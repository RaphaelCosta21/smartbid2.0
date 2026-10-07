/**
 * QualificationDbService — CRUD for the "Qualifications Database" SharePoint list
 * (one row per qualification table item). The list and its columns are created
 * on first use by a user with Manage Lists rights. Static singleton pattern.
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  IQualificationDbItem,
  IQualificationTableChanges,
  IQualificationTableSaveResult,
} from "../models/IQualificationDb";
import { IClarificationSyncResult } from "./ClarificationDbService";

const LIST_NAME = SHAREPOINT_CONFIG.lists.qualificationsDatabase;
const F = SHAREPOINT_CONFIG.qualificationDbFields;

let ensurePromise: Promise<void> | undefined;

const isNotFound = (err: unknown): boolean =>
  (err as { status?: number })?.status === 404;

export class QualificationDbService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(LIST_NAME);
  }

  /** Creates the list and its columns when missing; runs once per session. */
  public static ensureList(): Promise<void> {
    if (!ensurePromise) {
      ensurePromise = QualificationDbService._provision().catch((err) => {
        ensurePromise = undefined;
        throw err;
      });
    }
    return ensurePromise;
  }

  private static async _provision(): Promise<void> {
    try {
      const list = QualificationDbService._list as any;
      await list.select("Id")();
    } catch (err) {
      if (!isNotFound(err)) throw err;
      await (SPService.sp.web.lists as any).add(
        LIST_NAME,
        "SmartBid Clarif. & Qualif. library - qualification tables",
        100,
        false,
      );
    }
    const listApi = QualificationDbService._list as any;
    const fields = (await listApi.fields.select(
      "InternalName",
      "RichText",
    )()) as { InternalName: string; RichText?: boolean }[];
    const existing = fields.map((f) => f.InternalName);
    const add = async (
      name: string,
      kind: "text" | "indexed" | "note" | "number",
    ): Promise<void> => {
      if (existing.indexOf(name) >= 0) return;
      try {
        if (kind === "note")
          await listApi.fields.addMultilineText(name, { RichText: false });
        else if (kind === "number") await listApi.fields.addNumber(name);
        else if (kind === "indexed")
          // Indexed so the per-BID lookup keeps working past the 5000-item threshold
          await listApi.fields
            .addText(name, { Indexed: true })
            .catch(() => listApi.fields.addText(name));
        else await listApi.fields.addText(name);
      } catch (err) {
        console.warn(
          `QualificationDbService.ensureList: cannot add ${name}`,
          err,
        );
      }
    };
    await add(F.category, "text");
    await add(F.qualification, "note");
    await add(F.client, "text");
    await add(F.division, "text");
    await add(F.serviceLine, "text");
    await add(F.sourceBidNumber, "indexed");
    await add(F.sourceTableId, "text");
    await add(F.sourceItemId, "text");
    await add(F.itemOrder, "number");
    await add(F.tableKey, "text");

    // PnP creates multiline columns as rich text by default, which wraps the text in HTML.
    const note = fields.find((f) => f.InternalName === F.qualification);
    if (note && note.RichText) {
      await listApi.fields
        .getByInternalNameOrTitle(F.qualification)
        .update({ RichText: false }, "SP.FieldMultiLineText")
        .catch(() => undefined);
    }
  }

  private static _mapFromSP(item: any): IQualificationDbItem {
    return {
      id: item.Id,
      tableTitle: item[F.tableTitle] || "",
      category: item[F.category] || "",
      qualification: item[F.qualification] || "",
      client: item[F.client] || "",
      division: item[F.division] || "",
      serviceLine: item[F.serviceLine] || "",
      sourceBidNumber: item[F.sourceBidNumber] || "",
      sourceTableId: item[F.sourceTableId] || "",
      sourceItemId: item[F.sourceItemId] || "",
      itemOrder: Number(item[F.itemOrder]) || 0,
      tableKey: item[F.tableKey] || "",
      created: item.Created,
      modified: item.Modified,
      createdBy: item.Author ? item.Author.Title : "",
      modifiedBy: item.Editor ? item.Editor.Title : "",
    };
  }

  private static _mapToSP(item: IQualificationDbItem): Record<string, unknown> {
    const data: Record<string, unknown> = {
      [F.tableTitle]: item.tableTitle,
      [F.category]: item.category,
      [F.qualification]: item.qualification,
      [F.client]: item.client,
      [F.division]: item.division,
      [F.serviceLine]: item.serviceLine,
      [F.sourceBidNumber]: item.sourceBidNumber,
      [F.sourceTableId]: item.sourceTableId,
      [F.sourceItemId]: item.sourceItemId,
      [F.itemOrder]: item.itemOrder || 0,
    };
    // Only written when set: BID sync can run before a manager has provisioned the column.
    if (item.tableKey) data[F.tableKey] = item.tableKey;
    return data;
  }

  /** Empty until the list has been created. */
  public static async getAll(): Promise<IQualificationDbItem[]> {
    try {
      const items: any[] = await QualificationDbService._list.items
        .select("*", "Author/Title", "Editor/Title")
        .expand("Author", "Editor")
        .orderBy("Id", false)
        .top(5000)();
      return items.map((i) => QualificationDbService._mapFromSP(i));
    } catch (err) {
      if (isNotFound(err)) return [];
      throw err;
    }
  }

  /** Create a new item — returns the new SharePoint item Id */
  public static async create(item: IQualificationDbItem): Promise<number> {
    await QualificationDbService.ensureList();
    const result = await QualificationDbService._list.items.add(
      QualificationDbService._mapToSP(item),
    );
    return ((result as any).data as { Id: number }).Id;
  }

  public static async update(
    id: number,
    item: IQualificationDbItem,
  ): Promise<void> {
    await QualificationDbService._list.items
      .getById(id)
      .update(QualificationDbService._mapToSP(item));
  }

  public static async delete(id: number): Promise<void> {
    await QualificationDbService._list.items.getById(id).delete();
  }

  /** Applies the changes of one library table, row by row; failed rows are counted, not thrown. */
  public static async saveTable(
    changes: IQualificationTableChanges,
  ): Promise<IQualificationTableSaveResult> {
    const result: IQualificationTableSaveResult = {
      created: 0,
      updated: 0,
      deleted: 0,
      failed: 0,
    };
    await QualificationDbService.ensureList();
    for (const row of changes.update) {
      try {
        await QualificationDbService.update(row.id, row);
        result.updated++;
      } catch (err) {
        console.error(`QualificationDbService.saveTable: update ${row.id}`, err);
        result.failed++;
      }
    }
    for (const row of changes.create) {
      try {
        await QualificationDbService._list.items.add(
          QualificationDbService._mapToSP(row),
        );
        result.created++;
      } catch (err) {
        console.error("QualificationDbService.saveTable: create", err);
        result.failed++;
      }
    }
    for (const id of changes.deleteIds) {
      try {
        await QualificationDbService.delete(id);
        result.deleted++;
      } catch (err) {
        console.error(`QualificationDbService.saveTable: delete ${id}`, err);
        result.failed++;
      }
    }
    return result;
  }

  /**
   * Upsert the rows of one BID, matched by SourceItemId, so re-completing a
   * BID (after a revision) updates its rows instead of duplicating them.
   * Rows removed from the BID are left in the library.
   */
  public static async syncFromBid(
    bidNumber: string,
    rows: IQualificationDbItem[],
  ): Promise<IClarificationSyncResult> {
    const result: IClarificationSyncResult = {
      created: 0,
      updated: 0,
      failed: 0,
    };
    if (rows.length === 0) return result;
    try {
      await QualificationDbService.ensureList();
    } catch (err) {
      console.error("QualificationDbService.ensureList failed", err);
      throw new Error(
        "The Qualifications Database list is not available. A site owner must open the Clarif. & Qualif. page once to create it.",
      );
    }
    const existing: any[] = await QualificationDbService._list.items
      .select("Id", F.sourceItemId)
      .filter(`${F.sourceBidNumber} eq '${bidNumber.replace(/'/g, "''")}'`)
      .top(5000)();
    const idByItem: Record<string, number> = {};
    existing.forEach((e) => {
      if (e[F.sourceItemId]) idByItem[e[F.sourceItemId]] = e.Id;
    });
    for (const row of rows) {
      try {
        const id = idByItem[row.sourceItemId];
        if (id) {
          await QualificationDbService.update(id, row);
          result.updated++;
        } else {
          await QualificationDbService._list.items.add(
            QualificationDbService._mapToSP(row),
          );
          result.created++;
        }
      } catch (err) {
        console.error(
          `QualificationDbService.syncFromBid: row ${row.sourceItemId} failed`,
          err,
        );
        result.failed++;
      }
    }
    return result;
  }
}

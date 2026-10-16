/**
 * ClarificationDbService — CRUD for the "Clarifications Database" SharePoint list.
 * NOTE: This list uses real SharePoint columns (not a JSON blob).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IClarificationDbItem } from "../models/IClarificationDb";

const F = SHAREPOINT_CONFIG.clarificationDbFields;

/** Columns added after the legacy list was created (provisioned on demand). */
const PROVISIONED_FIELDS: string[] = [
  F.category,
  F.division,
  F.serviceLine,
  F.sourceBidNumber,
  F.sourceItemId,
];

/** Resolves to the provisioned columns that exist; runs once per session. */
let columnsPromise: Promise<string[]> | undefined;

export interface IClarificationSyncResult {
  created: number;
  updated: number;
  failed: number;
}

export class ClarificationDbService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(
      SHAREPOINT_CONFIG.lists.clarificationsDatabase,
    );
  }

  /**
   * Create the Category / Division / ServiceLine / Source* columns when missing.
   * Users without Manage Lists rights cannot add them, so callers only read or
   * write the columns returned here.
   */
  public static ensureColumns(): Promise<string[]> {
    if (!columnsPromise) {
      columnsPromise = ClarificationDbService._provisionColumns().catch(
        (err) => {
          columnsPromise = undefined;
          throw err;
        },
      );
    }
    return columnsPromise;
  }

  private static async _provisionColumns(): Promise<string[]> {
    const listApi = ClarificationDbService._list as any;
    const fields = (await listApi.fields.select("InternalName")()) as {
      InternalName: string;
    }[];
    const existing = fields.map((f) => f.InternalName);
    const available: string[] = [];
    for (const name of PROVISIONED_FIELDS) {
      if (existing.indexOf(name) >= 0) {
        available.push(name);
        continue;
      }
      try {
        if (name === F.sourceBidNumber) {
          // Indexed so the per-BID lookup keeps working past the 5000-item threshold
          await listApi.fields
            .addText(name, { Indexed: true })
            .catch(() => listApi.fields.addText(name));
        } else {
          await listApi.fields.addText(name);
        }
        available.push(name);
      } catch (err) {
        console.warn(
          `ClarificationDbService.ensureColumns: cannot add ${name}`,
          err,
        );
      }
    }
    return available;
  }

  private static async _columns(): Promise<string[]> {
    try {
      return await ClarificationDbService.ensureColumns();
    } catch (err) {
      console.warn("ClarificationDbService.ensureColumns failed", err);
      return [];
    }
  }

  private static _mapFromSP(item: any): IClarificationDbItem {
    return {
      id: item.Id,
      baseType:
        item[F.baseType] === "Qualification"
          ? "Qualification"
          : "Clarification",
      clientDocRef: item.Title || "",
      etTopic: item[F.etTopic] || "",
      clarification: item[F.clarification] || "",
      clientReply: item[F.clientReply] || "",
      approved: !!item[F.approved],
      date: item[F.date] || "",
      keyword: item[F.keyword] || "",
      client: item[F.client] || "",
      category: item[F.category] || "",
      division: item[F.division] || "",
      serviceLine: item[F.serviceLine] || "",
      sourceBidNumber: item[F.sourceBidNumber] || "",
      sourceItemId: item[F.sourceItemId] || "",
      created: item.Created,
      modified: item.Modified,
      createdBy: item.Author ? item.Author.Title : "",
      modifiedBy: item.Editor ? item.Editor.Title : "",
    };
  }

  /**
   * @param fromBid Update coming from a BID sync: keep the library-owned
   *   fields (Approved; Keyword and Category when the BID row has none).
   */
  private static _mapToSP(
    item: IClarificationDbItem,
    available: string[],
    fromBid = false,
  ): Record<string, unknown> {
    const data: Record<string, unknown> = {
      [F.baseType]: item.baseType,
      Title: item.clientDocRef,
      [F.etTopic]: item.etTopic,
      [F.clarification]: item.clarification,
      [F.clientReply]: item.clientReply,
      [F.date]: item.date || null,
      [F.client]: item.client,
    };
    if (!fromBid) data[F.approved] = item.approved;
    if (!fromBid || item.keyword) data[F.keyword] = item.keyword;
    const optional: Record<string, string> = {
      [F.division]: item.division,
      [F.serviceLine]: item.serviceLine,
      [F.sourceBidNumber]: item.sourceBidNumber,
      [F.sourceItemId]: item.sourceItemId,
    };
    if (!fromBid || item.category) optional[F.category] = item.category;
    Object.keys(optional).forEach((name) => {
      if (available.indexOf(name) >= 0) data[name] = optional[name] || "";
    });
    return data;
  }

  /** Load all clarification database items */
  public static async getAll(): Promise<IClarificationDbItem[]> {
    const available = await ClarificationDbService._columns();
    const items: any[] = await ClarificationDbService._list.items
      .select(
        "Id",
        "Title",
        F.baseType,
        F.etTopic,
        F.clarification,
        F.clientReply,
        F.approved,
        F.date,
        F.keyword,
        F.client,
        ...available,
        "Created",
        "Modified",
        "Author/Title",
        "Editor/Title",
      )
      .expand("Author", "Editor")
      .orderBy("Id", false)
      .top(5000)();
    return items.map((i) => ClarificationDbService._mapFromSP(i));
  }

  /** Create a new item — returns the new SharePoint item Id */
  public static async create(item: IClarificationDbItem): Promise<number> {
    const available = await ClarificationDbService._columns();
    const result = await ClarificationDbService._list.items.add(
      ClarificationDbService._mapToSP(item, available),
    );
    return ((result as any).data as { Id: number }).Id;
  }

  /** Update an existing item */
  public static async update(
    id: number,
    item: IClarificationDbItem,
  ): Promise<void> {
    const available = await ClarificationDbService._columns();
    await ClarificationDbService._list.items
      .getById(id)
      .update(ClarificationDbService._mapToSP(item, available));
  }

  /** Delete an item */
  public static async delete(id: number): Promise<void> {
    await ClarificationDbService._list.items.getById(id).delete();
  }

  /**
   * Upsert the rows of one BID, matched by SourceItemId, so re-completing a
   * BID (after a revision) updates its rows instead of duplicating them.
   * Rows removed from the BID are left in the library.
   */
  public static async syncFromBid(
    bidNumber: string,
    rows: IClarificationDbItem[],
  ): Promise<IClarificationSyncResult> {
    const result: IClarificationSyncResult = {
      created: 0,
      updated: 0,
      failed: 0,
    };
    if (rows.length === 0) return result;
    const available = await ClarificationDbService.ensureColumns();
    if (
      available.indexOf(F.sourceBidNumber) < 0 ||
      available.indexOf(F.sourceItemId) < 0
    ) {
      throw new Error(
        "The Clarifications Database is missing the SourceBidNumber / SourceItemId columns. A site owner must open the Clarif. & Qualif. page once to create them.",
      );
    }
    const existing: any[] = await ClarificationDbService._list.items
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
          await ClarificationDbService._list.items
            .getById(id)
            .update(ClarificationDbService._mapToSP(row, available, true));
          result.updated++;
        } else {
          await ClarificationDbService._list.items.add(
            ClarificationDbService._mapToSP(row, available),
          );
          result.created++;
        }
      } catch (err) {
        console.error(
          `ClarificationDbService.syncFromBid: row ${row.sourceItemId} failed`,
          err,
        );
        result.failed++;
      }
    }
    return result;
  }
}

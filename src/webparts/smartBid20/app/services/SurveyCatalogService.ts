/**
 * SurveyCatalogService — Survey Knowledge & BID Portal catalog.
 * Static singleton. One row per family / equipment / system in
 * smartbid-survey-catalog; rich fields are stored in the row's jsondata.
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  ISurveyCatalog,
  ISurveyEquipment,
  ISurveyFamily,
  ISurveySpread,
  ISurveySystem,
} from "../models";

const LIST_NAME = SHAREPOINT_CONFIG.lists.surveyCatalog;
const F = SHAREPOINT_CONFIG.surveyCatalogFields;
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

type ItemType = "family" | "equipment" | "system" | "spread";
type AnyEntry = ISurveyFamily | ISurveyEquipment | ISurveySystem | ISurveySpread;

let ensurePromise: Promise<void> | undefined;

export class SurveyCatalogService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(LIST_NAME);
  }

  private static get _origin(): string {
    return SHAREPOINT_CONFIG.siteUrl.replace(/\/sites\/.*$/, "");
  }

  /** Creates the list and its columns on first write of a session. */
  public static async ensureList(): Promise<void> {
    if (!ensurePromise) {
      ensurePromise = SurveyCatalogService._provision().catch((err) => {
        ensurePromise = undefined;
        throw err;
      });
    }
    return ensurePromise;
  }

  private static async _provision(): Promise<void> {
    await (SPService.sp.web.lists as any).ensure(
      LIST_NAME,
      "SmartBid Survey Knowledge & BID Portal catalog",
      100,
    );
    const listApi = SurveyCatalogService._list as any;
    const fields = (await listApi.fields.select("InternalName", "RichText")()) as {
      InternalName: string;
      RichText?: boolean;
    }[];
    const existing = fields.map((f) => f.InternalName);
    const add = async (
      name: string,
      kind: "text" | "note" | "number" | "bool",
    ): Promise<void> => {
      if (existing.indexOf(name) >= 0) return;
      try {
        if (kind === "note")
          await listApi.fields.addMultilineText(name, { RichText: false });
        else if (kind === "number") await listApi.fields.addNumber(name);
        else if (kind === "bool") await listApi.fields.addBoolean(name);
        else await listApi.fields.addText(name);
      } catch {
        /* concurrent run or insufficient permission */
      }
    };
    await add(F.itemType, "text");
    await add(F.itemKey, "text");
    await add(F.familyKey, "text");
    await add(F.partNumber, "text");
    await add(F.sortOrder, "number");
    await add(F.isActive, "bool");
    await add(F.jsondata, "note");

    // PnP creates multiline columns as rich text by default, which wraps the JSON in HTML.
    const json = fields.find((f) => f.InternalName === F.jsondata);
    if (json && json.RichText) {
      await listApi.fields
        .getByInternalNameOrTitle(F.jsondata)
        .update({ RichText: false }, "SP.FieldMultiLineText");
    }
  }

  /** Reads jsondata even when the column was saved as rich text (HTML-wrapped, entity-encoded). */
  private static _parseJson(raw: unknown): any {
    let text = String(raw || "").trim();
    if (!text) return {};
    if (text.charAt(0) === "<") {
      text =
        new DOMParser().parseFromString(text, "text/html").body.textContent || "";
    }
    return JSON.parse(text.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
  }

  /** Returns null when the list has not been provisioned yet. */
  public static async getAll(): Promise<ISurveyCatalog | null> {
    let rows: any[];
    try {
      rows = await SurveyCatalogService._list.items
        .select(
          "Id",
          "Title",
          F.itemType,
          F.itemKey,
          F.familyKey,
          F.partNumber,
          F.sortOrder,
          F.isActive,
          F.jsondata,
          "AttachmentFiles",
        )
        .expand("AttachmentFiles")
        .top(5000)();
    } catch (err) {
      if ((err as { status?: number })?.status === 404) return null;
      throw err;
    }

    const catalog: ISurveyCatalog = { families: [], equipment: [], systems: [], spreads: [] };
    let skipped = 0;
    rows.forEach((row) => {
      if (row[F.isActive] === false) return;
      let data: any = {};
      try {
        data = SurveyCatalogService._parseJson(row[F.jsondata]);
      } catch {
        skipped++;
        return;
      }
      const base = {
        ...data,
        id: String(row[F.itemKey] || data.id || row.Id),
        title: String(row.Title || data.title || ""),
        familyId: String(row[F.familyKey] || data.familyId || ""),
        order: Number(row[F.sortOrder] ?? data.order ?? 0),
      };
      const type = row[F.itemType] as ItemType;
      if (type === "family") {
        catalog.families.push(base as ISurveyFamily);
      } else if (type === "system") {
        catalog.systems.push(SurveyCatalogService._normalizeSystem(base));
      } else if (type === "spread") {
        catalog.spreads.push({
          id: base.id,
          title: base.title,
          drawingNo: base.drawingNo || "",
          revision: base.revision || "",
          description: base.description || "",
          zones: (base.zones || []).map((z: any) => ({
            id: String(z.id),
            title: z.title || "",
            sceneAnchor: z.sceneAnchor || "vessel",
            description: z.description || "",
            lines: z.lines || [],
          })),
          links: base.links || [],
          order: base.order,
        });
      } else if (type === "equipment") {
        catalog.equipment.push(
          SurveyCatalogService._normalizeEquipment(base, row),
        );
      }
    });

    const byOrder = (a: { order: number }, b: { order: number }): number =>
      a.order - b.order;
    if (skipped > 0) {
      console.warn(`SurveyCatalogService: ${skipped} row(s) with unreadable jsondata skipped`);
    }
    catalog.families.sort(byOrder);
    catalog.equipment.sort(byOrder);
    catalog.systems.sort(byOrder);
    return catalog;
  }

  private static _normalizeSystem(d: any): ISurveySystem {
    return {
      id: d.id,
      familyId: d.familyId,
      title: d.title,
      description: d.description || "",
      components: d.components || [],
      equipmentIds: d.equipmentIds || [],
      sceneAnchor: d.sceneAnchor || "",
      order: d.order,
    };
  }

  private static _normalizeEquipment(d: any, row: any): ISurveyEquipment {
    const partNumber = String(row[F.partNumber] || d.partNumber || "");
    let imageUrl: string | null = d.imageUrl || null;
    if (!imageUrl) {
      const files: any[] = row.AttachmentFiles || [];
      for (let i = 0; i < files.length; i++) {
        if (IMAGE_EXT.test(files[i].FileName)) {
          imageUrl = SurveyCatalogService._origin + files[i].ServerRelativeUrl;
          break;
        }
      }
    }
    if (!imageUrl && partNumber) {
      imageUrl = `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${encodeURIComponent(partNumber)}.jpg`;
    }
    return {
      id: d.id,
      familyId: d.familyId,
      title: d.title,
      technology: d.technology || "",
      aliases: d.aliases || [],
      summary: d.summary || "",
      whatIsIt: d.whatIsIt || "",
      whatDoesItDo: d.whatDoesItDo || "",
      partNumber,
      manufacturer: d.manufacturer || "",
      model: d.model || "",
      divisions: d.divisions || [],
      serviceLines: d.serviceLines || [],
      status: d.status || "Active",
      usedIn: d.usedIn || [],
      connectsTo: d.connectsTo || [],
      whereItFits: d.whereItFits || [],
      bidConsiderations: d.bidConsiderations || [],
      sceneAnchor: d.sceneAnchor || "",
      sceneShape: d.sceneShape || "",
      modelUrl: d.modelUrl || null,
      imageUrl,
      datasheetUrl: d.datasheetUrl || null,
      order: d.order,
    };
  }

  /**
   * Upserts every entry (matched by type + key). `images` maps an equipment id to a
   * photo that is stored as that row's attachment (replaced when it already exists).
   */
  public static async importCatalog(
    catalog: ISurveyCatalog,
    images: Record<string, File> = {},
  ): Promise<{ rows: number; photos: number }> {
    await SurveyCatalogService.ensureList();
    const existing: any[] = await SurveyCatalogService._list.items
      .select("Id", F.itemType, F.itemKey)
      .top(5000)();
    const idByKey: Record<string, number> = {};
    existing.forEach((r) => {
      idByKey[`${r[F.itemType]}|${r[F.itemKey]}`] = r.Id;
    });

    const entries: { type: ItemType; entry: AnyEntry }[] = [];
    (catalog.families || []).forEach((e) =>
      entries.push({ type: "family", entry: e }),
    );
    (catalog.equipment || []).forEach((e) =>
      entries.push({ type: "equipment", entry: e }),
    );
    (catalog.systems || []).forEach((e) =>
      entries.push({ type: "system", entry: e }),
    );
    (catalog.spreads || []).forEach((e) =>
      entries.push({ type: "spread", entry: e }),
    );

    let written = 0;
    let photos = 0;
    for (let i = 0; i < entries.length; i++) {
      const { type, entry } = entries[i];
      const row = {
        Title: entry.title,
        [F.itemType]: type,
        [F.itemKey]: entry.id,
        [F.familyKey]: (entry as ISurveyEquipment).familyId || "",
        [F.partNumber]: (entry as ISurveyEquipment).partNumber || "",
        [F.sortOrder]: entry.order || 0,
        [F.isActive]: true,
        [F.jsondata]: JSON.stringify(entry),
      };
      let spId = idByKey[`${type}|${entry.id}`];
      if (spId) {
        await SurveyCatalogService._list.items.getById(spId).update(row);
      } else {
        const added: any = await SurveyCatalogService._list.items.add(row);
        spId = added?.data?.Id;
      }
      written++;

      const photo = type === "equipment" ? images[entry.id] : undefined;
      if (photo && spId) {
        const attachments = (SurveyCatalogService._list.items.getById(spId) as any)
          .attachmentFiles;
        try {
          await attachments.add(photo.name, photo);
        } catch {
          await attachments.getByName(photo.name).setContent(photo);
        }
        photos++;
      }
    }
    return { rows: written, photos };
  }
}

/**
 * QuotationService — Quotation catalog CRUD.
 * Static singleton pattern. One SharePoint list item per quotation, so the list
 * is indexable by AI Search and two users editing at once no longer overwrite
 * each other. Legacy single-blob rows are migrated on first read.
 * Files uploaded to smartBidDocs/Quotations document library folder.
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IQuotationItem } from "../models";

const LIST_NAME = SHAREPOINT_CONFIG.lists.quotations;
const LEGACY_CONFIG_KEY = "QUOTATIONS";
const F = SHAREPOINT_CONFIG.quotationFields;
const QUOTATIONS_FOLDER =
  "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/Quotations";

/** Runs at most once per session; the columns only need provisioning the first time. */
let ensureColumnsPromise: Promise<void> | undefined;

export class QuotationService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(LIST_NAME);
  }

  /**
   * Create the per-quotation columns if missing. Writing to a column that does
   * not exist makes SharePoint reject the whole item, so this must succeed
   * before the first write of a session.
   */
  public static async ensureColumns(): Promise<void> {
    if (!ensureColumnsPromise) {
      ensureColumnsPromise = QuotationService._provisionColumns().catch(
        (err) => {
          ensureColumnsPromise = undefined;
          throw err;
        },
      );
    }
    return ensureColumnsPromise;
  }

  private static async _provisionColumns(): Promise<void> {
    const listApi = QuotationService._list as any;
    let existing: string[] = [];
    try {
      const fields = await listApi.fields.select("InternalName")();
      existing = (fields as { InternalName: string }[]).map(
        (f) => f.InternalName,
      );
    } catch (err) {
      console.warn("QuotationService.ensureColumns: cannot read fields", err);
      return;
    }
    const api = listApi.fields;
    const add = async (
      name: string,
      kind: "text" | "note" | "number" | "bool" | "date",
    ): Promise<void> => {
      if (existing.indexOf(name) >= 0) return;
      try {
        if (kind === "note") await api.addMultilineText(name);
        else if (kind === "number") await api.addNumber(name);
        else if (kind === "bool") await api.addBoolean(name);
        else if (kind === "date") await api.addDateTime(name);
        else await api.addText(name);
      } catch (e) {
        /* ignore — concurrent run or insufficient permission */
      }
    };

    await add(F.quotationId, "text");
    await add(F.groupId, "text");
    await add(F.subGroupId, "text");
    await add(F.partNumber, "text");
    await add(F.reference, "text");
    await add(F.supplier, "text");
    await add(F.quantity, "number");
    await add(F.leadTimeDays, "number");
    await add(F.quotationDate, "date");
    await add(F.quotationType, "text");
    await add(F.cost, "number");
    await add(F.currency, "text");
    await add(F.costUSD, "number");
    await add(F.exchangeRateUsed, "number");
    await add(F.notes, "note");
    await add(F.isFavorite, "bool");
    await add(F.fileUrl, "text");
    await add(F.fileName, "text");
    await add(F.createdByName, "text");
    await add(F.createdDate, "date");
    await add(F.lastModifiedDate, "date");
  }

  /** SharePoint row → domain object. */
  private static _fromRow(row: any): IQuotationItem {
    const num = (v: unknown): number =>
      typeof v === "number" ? v : Number(v) || 0;
    return {
      id: String(row[F.quotationId] || ""),
      groupId: String(row[F.groupId] || ""),
      subGroupId: String(row[F.subGroupId] || ""),
      partNumber: String(row[F.partNumber] || ""),
      reference: String(row[F.reference] || ""),
      description: String(row.Title || ""),
      quantity: num(row[F.quantity]) || 1,
      supplier: String(row[F.supplier] || ""),
      leadTimeDays: num(row[F.leadTimeDays]),
      quotationDate: String(row[F.quotationDate] || ""),
      type: row[F.quotationType] === "rental" ? "rental" : "acquisition",
      cost: num(row[F.cost]),
      currency: String(row[F.currency] || "USD"),
      costUSD: num(row[F.costUSD]),
      exchangeRateUsed: num(row[F.exchangeRateUsed]),
      notes: String(row[F.notes] || ""),
      isFavorite: row[F.isFavorite] === true,
      fileUrl: row[F.fileUrl] ? String(row[F.fileUrl]) : undefined,
      fileName: row[F.fileName] ? String(row[F.fileName]) : undefined,
      createdBy: String(row[F.createdByName] || ""),
      createdDate: String(row[F.createdDate] || ""),
      lastModified: String(row[F.lastModifiedDate] || ""),
    };
  }

  /** Domain object → SharePoint row. Title carries the description so it is searchable. */
  private static _toRow(item: IQuotationItem): Record<string, unknown> {
    return {
      Title: item.description || item.partNumber || "Quotation",
      [F.quotationId]: item.id,
      [F.groupId]: item.groupId || "",
      [F.subGroupId]: item.subGroupId || "",
      [F.partNumber]: item.partNumber || "",
      [F.reference]: item.reference || "",
      [F.supplier]: item.supplier || "",
      [F.quantity]: item.quantity || 1,
      [F.leadTimeDays]: item.leadTimeDays || 0,
      [F.quotationDate]: item.quotationDate || null,
      [F.quotationType]: item.type,
      [F.cost]: item.cost || 0,
      [F.currency]: item.currency || "USD",
      [F.costUSD]: item.costUSD || 0,
      [F.exchangeRateUsed]: item.exchangeRateUsed || 0,
      [F.notes]: item.notes || "",
      [F.isFavorite]: !!item.isFavorite,
      [F.fileUrl]: item.fileUrl || "",
      [F.fileName]: item.fileName || "",
      [F.createdByName]: item.createdBy || "",
      [F.createdDate]: item.createdDate || null,
      [F.lastModifiedDate]: item.lastModified || new Date().toISOString(),
    };
  }

  /** Find the SharePoint item id backing a quotation. */
  private static async _findRowId(id: string): Promise<number | null> {
    const rows: any[] = await QuotationService._list.items
      .filter(`${F.quotationId} eq '${id.replace(/'/g, "''")}'`)
      .select("Id")
      .top(1)();
    return rows.length > 0 ? (rows[0].Id as number) : null;
  }

  /**
   * One-time migration of the legacy layout (a single row holding the whole
   * catalog as JSON) into one row per quotation.
   */
  private static async _migrateLegacyBlob(): Promise<IQuotationItem[]> {
    const legacy: any[] = await QuotationService._list.items
      .filter(`Title eq '${LEGACY_CONFIG_KEY}'`)
      .select("Id", "ConfigValue")
      .top(1)();
    if (legacy.length === 0 || !legacy[0].ConfigValue) return [];

    let parsed: IQuotationItem[] = [];
    try {
      const raw = JSON.parse(legacy[0].ConfigValue);
      parsed = Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
    if (parsed.length === 0) return [];

    await QuotationService.ensureColumns();
    for (let i = 0; i < parsed.length; i++) {
      try {
        await QuotationService._list.items.add(
          QuotationService._toRow(parsed[i]),
        );
      } catch (err) {
        console.error("Quotation migration failed for one item:", err);
      }
    }
    // Only drop the blob once every row landed, so a failure keeps the source.
    await QuotationService._list.items.getById(legacy[0].Id).delete();
    return parsed;
  }

  /** Load all quotation items from the list */
  public static async getAll(): Promise<IQuotationItem[]> {
    try {
      const migrated = await QuotationService._migrateLegacyBlob();
      if (migrated.length > 0) return migrated;

      const rows: any[] = await QuotationService._list.items
        .select(
          "Id",
          "Title",
          F.quotationId,
          F.groupId,
          F.subGroupId,
          F.partNumber,
          F.reference,
          F.supplier,
          F.quantity,
          F.leadTimeDays,
          F.quotationDate,
          F.quotationType,
          F.cost,
          F.currency,
          F.costUSD,
          F.exchangeRateUsed,
          F.notes,
          F.isFavorite,
          F.fileUrl,
          F.fileName,
          F.createdByName,
          F.createdDate,
          F.lastModifiedDate,
        )
        .top(5000)();
      return rows
        .filter((r) => r[F.quotationId])
        .map((r) => QuotationService._fromRow(r));
    } catch (err) {
      console.error("Failed to load quotations:", err);
      return [];
    }
  }

  /** Append one or more items, one row each */
  public static async addItems(items: IQuotationItem[]): Promise<void> {
    await QuotationService.ensureColumns();
    for (let i = 0; i < items.length; i++) {
      await QuotationService._list.items.add(QuotationService._toRow(items[i]));
    }
  }

  /** Update a single item by ID */
  public static async updateItem(item: IQuotationItem): Promise<void> {
    await QuotationService.ensureColumns();
    const rowId = await QuotationService._findRowId(item.id);
    if (rowId === null) {
      await QuotationService._list.items.add(QuotationService._toRow(item));
      return;
    }
    await QuotationService._list.items
      .getById(rowId)
      .update(QuotationService._toRow(item));
  }

  /** Delete a single item by ID */
  public static async deleteItem(id: string): Promise<void> {
    const rowId = await QuotationService._findRowId(id);
    if (rowId === null) return;
    await QuotationService._list.items.getById(rowId).delete();
  }

  /**
   * Upload a quotation file to the Quotations folder in SharePoint.
   * Returns the server-relative URL of the uploaded file.
   */
  public static async uploadFile(file: File): Promise<string> {
    // Prefix with timestamp to avoid collisions
    const safeName = file.name.replace(/[\\/:*?"<>|#%]/g, "_");
    const ts = Date.now();
    const fileName = `${ts}_${safeName}`;

    const result = await SPService.sp.web
      .getFolderByServerRelativePath(QUOTATIONS_FOLDER)
      .files.addUsingPath(fileName, file, { Overwrite: true });

    return (result.data as { ServerRelativeUrl: string }).ServerRelativeUrl;
  }

  /**
   * Build the full URL for opening a quotation file in the browser.
   */
  public static getFileOpenUrl(serverRelativeUrl: string): string {
    return `${SHAREPOINT_CONFIG.siteUrl.replace(
      /\/sites\/.*/,
      "",
    )}${serverRelativeUrl}`;
  }
}

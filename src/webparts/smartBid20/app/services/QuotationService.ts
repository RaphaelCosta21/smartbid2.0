/**
 * QuotationService — Quotation catalog CRUD.
 * Static singleton pattern. Data stored as JSON blob in smartbid-quotations list.
 * Files uploaded to smartBidDocs/Quotations document library folder.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IQuotationItem } from "../models";

const LIST_NAME = SHAREPOINT_CONFIG.lists.quotations;
const CONFIG_KEY = "QUOTATIONS";
const QUOTATIONS_FOLDER =
  "/sites/G-OPGSSRBrazilEngineering/smartBidDocs/Quotations";

export class QuotationService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(LIST_NAME);
  }

  /** Load all quotation items from the list */
  public static async getAll(): Promise<IQuotationItem[]> {
    try {
      const items: any[] = await QuotationService._list.items
        .filter(`Title eq '${CONFIG_KEY}'`)
        .select("ConfigValue")
        .top(1)();
      if (items.length === 0) return [];
      const raw = items[0].ConfigValue;
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /** Save the full quotation array (upsert) */
  public static async save(quotations: IQuotationItem[]): Promise<void> {
    const existing: any[] = await QuotationService._list.items
      .filter(`Title eq '${CONFIG_KEY}'`)
      .select("Id")
      .top(1)();
    const json = JSON.stringify(quotations);
    if (existing.length > 0) {
      await QuotationService._list.items
        .getById(existing[0].Id)
        .update({ ConfigValue: json });
    } else {
      await QuotationService._list.items.add({
        Title: CONFIG_KEY,
        ConfigValue: json,
      });
    }
  }

  /** Append one or more items and save */
  public static async addItems(items: IQuotationItem[]): Promise<void> {
    const all = await QuotationService.getAll();
    items.forEach((item) => all.push(item));
    await QuotationService.save(all);
  }

  /** Update a single item by ID */
  public static async updateItem(item: IQuotationItem): Promise<void> {
    const all = await QuotationService.getAll();
    const idx = all.findIndex((q) => q.id === item.id);
    if (idx >= 0) {
      all[idx] = item;
      await QuotationService.save(all);
    }
  }

  /** Delete a single item by ID */
  public static async deleteItem(id: string): Promise<void> {
    const all = await QuotationService.getAll();
    const filtered = all.filter((q) => q.id !== id);
    await QuotationService.save(filtered);
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

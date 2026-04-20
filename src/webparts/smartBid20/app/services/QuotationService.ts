/**
 * QuotationService — Vendor quotation database.
 * Static singleton pattern (data stored as JSON in smartbid-config).
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

export interface IQuotation {
  id: string;
  vendor: string;
  description: string;
  division: string;
  amount: number;
  currency: string;
  validUntil: string;
  status: "active" | "expired" | "used";
  relatedBid: string | null;
}

export class QuotationService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  public static async getAll(): Promise<IQuotation[]> {
    const items = await QuotationService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.quotationDatabase}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return [];
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return [];
    try {
      return JSON.parse(raw) as IQuotation[];
    } catch {
      return [];
    }
  }

  public static async save(quotations: IQuotation[]): Promise<void> {
    const existing = await QuotationService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.quotationDatabase}'`)
      .select("Id")
      .top(1)();
    if (existing.length > 0) {
      await QuotationService._list.items
        .getById((existing[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(quotations) });
    } else {
      await QuotationService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.quotationDatabase,
        ConfigValue: JSON.stringify(quotations),
      });
    }
  }
}

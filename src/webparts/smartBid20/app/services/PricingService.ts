/**
 * PricingService — Price consulting / rate database.
 * Static singleton pattern (data stored as JSON in smartbid-config).
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

export interface IPriceEntry {
  id: string;
  category: string;
  item: string;
  division: string;
  unitRate: number;
  currency: string;
  unit: string;
  source: string;
  lastUpdated: string;
}

export class PricingService {
  private static readonly CONFIG_KEY = "PRICING_DATABASE";

  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  public static async getAll(): Promise<IPriceEntry[]> {
    const items = await PricingService._list.items
      .filter(`Title eq '${PricingService.CONFIG_KEY}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return [];
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return [];
    try {
      return JSON.parse(raw) as IPriceEntry[];
    } catch {
      return [];
    }
  }

  public static async save(prices: IPriceEntry[]): Promise<void> {
    const existing = await PricingService._list.items
      .filter(`Title eq '${PricingService.CONFIG_KEY}'`)
      .select("Id")
      .top(1)();
    if (existing.length > 0) {
      await PricingService._list.items
        .getById((existing[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(prices) });
    } else {
      await PricingService._list.items.add({
        Title: PricingService.CONFIG_KEY,
        ConfigValue: JSON.stringify(prices),
      });
    }
  }
}

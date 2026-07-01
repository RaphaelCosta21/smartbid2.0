/**
 * LinksRecommendationsService — CRUD for BID links and recommendations/notes.
 * Data stored as a JSON blob in smartbid-config list with key "LINKS_RECOMMENDATIONS".
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  ILinksRecommendationsData,
  IBidLink,
  IBidRecommendation,
} from "../models/ILinksRecommendations";

const EMPTY_DATA: ILinksRecommendationsData = {
  links: [],
  recommendations: [],
};

export class LinksRecommendationsService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  /** Load all links & recommendations from the config list */
  public static async getAll(): Promise<ILinksRecommendationsData> {
    const items = await LinksRecommendationsService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.linksRecommendations}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0)
      return { ...EMPTY_DATA, links: [], recommendations: [] };
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return { links: [], recommendations: [] };
    try {
      const parsed = JSON.parse(raw) as ILinksRecommendationsData;
      return {
        links: parsed.links || [],
        recommendations: parsed.recommendations || [],
      };
    } catch {
      return { links: [], recommendations: [] };
    }
  }

  /** Persist the full data set (upsert) */
  public static async save(data: ILinksRecommendationsData): Promise<void> {
    const existing = await LinksRecommendationsService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.linksRecommendations}'`)
      .select("Id")
      .top(1)();
    if (existing.length > 0) {
      await LinksRecommendationsService._list.items
        .getById((existing[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(data) });
    } else {
      await LinksRecommendationsService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.linksRecommendations,
        ConfigValue: JSON.stringify(data),
      });
    }
  }

  // ─── Links ───
  public static async addLink(link: IBidLink): Promise<void> {
    const data = await LinksRecommendationsService.getAll();
    data.links.push(link);
    await LinksRecommendationsService.save(data);
  }

  public static async updateLink(link: IBidLink): Promise<void> {
    const data = await LinksRecommendationsService.getAll();
    const idx = data.links.findIndex((l) => l.id === link.id);
    if (idx >= 0) data.links[idx] = link;
    await LinksRecommendationsService.save(data);
  }

  public static async removeLink(id: string): Promise<void> {
    const data = await LinksRecommendationsService.getAll();
    data.links = data.links.filter((l) => l.id !== id);
    await LinksRecommendationsService.save(data);
  }

  // ─── Recommendations ───
  public static async addRecommendation(
    rec: IBidRecommendation,
  ): Promise<void> {
    const data = await LinksRecommendationsService.getAll();
    data.recommendations.push(rec);
    await LinksRecommendationsService.save(data);
  }

  public static async updateRecommendation(
    rec: IBidRecommendation,
  ): Promise<void> {
    const data = await LinksRecommendationsService.getAll();
    const idx = data.recommendations.findIndex((r) => r.id === rec.id);
    if (idx >= 0) data.recommendations[idx] = rec;
    await LinksRecommendationsService.save(data);
  }

  public static async removeRecommendation(id: string): Promise<void> {
    const data = await LinksRecommendationsService.getAll();
    data.recommendations = data.recommendations.filter((r) => r.id !== id);
    await LinksRecommendationsService.save(data);
  }
}

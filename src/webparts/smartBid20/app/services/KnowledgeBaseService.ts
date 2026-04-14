/**
 * KnowledgeBaseService — Datasheets, Past Bids, Manuals.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IKnowledgeBaseItem, KBCategory } from "../models/IKnowledgeBase";

export class KnowledgeBaseService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  public static async getAll(): Promise<IKnowledgeBaseItem[]> {
    const items = await KnowledgeBaseService._list.items
      .filter(`Title eq 'KNOWLEDGE_BASE'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return [];
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return [];
    try {
      return JSON.parse(raw) as IKnowledgeBaseItem[];
    } catch {
      return [];
    }
  }

  public static async getByCategory(
    category: KBCategory,
  ): Promise<IKnowledgeBaseItem[]> {
    const all = await KnowledgeBaseService.getAll();
    return all.filter((item) => item.category === category);
  }

  public static async save(items: IKnowledgeBaseItem[]): Promise<void> {
    const existing = await KnowledgeBaseService._list.items
      .filter(`Title eq 'KNOWLEDGE_BASE'`)
      .select("Id")
      .top(1)();
    if (existing.length > 0) {
      await KnowledgeBaseService._list.items
        .getById((existing[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(items) });
    } else {
      await KnowledgeBaseService._list.items.add({
        Title: "KNOWLEDGE_BASE",
        ConfigValue: JSON.stringify(items),
      });
    }
  }

  public static async addItem(item: IKnowledgeBaseItem): Promise<void> {
    const items = await KnowledgeBaseService.getAll();
    items.push(item);
    await KnowledgeBaseService.save(items);
  }

  public static async deleteItem(itemId: string): Promise<void> {
    const items = await KnowledgeBaseService.getAll();
    await KnowledgeBaseService.save(items.filter((i) => i.id !== itemId));
  }
}

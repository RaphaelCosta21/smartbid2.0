/**
 * TemplateService — CRUD for bid templates.
 * Templates are stored in two places (legacy + current):
 *   1. smartbid-config list, key "BID_TEMPLATES" → ConfigValue = JSON array
 *   2. smartbid-templates list → one row per template (Title=id, jsondata=JSON)
 * getAll() merges both sources, deduplicating by template ID.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IBidTemplate } from "../models/IBidTemplate";

export class TemplateService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.templates);
  }

  private static get _configList() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  /**
   * Get all templates from both storage locations (config key + dedicated list).
   */
  public static async getAll(): Promise<IBidTemplate[]> {
    const byId = new Map<string, IBidTemplate>();

    // Source 1: smartbid-config list → BID_TEMPLATES key (legacy/primary)
    try {
      const configItems = await TemplateService._configList.items
        .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.bidTemplates}'`)
        .select("ConfigValue")
        .top(1)();

      if (configItems.length > 0) {
        const raw = (configItems[0] as { ConfigValue: string }).ConfigValue;
        if (raw) {
          const parsed = JSON.parse(raw);
          const arr: IBidTemplate[] = Array.isArray(parsed) ? parsed : [parsed];
          arr.forEach((tpl) => {
            if (tpl && tpl.id) byId.set(tpl.id, tpl);
          });
        }
      }
    } catch (e) {
      console.warn("TemplateService: Failed to read from config list", e);
    }

    // Source 2: smartbid-templates list (one row per template)
    try {
      const listItems = await TemplateService._list.items
        .select("Title", "jsondata")
        .top(500)();

      listItems.forEach((item: { Title: string; jsondata: string }) => {
        if (item.jsondata) {
          try {
            const tpl = JSON.parse(item.jsondata) as IBidTemplate;
            if (tpl && tpl.id) byId.set(tpl.id, tpl); // Overrides config version if same ID
          } catch {
            // Skip invalid JSON rows
          }
        }
      });
    } catch (e) {
      // smartbid-templates list may not exist — that's OK
      console.warn(
        "TemplateService: smartbid-templates list not found or empty",
        e,
      );
    }

    const results: IBidTemplate[] = [];
    byId.forEach((tpl) => results.push(tpl));
    return results;
  }

  /**
   * Get a single template by its ID.
   */
  public static async getById(
    templateId: string,
  ): Promise<IBidTemplate | null> {
    const items = await TemplateService._list.items
      .filter("Title eq '" + templateId + "'")
      .select("jsondata")
      .top(1)();

    if (items.length === 0) return null;
    const raw = (items[0] as { jsondata: string }).jsondata;
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IBidTemplate;
    } catch {
      return null;
    }
  }

  /**
   * Create a new template (adds a new row).
   */
  public static async create(template: IBidTemplate): Promise<void> {
    await TemplateService._list.items.add({
      Title: template.id,
      jsondata: JSON.stringify(template),
    });
  }

  /**
   * Update an existing template (finds row by Title = template.id).
   */
  public static async update(template: IBidTemplate): Promise<void> {
    const items = await TemplateService._list.items
      .filter("Title eq '" + template.id + "'")
      .select("Id")
      .top(1)();

    if (items.length > 0) {
      await TemplateService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ jsondata: JSON.stringify(template) });
    } else {
      // Row not found — create it
      await TemplateService.create(template);
    }
  }

  /**
   * Delete a template by its ID.
   */
  public static async deleteTemplate(templateId: string): Promise<void> {
    const items = await TemplateService._list.items
      .filter("Title eq '" + templateId + "'")
      .select("Id")
      .top(1)();

    if (items.length > 0) {
      await TemplateService._list.items
        .getById((items[0] as { Id: number }).Id)
        .delete();
    }
  }

  /**
   * Get the SP list item ID for a template (needed for AI polling).
   */
  public static async getSpItemId(templateId: string): Promise<number | null> {
    const items = await TemplateService._list.items
      .filter("Title eq '" + templateId + "'")
      .select("Id")
      .top(1)();

    if (items.length > 0) {
      return (items[0] as { Id: number }).Id;
    }
    return null;
  }

  /**
   * Read the AIResponse column for a template.
   */
  public static async getAIResponse(
    templateId: string,
  ): Promise<string | null> {
    const items = await TemplateService._list.items
      .filter("Title eq '" + templateId + "'")
      .select("AIResponse")
      .top(1)();

    if (items.length > 0 && (items[0] as { AIResponse: string }).AIResponse) {
      return (items[0] as { AIResponse: string }).AIResponse;
    }
    return null;
  }

  /**
   * Clear the AIResponse column for a template.
   */
  public static async clearAIResponse(templateId: string): Promise<void> {
    const items = await TemplateService._list.items
      .filter("Title eq '" + templateId + "'")
      .select("Id")
      .top(1)();

    if (items.length > 0) {
      await TemplateService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ AIResponse: "" });
    }
  }
}

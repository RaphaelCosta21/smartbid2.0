/**
 * TemplateService — CRUD for bid templates.
 * Each template is a separate row in the smartbid-templates list.
 * Column mapping: Title = template.id, jsondata = JSON.stringify(template)
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IBidTemplate } from "../models/IBidTemplate";

export class TemplateService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.templates);
  }

  /**
   * Get all templates from the smartbid-templates list.
   */
  public static async getAll(): Promise<IBidTemplate[]> {
    const items = await TemplateService._list.items
      .select("Title", "jsondata")
      .top(500)();

    const results: IBidTemplate[] = [];
    items.forEach((item: { Title: string; jsondata: string }) => {
      if (item.jsondata) {
        try {
          results.push(JSON.parse(item.jsondata) as IBidTemplate);
        } catch {
          // Skip invalid JSON rows
        }
      }
    });
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

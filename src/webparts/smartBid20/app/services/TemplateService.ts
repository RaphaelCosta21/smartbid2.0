/**
 * TemplateService — CRUD de templates de equipamento.
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IBidTemplate } from "../models/IBidTemplate";

export class TemplateService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  public static async getAll(): Promise<IBidTemplate[]> {
    const items = await TemplateService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.bidTemplates}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return [];
    return JSON.parse(
      (items[0] as { ConfigValue: string }).ConfigValue,
    ) as IBidTemplate[];
  }

  public static async save(templates: IBidTemplate[]): Promise<void> {
    const items = await TemplateService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.bidTemplates}'`)
      .select("Id")
      .top(1)();
    if (items.length > 0) {
      await TemplateService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(templates) });
    } else {
      await TemplateService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.bidTemplates,
        ConfigValue: JSON.stringify(templates),
      });
    }
  }

  public static async create(template: IBidTemplate): Promise<void> {
    const templates = await TemplateService.getAll();
    templates.push(template);
    await TemplateService.save(templates);
  }

  public static async update(template: IBidTemplate): Promise<void> {
    const templates = await TemplateService.getAll();
    const idx = templates.findIndex((t) => t.id === template.id);
    if (idx >= 0) {
      templates[idx] = template;
      await TemplateService.save(templates);
    }
  }

  public static async deleteTemplate(templateId: string): Promise<void> {
    const templates = await TemplateService.getAll();
    const filtered = templates.filter((t) => t.id !== templateId);
    await TemplateService.save(filtered);
  }
}

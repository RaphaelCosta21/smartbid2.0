/**
 * BomCostAnalysisService — CRUD for BOM Cost Analyses.
 * Stored in smartbid-config list under "BOM_COSTS" config key.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IBomCostAnalysis } from "../models";

const CONFIG_KEY = SHAREPOINT_CONFIG.configKeys.bomCosts;
const LIST_NAME = SHAREPOINT_CONFIG.lists.config;

export class BomCostAnalysisService {
  /**
   * Get all saved BOM Cost Analyses.
   */
  public static async getAll(): Promise<IBomCostAnalysis[]> {
    try {
      const items: any[] = await SPService.sp.web.lists
        .getByTitle(LIST_NAME)
        .items.filter(`Title eq '${CONFIG_KEY}'`)
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

  /**
   * Save the full array of analyses (overwrite).
   */
  public static async save(analyses: IBomCostAnalysis[]): Promise<void> {
    const items: any[] = await SPService.sp.web.lists
      .getByTitle(LIST_NAME)
      .items.filter(`Title eq '${CONFIG_KEY}'`)
      .top(1)();

    const json = JSON.stringify(analyses);

    if (items.length > 0) {
      await SPService.sp.web.lists
        .getByTitle(LIST_NAME)
        .items.getById(items[0].Id)
        .update({ ConfigValue: json });
    } else {
      await SPService.sp.web.lists
        .getByTitle(LIST_NAME)
        .items.add({ Title: CONFIG_KEY, ConfigValue: json });
    }
  }

  /**
   * Save or update a single analysis (upsert by id).
   */
  public static async saveOne(analysis: IBomCostAnalysis): Promise<void> {
    const all = await BomCostAnalysisService.getAll();
    const idx = all.findIndex((a) => a.id === analysis.id);
    if (idx >= 0) {
      all[idx] = analysis;
    } else {
      all.push(analysis);
    }
    await BomCostAnalysisService.save(all);
  }

  /**
   * Delete a single analysis by id.
   */
  public static async deleteOne(id: string): Promise<void> {
    const all = await BomCostAnalysisService.getAll();
    const filtered = all.filter((a) => a.id !== id);
    await BomCostAnalysisService.save(filtered);
  }
}

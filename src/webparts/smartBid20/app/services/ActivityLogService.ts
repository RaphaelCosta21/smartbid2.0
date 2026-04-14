/**
 * ActivityLogService — Log de atividades in-app (padrão SmartFlow).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IActivityLogEntry } from "../models/IActivityLog";

const MAX_LOG_ENTRIES = 200;

export class ActivityLogService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  public static async getAll(): Promise<IActivityLogEntry[]> {
    const items = await ActivityLogService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.activityLog}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return [];
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return [];
    try {
      return JSON.parse(raw) as IActivityLogEntry[];
    } catch {
      return [];
    }
  }

  public static async addEntry(entry: IActivityLogEntry): Promise<void> {
    const entries = await ActivityLogService.getAll();
    entries.unshift(entry);

    // Keep only the last MAX_LOG_ENTRIES
    const trimmed = entries.slice(0, MAX_LOG_ENTRIES);

    const items = await ActivityLogService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.activityLog}'`)
      .select("Id")
      .top(1)();
    if (items.length > 0) {
      await ActivityLogService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(trimmed) });
    } else {
      await ActivityLogService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.activityLog,
        ConfigValue: JSON.stringify(trimmed),
      });
    }
  }
}

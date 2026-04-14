/**
 * SystemConfigService — Config do sistema (cache 5min, padrão SmartFlow).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { ISystemConfig } from "../models";

export class SystemConfigService {
  private static _cache: ISystemConfig | null = null;
  private static _cacheTimestamp = 0;
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  public static async get(): Promise<ISystemConfig> {
    const now = Date.now();
    if (
      SystemConfigService._cache &&
      now - SystemConfigService._cacheTimestamp < SystemConfigService.CACHE_TTL
    ) {
      return SystemConfigService._cache;
    }

    const items = await SystemConfigService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.systemConfig}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) {
      throw new Error("System configuration not found");
    }
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) {
      throw new Error("System configuration is empty");
    }
    let config: ISystemConfig;
    try {
      config = JSON.parse(raw) as ISystemConfig;
    } catch {
      throw new Error("System configuration has invalid JSON");
    }
    SystemConfigService._cache = config;
    SystemConfigService._cacheTimestamp = now;
    return config;
  }

  public static async update(config: ISystemConfig): Promise<void> {
    const items = await SystemConfigService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.systemConfig}'`)
      .select("Id")
      .top(1)();
    if (items.length > 0) {
      await SystemConfigService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(config) });
    } else {
      await SystemConfigService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.systemConfig,
        ConfigValue: JSON.stringify(config),
      });
    }
    SystemConfigService._cache = config;
    SystemConfigService._cacheTimestamp = Date.now();
  }

  public static clearCache(): void {
    SystemConfigService._cache = null;
    SystemConfigService._cacheTimestamp = 0;
  }
}

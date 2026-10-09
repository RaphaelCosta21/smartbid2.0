import {
  AccessAreaKey,
  AccessPermission,
  IAccessLevelDef,
  IBidAccessLevelDef,
  IBid,
  ISystemConfig,
  IUser,
  UserRole,
} from "../models";
import { APP_CONFIG } from "../config/app.config";
import {
  DEFAULT_ACCESS_LEVELS,
  DEFAULT_BID_ACCESS_LEVELS,
  PAGE_AREA,
  SUPER_ADMIN_PAGES,
} from "../config/accessControl.config";
import { BID_TAB_GROUP } from "../config/bidTabs.config";

type MaybeConfig = ISystemConfig | null | undefined;
type MaybeUser = IUser | null | undefined;

export function isSuperAdmin(email: string): boolean {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return false;
  return (APP_CONFIG.superAdminEmails as readonly string[]).some(
    (e) => e.toLowerCase() === normalized,
  );
}

export function isSuperAdminMaster(email: string): boolean {
  return (
    (email || "").trim().toLowerCase() ===
    APP_CONFIG.superAdminMasterEmail.toLowerCase()
  );
}

export function isSuperAdminUser(user: MaybeUser): boolean {
  return !!user && (user.isSuperAdmin === true || isSuperAdmin(user.email));
}

const roleOf = (user: MaybeUser): UserRole => (user && user.role) || "guest";

const roleLevels = (config: MaybeConfig, role: UserRole): IAccessLevelDef =>
  (config && config.accessLevels && config.accessLevels[role]) ||
  DEFAULT_ACCESS_LEVELS[role] ||
  DEFAULT_ACCESS_LEVELS.guest;

const roleBidLevels = (
  config: MaybeConfig,
  role: UserRole,
): IBidAccessLevelDef =>
  (config && config.bidAccessLevels && config.bidAccessLevels[role]) ||
  DEFAULT_BID_ACCESS_LEVELS[role] ||
  DEFAULT_BID_ACCESS_LEVELS.guest;

export function resolveAreaLevel(
  config: MaybeConfig,
  role: UserRole,
  area: AccessAreaKey,
): AccessPermission {
  return roleLevels(config, role)[area] || "none";
}

/** Sub-page level = manual override, otherwise the level of its area. */
export function resolvePageLevel(
  config: MaybeConfig,
  role: UserRole,
  pageKey: string,
): AccessPermission {
  const area = PAGE_AREA[pageKey];
  if (!area) return "none";
  const levels = roleLevels(config, role);
  return (levels.pages && levels.pages[pageKey]) || levels[area] || "none";
}

/** BID tab level = manual override, otherwise the level of its group. */
export function resolveBidTabLevel(
  config: MaybeConfig,
  role: UserRole,
  tabKey: string,
): AccessPermission {
  const group = BID_TAB_GROUP[tabKey];
  if (!group) return "none";
  const levels = roleBidLevels(config, role);
  return (levels.tabs && levels.tabs[tabKey]) || levels[group] || "none";
}

export function getEffectiveAreaLevel(
  user: MaybeUser,
  config: MaybeConfig,
  area: AccessAreaKey,
): AccessPermission {
  if (!user) return "none";
  return resolveAreaLevel(config, roleOf(user), area);
}

export function getEffectivePageLevel(
  user: MaybeUser,
  config: MaybeConfig,
  pageKey: string,
): AccessPermission {
  if (!user) return "none";
  if (SUPER_ADMIN_PAGES.indexOf(pageKey) >= 0 && isSuperAdminUser(user)) {
    return "edit";
  }
  return resolvePageLevel(config, roleOf(user), pageKey);
}

export function getEffectiveBidTabLevel(
  user: MaybeUser,
  config: MaybeConfig,
  tabKey: string,
): AccessPermission {
  if (!user) return "none";
  return resolveBidTabLevel(config, roleOf(user), tabKey);
}

export const canViewLevel = (level: AccessPermission): boolean =>
  level === "view" || canEditLevel(level);

export const canEditLevel = (level: AccessPermission): boolean =>
  level === "edit" || level === "editNoDelete";

export const canDeleteLevel = (level: AccessPermission): boolean =>
  level === "edit";

export function removesCollaborationContent(
  bid: IBid,
  patch: Partial<IBid>,
  tab: "notes" | "qualifications",
): boolean {
  const removesIds = <T extends { id: string }>(
    before: T[],
    after: T[],
  ): boolean =>
    before.some((item) => !after.some((next) => next.id === item.id));

  if (tab === "notes") {
    return (
      (patch.bidNotes !== undefined &&
        Object.keys(bid.bidNotes || {}).some(
          (key) =>
            !Object.prototype.hasOwnProperty.call(patch.bidNotes || {}, key),
        )) ||
      (patch.quickNotes !== undefined &&
        removesIds(bid.quickNotes || [], patch.quickNotes || [])) ||
      (patch.comments !== undefined &&
        removesIds(bid.comments || [], patch.comments || []))
    );
  }

  if (
    patch.clarifications !== undefined &&
    removesIds(bid.clarifications || [], patch.clarifications || [])
  )
    return true;
  if (patch.qualificationTables === undefined) return false;
  const tables = patch.qualificationTables || [];
  return (bid.qualificationTables || []).some((table) => {
    const next = tables.find((item) => item.id === table.id);
    return !next || removesIds(table.items || [], next.items || []);
  });
}

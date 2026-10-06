import {
  AccessAreaKey,
  AccessPermission,
  BidTabGroupKey,
  IAccessLevelDef,
  IBidAccessLevelDef,
  ISystemConfig,
} from "../models/ISystemConfig";
import { UserRole } from "../models/IUser";
import { SECTORS } from "./sectors.config";
import { NAVIGATION_ITEMS } from "./navigation.config";
import { BID_TAB_GROUP, BID_TAB_GROUPS } from "./bidTabs.config";

export interface IAccessRoleDef {
  value: UserRole;
  label: string;
}

const SHORT_ROLE_LABELS: Partial<Record<UserRole, string>> = {
  equipmentInstallation: "Equip. Install.",
};

/** Matrix columns: every team from Members Management plus Guest (users without a team). */
export const ACCESS_ROLES: IAccessRoleDef[] = [
  ...SECTORS.map((s) => ({
    value: s.value as UserRole,
    label: SHORT_ROLE_LABELS[s.value] || s.label,
  })),
  { value: "guest", label: "Guest" },
];

export const ACCESS_PERMISSIONS: AccessPermission[] = ["none", "view", "edit"];

export interface IAccessPageDef {
  key: string;
  label: string;
}

export interface IAccessAreaDef {
  key: AccessAreaKey;
  label: string;
  pages: IAccessPageDef[];
}

export const ACCESS_AREA_KEYS: AccessAreaKey[] = [
  "workspace",
  "knowledge",
  "insights",
  "reports",
  "tools",
  "settings",
];

const AREA_LABELS: Record<AccessAreaKey, string> = {
  workspace: "Workspace",
  knowledge: "Knowledge Base",
  insights: "Insights",
  reports: "Reports",
  tools: "Tools",
  settings: "Settings",
};

const collectPages = (area: AccessAreaKey): IAccessPageDef[] => {
  const pages: IAccessPageDef[] = [];
  NAVIGATION_ITEMS.forEach((item) => {
    if (item.section !== area) return;
    pages.push({ key: item.key, label: item.label });
    (item.children || []).forEach((child) =>
      pages.push({ key: child.key, label: child.label }),
    );
  });
  return pages;
};

/** Sidebar sections become areas; their items (and submenu children) become sub-pages. */
export const ACCESS_AREAS: IAccessAreaDef[] = ACCESS_AREA_KEYS.map((key) => ({
  key,
  label: AREA_LABELS[key],
  pages: collectPages(key),
}));

export const PAGE_AREA: Record<string, AccessAreaKey> = {};
ACCESS_AREAS.forEach((a) => {
  a.pages.forEach((p) => {
    PAGE_AREA[p.key] = a.key;
  });
});

/** Pages a super admin can always edit, whatever their team's permissions are. */
export const SUPER_ADMIN_PAGES = ["system-config", "members"];

export const BID_TAB_GROUP_KEYS: BidTabGroupKey[] = BID_TAB_GROUPS.map(
  (g) => g.key,
);

/* ---- Seeds (mirror the behavior before the matrix was enforced) ---- */

const areas = (
  workspace: AccessPermission,
  knowledge: AccessPermission,
  insights: AccessPermission,
  reports: AccessPermission,
  tools: AccessPermission,
  settings: AccessPermission,
  pages?: Record<string, AccessPermission>,
): IAccessLevelDef => ({
  workspace,
  knowledge,
  insights,
  reports,
  tools,
  settings,
  ...(pages ? { pages } : {}),
});

const NON_ENG_PAGES: Record<string, AccessPermission> = {
  dashboard: "none",
  "patch-notes": "view",
};

export const DEFAULT_ACCESS_LEVELS: Record<UserRole, IAccessLevelDef> = {
  commercial: areas("edit", "none", "edit", "edit", "edit", "edit", {
    dashboard: "none",
  }),
  engineering: areas("edit", "edit", "view", "view", "edit", "none", {
    "patch-notes": "view",
  }),
  project: areas("edit", "none", "view", "view", "edit", "none", NON_ENG_PAGES),
  operation: areas(
    "edit",
    "none",
    "view",
    "view",
    "edit",
    "none",
    NON_ENG_PAGES,
  ),
  dataCenter: areas(
    "view",
    "none",
    "view",
    "view",
    "edit",
    "none",
    NON_ENG_PAGES,
  ),
  equipmentInstallation: areas(
    "view",
    "none",
    "view",
    "view",
    "edit",
    "none",
    NON_ENG_PAGES,
  ),
  supplyChain: areas(
    "view",
    "none",
    "view",
    "view",
    "edit",
    "none",
    NON_ENG_PAGES,
  ),
  guest: areas("view", "none", "none", "none", "view", "none", NON_ENG_PAGES),
};

const bidGroups = (
  role: UserRole,
  workspace: AccessPermission,
): IBidAccessLevelDef => {
  const isEngineering = role === "engineering";
  const level: IBidAccessLevelDef = {
    general: workspace,
    scopeCosting: isEngineering
      ? "edit"
      : workspace === "none"
        ? "none"
        : "view",
    management: workspace,
    collaboration: workspace,
    tools: workspace,
  };
  // Approval rounds/override used to be Engineering-only.
  if (!isEngineering && workspace === "edit") level.tabs = { approval: "view" };
  return level;
};

export const DEFAULT_BID_ACCESS_LEVELS = {} as Record<
  UserRole,
  IBidAccessLevelDef
>;
ACCESS_ROLES.forEach((r) => {
  DEFAULT_BID_ACCESS_LEVELS[r.value] = bidGroups(
    r.value,
    DEFAULT_ACCESS_LEVELS[r.value].workspace,
  );
});

/* ---- Migration / normalization of the JSON stored in SYSTEM_CONFIG ---- */

const isPermission = (v: unknown): v is AccessPermission =>
  v === "edit" || v === "view" || v === "none";

const pickOverrides = (
  source: Record<string, unknown> | undefined,
  validKeys: Record<string, unknown>,
  allowEditNoDelete: (key: string) => boolean = () => false,
): Record<string, AccessPermission> | undefined => {
  if (!source) return undefined;
  const out: Record<string, AccessPermission> = {};
  Object.keys(source).forEach((k) => {
    const v = source[k];
    if (
      validKeys[k] &&
      (isPermission(v) || (v === "editNoDelete" && allowEditNoDelete(k)))
    ) {
      out[k] = v as AccessPermission;
    }
  });
  return Object.keys(out).length ? out : undefined;
};

export function normalizeAccessLevels(
  raw: unknown,
): Record<UserRole, IAccessLevelDef> {
  const rawMap = (raw || {}) as Record<string, Record<string, unknown>>;
  const out = {} as Record<UserRole, IAccessLevelDef>;
  ACCESS_ROLES.forEach(({ value: role }) => {
    const saved = rawMap[role];
    const def = DEFAULT_ACCESS_LEVELS[role];
    // Records saved before Knowledge Base/Tools existed also receive the seeded page overrides.
    const legacy = !saved || saved.knowledge === undefined;
    const levels = {} as IAccessLevelDef;
    ACCESS_AREA_KEYS.forEach((area) => {
      const v = saved ? saved[area] : undefined;
      levels[area] = isPermission(v) ? v : def[area];
    });
    const savedPages = saved
      ? (saved.pages as Record<string, unknown> | undefined)
      : undefined;
    const pages = pickOverrides(
      legacy ? { ...(def.pages || {}), ...(savedPages || {}) } : savedPages,
      PAGE_AREA,
    );
    if (pages) levels.pages = pages;
    out[role] = levels;
  });
  return out;
}

export function normalizeBidAccessLevels(
  raw: unknown,
): Record<UserRole, IBidAccessLevelDef> {
  const rawMap = (raw || {}) as Record<string, Record<string, unknown>>;
  const out = {} as Record<UserRole, IBidAccessLevelDef>;
  ACCESS_ROLES.forEach(({ value: role }) => {
    const saved = rawMap[role];
    const def = DEFAULT_BID_ACCESS_LEVELS[role];
    const levels = {} as IBidAccessLevelDef;
    BID_TAB_GROUP_KEYS.forEach((g) => {
      const v = saved ? saved[g] : undefined;
      levels[g] =
        isPermission(v) || (g === "collaboration" && v === "editNoDelete")
          ? (v as AccessPermission)
          : def[g];
    });
    const tabs = pickOverrides(
      saved ? (saved.tabs as Record<string, unknown> | undefined) : def.tabs,
      BID_TAB_GROUP,
      (key) => BID_TAB_GROUP[key] === "collaboration",
    );
    if (tabs) levels.tabs = tabs;
    out[role] = levels;
  });
  return out;
}

export function normalizeAccessConfig(config: ISystemConfig): ISystemConfig {
  return {
    ...config,
    accessLevels: normalizeAccessLevels(config.accessLevels),
    bidAccessLevels: normalizeBidAccessLevels(config.bidAccessLevels),
  };
}

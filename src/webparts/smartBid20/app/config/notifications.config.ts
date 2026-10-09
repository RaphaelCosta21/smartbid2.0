import {
  BidRole,
  INotificationEventRule,
  INotificationSettings,
  INotificationTeamRule,
  NotificationAudienceMode,
  NotificationEventKey,
  Sector,
} from "../models";
import { ACCESS_ROLES } from "./accessControl.config";
import { BID_ROLE_META } from "./bidRoles.config";

export type NotificationChannel = "email" | "teams";
export type NotificationTone = "brand" | "info" | "success" | "warning" | "danger";
export type NotificationSource = "app" | "approvalFlow" | "deadlineMonitor";
export type NotificationGroupKey =
  | "lifecycle"
  | "approvals"
  | "deadlines"
  | "documents";

export interface INotificationEventDef {
  key: NotificationEventKey;
  label: string;
  group: NotificationGroupKey;
  channels: NotificationChannel[];
  /** Where the event fires, shown under the event name. */
  trigger: string;
  source: NotificationSource;
  /** Card / e-mail title (PT-BR, like every Teams and e-mail template). */
  title: string;
  emoji: string;
  tone: NotificationTone;
}

export const NOTIFICATION_GROUPS: { key: NotificationGroupKey; label: string }[] =
  [
    { key: "lifecycle", label: "BID lifecycle" },
    { key: "approvals", label: "Approvals" },
    { key: "deadlines", label: "Deadlines" },
    { key: "documents", label: "Documents" },
  ];

export const NOTIFICATION_EVENTS: INotificationEventDef[] = [
  {
    key: "BID_CREATED",
    label: "SmartBID Created",
    group: "lifecycle",
    channels: ["email", "teams"],
    trigger: "Create Request > Submit Request",
    source: "app",
    title: "Novo SmartBID criado",
    emoji: "🆕",
    tone: "brand",
  },
  {
    key: "BID_ASSIGNED",
    label: "SmartBID Assigned",
    group: "lifecycle",
    channels: ["teams"],
    trigger: "Unassigned Requests > Assign",
    source: "app",
    title: "SmartBID atribuído",
    emoji: "👥",
    tone: "brand",
  },
  {
    key: "PHASE_CHANGED",
    label: "Phase Changed",
    group: "lifecycle",
    channels: ["teams"],
    trigger: "BID Details > Status & Phase panel",
    source: "app",
    title: "Fase alterada",
    emoji: "🔀",
    tone: "info",
  },
  {
    key: "STATUS_CHANGED",
    label: "Status Changed",
    group: "lifecycle",
    channels: ["teams"],
    trigger: "BID Details > Status & Phase panel",
    source: "app",
    title: "Status alterado",
    emoji: "🔄",
    tone: "info",
  },
  {
    key: "BID_ON_HOLD",
    label: "SmartBID On Hold / Resumed",
    group: "lifecycle",
    channels: ["teams"],
    trigger: "Status set to On Hold or moved out of it",
    source: "app",
    title: "SmartBID em espera",
    emoji: "⏸️",
    tone: "warning",
  },
  {
    key: "REVISION_STARTED",
    label: "Revision Started",
    group: "lifecycle",
    channels: ["teams"],
    trigger: "Revisions > Start New Revision",
    source: "app",
    title: "Revisão iniciada",
    emoji: "🛠️",
    tone: "warning",
  },
  {
    key: "BID_COMPLETED",
    label: "SmartBID Completed",
    group: "lifecycle",
    channels: ["email", "teams"],
    trigger: "Status Completed, Close Revision or approval round closed",
    source: "app",
    title: "SmartBID concluído",
    emoji: "✅",
    tone: "success",
  },
  {
    key: "BID_CANCELED",
    label: "SmartBID Canceled",
    group: "lifecycle",
    channels: ["email", "teams"],
    trigger: "Status set to a canceled status",
    source: "app",
    title: "SmartBID cancelado",
    emoji: "🚫",
    tone: "danger",
  },
  {
    key: "APPROVAL_STARTED",
    label: "New Approval Flow Started",
    group: "approvals",
    channels: ["teams"],
    trigger: "Approval > Request Approvals",
    source: "app",
    title: "Rodada de aprovação iniciada",
    emoji: "🚀",
    tone: "brand",
  },
  {
    key: "APPROVAL_RESPONSE",
    label: "Approval Response",
    group: "approvals",
    channels: ["teams"],
    trigger: "Approver answers in Teams (approval flow)",
    source: "approvalFlow",
    title: "Resposta de aprovação",
    emoji: "📝",
    tone: "info",
  },
  {
    key: "APPROVAL_OVERRIDE",
    label: "Approval Override",
    group: "approvals",
    channels: ["teams"],
    trigger: "Approval > Override Approval",
    source: "app",
    title: "Aprovação concluída por override",
    emoji: "⚠️",
    tone: "warning",
  },
  {
    key: "DUE_DATE_CHANGED",
    label: "Due Date Changed",
    group: "deadlines",
    channels: ["teams"],
    trigger: "Overview > Key Dates > Change",
    source: "app",
    title: "Prazo alterado",
    emoji: "📅",
    tone: "info",
  },
  {
    key: "DEADLINE_WARNING",
    label: "Deadline Warning",
    group: "deadlines",
    channels: ["teams"],
    trigger: "Daily check, Mon-Fri 08:00 (Brasilia)",
    source: "deadlineMonitor",
    title: "Prazo se aproximando",
    emoji: "⏰",
    tone: "warning",
  },
  {
    key: "BID_OVERDUE",
    label: "SmartBID Overdue",
    group: "deadlines",
    channels: ["teams"],
    trigger: "Daily check, then weekly while late. Skips On Hold",
    source: "deadlineMonitor",
    title: "SmartBID atrasado",
    emoji: "🔴",
    tone: "danger",
  },
  {
    key: "TECHNICAL_PROPOSAL_UPLOADED",
    label: "Technical Proposal Uploaded",
    group: "documents",
    channels: ["teams"],
    trigger: "Documents > Upload as Technical Proposal",
    source: "app",
    title: "Technical Proposal anexada",
    emoji: "📄",
    tone: "info",
  },
];

export function getNotificationEventDef(
  key: NotificationEventKey,
): INotificationEventDef {
  return NOTIFICATION_EVENTS.filter((e) => e.key === key)[0];
}

/** Matrix columns: the Members Management teams (Guest has no members). */
export const NOTIFICATION_TEAMS: { value: Sector; label: string }[] =
  ACCESS_ROLES.filter((r) => r.value !== "guest").map((r) => ({
    value: r.value as Sector,
    label: r.label,
  }));

export const DEFAULT_DEADLINE_WARNING_DAYS = 2;
export const MAX_DEADLINE_WARNING_DAYS = 30;

const MODES: NotificationAudienceMode[] = ["off", "all", "custom"];
const BID_ROLE_KEYS: BidRole[] = BID_ROLE_META.map((r) => r.key);
const KEY_PEOPLE_TEAMS: Sector[] = ["engineering", "commercial", "project"];
const ENGINEERING_LEADS: BidRole[] = ["manager", "sr-manager", "coordinator"];

const teamRule = (
  mode: NotificationAudienceMode,
  bidRoles: BidRole[] = [],
  keyPeople = false,
): INotificationTeamRule => ({ mode, bidRoles, keyPeople });

function buildDefaultRule(event: NotificationEventKey): INotificationEventRule {
  const teams = {} as Record<Sector, INotificationTeamRule>;
  NOTIFICATION_TEAMS.forEach((t) => {
    teams[t.value] =
      KEY_PEOPLE_TEAMS.indexOf(t.value) >= 0
        ? teamRule("custom", [], true)
        : teamRule("off");
  });
  if (event === "BID_CREATED" || event === "BID_OVERDUE") {
    teams.engineering = teamRule("custom", ENGINEERING_LEADS.slice(), true);
  }
  return { enabled: true, teams };
}

export function buildDefaultNotificationRules(): Record<
  NotificationEventKey,
  INotificationEventRule
> {
  const rules = {} as Record<NotificationEventKey, INotificationEventRule>;
  NOTIFICATION_EVENTS.forEach((e) => {
    rules[e.key] = buildDefaultRule(e.key);
  });
  return rules;
}

export const DEFAULT_NOTIFICATION_SETTINGS: INotificationSettings = {
  flowUrl: "",
  filterByBusinessLine: true,
  deadlineWarningDays: DEFAULT_DEADLINE_WARNING_DAYS,
  rules: buildDefaultNotificationRules(),
};

/** Every team rule keeps the full shape so the flow can read it without null checks. */
function normalizeTeamRule(raw: unknown): INotificationTeamRule {
  const r = (raw || {}) as Partial<INotificationTeamRule>;
  const mode =
    MODES.indexOf(r.mode as NotificationAudienceMode) >= 0
      ? (r.mode as NotificationAudienceMode)
      : "off";
  const bidRoles = (Array.isArray(r.bidRoles) ? r.bidRoles : []).filter(
    (b) => BID_ROLE_KEYS.indexOf(b) >= 0,
  );
  return teamRule(mode, bidRoles, r.keyPeople === true);
}

export function clampDeadlineWarningDays(value: unknown): number {
  const n = Math.round(Number(value));
  if (!isFinite(n)) return DEFAULT_DEADLINE_WARNING_DAYS;
  return Math.max(0, Math.min(MAX_DEADLINE_WARNING_DAYS, n));
}

/** The legacy `Record<event, roles[]>` format never drove any delivery, so it falls back to defaults. */
export function normalizeNotificationSettings(
  raw: unknown,
): INotificationSettings {
  const src =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Partial<INotificationSettings>)
      : {};
  const rawRules =
    src.rules && typeof src.rules === "object"
      ? (src.rules as Partial<Record<NotificationEventKey, unknown>>)
      : null;

  const rules = {} as Record<NotificationEventKey, INotificationEventRule>;
  NOTIFICATION_EVENTS.forEach((e) => {
    const rawRule = rawRules ? (rawRules[e.key] as Partial<INotificationEventRule>) : null;
    if (!rawRule || typeof rawRule !== "object") {
      rules[e.key] = buildDefaultRule(e.key);
      return;
    }
    const rawTeams = (rawRule.teams || {}) as Partial<Record<Sector, unknown>>;
    const teams = {} as Record<Sector, INotificationTeamRule>;
    NOTIFICATION_TEAMS.forEach((t) => {
      teams[t.value] = normalizeTeamRule(rawTeams[t.value]);
    });
    rules[e.key] = { enabled: rawRule.enabled !== false, teams };
  });

  return {
    flowUrl: typeof src.flowUrl === "string" ? src.flowUrl.trim() : "",
    filterByBusinessLine: src.filterByBusinessLine !== false,
    deadlineWarningDays:
      src.deadlineWarningDays === undefined
        ? DEFAULT_DEADLINE_WARNING_DAYS
        : clampDeadlineWarningDays(src.deadlineWarningDays),
    rules,
  };
}

const FLOW_URL_PATTERN =
  /^https:\/\/([a-z0-9-]+\.)+(powerplatform\.com|logic\.azure\.com)(:\d+)?\//i;

/** Only Power Automate / Logic Apps endpoints may receive BID data. */
export function isValidFlowUrl(url: string): boolean {
  return FLOW_URL_PATTERN.test((url || "").trim());
}

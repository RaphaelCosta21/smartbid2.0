import { BidRole, Sector, UserRole } from "./IUser";
import { IFavoriteGroup } from "./IFavoriteItem";
import { BidPriority } from "./IBidStatus";

export interface IConfigOption {
  id: string;
  label: string;
  value: string;
  isActive?: boolean;
  order?: number;
  color?: string;
  category?: string;
  /** ERN Project Number assigned to this Division / Service Line (used to pre-fill ERN creation) */
  projectNumber?: string;
  [key: string]: unknown;
}

export interface IKPITargets {
  targetOnTimeDelivery: number;
  targetOTIF: number;
  /** Business days from creation to first delivery, per BID urgency. */
  targetAvgCompletionDaysByPriority: Record<BidPriority, number>;
  targetFirstPassApproval: number;
  targetApprovalCycleDays: number;
  /** Applies to both ERN overdue and BID due-date overdue. */
  targetOverdueRate: number;
  targetWinRate: number;
}

/** Business-day lead time (request date to desired due date) that classifies a new BID. */
export interface IPriorityRules {
  urgentMaxBusinessDays: number;
  normalMaxBusinessDays: number;
}

export interface IExchangeRate {
  currency: string;
  rate: number;
  lastUpdate: string;
}

export interface ICurrencySettings {
  defaultCurrency: string;
  exchangeRates: IExchangeRate[];
  updateFrequency: "monthly" | "weekly" | "daily";
}

export type AccessPermission = "edit" | "view" | "none" | "editNoDelete";

export type AccessAreaKey =
  | "workspace"
  | "knowledge"
  | "insights"
  | "reports"
  | "tools"
  | "settings";

export type BidTabGroupKey =
  | "general"
  | "scopeCosting"
  | "management"
  | "collaboration"
  | "tools";

/** Area levels per team; `pages` holds manual sub-page overrides (absent = inherit area). */
export type IAccessLevelDef = Record<AccessAreaKey, AccessPermission> & {
  pages?: Record<string, AccessPermission>;
};

/** BID Details group levels per team; `tabs` holds manual tab overrides (absent = inherit group). */
export type IBidAccessLevelDef = Record<BidTabGroupKey, AccessPermission> & {
  tabs?: Record<string, AccessPermission>;
};

export type NotificationEventKey =
  | "BID_CREATED"
  | "BID_ASSIGNED"
  | "PHASE_CHANGED"
  | "STATUS_CHANGED"
  | "BID_ON_HOLD"
  | "REVISION_STARTED"
  | "BID_COMPLETED"
  | "BID_CANCELED"
  | "APPROVAL_STARTED"
  | "APPROVAL_RESPONSE"
  | "APPROVAL_OVERRIDE"
  | "DUE_DATE_CHANGED"
  | "DEADLINE_WARNING"
  | "BID_OVERDUE"
  | "TECHNICAL_PROPOSAL_UPLOADED";

export type NotificationAudienceMode = "off" | "all" | "custom";

/** `custom` = team members holding one of `bidRoles`, plus the BID Key People of this team when `keyPeople`. */
export interface INotificationTeamRule {
  mode: NotificationAudienceMode;
  bidRoles?: BidRole[];
  keyPeople?: boolean;
}

export interface INotificationEventRule {
  enabled: boolean;
  teams: Record<Sector, INotificationTeamRule>;
}

/** Read by the Power Automate notification flows (power-automate/NOTIFICATIONS.md). */
export interface INotificationSettings {
  flowUrl: string;
  filterByBusinessLine: boolean;
  deadlineWarningDays: number;
  rules: Record<NotificationEventKey, INotificationEventRule>;
}

export interface IResourceTypeConfig {
  id: string;
  label: string;
  isActive: boolean;
  order: number;
  subTypes: IConfigOption[];
}

export interface ISystemConfig {
  kpiTargets: IKPITargets;
  priorityRules?: IPriorityRules;
  regions: IConfigOption[];
  bidTypes: IConfigOption[];
  divisions: IConfigOption[];
  serviceLines: IConfigOption[];
  clientList: IConfigOption[];
  jobFunctions: IConfigOption[];
  jobTeams?: string[];
  hoursPhases: IConfigOption[];
  availabilityStatuses: IConfigOption[];
  acquisitionTypes: IConfigOption[];
  deliverableTypes: IConfigOption[];
  engineerDeliverables: IConfigOption[];
  engineerDeliverableCategories?: string[];
  bidResultOptions: IConfigOption[];
  lossReasons: IConfigOption[];
  costReferences: IConfigOption[];
  phases: IConfigOption[];
  subStatuses: IConfigOption[];
  terminalStatuses: IConfigOption[];
  resourceTypes: IResourceTypeConfig[];
  /** Scope categories used to classify completed BIDs on the Past Bids page */
  scopeCategories?: IConfigOption[];
  /** Categories used to classify Clarifications (library + BID) */
  clarificationCategories?: IConfigOption[];
  /** Categories used to classify Qualifications (library + BID qualification tables) */
  qualificationCategories?: IConfigOption[];
  /** Supplier service types (Suppliers page filters + AI profile). */
  supplierServiceTypes?: IConfigOption[];
  currencySettings: ICurrencySettings;
  notifications: INotificationSettings;
  accessLevels: Record<UserRole, IAccessLevelDef>;
  bidAccessLevels?: Record<UserRole, IBidAccessLevelDef>;
  /** Teams that see the SmartBid Assistant button (absent = DEFAULT_ASSISTANT_TEAMS). */
  assistantTeams?: UserRole[];
  favoriteGroups: IFavoriteGroup[];
}

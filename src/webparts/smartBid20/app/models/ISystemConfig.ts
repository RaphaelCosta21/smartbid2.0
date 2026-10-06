import { UserRole } from "./IUser";
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

export type AccessPermission = "edit" | "view" | "none";

export interface IAccessLevelDef {
  workspace: AccessPermission;
  insights: AccessPermission;
  reports: AccessPermission;
  settings: AccessPermission;
  approvals: AccessPermission;
  templates: AccessPermission;
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
  /** Categories used to classify Clarifications & Qualifications (library + BID) */
  clarificationCategories?: IConfigOption[];
  /** Supplier service types (Suppliers page filters + AI profile). */
  supplierServiceTypes?: IConfigOption[];
  currencySettings: ICurrencySettings;
  notifications: Record<string, string[]>;
  accessLevels: Record<UserRole, IAccessLevelDef>;
  favoriteGroups: IFavoriteGroup[];
}

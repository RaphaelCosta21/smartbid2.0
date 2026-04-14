import { UserRole } from "./IUser";

export interface IConfigOption {
  id: string;
  label: string;
  value: string;
  isActive?: boolean;
  order?: number;
  color?: string;
  category?: string;
  [key: string]: unknown;
}

export interface IKPITargets {
  targetOnTimeDelivery: number;
  targetOTIF: number;
  targetAvgCompletionDays: number;
  targetFirstPassApproval: number;
  targetApprovalCycleDays: number;
  targetCancellationRate: number;
  targetTemplateUsage: number;
  targetOverdueRate: number;
  targetWinRate: number;
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

export interface ISystemConfig {
  kpiTargets: IKPITargets;
  regions: IConfigOption[];
  bidTypes: IConfigOption[];
  divisions: IConfigOption[];
  serviceLines: IConfigOption[];
  clientList: IConfigOption[];
  jobFunctions: IConfigOption[];
  hoursPhases: IConfigOption[];
  acquisitionTypes: IConfigOption[];
  deliverableTypes: IConfigOption[];
  engineerDeliverables: IConfigOption[];
  bidResultOptions: IConfigOption[];
  lossReasons: IConfigOption[];
  costReferences: IConfigOption[];
  phases: IConfigOption[];
  currencySettings: ICurrencySettings;
  notifications: Record<string, string[]>;
  accessLevels: Record<UserRole, IAccessLevelDef>;
}

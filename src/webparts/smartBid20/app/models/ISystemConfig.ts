import { UserRole } from "./IUser";

export interface IConfigOption {
  id: string;
  label: string;
  value: string;
  isActive?: boolean;
  order?: number;
  color?: string;
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

export interface ICurrencySettings {
  defaultCurrency: string;
  ptax: number;
  ptaxLastUpdate: string;
  ptaxUpdateFrequency: string;
}

export interface IApprovalRuleEntry {
  role: string;
  required: boolean;
  order: number;
}

export interface IApprovalRules {
  defaultApprovers: IApprovalRuleEntry[];
  divisionOverrides: Record<string, IApprovalRuleEntry[]>;
  thresholds: {
    highValueThreshold: number;
    highValueAdditionalApprovers: IApprovalRuleEntry[];
  };
  reminderIntervalHours: number;
  maxReminders: number;
  autoEscalateAfterHours: number;
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
  bidSizes: IConfigOption[];
  priorities: IConfigOption[];
  clientList: IConfigOption[];
  jobFunctions: IConfigOption[];
  hoursPhases: IConfigOption[];
  acquisitionTypes: IConfigOption[];
  deliverableTypes: IConfigOption[];
  equipmentCategories: IConfigOption[];
  bidResultOptions: IConfigOption[];
  currencySettings: ICurrencySettings;
  notifications: Record<string, string[]>;
  accessLevels: Record<UserRole, IAccessLevelDef>;
  approvalRules: IApprovalRules;
  bidStatuses: IConfigOption[];
  phases: IConfigOption[];
  costReferences: IConfigOption[];
  equipmentSubCategories: IConfigOption[];
  lossReasons: IConfigOption[];
}

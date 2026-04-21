import { IPersonRef } from "./IUser";
import {
  BidPhase,
  BidPriority,
  BidType,
  BidSize,
  Division,
  ApprovalStatus,
  BidResultOutcome,
} from "./IBidStatus";

export interface IOpportunityInfo {
  client: string;
  clientContact: string;
  projectName: string;
  projectDescription: string;
  region: string;
  vessel: string;
  field: string;
  waterDepth: number;
  waterDepthUnit: string;
  operationStartDate: string;
  totalDuration: number;
  totalDurationUnit: string;
  currency: string;
  ptax: number;
  ptaxDate: string;
  qualifications: string[];
}

/** Tracks time spent in each phase independently */
export interface IPhaseHistoryEntry {
  id: number;
  phase: BidPhase;
  start: string;
  end: string | null;
  durationHours: number | null;
  actor: string;
}

/** Tracks time spent in each status independently */
export interface IStatusHistoryEntry {
  id: number;
  status: string;
  phase: BidPhase;
  start: string;
  end: string | null;
  durationHours: number | null;
  actor: string;
}

export interface IBidTask {
  taskId: string;
  phase: BidPhase;
  name: string;
  status: "not-started" | "in-progress" | "completed" | "skipped";
  assignedTo: string;
  completedDate: string | null;
  comments: string;
}

export interface IEquipmentItem {
  id: string;
  lineNumber: number;
  requirementGroup: number;
  requirementName: string;
  engStudy: string;
  partNumber: string;
  toolDescription: string;
  qtyOperational: number;
  qtySpare: number;
  qtyOnHand: number;
  qtyToBuy: number;
  acquisitionType: string;
  leadTimeDays: number;
  unitCostUSD: number;
  totalCostUSD: number;
  costReference: string;
  isFavorite: boolean;
  costCategory: "CAPEX" | "OPEX";
  costCalcMethod: "auto" | "manual";
  originalCost: number;
  originalCurrency: string;
  costDate: string;
  quoteUrl: string | null;
  quoteLabel: string | null;
  statusIndicator: string | null;
  equipmentSubCategory: string;
  importedFromTemplate: string | null;
  notes: string;
}

/* ─── Scope of Supply ─── */
export interface IScopeItem {
  id: string;
  lineNumber: number;
  /** true = this row is a section header (only sectionTitle is meaningful) */
  isSection: boolean;
  /** ID of the parent section header (null = unsectioned) */
  sectionId: string | null;
  /** Section header display name (only when isSection = true) */
  sectionTitle: string;
  clientDocRef: string;
  description: string;
  compliance: "yes" | "no" | null;
  /** Parent resource type from systemConfig.resourceTypes (e.g. "ROV Asset") */
  resourceType: string;
  /** Sub-type from systemConfig.resourceTypes[].subTypes (e.g. "Camera") */
  resourceSubType: string;
  equipmentOffer: string;
  oiiPartNumber: string;
  mfgReference: string;
  qtyOperational: number;
  qtySpare: number;
  /** Flag: this item needs certification (auto-populates Certifications tab) */
  needsCertification: boolean;
  comments: string;
  importedFromTemplate: string | null;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

/* ─── Assets Breakdown (cost layer for Scope items) ─── */
export interface IAssetBreakdownItem {
  id: string;
  /** FK to IScopeItem.id — live sync link */
  scopeItemId: string;
  /** Gap Analysis status */
  availabilityStatus:
    | "In House"
    | "Onboard"
    | "Purchase"
    | "Rental"
    | "Not Available"
    | "";
  /** From systemConfig.acquisitionTypes */
  acquisitionType: string;
  unitCostUSD: number;
  /** Auto-calc: unitCostUSD × (scope.qtyOper + scope.qtySpare) */
  totalCostUSD: number;
  /** From systemConfig.costReferences (BUMBL, BUABO, etc.) */
  costReference: string;
  costCalcMethod: "auto" | "manual";
  originalCost: number;
  originalCurrency: string;
  costDate: string;
  leadTimeDays: number;
  /** For rental items */
  dailyRate: number | null;
  /** Number of rental days */
  rentalDays: number | null;
  transitCost: number;
  costCategory: "CAPEX" | "OPEX" | "";
  supplier: string;
  quoteReference: string | null;
  statusIndicator: string | null;
  notes: string;
  subCosts?: IAssetSubCost[];
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

/* ─── Logistics Breakdown ─── */
export interface ILogisticsItem {
  id: string;
  lineNumber: number;
  item: string;
  description: string;
  originalCurrency: string;
  qty: number;
  unitCost: number;
  /** Auto-calc: unitCost × qty */
  totalCost: number;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

/* ─── Certifications Breakdown ─── */
export interface ICertificationItem {
  id: string;
  lineNumber: number;
  /** Optional FK to IScopeItem (items flagged needsCertification) */
  scopeItemId: string | null;
  /** Display reference (auto-filled from Scope or manual) */
  itemRef: string;
  qty: number;
  /** Free text, e.g. "12 months", "2 years" */
  expiryPeriod: string;
  unitCost: number;
  /** Auto-calc: unitCost × qty */
  totalCost: number;
  originalCurrency: string;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

/* ─── Preparation & Mobilization ─── */

export type RTSCostType =
  | "maintenance"
  | "refurbishment"
  | "upgrade"
  | "rts-inspection"
  | "";

export interface IRTSItem {
  id: string;
  lineNumber: number;
  sectionId?: string | null;
  /** FK to IScopeItem.id — which asset needs RTS */
  scopeItemId: string | null;
  description: string;
  costType: RTSCostType;
  originalCurrency: string;
  unitCost: number;
  qty: number;
  totalCost: number;
  costReference: string;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

export type MobilizationCostType =
  | "mobilization"
  | "demobilization"
  | "transit"
  | "";

export interface IMobilizationItem {
  id: string;
  lineNumber: number;
  sectionId?: string | null;
  description: string;
  costType: MobilizationCostType;
  originalCurrency: string;
  unitCost: number;
  qty: number;
  totalCost: number;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

export interface IConsumableItem {
  id: string;
  lineNumber: number;
  sectionId?: string | null;
  item: string;
  description: string;
  originalCurrency: string;
  qty: number;
  unitCost: number;
  totalCost: number;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

/* ─── Asset Sub-Costs ─── */
export interface IAssetSubCost {
  id: string;
  description: string;
  costUSD: number;
  costReference?: string;
  leadTimeDays?: number;
  notes: string;
  /** Transit Rate sub-cost (auto-created for Rental items) */
  isTransitRate?: boolean;
  importDays?: number;
  exportDays?: number;
  transitDiscount?: number;
}

/* ─── Qualifications & Clarifications ─── */
export interface IQualificationTable {
  id: string;
  title: string;
  items: IQualificationItem[];
}

export interface IQualificationItem {
  id: string;
  item: number;
  description: string;
  comments: string;
}

export interface IClarificationItem {
  id: string;
  scopeItemId: string | null;
  item: string;
  description: string;
  clarification: string;
  clientResponse: string;
  isAutoImported: boolean;
}

export interface IHoursItem {
  id: string;
  lineNumber: number;
  sectionId?: string | null;
  resourceGroup?: number;
  requirementName: string;
  engStudy?: string;
  function: string;
  phase: string;
  hoursPerDay: number;
  pplQty: number;
  workDays: number;
  utilizationPercent: number;
  totalHours: number;
  costBRL: number;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "";
}

export interface IHoursSectionGroup {
  id: string;
  title: string;
}

export interface IHoursSection {
  totalHours: number;
  totalCostBRL: number;
  items: IHoursItem[];
  sections?: IHoursSectionGroup[];
}

export interface IDivisionHoursTotals {
  engineering: number;
  onshore: number;
  offshore: number;
}

export interface IHoursSummary {
  engineeringHours: IHoursSection;
  onshoreHours: IHoursSection;
  offshoreHours: IHoursSection;
  totalsByDivision: Record<string, IDivisionHoursTotals>;
  grandTotalHours: number;
  grandTotalCostBRL: number;
  grandTotalCostUSD: number;
}

export interface IDivisionCost {
  capex: number;
  opex: number;
  total: number;
}

export interface IAssetsCostSummary {
  capexTotal: number;
  capexTotalBRL: number;
  opexTotal: number;
  opexTotalBRL: number;
  grandTotal: number;
  grandTotalBRL: number;
  byDivision: Record<string, IDivisionCost>;
}

export interface ICostSummary {
  assetsCostUSD: number;
  assetsCostBRL: number;
  assetsCapexUSD: number;
  assetsOpexUSD: number;
  onshoreHoursCostBRL: number;
  offshoreHoursCostBRL: number;
  engineeringHoursCostBRL: number;
  totalHoursCostBRL: number;
  totalHoursCostUSD: number;
  logisticsCostUSD: number;
  logisticsCostBRL: number;
  certificationsCostUSD: number;
  certificationsCostBRL: number;
  rtsCostUSD: number;
  rtsCostBRL: number;
  mobilizationCostUSD: number;
  mobilizationCostBRL: number;
  consumablesCostUSD: number;
  consumablesCostBRL: number;
  totalCostUSD: number;
  totalCostBRL: number;
  currency: string;
  ptaxUsed: number;
  notes: string;
}

export interface IBidApproval {
  id: string;
  stakeholderRole: string;
  stakeholder: IPersonRef;
  status: ApprovalStatus;
  requestedDate: string;
  respondedDate: string | null;
  decision: string | null;
  comments: string | null;
  approvedVia: string | null;
  notificationSent: boolean;
  reminderCount: number;
}

export interface IBidAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedDate: string;
  category: string;
}

export interface IQuickNote {
  id: string;
  text: string;
  author: { name: string; email: string };
  createdAt: string;
}

export interface IBidComment {
  id: string;
  author: IPersonRef;
  text: string;
  timestamp: string;
  phase: BidPhase;
  section: string;
  isEdited: boolean;
  editedAt: string | null;
  mentions: string[];
  attachments: string[];
}

export interface IBidResult {
  outcome: BidResultOutcome | null;
  outcomeDate: string | null;
  contractValue: number | null;
  contractCurrency: string | null;
  lostReason: string | null;
  competitorName: string | null;
  feedbackNotes: string | null;
  followUpDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdatedDate: string | null;
}

export interface IActivityLogEntry {
  id: string;
  type: string;
  timestamp: string;
  actor: string;
  actorName: string;
  description: string;
  metadata: Record<string, unknown>;
}

export interface IBidKPIs {
  daysInCurrentPhase: number;
  totalDaysElapsed: number;
  estimatedDaysRemaining: number;
  isOverdue: boolean;
  overdueBy: number;
  approvalCycleTime: number | null;
  phaseCompletionPercentage: number;
  templateMatchScore: number | null;
}

export interface IBidRevision {
  revision: number;
  openedBy: { name: string; email: string };
  openedDate: string;
  reason: string;
  returnToPhase: string;
  closedDate: string | null;
}

export interface IBidMetadata {
  version: string;
  createdBy: string;
  lastModifiedBy: string;
  source: string;
  schemaVersion: number;
}

export interface IBid {
  bidNumber: string;
  crmNumber: string;
  division: Division;
  serviceLine: string;
  bidType: BidType;
  bidSize: BidSize;
  priority: BidPriority;
  opportunityInfo: IOpportunityInfo;
  creator: IPersonRef;
  engineerResponsible: IPersonRef[];
  analyst: IPersonRef[];
  projectManager: IPersonRef[];
  reviewers: IPersonRef[];
  createdDate: string;
  /** @deprecated Use desiredDueDate instead */
  dueDate: string;
  desiredDueDate: string;
  startDate: string | null;
  completedDate: string | null;
  lastModified: string;
  currentStatus: string;
  currentPhase: BidPhase;
  phaseHistory: IPhaseHistoryEntry[];
  statusHistory: IStatusHistoryEntry[];
  tasks: IBidTask[];
  assetsCostSummary: IAssetsCostSummary;
  equipmentList: IEquipmentItem[];
  scopeItems: IScopeItem[];
  assetBreakdown: IAssetBreakdownItem[];
  logisticsBreakdown: ILogisticsItem[];
  certificationsBreakdown: ICertificationItem[];
  rtsItems: IRTSItem[];
  mobilizationItems: IMobilizationItem[];
  consumableItems: IConsumableItem[];
  rtsSections?: IHoursSectionGroup[];
  mobSections?: IHoursSectionGroup[];
  consSections?: IHoursSectionGroup[];
  hoursSummary: IHoursSummary;
  costSummary: ICostSummary;
  bidResult: IBidResult;
  approvals: IBidApproval[];
  approvalStatus: ApprovalStatus;
  attachments: IBidAttachment[];
  comments: IBidComment[];
  activityLog: IActivityLogEntry[];
  templateUsed: string | null;
  bidFolderUrl: string | null;
  commercialFolderUrl: string | null;
  bidNotes: Record<string, string>;
  quickNotes: IQuickNote[];
  engineerBidOverview: string;
  revisions: IBidRevision[];
  metadata: IBidMetadata;
  kpis: IBidKPIs;
  qualificationTables: IQualificationTable[];
  clarifications: IClarificationItem[];
}

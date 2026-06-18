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
  /** Snapshot of all exchange rates at BID creation time */
  exchangeRatesSnapshot?: IExchangeRateSnapshot[];
  qualifications: string[];
}

/** Exchange rate snapshot saved at BID creation */
export interface IExchangeRateSnapshot {
  currency: string;
  rate: number;
  capturedDate: string;
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

/* â”€â”€â”€ Scope of Supply â”€â”€â”€ */
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
  /** OII or Manufacturer part number */
  partNumber: string;
  qtyOperational: number;
  qtySpare: number;
  /** Flag: this item needs certification (auto-populates Certifications tab) */
  needsCertification: boolean;
  /** Flag: this item needs engineering hours (appears in Engineering Hours section) */
  needsEngineering?: boolean;
  comments: string;
  importedFromTemplate: string | null;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
  /** Main client requirement / solicitation text */
  clientRequirement?: string;
  /** Detailed technical specification lines from the client document */
  clientSpecs?: string[];
  /** Custom color for section header (only used when isSection = true) */
  sectionColor?: string;
  /** Sub-items: consumables, spare parts, accessories tied to this scope item */
  subItems?: IScopeSubItem[];
  /** Attachments for this scope item or section */
  attachments?: IBidAttachment[];
}

/** A sub-item within a scope item (e.g. consumable brush, spare blade) */
export interface IScopeSubItem {
  id: string;
  description: string;
  /** Sub-type classification (e.g. Consumable, Spare Part) */
  subType: string;
  equipmentOffer: string;
  /** OII or Manufacturer part number */
  partNumber: string;
  qty: number;
  comments: string;
  /** If true, this sub-item needs engineering hours */
  needsEngineering?: boolean;
}
/* ——— Availability Split (partial qty with different status/cost) ——— */
export interface IAvailabilitySplit {
  id: string;
  /** How many units this split covers */
  qty: number;
  availabilityStatus: string;
  acquisitionType: string;
  unitCostUSD: number;
  /** Auto-calc based on acq type and qty */
  totalCostUSD: number;
  costReference: string;
  dateReference?: string;
  costCategory: "CAPEX" | "OPEX" | "";
  supplier: string;
  leadTimeDays: number;
  dailyRate: number | null;
  rentalDays: number | null;
  notes: string;
  /** Sub-costs specific to this split (e.g., Transit Rate for rental splits) */
  subCosts?: IAssetSubCost[];
}
/* â”€â”€â”€ Assets Breakdown (cost layer for Scope items) â”€â”€â”€ */
export interface IAssetBreakdownItem {
  id: string;
  /** FK to IScopeItem.id â€” live sync link */
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
  /** Auto-calc: unitCostUSD Ã— (scope.qtyOper + scope.qtySpare) */
  totalCostUSD: number;
  /** From systemConfig.costReferences (BUMBL, BUABO, etc.) */
  costReference: string;
  /** Date reference for cost (ISO string — when the cost was last sourced) */
  dateReference?: string;
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
  /** Cost entries for scope sub-items (consumables, spares) */
  subItemCosts?: ISubItemCost[];
  /** Partial availability splits — when set, overrides main availability/cost fields */
  availabilitySplits?: IAvailabilitySplit[];
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
}

/* â”€â”€â”€ Logistics Breakdown â”€â”€â”€ */
export interface ILogisticsItem {
  id: string;
  lineNumber: number;
  item: string;
  description: string;
  originalCurrency: string;
  qty: number;
  unitCost: number;
  /** Auto-calc: unitCost Ã— qty */
  totalCost: number;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
}

/* â”€â”€â”€ Certifications Breakdown â”€â”€â”€ */
export interface ICertificationItem {
  id: string;
  lineNumber: number;
  /** Optional FK to IScopeItem (items flagged needsCertification) */
  scopeItemId: string | null;
  /** If true, this is a section header row */
  isSection?: boolean;
  /** Section title (only when isSection=true) */
  sectionTitle?: string;
  /** Parent section ID */
  sectionId?: string | null;
  /** Section color */
  sectionColor?: string;
  /** Display reference (auto-filled from Scope or manual) */
  itemRef: string;
  qty: number;
  /** Free text, e.g. "12 months", "2 years" */
  expiryPeriod: string;
  unitCost: number;
  /** Auto-calc: unitCost × qty */
  totalCost: number;
  originalCurrency: string;
  costReference: string;
  notes: string;
  /** Attachments for this certification item */
  attachments?: IBidAttachment[];
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
}

/* â”€â”€â”€ Preparation & Mobilization â”€â”€â”€ */

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
  /** FK to IScopeItem.id â€” which asset needs RTS */
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
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
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
  costReference: string;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
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
  costReference: string;
  notes: string;
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
}

/* ——— Sub-Item Cost (cost layer for IScopeSubItem) ——— */
export interface ISubItemCost {
  id: string;
  /** FK to IScopeSubItem.id */
  subItemId: string;
  availabilityStatus: string;
  acquisitionType: string;
  unitCostUSD: number;
  totalCostUSD: number;
  costReference: string;
  /** Date reference for cost (ISO string) */
  dateReference?: string;
  costCategory: "CAPEX" | "OPEX" | "";
  supplier: string;
  leadTimeDays: number;
  /** For rental sub-items */
  dailyRate?: number | null;
  rentalDays?: number | null;
  notes: string;
  /** Partial availability splits — when set, overrides main availability/cost fields */
  availabilitySplits?: IAvailabilitySplit[];
  /** Sub-costs (e.g. Transit Rate for Rental sub-items) */
  subCosts?: IAssetSubCost[];
}

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

/* â”€â”€â”€ Qualifications & Clarifications â”€â”€â”€ */
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
  /** Date when the clarification was created/added */
  createdDate?: string;
  /** Date when the client response was provided */
  responseDate?: string;
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
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
  /** Optional notes/comments for this line item */
  notes?: string;
  /** If true, this item is rendered as a visual separator line */
  isSeparator?: boolean;
  /** Label for a separator row */
  separatorLabel?: string;
}

export interface IHoursSectionGroup {
  id: string;
  title: string;
  /** Optional custom color for the section header */
  color?: string;
  /** Section notes/comments */
  notes?: string;
  /** Technical specs for the section */
  specs?: string[];
  /** Division tag for Integrated BIDs (ROV/SURVEY) */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | "";
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
  engineeringHours: IEngineeringHoursSection;
  onshoreHours: IHoursSection;
  offshoreHours: IHoursSection;
  totalsByDivision: Record<string, IDivisionHoursTotals>;
  grandTotalHours: number;
  grandTotalCostBRL: number;
  grandTotalCostUSD: number;
}

/* ─── Engineering Hours (deliverable-based) ─── */

/** A single deliverable within an engineering item (e.g. "Drawing - Detail Drawing": 12h) */
export interface IEngineeringDeliverable {
  id: string;
  /** Deliverable type label from config.engineerDeliverables */
  deliverableType: string;
  /** Resource/function performing this deliverable (legacy single-resource) */
  resourceType: string;
  /** Estimated hours (total across all resources) */
  hours: number;
  /** Hours broken down by resource type (e.g. {"Designer": 10, "Engineer": 20}) */
  hoursByResource?: Record<string, number>;
}

/** An engineering scope item with its deliverable breakdown */
export interface IEngineeringHoursItem {
  id: string;
  /** FK to IScopeItem.id — links back to scope of supply */
  scopeItemId: string;
  /** Item description (copied from scope for display) */
  description: string;
  /** Equipment offer info (copied from scope) */
  equipmentOffer?: string;
  /** Section name from scope (parent section title) */
  sectionName?: string;
  /** Notes/comments for this engineering item */
  notes?: string;
  /** Deliverable breakdown for this item */
  deliverables: IEngineeringDeliverable[];
  /** Total hours for this item (sum of deliverables) */
  totalHours: number;
  /** Whether Manufacturing Support (20%) is included in totalHours */
  includeManufacturing?: boolean;
}

/** Resource allocation for engineering hours planning */
export interface IResourceAllocation {
  id: string;
  /** Resource type (job function) from config */
  resourceType: string;
  /** Total hours assigned to this resource (derived from deliverables) */
  totalHours: number;
  /** Hours per day this resource works */
  hoursPerDay: number;
  /** Number of people allocated */
  people: number;
  /** Calculated: totalHours / (hoursPerDay * people) */
  estimatedDays: number;
}

/** Engineering Hours section — different from onshore/offshore */
export interface IEngineeringHoursSection {
  totalHours: number;
  totalCostBRL: number;
  /** Legacy row-based items (kept for backward compat) */
  items: IHoursItem[];
  sections?: IHoursSectionGroup[];
  /** New deliverable-based engineering items */
  engineeringItems?: IEngineeringHoursItem[];
  /** Resource allocation plan for engineering hours */
  resourceAllocations?: IResourceAllocation[];
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

/** A single tracked change within a revision */
export interface IRevisionChange {
  id: string;
  /** Which tab/page was changed (e.g. "scope", "hours", "assets", "preparation", "logistics", "certifications") */
  section: string;
  /** Type of change: added, removed, or modified */
  changeType: "added" | "removed" | "modified";
  /** Human-readable description of what changed */
  description: string;
  /** Field path or item identifier that changed */
  fieldPath: string;
  /** Previous value (serialized) - null for additions */
  previousValue: string | null;
  /** New value (serialized) - null for removals */
  newValue: string | null;
  /** Who made this change */
  changedBy: { name: string; email: string };
  /** When was this change made */
  changedAt: string;
}

export interface IBidRevision {
  /** Revision letter: "A", "B", "C", etc. */
  revisionLetter: string;
  /** Legacy numeric index (0-based) */
  revision: number;
  openedBy: { name: string; email: string };
  openedDate: string;
  closedBy: { name: string; email: string } | null;
  closedDate: string | null;
  reason: string;
  /** Phase the BID was in when revision was opened */
  returnToPhase: string;
  /** Status of this revision: open or closed */
  status: "open" | "closed";
  /** All changes tracked during this revision */
  changes: IRevisionChange[];
  /** Phase history entries during this revision */
  phaseChanges: IPhaseHistoryEntry[];
  /** Status history entries during this revision */
  statusChanges: IStatusHistoryEntry[];
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
  bidNotesMetadata?: Record<
    string,
    {
      author: string;
      date: string;
      lastEditedBy?: string;
      lastEditedDate?: string;
    }
  >;
  quickNotes: IQuickNote[];
  engineerBidOverview: string;
  revisions: IBidRevision[];
  metadata: IBidMetadata;
  kpis: IBidKPIs;
  qualificationTables: IQualificationTable[];
  clarifications: IClarificationItem[];
}

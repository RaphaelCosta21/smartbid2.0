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

export interface IBidStep {
  idStep: number;
  status: string;
  phase: BidPhase;
  start: string;
  end: string | null;
  duration: number | null;
  durationFormatted: string;
  actor: string;
  comments: string;
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

export interface IHoursItem {
  id: string;
  lineNumber: number;
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
}

export interface IHoursSection {
  totalHours: number;
  totalCostBRL: number;
  items: IHoursItem[];
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
  onshoreHoursCostBRL: number;
  offshoreHoursCostBRL: number;
  engineeringHoursCostBRL: number;
  totalHoursCostBRL: number;
  totalHoursCostUSD: number;
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
  bidder: IPersonRef;
  owner: IPersonRef;
  reviewers: IPersonRef[];
  createdDate: string;
  dueDate: string;
  startDate: string | null;
  completedDate: string | null;
  lastModified: string;
  currentStatus: string;
  currentPhase: BidPhase;
  steps: IBidStep[];
  tasks: IBidTask[];
  assetsCostSummary: IAssetsCostSummary;
  equipmentList: IEquipmentItem[];
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
  metadata: IBidMetadata;
  kpis: IBidKPIs;
}

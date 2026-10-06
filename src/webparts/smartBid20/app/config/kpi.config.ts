/**
 * KPI definitions and default targets.
 */
import { IKPITargets, IPriorityRules } from "../models/ISystemConfig";
import { BidPriority } from "../models/IBidStatus";

export type KPIGroup = "Delivery" | "Cycle Time" | "Approval" | "Commercial";

export interface IKPIDef {
  id: string;
  label: string;
  description: string;
  unit: string;
  targetKey: keyof IKPITargets;
  higherIsBetter: boolean;
  format: "percent" | "days" | "number";
  color: string;
  group: KPIGroup;
}

export const KPI_GROUPS: KPIGroup[] = [
  "Delivery",
  "Cycle Time",
  "Approval",
  "Commercial",
];

export const KPI_DEFINITIONS: IKPIDef[] = [
  {
    id: "on-time-delivery",
    label: "On-Time Delivery",
    description:
      "Share of delivered BIDs whose first delivery (Completed) happened on or before the due date in effect at that moment.",
    unit: "%",
    targetKey: "targetOnTimeDelivery",
    higherIsBetter: true,
    format: "percent",
    color: "#10B981",
    group: "Delivery",
  },
  {
    id: "otif",
    label: "OTIF (On Time In Full)",
    description:
      "Delivered on time, approved on the first pass (nobody rejected, no override) and no revision opened within 2 months after delivery.",
    unit: "%",
    targetKey: "targetOTIF",
    higherIsBetter: true,
    format: "percent",
    color: "#3B82F6",
    group: "Delivery",
  },
  {
    id: "overdue-rate",
    label: "Overdue Rate",
    description:
      "Maximum share of open items past their deadline. Applies to both ERNs (ERN Engineering Due Date) and BIDs (BID Due Date).",
    unit: "%",
    targetKey: "targetOverdueRate",
    higherIsBetter: false,
    format: "percent",
    color: "#F97316",
    group: "Delivery",
  },
  {
    id: "avg-completion-days",
    label: "Avg Completion",
    description:
      "Average business days from BID creation to first delivery, with one target per urgency category.",
    unit: "business days",
    targetKey: "targetAvgCompletionDaysByPriority",
    higherIsBetter: false,
    format: "days",
    color: "#8B5CF6",
    group: "Cycle Time",
  },
  {
    id: "approval-cycle",
    label: "Approval Cycle",
    description: "Average days from approval request to the last sign-off.",
    unit: "days",
    targetKey: "targetApprovalCycleDays",
    higherIsBetter: false,
    format: "days",
    color: "#EC4899",
    group: "Cycle Time",
  },
  {
    id: "first-pass-approval",
    label: "First-Pass Approval",
    description:
      "Share of BIDs whose first closed approval round was approved with no rejection, no revision request and no override.",
    unit: "%",
    targetKey: "targetFirstPassApproval",
    higherIsBetter: true,
    format: "percent",
    color: "#F59E0B",
    group: "Approval",
  },
  {
    id: "win-rate",
    label: "Win Rate",
    description: "Won BIDs over BIDs with a Won or Loss result.",
    unit: "%",
    targetKey: "targetWinRate",
    higherIsBetter: true,
    format: "percent",
    color: "#22C55E",
    group: "Commercial",
  },
];

export const BID_PRIORITIES: BidPriority[] = ["Urgent", "Normal", "Low"];

export const DEFAULT_KPI_TARGETS: IKPITargets = {
  targetOnTimeDelivery: 85,
  targetOTIF: 80,
  targetAvgCompletionDaysByPriority: { Urgent: 4, Normal: 10, Low: 20 },
  targetFirstPassApproval: 70,
  targetApprovalCycleDays: 5,
  targetOverdueRate: 15,
  targetWinRate: 40,
};

export const DEFAULT_PRIORITY_RULES: IPriorityRules = {
  urgentMaxBusinessDays: 4,
  normalMaxBusinessDays: 14,
};

export const OTIF_REVISION_WINDOW_MONTHS = 2;

/**
 * KPI definitions and default targets.
 */
export interface IKPIDef {
  id: string;
  label: string;
  description: string;
  unit: string;
  targetKey: string;
  higherIsBetter: boolean;
  format: "percent" | "days" | "number";
  color: string;
}

export const KPI_DEFINITIONS: IKPIDef[] = [
  {
    id: "on-time-delivery",
    label: "On-Time Delivery",
    description: "Percentage of BIDs delivered on or before due date",
    unit: "%",
    targetKey: "targetOnTimeDelivery",
    higherIsBetter: true,
    format: "percent",
    color: "#10B981",
  },
  {
    id: "otif",
    label: "OTIF",
    description: "On Time In Full — delivered on time and complete",
    unit: "%",
    targetKey: "targetOTIF",
    higherIsBetter: true,
    format: "percent",
    color: "#3B82F6",
  },
  {
    id: "avg-completion-days",
    label: "Avg Completion Days",
    description: "Average days to complete a BID end-to-end",
    unit: "days",
    targetKey: "targetAvgCompletionDays",
    higherIsBetter: false,
    format: "days",
    color: "#8B5CF6",
  },
  {
    id: "first-pass-approval",
    label: "First-Pass Approval",
    description: "Percentage of BIDs approved without revision",
    unit: "%",
    targetKey: "targetFirstPassApproval",
    higherIsBetter: true,
    format: "percent",
    color: "#F59E0B",
  },
  {
    id: "approval-cycle",
    label: "Approval Cycle Time",
    description: "Average days for approval process completion",
    unit: "days",
    targetKey: "targetApprovalCycleDays",
    higherIsBetter: false,
    format: "days",
    color: "#EC4899",
  },
  {
    id: "cancellation-rate",
    label: "Cancellation Rate",
    description: "Percentage of BIDs cancelled",
    unit: "%",
    targetKey: "targetCancellationRate",
    higherIsBetter: false,
    format: "percent",
    color: "#EF4444",
  },
  {
    id: "template-usage",
    label: "Template Usage",
    description: "Percentage of BIDs using predefined templates",
    unit: "%",
    targetKey: "targetTemplateUsage",
    higherIsBetter: true,
    format: "percent",
    color: "#06B6D4",
  },
  {
    id: "overdue-rate",
    label: "Overdue Rate",
    description: "Percentage of active BIDs past due date",
    unit: "%",
    targetKey: "targetOverdueRate",
    higherIsBetter: false,
    format: "percent",
    color: "#F97316",
  },
  {
    id: "win-rate",
    label: "Win Rate",
    description: "Percentage of BIDs with Won outcome",
    unit: "%",
    targetKey: "targetWinRate",
    higherIsBetter: true,
    format: "percent",
    color: "#22C55E",
  },
];

export const DEFAULT_KPI_TARGETS = {
  targetOnTimeDelivery: 85,
  targetOTIF: 80,
  targetAvgCompletionDays: 30,
  targetFirstPassApproval: 70,
  targetApprovalCycleDays: 5,
  targetCancellationRate: 10,
  targetTemplateUsage: 60,
  targetOverdueRate: 15,
  targetWinRate: 40,
};

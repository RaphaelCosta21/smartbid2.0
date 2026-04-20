import { IBidStatusDef, IPhaseDef, ISubStatusDef } from "../models/IBidStatus";

export const BID_STATUSES: IBidStatusDef[] = [
  {
    id: "request-submitted",
    label: "Request Submitted",
    value: "Request Submitted",
    phase: "Request Submitted",
    color: "#94A3B8",
    order: 1,
    isTerminal: false,
  },
  {
    id: "pending-assignment",
    label: "Pending Assignment",
    value: "Pending Assignment",
    phase: "Request Submitted",
    color: "#F59E0B",
    order: 2,
    isTerminal: false,
  },
  {
    id: "kick-off",
    label: "Kick Off",
    value: "Kick Off",
    phase: "Bid Kick Off",
    color: "#3B82F6",
    order: 3,
    isTerminal: false,
  },
  {
    id: "technical-analysis",
    label: "Technical Analysis",
    value: "Technical Analysis",
    phase: "Technical Analysis",
    color: "#06B6D4",
    order: 4,
    isTerminal: false,
  },
  {
    id: "awaiting-clarification",
    label: "Awaiting Clarification",
    value: "Awaiting Clarification",
    phase: "Technical Analysis",
    color: "#F97316",
    order: 5,
    isTerminal: false,
  },
  {
    id: "cost-gathering",
    label: "Cost Gathering",
    value: "Cost Gathering",
    phase: "Cost & Resources",
    color: "#8B5CF6",
    order: 6,
    isTerminal: false,
  },
  {
    id: "bid-elaboration",
    label: "BID Elaboration",
    value: "BID Elaboration",
    phase: "Cost & Resources",
    color: "#A855F7",
    order: 7,
    isTerminal: false,
  },
  {
    id: "under-review",
    label: "Under Review",
    value: "Under Review",
    phase: "Cost & Resources",
    color: "#EC4899",
    order: 8,
    isTerminal: false,
  },
  {
    id: "pending-approval",
    label: "Pending Approval",
    value: "Pending Approval",
    phase: "Cost & Resources",
    color: "#F59E0B",
    order: 9,
    isTerminal: false,
  },
  {
    id: "technical-proposal",
    label: "Technical Proposal",
    value: "Technical Proposal",
    phase: "Technical Proposal",
    color: "#14B8A6",
    order: 10,
    isTerminal: false,
  },
  {
    id: "proposal-review",
    label: "Proposal Review",
    value: "Proposal Review",
    phase: "Technical Proposal",
    color: "#0EA5E9",
    order: 11,
    isTerminal: false,
  },
  {
    id: "proposal-approval",
    label: "Proposal Approval",
    value: "Proposal Approval",
    phase: "Technical Proposal",
    color: "#F59E0B",
    order: 12,
    isTerminal: false,
  },
  {
    id: "completed",
    label: "Completed",
    value: "Completed",
    phase: "Close Out",
    color: "#10B981",
    order: 13,
    isTerminal: true,
  },
  {
    id: "on-hold",
    label: "On Hold",
    value: "On Hold",
    phase: null,
    color: "#64748B",
    order: 15,
    isTerminal: false,
  },
  {
    id: "canceled",
    label: "Canceled",
    value: "Canceled",
    phase: "Close Out",
    color: "#EF4444",
    order: 16,
    isTerminal: true,
  },
  {
    id: "no-bid",
    label: "No Bid",
    value: "No Bid",
    phase: "Close Out",
    color: "#94A3B8",
    order: 17,
    isTerminal: true,
  },
  {
    id: "returned-revision",
    label: "Returned for Revision",
    value: "Returned for Revision",
    phase: null,
    color: "#F97316",
    order: 18,
    isTerminal: false,
  },
];

export const BID_PHASES: IPhaseDef[] = [
  {
    id: "phase-0",
    label: "Request Submitted",
    value: "Request Submitted",
    order: 0,
    color: "#94A3B8",
  },
  {
    id: "phase-1",
    label: "Bid Kick Off",
    value: "Bid Kick Off",
    order: 1,
    color: "#3B82F6",
  },
  {
    id: "phase-2",
    label: "Technical Analysis",
    value: "Technical Analysis",
    order: 2,
    color: "#06B6D4",
  },
  {
    id: "phase-3",
    label: "Cost & Resources",
    value: "Cost & Resources",
    order: 3,
    color: "#8B5CF6",
  },
  {
    id: "phase-4",
    label: "Technical Proposal",
    value: "Technical Proposal",
    order: 4,
    color: "#14B8A6",
  },
  {
    id: "phase-5",
    label: "Close Out",
    value: "Close Out",
    order: 5,
    color: "#10B981",
  },
];

export function getStatusDef(statusValue: string): IBidStatusDef | undefined {
  return BID_STATUSES.find((s) => s.value === statusValue);
}

export function getPhaseDef(phaseValue: string): IPhaseDef | undefined {
  return BID_PHASES.find((p) => p.value === phaseValue);
}

export function getStatusColor(statusValue: string): string {
  return getStatusDef(statusValue)?.color ?? "#94A3B8";
}

export function getPhaseColor(phaseValue: string): string {
  return getPhaseDef(phaseValue)?.color ?? "#94A3B8";
}

/* ------------------------------------------------------------------ */
/* SUB-STATUSES — Phase-independent workflow statuses                  */
/* ------------------------------------------------------------------ */

export const SUB_STATUSES: ISubStatusDef[] = [
  {
    id: "pending-assignment",
    label: "Pending Assignment",
    value: "Pending Assignment",
    color: "#F59E0B",
    icon: "⏳",
    order: 1,
    applicablePhases: ["Request Submitted", "Bid Kick Off"],
  },
  {
    id: "awaiting-clarification",
    label: "Awaiting Clarification",
    value: "Awaiting Clarification",
    color: "#F97316",
    icon: "❓",
    order: 2,
    applicablePhases: "all",
  },
  {
    id: "cost-gathering",
    label: "Cost Gathering",
    value: "Cost Gathering",
    color: "#8B5CF6",
    icon: "💰",
    order: 3,
    applicablePhases: [
      "Technical Analysis",
      "Cost & Resources",
      "Technical Proposal",
    ],
  },
  {
    id: "bid-elaboration",
    label: "BID Elaboration",
    value: "BID Elaboration",
    color: "#A855F7",
    icon: "📝",
    order: 4,
    applicablePhases: ["Cost & Resources"],
  },
  {
    id: "under-review",
    label: "Under Review",
    value: "Under Review",
    color: "#EC4899",
    icon: "🔍",
    order: 5,
    applicablePhases: "all",
  },
  {
    id: "pending-approval",
    label: "Pending Approval",
    value: "Pending Approval",
    color: "#F59E0B",
    icon: "✋",
    order: 6,
    applicablePhases: ["Cost & Resources", "Technical Proposal", "Close Out"],
  },
  {
    id: "on-hold",
    label: "On Hold",
    value: "On Hold",
    color: "#64748B",
    icon: "⏸",
    order: 7,
    applicablePhases: "all",
    isBlocking: true,
  },
];

export function getSubStatusDef(
  subStatusValue: string,
): ISubStatusDef | undefined {
  return SUB_STATUSES.find((s) => s.value === subStatusValue);
}

export function getSubStatusColor(subStatusValue: string): string {
  return getSubStatusDef(subStatusValue)?.color ?? "#94A3B8";
}

export function getSubStatusesForPhase(phase: string): ISubStatusDef[] {
  return SUB_STATUSES.filter(
    (s) =>
      s.applicablePhases === "all" || s.applicablePhases.includes(phase as any),
  );
}

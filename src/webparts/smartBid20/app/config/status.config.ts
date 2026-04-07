import { IBidStatusDef, IPhaseDef } from "../models/IBidStatus";

export const BID_STATUSES: IBidStatusDef[] = [
  {
    id: "request-submitted",
    label: "Request Submitted",
    value: "Request Submitted",
    phase: "PHASE_0",
    color: "#94A3B8",
    order: 1,
    isTerminal: false,
  },
  {
    id: "pending-assignment",
    label: "Pending Assignment",
    value: "Pending Assignment",
    phase: "PHASE_0",
    color: "#F59E0B",
    order: 2,
    isTerminal: false,
  },
  {
    id: "kick-off",
    label: "Kick Off",
    value: "Kick Off",
    phase: "PHASE_1",
    color: "#3B82F6",
    order: 3,
    isTerminal: false,
  },
  {
    id: "technical-analysis",
    label: "Technical Analysis",
    value: "Technical Analysis",
    phase: "PHASE_2",
    color: "#06B6D4",
    order: 4,
    isTerminal: false,
  },
  {
    id: "awaiting-clarification",
    label: "Awaiting Clarification",
    value: "Awaiting Clarification",
    phase: "PHASE_2",
    color: "#F97316",
    order: 5,
    isTerminal: false,
  },
  {
    id: "cost-gathering",
    label: "Cost Gathering",
    value: "Cost Gathering",
    phase: "PHASE_3",
    color: "#8B5CF6",
    order: 6,
    isTerminal: false,
  },
  {
    id: "bid-elaboration",
    label: "BID Elaboration",
    value: "BID Elaboration",
    phase: "PHASE_3",
    color: "#A855F7",
    order: 7,
    isTerminal: false,
  },
  {
    id: "under-review",
    label: "Under Review",
    value: "Under Review",
    phase: "PHASE_3",
    color: "#EC4899",
    order: 8,
    isTerminal: false,
  },
  {
    id: "pending-approval",
    label: "Pending Approval",
    value: "Pending Approval",
    phase: "PHASE_3",
    color: "#F59E0B",
    order: 9,
    isTerminal: false,
  },
  {
    id: "technical-proposal",
    label: "Technical Proposal",
    value: "Technical Proposal",
    phase: "PHASE_4",
    color: "#14B8A6",
    order: 10,
    isTerminal: false,
  },
  {
    id: "proposal-review",
    label: "Proposal Review",
    value: "Proposal Review",
    phase: "PHASE_4",
    color: "#0EA5E9",
    order: 11,
    isTerminal: false,
  },
  {
    id: "proposal-approval",
    label: "Proposal Approval",
    value: "Proposal Approval",
    phase: "PHASE_4",
    color: "#F59E0B",
    order: 12,
    isTerminal: false,
  },
  {
    id: "completed",
    label: "Completed",
    value: "Completed",
    phase: "PHASE_5",
    color: "#10B981",
    order: 13,
    isTerminal: true,
  },
  {
    id: "returned-commercial",
    label: "Returned to Commercial",
    value: "Returned to Commercial",
    phase: "PHASE_5",
    color: "#10B981",
    order: 14,
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
    phase: null,
    color: "#EF4444",
    order: 16,
    isTerminal: true,
  },
  {
    id: "no-bid",
    label: "No Bid",
    value: "No Bid",
    phase: null,
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
    label: "Request",
    value: "PHASE_0",
    order: 0,
    color: "#94A3B8",
  },
  {
    id: "phase-1",
    label: "Bid Kick Off",
    value: "PHASE_1",
    order: 1,
    color: "#3B82F6",
  },
  {
    id: "phase-2",
    label: "Technical Analysis",
    value: "PHASE_2",
    order: 2,
    color: "#06B6D4",
  },
  {
    id: "phase-3",
    label: "Cost & Resources",
    value: "PHASE_3",
    order: 3,
    color: "#8B5CF6",
  },
  {
    id: "phase-4",
    label: "Technical Proposal",
    value: "PHASE_4",
    order: 4,
    color: "#14B8A6",
  },
  {
    id: "phase-5",
    label: "Close Out",
    value: "PHASE_5",
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

import {
  IBidStatusDef,
  IPhaseDef,
  ISubStatusDef,
  BidPhase,
} from "../models/IBidStatus";
import { useConfigStore } from "../stores/useConfigStore";

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
  const cfg = useConfigStore.getState().config;
  if (cfg) {
    const sub = (cfg.subStatuses || []).find((s) => s.value === statusValue);
    if (sub) {
      return {
        id: sub.id as any,
        label: sub.label,
        value: sub.value,
        color: sub.color || "#94A3B8",
        order: sub.order || 0,
        phase: null,
        isTerminal: false,
      };
    }
    const term = ((cfg as any).terminalStatuses || []).find(
      (t: any) => t.value === statusValue,
    );
    if (term) {
      return {
        id: term.id as any,
        label: term.label,
        value: term.value,
        color: term.color || "#94A3B8",
        order: term.order || 0,
        phase: "Close Out" as BidPhase,
        isTerminal: true,
      };
    }
  }
  return BID_STATUSES.find((s) => s.value === statusValue);
}

export function getPhaseDef(phaseValue: string): IPhaseDef | undefined {
  const cfg = useConfigStore.getState().config;
  if (cfg) {
    const phase = (cfg.phases || []).find((p) => p.value === phaseValue);
    if (phase) {
      return {
        id: phase.id,
        label: phase.label,
        value: phase.value as BidPhase,
        color: phase.color || "#94A3B8",
        order: phase.order || 0,
      };
    }
  }
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
  {
    id: "awaiting-kick-off",
    label: "Awaiting Kick Off",
    value: "Awaiting Kick Off",
    color: "#06B6D4",
    icon: "🚀",
    order: 8,
    applicablePhases: ["Bid Kick Off"],
  },
  {
    id: "eng-study",
    label: "Eng. Study",
    value: "Eng. Study",
    color: "#2563EB",
    icon: "🔬",
    order: 9,
    applicablePhases: ["Technical Analysis", "Cost & Resources"],
  },
];

export function getSubStatusDef(
  subStatusValue: string,
): ISubStatusDef | undefined {
  const cfg = useConfigStore.getState().config;
  if (cfg) {
    const sub = (cfg.subStatuses || []).find((s) => s.value === subStatusValue);
    if (sub) {
      return {
        id: sub.id as any,
        label: sub.label,
        value: sub.value,
        color: sub.color || "#94A3B8",
        icon: "",
        order: sub.order || 0,
        applicablePhases: (sub.category || "all") as any,
      };
    }
  }
  return SUB_STATUSES.find((s) => s.value === subStatusValue);
}

export function getSubStatusColor(subStatusValue: string): string {
  return getSubStatusDef(subStatusValue)?.color ?? "#94A3B8";
}

export function getSubStatusesForPhase(phase: string): ISubStatusDef[] {
  const cfg = useConfigStore.getState().config;
  if (cfg && cfg.subStatuses && cfg.subStatuses.length > 0) {
    return cfg.subStatuses
      .filter((s) => s.isActive !== false)
      .filter((s) => {
        const cat = s.category || "all";
        return cat === "all" || cat.split(",").indexOf(phase) >= 0;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => ({
        id: s.id as any,
        label: s.label,
        value: s.value,
        color: s.color || "#94A3B8",
        icon: "",
        order: s.order || 0,
        applicablePhases: (s.category || "all") as any,
      }));
  }
  return SUB_STATUSES.filter(
    (s) =>
      s.applicablePhases === "all" || s.applicablePhases.includes(phase as any),
  );
}

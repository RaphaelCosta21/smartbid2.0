export type BidPhase =
  | "PHASE_0"
  | "PHASE_1"
  | "PHASE_2"
  | "PHASE_3"
  | "PHASE_4"
  | "PHASE_5";

export type BidStatusId =
  | "request-submitted"
  | "pending-assignment"
  | "kick-off"
  | "technical-analysis"
  | "awaiting-clarification"
  | "cost-gathering"
  | "bid-elaboration"
  | "under-review"
  | "pending-approval"
  | "technical-proposal"
  | "proposal-review"
  | "proposal-approval"
  | "completed"
  | "returned-commercial"
  | "on-hold"
  | "canceled"
  | "no-bid"
  | "returned-revision";

export interface IBidStatusDef {
  id: BidStatusId;
  label: string;
  value: string;
  phase: BidPhase | null;
  color: string;
  order: number;
  isTerminal: boolean;
}

export interface IPhaseDef {
  id: string;
  label: string;
  value: BidPhase;
  order: number;
  color: string;
}

export type BidPriority = "Urgent" | "High" | "Normal" | "Low";
export type BidType = "Firm" | "Budgetary" | "RFI" | "Extension" | "Amendment";
export type BidSize = "Small" | "Standard" | "Epic";
export type Division = "OPG" | "SSR-Survey" | "SSR-ROV" | "SSR-Integrated";
export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "revision-requested"
  | "not-started";
export type BidResultOutcome =
  | "Won"
  | "Lost"
  | "Client Canceled"
  | "No Bid"
  | "Pending"
  | "Renegotiation";

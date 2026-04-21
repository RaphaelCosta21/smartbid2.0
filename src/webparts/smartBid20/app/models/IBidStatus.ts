export type BidPhase =
  | "Request Submitted"
  | "Bid Kick Off"
  | "Technical Analysis"
  | "Cost & Resources"
  | "Technical Proposal"
  | "Close Out";

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

/* ------------------------------------------------------------------ */
/* SUB-STATUS — Phase-independent workflow statuses                    */
/* ------------------------------------------------------------------ */

export type SubStatusId =
  | "pending-assignment"
  | "awaiting-clarification"
  | "cost-gathering"
  | "bid-elaboration"
  | "under-review"
  | "pending-approval"
  | "on-hold"
  | "awaiting-kick-off"
  | "eng-study";

export interface ISubStatusDef {
  id: SubStatusId;
  label: string;
  value: string;
  color: string;
  icon?: string;
  order: number;
  /** Phases where this sub-status can appear. Use "all" for universal. */
  applicablePhases: BidPhase[] | "all";
  /** If true, blocks phase progression (e.g. On Hold) */
  isBlocking?: boolean;
}

/* ------------------------------------------------------------------ */
/* OTHER TYPES                                                        */
/* ------------------------------------------------------------------ */

export type BidPriority = "Urgent" | "Normal" | "Low";
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

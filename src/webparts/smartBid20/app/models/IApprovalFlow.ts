/**
 * IApprovalFlow — Fluxo de aprovação.
 */
import { IPersonRef } from "./IUser";
import { ApprovalStatus } from "./IBidStatus";

export interface IApprovalFlowStep {
  stepOrder: number;
  approver: IPersonRef;
  role: string;
  decision: "approved" | "rejected" | "revision-requested" | null;
  decisionDate: string | null;
  comments: string | null;
}

export interface IApprovalFlowChain {
  chainId: string;
  chainName: string;
  division: string;
  steps: IApprovalFlowStep[];
  currentStep: number;
  status: ApprovalStatus;
}

export interface IApprovalFlow {
  bidNumber: string;
  type: "bid-approval" | "proposal-approval" | "high-value-override";
  status: ApprovalStatus;
  chains: IApprovalFlowChain[];
  requestedBy: IPersonRef;
  requestedDate: string;
  completedDate: string | null;
}

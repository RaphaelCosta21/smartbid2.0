/**
 * IBidApproval — Sistema de aprovação.
 */
import { IPersonRef } from "./IUser";
import { ApprovalStatus } from "./IBidStatus";

export interface IApprovalChainStep {
  stepOrder: number;
  approver: IPersonRef;
  role: string;
  decision: "approved" | "rejected" | "revision-requested" | null;
  decisionDate: string | null;
  comments: string | null;
  notificationSent: boolean;
  reminderCount: number;
}

export interface IApprovalChain {
  chainId: string;
  chainName: string;
  division: string;
  steps: IApprovalChainStep[];
  currentStep: number;
  status: ApprovalStatus;
  startedDate: string;
  completedDate: string | null;
}

export interface IBidApprovalState {
  id: string;
  bidNumber: string;
  type: "bid-approval" | "proposal-approval" | "high-value-override";
  status: ApprovalStatus;
  chains: IApprovalChain[];
  requestedBy: IPersonRef;
  requestedDate: string;
  completedDate: string | null;
  allChainsApproved: boolean;
  totalApprovers: number;
  approvedCount: number;
  rejectedCount: number;
}

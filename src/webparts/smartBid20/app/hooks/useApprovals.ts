/**
 * useApprovals — Hook de aprovações.
 */
import * as React from "react";
import { useBidStore } from "../stores/useBidStore";
import { IBid } from "../models";

export interface ApprovalSummary {
  pending: IBid[];
  approved: IBid[];
  rejected: IBid[];
  totalPending: number;
}

export function useApprovals(): ApprovalSummary {
  const bids = useBidStore((s) => s.bids);

  return React.useMemo(() => {
    const pending = bids.filter((b) => b.approvalStatus === "pending");
    const approved = bids.filter((b) => b.approvalStatus === "approved");
    const rejected = bids.filter((b) => b.approvalStatus === "rejected");

    return {
      pending,
      approved,
      rejected,
      totalPending: pending.length,
    };
  }, [bids]);
}

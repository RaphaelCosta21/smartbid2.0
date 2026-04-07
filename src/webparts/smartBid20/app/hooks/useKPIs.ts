/**
 * useKPIs — Computes key performance indicators from BID data.
 */

import * as React from "react";
import { useBidStore } from "../stores/useBidStore";

export interface BidKPIs {
  totalBids: number;
  activeBids: number;
  wonBids: number;
  lostBids: number;
  pendingBids: number;
  winRate: number;
  avgCycleTimeDays: number;
  overdueBids: number;
  overdueRate: number;
  totalPipelineValueUSD: number;
}

const TERMINAL_STATUSES = ["Completed", "Cancelled", "On Hold"];

function isTerminal(status: string): boolean {
  return TERMINAL_STATUSES.indexOf(status) >= 0;
}

export function useKPIs(): BidKPIs {
  const bids = useBidStore((s) => s.bids);

  return React.useMemo(() => {
    const totalBids = bids.length;
    const activeBids = bids.filter((b) => !isTerminal(b.currentStatus)).length;
    const wonBids = bids.filter((b) => b.bidResult?.outcome === "Won").length;
    const lostBids = bids.filter((b) => b.bidResult?.outcome === "Lost").length;
    const pendingBids = bids.filter(
      (b) => b.bidResult?.outcome === "Pending" || !b.bidResult?.outcome,
    ).length;

    const completedWithResult = bids.filter(
      (b) => b.bidResult?.outcome === "Won" || b.bidResult?.outcome === "Lost",
    );
    const winRate = completedWithResult.length
      ? (wonBids / completedWithResult.length) * 100
      : 0;

    const now = new Date();
    const overdueBids = bids.filter((b) => {
      if (isTerminal(b.currentStatus)) return false;
      return b.dueDate ? new Date(b.dueDate) < now : false;
    }).length;
    const overdueRate = activeBids ? (overdueBids / activeBids) * 100 : 0;

    const completedBids = bids.filter(
      (b) =>
        b.currentStatus === "Completed" && b.completedDate && b.createdDate,
    );
    const avgCycleTimeDays = completedBids.length
      ? completedBids.reduce((sum, b) => {
          const start = new Date(b.createdDate).getTime();
          const end = new Date(b.completedDate!).getTime();
          return sum + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / completedBids.length
      : 0;

    const totalPipelineValueUSD = bids
      .filter((b) => !isTerminal(b.currentStatus))
      .reduce((sum, b) => sum + (b.costSummary?.totalCostUSD || 0), 0);

    return {
      totalBids,
      activeBids,
      wonBids,
      lostBids,
      pendingBids,
      winRate: Math.round(winRate * 10) / 10,
      avgCycleTimeDays: Math.round(avgCycleTimeDays * 10) / 10,
      overdueBids,
      overdueRate: Math.round(overdueRate * 10) / 10,
      totalPipelineValueUSD,
    };
  }, [bids]);
}

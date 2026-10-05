/**
 * useKPIs — Computes key performance indicators from BID data.
 */

import * as React from "react";
import { IBid } from "../models";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import { isPastDue } from "../utils/formatters";
import { getDueFreezeDate } from "../utils/bidHelpers";

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

/** KPIs over `source` (e.g. a filtered list) or, by default, every BID in the store. */
export function useKPIs(source?: IBid[]): BidKPIs {
  const storeBids = useBidStore((s) => s.bids);
  const bids = source || storeBids;
  const config = useConfigStore((s) => s.config);

  return React.useMemo(() => {
    // Build terminal status list from config
    const terminalValues: string[] = [];
    if (config) {
      const terms = (config as any).terminalStatuses || [];
      terms.forEach((t: any) => {
        if (t.value && t.isActive !== false) terminalValues.push(t.value);
      });
    }
    if (terminalValues.length === 0) {
      terminalValues.push("Completed", "Canceled", "No Bid");
    }

    function isTerminal(status: string): boolean {
      return terminalValues.indexOf(status) >= 0;
    }

    const totalBids = bids.length;
    const activeBids = bids.filter((b) => !isTerminal(b.currentStatus)).length;
    const wonBids = bids.filter((b) => b.bidResult?.outcome === "Won").length;
    const lostBids = bids.filter((b) => b.bidResult?.outcome === "Loss").length;
    const pendingBids = bids.filter(
      (b) => b.bidResult?.outcome === "Pending" || !b.bidResult?.outcome,
    ).length;

    const completedWithResult = bids.filter(
      (b) => b.bidResult?.outcome === "Won" || b.bidResult?.outcome === "Loss",
    );
    const winRate = completedWithResult.length
      ? (wonBids / completedWithResult.length) * 100
      : 0;

    const overdueBids = bids.filter(
      (b) =>
        !isTerminal(b.currentStatus) &&
        isPastDue(b.dueDate, getDueFreezeDate(b)),
    ).length;
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
  }, [bids, config]);
}

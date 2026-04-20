import { IBid, Division } from "../models";
import { differenceInDays } from "date-fns";

export function isActiveBid(bid: IBid): boolean {
  const terminalStatuses = [
    "Completed",
    "Returned to Commercial",
    "Canceled",
    "No Bid",
  ];
  return terminalStatuses.indexOf(bid.currentStatus) < 0;
}

export function isOverdueBid(bid: IBid): boolean {
  if (!isActiveBid(bid)) return false;
  return differenceInDays(new Date(bid.dueDate), new Date()) < 0;
}

export function getBidsByDivision(bids: IBid[], division: Division): IBid[] {
  return bids.filter((b) => b.division === division);
}

export function getBidsByStatus(bids: IBid[], status: string): IBid[] {
  return bids.filter((b) => b.currentStatus === status);
}

export function getBidsByPhase(bids: IBid[], phase: string): IBid[] {
  return bids.filter((b) => b.currentPhase === phase);
}

export function getTotalHours(bids: IBid[]): number {
  return bids.reduce(
    (sum, b) => sum + (b.hoursSummary?.grandTotalHours || 0),
    0,
  );
}

export function getTotalCostUSD(bids: IBid[]): number {
  return bids.reduce((sum, b) => sum + (b.costSummary?.totalCostUSD || 0), 0);
}

export function getUniqueClients(bids: IBid[]): string[] {
  const seen: Record<string, boolean> = {};
  const result: string[] = [];
  for (const b of bids) {
    if (!seen[b.opportunityInfo.client]) {
      seen[b.opportunityInfo.client] = true;
      result.push(b.opportunityInfo.client);
    }
  }
  return result.sort();
}

export function getUniqueOwners(
  bids: IBid[],
): { name: string; email: string }[] {
  const seen: Record<string, { name: string; email: string }> = {};
  for (const bid of bids) {
    const creator = bid.creator;
    if (creator && !seen[creator.email]) {
      seen[creator.email] = {
        name: creator.name,
        email: creator.email,
      };
    }
  }
  const result: { name: string; email: string }[] = [];
  for (const key in seen) {
    if (Object.prototype.hasOwnProperty.call(seen, key)) {
      result.push(seen[key]);
    }
  }
  return result.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

export function generateBidNumber(): string {
  const year = new Date().getFullYear();
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `BID-${year}-${seq}`;
}

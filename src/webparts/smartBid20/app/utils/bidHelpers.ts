import { IBid, Division } from "../models";
import { formatDaysLeft, isPastDue, parseDate } from "./formatters";
import { DUE_DATE_CHANGED } from "./revisionHelpers";

export function isActiveBid(bid: IBid): boolean {
  const terminalStatuses = [
    "Completed",
    "Returned to Commercial",
    "Canceled",
    "No Bid",
  ];
  return terminalStatuses.indexOf(bid.currentStatus) < 0;
}

/** A BID stays in Unassigned Requests until an engineer responsible is set. */
export function isUnassignedBid(bid: IBid): boolean {
  return (
    !bid.engineerResponsible ||
    (Array.isArray(bid.engineerResponsible) &&
      bid.engineerResponsible.length === 0)
  );
}

function getLastDueDateChange(bid: IBid): Date | null {
  let last: Date | null = null;
  for (const entry of bid.activityLog || []) {
    if (entry.type !== DUE_DATE_CHANGED) continue;
    const at = parseDate(entry.timestamp);
    if (at && (!last || at.getTime() > last.getTime())) last = at;
  }
  return last;
}

/** Due date in effect at `at`: the previous value of the first due-date change after it, else the current one. */
export function getDueDateAt(bid: IBid, at: Date): string {
  let firstAfter: { time: number; previous: string } | null = null;
  for (const entry of bid.activityLog || []) {
    if (entry.type !== DUE_DATE_CHANGED) continue;
    const changedAt = parseDate(entry.timestamp);
    const previous = entry.metadata?.previousDueDate;
    if (!changedAt || changedAt.getTime() <= at.getTime()) continue;
    if (typeof previous !== "string" || !previous) continue;
    if (!firstAfter || changedAt.getTime() < firstAfter.time) {
      firstAfter = { time: changedAt.getTime(), previous };
    }
  }
  return firstAfter
    ? firstAfter.previous
    : bid.desiredDueDate || bid.dueDate || "";
}

/**
 * When the BID first reached a terminal status under its current due date. The
 * due/overdue count stops there and stays frozen even after a revision reopens
 * the BID. A due date changed after a closing is a new deadline, so only a later
 * closing freezes it. Null = not closed since the current due date was set.
 */
export function getDueFreezeDate(bid: IBid): Date | null {
  const dueSetAt = getLastDueDateChange(bid);
  const appliesToDue = (closedAt: Date | null): boolean =>
    !!closedAt && (!dueSetAt || closedAt.getTime() >= dueSetAt.getTime());

  for (const revision of bid.revisions || []) {
    const opened = parseDate(revision.openedDate);
    if (!opened) continue;
    // Revisions only open from a terminal status: the entry in effect then is the closing one.
    let closedAt = opened;
    for (const entry of bid.statusHistory || []) {
      const start = parseDate(entry.start);
      if (start && start.getTime() < opened.getTime()) closedAt = start;
    }
    if (appliesToDue(closedAt)) return closedAt;
  }
  const completed = parseDate(bid.completedDate);
  return appliesToDue(completed) ? completed : null;
}

export function isOverdueBid(bid: IBid): boolean {
  if (!isActiveBid(bid)) return false;
  return isPastDue(bid.dueDate, getDueFreezeDate(bid));
}

export interface IUpcomingDeadline {
  bid: IBid;
  /** Days until due (negative = overdue) */
  days: number;
  text: string;
}

/** Active BIDs with a due date, most overdue / nearest first. */
export function buildUpcomingDeadlines(bids: IBid[]): IUpcomingDeadline[] {
  const rows: IUpcomingDeadline[] = [];
  bids.forEach((bid) => {
    if (!isActiveBid(bid)) return;
    const due = formatDaysLeft(bid.dueDate, getDueFreezeDate(bid));
    if (due.days === null) return;
    rows.push({ bid, days: due.days, text: due.text });
  });
  return rows.sort((a, b) => a.days - b.days);
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

/** Engineering-only hours for a single BID (excludes onshore/offshore). */
export function getEngineeringHours(bid: IBid): number {
  return bid.hoursSummary?.engineeringHours?.totalHours || 0;
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

export function getUniqueCreators(
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

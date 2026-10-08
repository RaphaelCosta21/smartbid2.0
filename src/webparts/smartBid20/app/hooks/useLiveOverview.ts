/**
 * useLiveOverview — "what needs attention now" (linked ERNs, pending approvals,
 * upcoming BID deadlines). Shared by the dashboard Live section and the header
 * Live panel so both always show the same numbers.
 */
import * as React from "react";
import { IBid, IErn } from "../models";
import { useErnStore } from "../stores/useErnStore";
import {
  buildErnLinkRows,
  compareErnUrgency,
  IErnLinkRow,
} from "../utils/ernHelpers";
import {
  buildPendingApprovalRows,
  IPendingApprovalRow,
} from "../utils/approvalHelpers";
import { buildUpcomingDeadlines, IUpcomingDeadline } from "../utils/bidHelpers";

export interface ErnLiveKpis {
  total: number;
  closed: number;
  open: number;
  onHold: number;
  dueSoon: number;
  overdue: number;
  /** Days late of the oldest overdue ERN */
  maxLate: number;
  /** Overdue share of open ERNs that are not on hold; null when there are none */
  overdueRate: number | null;
}

export interface LiveOverview {
  /** Linked ERNs (open and closed), most urgent first */
  ernRows: IErnLinkRow[];
  ernKpis: ErnLiveKpis;
  approvals: IPendingApprovalRow[];
  deadlines: IUpcomingDeadline[];
}

export type LiveUpdateKind = "erns" | "approvals" | "deadlines";

/** One Live item that changed since the user last checked, in plain language. */
export interface ILiveUpdate {
  key: string;
  kind: LiveUpdateKind;
  /** ERN number (erns) or BID number (approvals / deadlines) */
  id: string;
  title: string;
  /** What changed, one sentence each */
  changes: string[];
  /** The item left the Live overview (nothing to open) */
  gone: boolean;
}

/** Live items that changed since the user last checked (header Live panel). */
export interface LiveUpdates {
  /** Item keys (ern: / apr: / due:) new or changed */
  keys: Record<string, ILiveUpdate>;
  /** Changed + new + gone items */
  count: number;
  /** Changed + new + gone items, described */
  items: ILiveUpdate[];
}

export function useLiveOverview(bids: IBid[]): LiveOverview {
  const erns = useErnStore((s) => s.erns);

  const ernRows = React.useMemo(() => {
    const byTitle: Record<string, IErn> = {};
    erns.forEach((e) => {
      byTitle[e.title] = e;
    });
    return buildErnLinkRows(bids, byTitle).sort(compareErnUrgency);
  }, [bids, erns]);

  const ernKpis = React.useMemo((): ErnLiveKpis => {
    let open = 0;
    let onHold = 0;
    let dueSoon = 0;
    let overdue = 0;
    let maxLate = 0;
    ernRows.forEach((r) => {
      if (!r.closed) open++;
      if (!r.closed && r.onHold) onHold++;
      if (r.deadline === "due-soon") dueSoon++;
      if (r.deadline === "overdue") {
        overdue++;
        maxLate = Math.max(maxLate, -(r.daysLeft || 0));
      }
    });
    // On-hold ERNs never go overdue, so they stay out of the rate base
    const base = open - onHold;
    return {
      total: ernRows.length,
      closed: ernRows.length - open,
      open,
      onHold,
      dueSoon,
      overdue,
      maxLate,
      overdueRate: base ? Math.round((overdue / base) * 100) : null,
    };
  }, [ernRows]);

  const approvals = React.useMemo(() => buildPendingApprovalRows(bids), [bids]);
  const deadlines = React.useMemo(() => buildUpcomingDeadlines(bids), [bids]);

  return { ernRows, ernKpis, approvals, deadlines };
}

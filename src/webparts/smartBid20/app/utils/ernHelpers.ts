/**
 * ERN helpers — pure functions for the Engineering Request Number integration.
 */
import {
  IBid,
  IBidErnLink,
  IErn,
  ISystemConfig,
  ErnDeadlineState,
} from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { getDaysUntil } from "./formatters";

/** Revision Reason dropdown options (used when Content Action = "Revise"). */
export const ERN_REVISION_REASONS: string[] = [
  "Correction of Non-Conformities Identified in the First Execution",
  "Ambiguous/Incomplete Technical Specifications",
  "Detailing Errors / Internal Inconsistencies",
  "Updates to Improve Manufacturability",
  "Standardization and Compliance with Engineering Requirements",
  "Changes Motivated by Lessons Learned from Initial Production",
  "Integration with Other Areas (Engineering, Quality, Supply Chain)",
  "FPY Enhancement by Reducing Variability",
  "Obsolete document / PN replacement",
];

/** Deliverable Type pre-selected when creating an ERN from a BID. */
export const ERN_DEFAULT_DELIVERABLE_TYPE =
  "Bids - Engineering Hours and Lead Time Estimate";

/** SmartBid service line (normalized) -> ERN list Service Line choice. */
const ERN_SERVICE_LINE_MAP: Record<string, string> = {
  survey: "SSR - Survey",
  rov: "SSR - ROV",
  imr: "IMR",
  uwild: "IMR",
  controls: "Controls",
  engineersolutions: "Eng Solutions",
  decommissioning: "Intervention",
  installation: "Intervention",
};

const normalizeChoice = (s: string | null | undefined): string =>
  (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");

/** Find a choice ignoring case, spaces and punctuation. */
export function findErnChoice(
  choices: string[],
  target: string | null | undefined,
): string | undefined {
  const t = normalizeChoice(target);
  if (!t) return undefined;
  return choices.find((c) => normalizeChoice(c) === t);
}

/** ERN Service Line choice matching a SmartBid service line ("" when unknown). */
export function resolveErnServiceLineChoice(
  choices: string[],
  serviceLine: string | null | undefined,
): string {
  const mapped = ERN_SERVICE_LINE_MAP[normalizeChoice(serviceLine)];
  return (
    findErnChoice(choices, mapped) || findErnChoice(choices, serviceLine) || ""
  );
}

/** The service line value that means a BID spans both ROV and Survey. */
export const INTEGRATED_SERVICE_LINE = "Integrated";

export type ErnDivision = "ROV" | "SURVEY" | null;

export interface IErnSlot {
  /** Division tag for this ERN slot (null = single ERN). */
  division: ErnDivision;
  /** Short label shown in the UI (e.g. "ROV", "Survey", ""). */
  label: string;
  /** Service line value used to resolve the ERN's ServiceLine / Project Number. */
  serviceLine: string;
}

/** True when the BID is an Integrated (ROV + Survey) service line. */
export function isIntegratedBid(bid: IBid): boolean {
  return (bid.serviceLine || "") === INTEGRATED_SERVICE_LINE;
}

/**
 * ERN slots for a BID. Integrated BIDs need two ERNs (ROV + Survey); every
 * other BID needs a single ERN (division = null).
 */
export function getErnSlots(bid: IBid): IErnSlot[] {
  if (isIntegratedBid(bid)) {
    return [
      { division: "ROV", label: "ROV", serviceLine: "ROV" },
      { division: "SURVEY", label: "Survey", serviceLine: "Survey" },
    ];
  }
  return [{ division: null, label: "", serviceLine: bid.serviceLine }];
}

/** Normalized ERN links for a BID (falls back to the legacy single fields). */
export function getErnLinks(bid: IBid): IBidErnLink[] {
  if (bid.ernLinks && bid.ernLinks.length > 0) return bid.ernLinks;
  if (bid.ernNumber) {
    return [
      {
        division: null,
        ernNumber: bid.ernNumber,
        ernId: bid.ernId || 0,
        ernStatus: bid.ernStatus || "",
        ernDueDate: bid.ernDueDate || "",
        ernFinishDate: bid.ernFinishDate || "",
        linkedBy: bid.ernLinkedBy,
        linkedDate: bid.ernLinkedDate || undefined,
      },
    ];
  }
  return [];
}

/** The ERN link filling a given slot (division), if any. */
export function getErnLinkForSlot(
  bid: IBid,
  division: ErnDivision,
): IBidErnLink | undefined {
  return getErnLinks(bid).find((l) => (l.division || null) === division);
}

/** ERN titles already linked to this BID (to exclude from the picker). */
export function getLinkedErnTitles(bid: IBid): string[] {
  return getErnLinks(bid).map((l) => l.ernNumber);
}

/**
 * Resolve the ERN Project Number for a BID from the System Configuration.
 * Priority: (override service line || bid service line) projectNumber →
 * Division projectNumber → "". Always editable by the user in the modal.
 */
export function resolveErnProjectNumber(
  bid: IBid,
  config: ISystemConfig | null | undefined,
  serviceLineOverride?: string,
): string {
  if (!config) return "";
  const slValue = serviceLineOverride || bid.serviceLine;
  const sl = (config.serviceLines || []).find((o) => o.value === slValue);
  if (sl && sl.projectNumber) return sl.projectNumber;
  const div = (config.divisions || []).find((o) => o.value === bid.division);
  if (div && div.projectNumber) return div.projectNumber;
  return "";
}

const ERN_CLOSED_STATUSES = [
  "completed",
  "closed",
  "cancelled",
  "canceled",
  "released",
];

/** Whether an ERN counts as closed/finished (closed status or a Released/Finish date). */
export function isErnClosed(
  status: string | null | undefined,
  finishDate?: string | null,
): boolean {
  if (finishDate) return true;
  if (!status) return false;
  return ERN_CLOSED_STATUSES.indexOf(status.trim().toLowerCase()) >= 0;
}

/** On Hold ERNs stay open but are never due soon / overdue. */
export function isErnOnHold(status: string | null | undefined): boolean {
  return (status || "").trim().toLowerCase() === "on hold";
}

/**
 * Classify an ERN due date into a reminder state.
 * overdue  = past due and not closed / on hold
 * due-soon = within `dueSoonDays` and not closed / on hold
 */
export function getErnDeadlineState(
  dueDate: string | null | undefined,
  status?: string | null,
  finishDate?: string | null,
): ErnDeadlineState {
  if (!dueDate) return "none";
  if (isErnClosed(status, finishDate) || isErnOnHold(status)) return "ok";
  const days = getDaysUntil(dueDate);
  if (days === null) return "none";
  if (days < 0) return "overdue";
  if (days <= SHAREPOINT_CONFIG.ern.dueSoonDays) return "due-soon";
  return "ok";
}

/** Days until (positive) or since (negative) the ERN due date. */
export function getErnDaysLeft(dueDate: string | null | undefined): number {
  return getDaysUntil(dueDate) || 0;
}

/** One linked ERN with its live state (live list data wins over the BID snapshot). */
export interface IErnLinkRow {
  bid: IBid;
  ernNumber: string;
  division: ErnDivision;
  status: string;
  dueDate: string;
  finishDate: string;
  closed: boolean;
  onHold: boolean;
  deadline: ErnDeadlineState;
  /** Days until (positive) or since (negative) the due date; null without a date */
  daysLeft: number | null;
  /** Live ERN list record, undefined when the ERN is not (yet) loaded */
  ern?: IErn;
}

/** Linked ERNs across BIDs, deduped by ERN number. */
export function buildErnLinkRows(
  bids: IBid[],
  liveByTitle: Record<string, IErn>,
): IErnLinkRow[] {
  const seen: Record<string, boolean> = {};
  const rows: IErnLinkRow[] = [];
  bids.forEach((bid) => {
    getErnLinks(bid).forEach((l) => {
      if (!l.ernNumber || seen[l.ernNumber]) return;
      seen[l.ernNumber] = true;
      const live = liveByTitle[l.ernNumber];
      const status = (live ? live.status : l.ernStatus) || "Unknown";
      const dueDate = (live ? live.dueDate : l.ernDueDate) || "";
      const finishDate = (live ? live.finishDate : l.ernFinishDate) || "";
      rows.push({
        bid,
        ernNumber: l.ernNumber,
        division: l.division || null,
        status,
        dueDate,
        finishDate,
        closed: isErnClosed(status, finishDate),
        onHold: isErnOnHold(status),
        deadline: getErnDeadlineState(dueDate, status, finishDate),
        daysLeft: getDaysUntil(dueDate),
        ern: live,
      });
    });
  });
  return rows;
}

/** Whether the user is the ERN's responsible, checker or lead. */
export function isErnAssignedTo(
  ern: IErn | undefined,
  email: string | undefined,
): boolean {
  const me = (email || "").trim().toLowerCase();
  if (!ern || !me) return false;
  return [ern.resource1Email, ern.checkerEmail, ern.leadEmail].some(
    (e) => (e || "").trim().toLowerCase() === me,
  );
}

const DEADLINE_RANK: Record<string, number> = {
  overdue: 0,
  "due-soon": 1,
  ok: 2,
  none: 3,
};

/** Most urgent first: overdue (latest first), due soon, by date; on hold / undated last. */
export function compareErnUrgency(a: IErnLinkRow, b: IErnLinkRow): number {
  const rank = (r: IErnLinkRow): number =>
    r.closed ? 5 : r.onHold ? 4 : DEADLINE_RANK[r.deadline];
  const diff = rank(a) - rank(b);
  if (diff !== 0) return diff;
  const da = a.daysLeft === null ? Infinity : a.daysLeft;
  const db = b.daysLeft === null ? Infinity : b.daysLeft;
  return da - db;
}

/** Live watchlist buckets (all of them exclude closed ERNs). */
export type ErnWatchFilter = "overdue" | "due-soon" | "open" | "on-hold";

export function matchesErnWatchFilter(
  r: IErnLinkRow,
  filter: ErnWatchFilter,
): boolean {
  if (r.closed) return false;
  if (filter === "open") return true;
  if (filter === "on-hold") return r.onHold;
  return r.deadline === filter;
}

/** Short countdown for an ERN row, e.g. "3d late", "Due today", "in 4d". */
export function getErnCountdownLabel(r: IErnLinkRow): string {
  if (r.closed) return "Released";
  if (r.onHold) return "On hold";
  if (r.daysLeft === null) return "No due date";
  if (r.daysLeft < 0) return `${-r.daysLeft}d late`;
  if (r.daysLeft === 0) return "Due today";
  if (r.daysLeft === 1) return "Tomorrow";
  return `in ${r.daysLeft}d`;
}

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
      });
    });
  });
  return rows;
}

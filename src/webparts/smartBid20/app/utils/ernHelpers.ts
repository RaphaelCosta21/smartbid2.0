/**
 * ERN helpers — pure functions for the Engineering Request Number integration.
 */
import { IBid, IBidErnLink, ISystemConfig, ErnDeadlineState } from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

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

/** Whether an ERN status counts as closed/finished. */
export function isErnClosed(status: string | null | undefined): boolean {
  if (!status) return false;
  const s = status.toLowerCase();
  return s === "completed" || s === "closed" || s === "cancelled";
}

/**
 * Classify an ERN due date into a reminder state.
 * overdue  = past due and not closed
 * due-soon = within `dueSoonDays` and not closed
 */
export function getErnDeadlineState(
  dueDate: string | null | undefined,
  status?: string | null,
): ErnDeadlineState {
  if (!dueDate) return "none";
  if (isErnClosed(status)) return "ok";
  const due = new Date(dueDate).getTime();
  if (isNaN(due)) return "none";
  const now = Date.now();
  const days = Math.floor((due - now) / 86400000);
  if (days < 0) return "overdue";
  if (days <= SHAREPOINT_CONFIG.ern.dueSoonDays) return "due-soon";
  return "ok";
}

/** Days until (positive) or since (negative) the ERN due date. */
export function getErnDaysLeft(dueDate: string | null | undefined): number {
  if (!dueDate) return 0;
  const due = new Date(dueDate).getTime();
  if (isNaN(due)) return 0;
  return Math.floor((due - Date.now()) / 86400000);
}

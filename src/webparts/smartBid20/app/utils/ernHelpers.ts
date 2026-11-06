/**
 * ERN helpers — pure functions for the Engineering Request Number integration.
 */
import {
  BidErnPurpose,
  BusinessLine,
  IBid,
  IBidErnLink,
  IErn,
  ISystemConfig,
  ErnDeadlineState,
  ErnStage,
} from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { getDaysUntil } from "./formatters";
import {
  businessLineDivision,
  getBidBusinessLines,
  getBusinessLineLabel,
  getBusinessLineServiceLine,
  getTrackLabel,
  hasMultipleBusinessLines,
} from "./divisionHelpers";

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

/** Project Name / Project Title of ERNs that support BIDs in general (not linked to a BID). */
export const ERN_GENERAL_SUPPORT_TITLE = "General BID Support";

/** Whether an ERN is a General BID Support ERN (by Project Title). */
export function isGeneralSupportErn(ern: IErn | undefined): boolean {
  return (
    !!ern &&
    normalizeChoice(ern.projectTitle) ===
      normalizeChoice(ERN_GENERAL_SUPPORT_TITLE)
  );
}

/** Project Title of a BID's Technical Proposal ERN. */
export function getTechnicalProposalErnTitle(bid: IBid): string {
  const name = bid.opportunityInfo?.projectName || bid.bidNumber;
  return `${name} - Technical Proposal`;
}

export type ErnDivision = BusinessLine | null;

export interface IErnSlot {
  /** Team tag for this ERN slot (null = single ERN). */
  division: ErnDivision;
  /** Short label shown in the UI (e.g. "OPG", "ROV", "Survey", ""). */
  label: string;
  /** Service line value used to resolve the ERN's ServiceLine / Project Number. */
  serviceLine: string;
  /** What the ERN of this slot is for. */
  purpose: BidErnPurpose;
}

/** True when the BID has two teams (INTEGRATED division or SSR "Integrated"), one ERN each. */
export function isIntegratedBid(bid: IBid): boolean {
  return hasMultipleBusinessLines(bid);
}

/**
 * ERN slots for a BID. BIDs with two teams need one ERN per team (lead
 * first); every other BID needs a single ERN (division = null).
 */
export function getErnSlots(bid: IBid): IErnSlot[] {
  if (isIntegratedBid(bid)) {
    return getBidBusinessLines(bid).map((line) => ({
      division: line,
      label: getBusinessLineLabel(line),
      serviceLine: getBusinessLineServiceLine(bid, line),
      purpose: "bid" as BidErnPurpose,
    }));
  }
  return [
    { division: null, label: "", serviceLine: bid.serviceLine, purpose: "bid" },
  ];
}

/** Technical Proposal ERN slots (one per team); empty when no Technical Proposal was requested. */
export function getTechnicalProposalErnSlots(bid: IBid): IErnSlot[] {
  if (!bid.technicalProposal?.requested) return [];
  return getErnSlots(bid).map((s) => ({
    ...s,
    purpose: "technical-proposal" as BidErnPurpose,
  }));
}

/** Purpose of a link; links saved before Technical Proposal ERNs are BID ERNs. */
export function getErnLinkPurpose(link: IBidErnLink): BidErnPurpose {
  return link.purpose === "technical-proposal" ? "technical-proposal" : "bid";
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

/** The ERN link filling a given slot (division + purpose), if any. */
export function getErnLinkForSlot(
  bid: IBid,
  division: ErnDivision,
  purpose: BidErnPurpose = "bid",
): IBidErnLink | undefined {
  return getErnLinks(bid).find(
    (l) =>
      (l.division || null) === division && getErnLinkPurpose(l) === purpose,
  );
}

/** Technical Proposal ERN slots still without an ERN. */
export function getMissingTechnicalProposalErnSlots(bid: IBid): IErnSlot[] {
  return getTechnicalProposalErnSlots(bid).filter(
    (s) => !getErnLinkForSlot(bid, s.division, s.purpose),
  );
}

/** "ERN-42", "ERN-42 (SSR - ROV)", "ERN-43 (TP)" or "ERN-44 (Survey · TP)". */
export function getErnLinkLabel(bid: IBid, link: IBidErnLink): string {
  const parts: string[] = [];
  if (link.division) parts.push(getTrackLabel(bid, link.division));
  if (getErnLinkPurpose(link) === "technical-proposal") parts.push("TP");
  return parts.length
    ? `${link.ernNumber} (${parts.join(" · ")})`
    : link.ernNumber;
}

/** ERN titles already linked to this BID (to exclude from the picker). */
export function getLinkedErnTitles(bid: IBid): string[] {
  return getErnLinks(bid).map((l) => l.ernNumber);
}

/**
 * ERN Project Number from the System Configuration: the service line's
 * projectNumber, then the division's projectNumber, then "".
 */
export function resolveErnProjectNumberFor(
  config: ISystemConfig | null | undefined,
  serviceLine: string | null | undefined,
  division: string | null | undefined,
): string {
  if (!config) return "";
  const sl = (config.serviceLines || []).find((o) => o.value === serviceLine);
  if (sl && sl.projectNumber) return sl.projectNumber;
  const div = (config.divisions || []).find((o) => o.value === division);
  if (div && div.projectNumber) return div.projectNumber;
  return "";
}

/**
 * Resolve the ERN Project Number for a BID from the System Configuration.
 * Priority: (override service line || bid service line) projectNumber →
 * Division projectNumber (the slot's division on two-team BIDs) → "".
 * Always editable by the user in the modal.
 */
export function resolveErnProjectNumber(
  bid: IBid,
  config: ISystemConfig | null | undefined,
  serviceLineOverride?: string,
  slotDivision?: ErnDivision,
): string {
  return resolveErnProjectNumberFor(
    config,
    serviceLineOverride || bid.serviceLine,
    slotDivision ? businessLineDivision(slotDivision) : bid.division,
  );
}

/** SmartBid service line value a team (business line) works under ("" for OPG: several lines). */
export function getBusinessLineErnServiceLine(line: BusinessLine): string {
  if (line === "ROV") return "ROV";
  if (line === "SURVEY") return "Survey";
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

export function isErnCanceled(status: string | null | undefined): boolean {
  const s = (status || "").trim().toLowerCase();
  return s === "canceled" || s === "cancelled";
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

/* ─── Stages: who holds the ERN and which date applies ─── */

export const ERN_STAGES: ErnStage[] = ["engineering", "checker", "lead"];

/** Role holding each stage. */
export const ERN_STAGE_ROLES: Record<ErnStage, string> = {
  engineering: "Responsible",
  checker: "Checker",
  lead: "Lead",
};

/** Date that closes each stage. */
export const ERN_STAGE_DATE_LABELS: Record<ErnStage, string> = {
  engineering: "Eng. due date",
  checker: "Checker due date",
  lead: "Lead date",
};

/**
 * Stage of an open ERN from its status: "Waiting for Checker Approval" →
 * checker, "Waiting for Lead Approval" → lead, anything else (Received Not
 * Started, Work In Progress...) → engineering (the Responsible).
 */
export function getErnStage(status: string | null | undefined): ErnStage {
  const s = (status || "").toLowerCase();
  if (s.indexOf("checker") >= 0) return "checker";
  if (s.indexOf("lead") >= 0) return "lead";
  return "engineering";
}

export interface IErnStageDates {
  dueDate?: string | null;
  checkerDueDate?: string | null;
  leadDate?: string | null;
}

/** Due date of a stage: Eng. Due Date, Checker Due Date or Lead Date. */
export function getErnStageDueDate(
  stage: ErnStage,
  dates: IErnStageDates,
): string {
  if (stage === "lead") return dates.leadDate || "";
  if (stage === "checker") return dates.checkerDueDate || "";
  return dates.dueDate || "";
}

export interface IErnStageInfo {
  stage: ErnStage;
  /** Due date of the current stage ("" when not set) */
  stageDueDate: string;
  /** Due soon / overdue against the current stage date */
  deadline: ErnDeadlineState;
  /** Days until (positive) or since (negative) the stage date; null without a date */
  daysLeft: number | null;
}

/**
 * Deadline of an ERN against the date of whoever holds it now. An ERN waiting
 * for the Lead is not late for the Responsible once the Eng. Due Date passes;
 * it is late only after the Lead Date.
 */
export function getErnStageInfo(
  status: string | null | undefined,
  finishDate: string | null | undefined,
  dates: IErnStageDates,
): IErnStageInfo {
  const stage = getErnStage(status);
  const stageDueDate = getErnStageDueDate(stage, dates);
  return {
    stage,
    stageDueDate,
    deadline: getErnDeadlineState(stageDueDate, status, finishDate),
    daysLeft: getDaysUntil(stageDueDate),
  };
}

/** What a watchlist row is: a BID ERN, a Technical Proposal ERN or a General BID Support ERN. */
export type ErnRowPurpose = BidErnPurpose | "general";

/** One linked ERN with its live state (live list data wins over the BID snapshot). */
export interface IErnLinkRow {
  /** BID the ERN is linked to; undefined for General BID Support ERNs */
  bid?: IBid;
  ernNumber: string;
  division: ErnDivision;
  purpose: ErnRowPurpose;
  status: string;
  /** Eng. Due Date (Responsible) */
  dueDate: string;
  checkerDueDate: string;
  leadDate: string;
  finishDate: string;
  closed: boolean;
  onHold: boolean;
  /** Who holds the ERN now */
  stage: ErnStage;
  /** Due date of the current stage */
  stageDueDate: string;
  /** Due soon / overdue against the current stage date */
  deadline: ErnDeadlineState;
  /** Days until (positive) or since (negative) the stage date; null without a date */
  daysLeft: number | null;
  /** Live ERN list record, undefined when the ERN is not (yet) loaded */
  ern?: IErn;
}

interface IErnSnapshot {
  status?: string;
  dueDate?: string;
  checkerDueDate?: string;
  leadDate?: string;
  finishDate?: string;
}

function buildErnRow(
  bid: IBid | undefined,
  ernNumber: string,
  division: ErnDivision,
  purpose: ErnRowPurpose,
  live: IErn | undefined,
  snap: IErnSnapshot,
): IErnLinkRow {
  const src: IErnSnapshot = live || snap;
  const status = src.status || "Unknown";
  const dueDate = src.dueDate || "";
  const checkerDueDate = src.checkerDueDate || "";
  const leadDate = src.leadDate || "";
  const finishDate = src.finishDate || "";
  const info = getErnStageInfo(status, finishDate, {
    dueDate,
    checkerDueDate,
    leadDate,
  });
  return {
    bid,
    ernNumber,
    division,
    purpose,
    status,
    dueDate,
    checkerDueDate,
    leadDate,
    finishDate,
    closed: isErnClosed(status, finishDate),
    onHold: isErnOnHold(status),
    stage: info.stage,
    stageDueDate: info.stageDueDate,
    deadline: info.deadline,
    daysLeft: info.daysLeft,
    ern: live,
  };
}

/** Stage-aware deadline of a BID ERN link, using the live ERN when loaded. */
export function getErnLinkStageInfo(
  link: IBidErnLink,
  live?: IErn | null,
): IErnStageInfo {
  if (live) {
    return getErnStageInfo(live.status, live.finishDate, live);
  }
  return getErnStageInfo(link.ernStatus, link.ernFinishDate, {
    dueDate: link.ernDueDate,
    checkerDueDate: link.ernCheckerDueDate,
    leadDate: link.ernLeadDate,
  });
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
      rows.push(
        buildErnRow(
          bid,
          l.ernNumber,
          l.division || null,
          getErnLinkPurpose(l),
          liveByTitle[l.ernNumber],
          {
            status: l.ernStatus,
            dueDate: l.ernDueDate,
            checkerDueDate: l.ernCheckerDueDate,
            leadDate: l.ernLeadDate,
            finishDate: l.ernFinishDate,
          },
        ),
      );
    });
  });
  return rows;
}

/**
 * General BID Support ERNs (Project Title "General BID Support") that are not
 * linked to any BID. `linkedTitles` = ERN numbers linked to any BID.
 */
export function buildGeneralSupportErnRows(
  erns: IErn[],
  linkedTitles: Record<string, boolean>,
): IErnLinkRow[] {
  const rows: IErnLinkRow[] = [];
  erns.forEach((e) => {
    if (!e.title || linkedTitles[e.title] || !isGeneralSupportErn(e)) return;
    rows.push(buildErnRow(undefined, e.title, null, "general", e, {}));
  });
  return rows;
}

/* ─── People ─── */

function sameEmail(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  const x = (a || "").trim().toLowerCase();
  return !!x && x === (b || "").trim().toLowerCase();
}

/** Whether the user is the ERN's responsible, checker or lead. */
export function isErnAssignedTo(
  ern: IErn | undefined,
  email: string | undefined,
): boolean {
  if (!ern) return false;
  return [ern.resource1Email, ern.checkerEmail, ern.leadEmail].some((e) =>
    sameEmail(e, email),
  );
}

/** Whether the user is the ERN's Responsible (Resource 1). */
export function isErnResponsible(
  ern: IErn | undefined,
  email: string | undefined,
): boolean {
  return !!ern && sameEmail(ern.resource1Email, email);
}

export interface IErnPerson {
  stage: ErnStage;
  /** Responsible / Checker / Lead */
  role: string;
  name: string;
  email: string;
  /** Date that closes this person's stage */
  dueDate: string;
}

/** Responsible, Checker and Lead of an ERN (only the ones that are set). */
export function getErnPeople(ern: IErn | undefined): IErnPerson[] {
  if (!ern) return [];
  const all: IErnPerson[] = [
    {
      stage: "engineering",
      role: ERN_STAGE_ROLES.engineering,
      name: ern.resource1,
      email: ern.resource1Email,
      dueDate: ern.dueDate,
    },
    {
      stage: "checker",
      role: ERN_STAGE_ROLES.checker,
      name: ern.checker,
      email: ern.checkerEmail,
      dueDate: ern.checkerDueDate,
    },
    {
      stage: "lead",
      role: ERN_STAGE_ROLES.lead,
      name: ern.lead,
      email: ern.leadEmail,
      dueDate: ern.leadDate,
    },
  ];
  return all.filter((p) => !!p.name || !!p.email);
}

/** Person holding the ERN's current stage, if known. */
export function getErnStageOwner(r: IErnLinkRow): IErnPerson | undefined {
  return getErnPeople(r.ern).find((p) => p.stage === r.stage);
}

/** The ERN waits on the user as Checker or Lead (current stage is theirs). */
export function isErnWaitingOn(
  r: IErnLinkRow,
  email: string | undefined,
): boolean {
  if (!r.ern || r.stage === "engineering") return false;
  const owner = getErnStageOwner(r);
  return !!owner && sameEmail(owner.email, email);
}

/* ─── Watchlist scope, filters, sorting and labels ─── */

/** all = every ERN; mine = I am the Responsible; review = waiting on me as Checker / Lead. */
export type ErnWatchScope = "all" | "mine" | "review";

export function matchesErnWatchScope(
  r: IErnLinkRow,
  scope: ErnWatchScope,
  email: string | undefined,
): boolean {
  if (scope === "mine") return isErnResponsible(r.ern, email);
  if (scope === "review") return isErnWaitingOn(r, email);
  return true;
}

/** The Responsible already handed the ERN over (it is with the Checker or Lead). */
export function isErnHandedOver(r: IErnLinkRow, scope: ErnWatchScope): boolean {
  return (
    scope === "mine" && !r.closed && !r.onHold && r.stage !== "engineering"
  );
}

/**
 * Deadline as seen from the scope. In "mine" an ERN is due soon / overdue only
 * while the Responsible still has it (Engineering stage).
 */
export function getErnScopedDeadline(
  r: IErnLinkRow,
  scope: ErnWatchScope = "all",
): ErnDeadlineState {
  return isErnHandedOver(r, scope) ? "ok" : r.deadline;
}

const DEADLINE_RANK: Record<string, number> = {
  overdue: 0,
  "due-soon": 1,
  ok: 2,
  none: 3,
};

/**
 * Most urgent first: overdue (latest first), due soon, by date; handed over
 * (in "mine"), on hold and closed last.
 */
export function compareErnUrgency(
  a: IErnLinkRow,
  b: IErnLinkRow,
  scope: ErnWatchScope = "all",
): number {
  const rank = (r: IErnLinkRow): number =>
    r.closed
      ? 6
      : r.onHold
        ? 5
        : isErnHandedOver(r, scope)
          ? 4
          : DEADLINE_RANK[r.deadline];
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
  scope: ErnWatchScope = "all",
): boolean {
  if (r.closed) return false;
  if (filter === "open") return true;
  if (filter === "on-hold") return r.onHold;
  return getErnScopedDeadline(r, scope) === filter;
}

/**
 * Short countdown for an ERN row against the current stage date, e.g.
 * "3d late", "Checker · in 4d", "Lead · Due today". In "mine", ERNs already
 * handed over read "With Checker" / "With Lead".
 */
export function getErnCountdownLabel(
  r: IErnLinkRow,
  scope: ErnWatchScope = "all",
  showStage = true,
): string {
  if (r.closed) return isErnCanceled(r.status) ? "Canceled" : "Released";
  if (r.onHold) return "On hold";
  if (isErnHandedOver(r, scope)) return `With ${ERN_STAGE_ROLES[r.stage]}`;
  const prefix =
    !showStage || r.stage === "engineering"
      ? ""
      : `${ERN_STAGE_ROLES[r.stage]} · `;
  return `${prefix}${formatErnDaysLeft(r.daysLeft)}`;
}

/** "3d late", "Due today", "Tomorrow", "in 4d" or "No due date". */
export function formatErnDaysLeft(daysLeft: number | null): string {
  if (daysLeft === null) return "No due date";
  if (daysLeft < 0) return `${-daysLeft}d late`;
  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "Tomorrow";
  return `in ${daysLeft}d`;
}

/** Tag shown next to a row's ERN number (team, Technical Proposal, General). */
export function getErnRowTags(r: IErnLinkRow): string[] {
  const tags: string[] = [];
  if (r.division) tags.push(getBusinessLineLabel(r.division));
  if (r.purpose === "technical-proposal") tags.push("Tech. Proposal");
  if (r.purpose === "general") tags.push(ERN_GENERAL_SUPPORT_TITLE);
  return tags;
}

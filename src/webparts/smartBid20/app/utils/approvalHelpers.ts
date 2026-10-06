/**
 * approvalHelpers — Robust per-sector approval-duration computation.
 *
 * Uses the timestamps already stored on the BID (IBidApproval.requestedDate /
 * respondedDate) grouped by sector. Only CLOSED sectors/rounds count (every
 * approval in the sector has responded); pending approvals are excluded.
 * Prefers the persisted snapshot (round.sectorDurations) when present.
 */
import {
  ApprovalStatus,
  IActivityLogEntry,
  IBid,
  IBidApproval,
  IApprovalRound,
  IApprovalOverride,
  ISectorApprovalDuration,
} from "../models";
import { Sector } from "../models/IUser";
import {
  getSectorColor,
  getSectorLabel,
  sectorFromLabel,
  SECTORS,
} from "../config/sectors.config";
import { buildHistoryTransition } from "./phaseHelpers";
import { getDaysUntil, isPastDue, parseDate } from "./formatters";
import { getDueDateAt } from "./bidHelpers";

const MS_PER_HOUR = 3600000;
const MS_PER_DAY = 86400000;

export function getApprovalSector(a: IBidApproval): Sector | undefined {
  return a.sector || sectorFromLabel(a.stakeholderRole);
}

function toTime(s?: string | null): number | null {
  if (!s) return null;
  const t = new Date(s).getTime();
  return isNaN(t) ? null : t;
}

/** True when every approval in the sector has responded. */
export function sectorClosed(approvals: IBidApproval[]): boolean {
  return approvals.length > 0 && approvals.every((a) => !!a.respondedDate);
}

/**
 * Compute per-sector durations for one round (only sectors fully responded).
 * `fromRoundStart` measures every sector from the round start instead of its earliest request.
 */
export function computeRoundSectorDurations(
  round: IApprovalRound,
  fromRoundStart: boolean = false,
): ISectorApprovalDuration[] {
  const roundStart = fromRoundStart ? toTime(round.startedDate) : null;
  const bySector: { [sector: string]: IBidApproval[] } = {};
  (round.approvals || []).forEach((a) => {
    const sector = getApprovalSector(a);
    if (!sector) return;
    (bySector[sector] = bySector[sector] || []).push(a);
  });

  const out: ISectorApprovalDuration[] = [];
  Object.keys(bySector).forEach((sector) => {
    const list = bySector[sector];
    if (!sectorClosed(list)) return; // skip open sectors
    let minReq = Infinity;
    let maxResp = -Infinity;
    list.forEach((a) => {
      const req = toTime(a.requestedDate);
      const resp = toTime(a.respondedDate);
      if (req != null && req < minReq) minReq = req;
      if (resp != null && resp > maxResp) maxResp = resp;
    });
    if (roundStart != null) minReq = roundStart;
    if (!isFinite(minReq) || !isFinite(maxResp) || maxResp < minReq) return;
    out.push({
      sector: sector as Sector,
      sectorLabel: getSectorLabel(sector),
      requestedDate: new Date(minReq).toISOString(),
      completedDate: new Date(maxResp).toISOString(),
      durationHours: Math.round(((maxResp - minReq) / MS_PER_HOUR) * 10) / 10,
      approverCount: list.length,
    });
  });
  return out;
}

function roundIsClosed(r: IApprovalRound): boolean {
  return (
    !!r.completedDate || r.status === "approved" || r.status === "rejected"
  );
}

/** All closed-round sector durations for a bid (prefers persisted snapshot). */
export function computeBidSectorDurations(
  bid: IBid,
): ISectorApprovalDuration[] {
  const rounds = bid.approvalRounds || [];
  const result: ISectorApprovalDuration[] = [];

  rounds.forEach((r) => {
    if (!roundIsClosed(r)) return;
    const durations =
      r.sectorDurations && r.sectorDurations.length > 0
        ? r.sectorDurations
        : computeRoundSectorDurations(r);
    durations.forEach((d) => result.push(d));
  });

  // Fallback: flat bid.approvals grouped by round (no approvalRounds structure)
  if (result.length === 0 && bid.approvals && bid.approvals.length > 0) {
    const byRound: { [round: number]: IBidApproval[] } = {};
    bid.approvals.forEach((a) => {
      (byRound[a.round] = byRound[a.round] || []).push(a);
    });
    Object.keys(byRound).forEach((rk) => {
      const approvals = byRound[Number(rk)];
      const pseudo: IApprovalRound = {
        round: Number(rk),
        startedDate: "",
        startedBy: { name: "", email: "" },
        status: "approved",
        completedDate: null,
        approvals,
      };
      computeRoundSectorDurations(pseudo).forEach((d) => result.push(d));
    });
  }

  return result;
}

export interface SectorApprovalStat {
  sector: Sector;
  label: string;
  color: string;
  avgDays: number;
  count: number;
}

export interface ApprovalFilter {
  bidTypes?: string[];
  divisions?: string[];
  from?: string;
  to?: string;
}

/** Average approval days per sector across bids (closed rounds only). */
export function avgApprovalDaysBySector(
  bids: IBid[],
  filter?: ApprovalFilter,
): SectorApprovalStat[] {
  const buckets: { [sector: string]: number[] } = {};
  bids.forEach((b) => {
    if (
      filter &&
      filter.bidTypes &&
      filter.bidTypes.length > 0 &&
      filter.bidTypes.indexOf(b.bidType) < 0
    ) {
      return;
    }
    if (
      filter &&
      filter.divisions &&
      filter.divisions.length > 0 &&
      filter.divisions.indexOf(b.division) < 0
    ) {
      return;
    }
    const created = (b.createdDate || "").slice(0, 10);
    if (filter && filter.from && created && created < filter.from) return;
    if (filter && filter.to && created && created > filter.to) return;

    computeBidSectorDurations(b).forEach((d) => {
      (buckets[d.sector] = buckets[d.sector] || []).push(d.durationHours / 24);
    });
  });

  return SECTORS.map((s) => {
    const vals = buckets[s.value] || [];
    const avg = vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : 0;
    return {
      sector: s.value,
      label: s.label,
      color: getSectorColor(s.value),
      avgDays: Math.round(avg * 10) / 10,
      count: vals.length,
    };
  })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.avgDays - a.avgDays);
}

/** Last round when it closed approved (the one that completed the BID); legacy flat approvals as fallback. */
export function getFinalApprovedRound(bid: IBid): IApprovalRound | null {
  const rounds = bid.approvalRounds || [];
  if (rounds.length > 0) {
    const last = rounds[rounds.length - 1];
    return last.status === "approved" ? last : null;
  }
  const approvals = bid.approvals || [];
  if (bid.approvalStatus !== "approved" || approvals.length === 0) return null;
  const round = approvals.reduce((m, a) => Math.max(m, a.round || 0), 0);
  return {
    round,
    startedDate: "",
    startedBy: { name: "", email: "" },
    status: "approved",
    completedDate: null,
    approvals: approvals.filter((a) => (a.round || 0) === round),
  };
}

/** Sectors of the round where every approver approved (bypassed/rejected sectors are left out). */
function approvedSectorDurations(
  round: IApprovalRound,
): ISectorApprovalDuration[] {
  const notApproved: { [sector: string]: boolean } = {};
  (round.approvals || []).forEach((a) => {
    const sector = getApprovalSector(a);
    if (sector && a.status !== "approved") notApproved[sector] = true;
  });
  return computeRoundSectorDurations(round, true).filter(
    (d) => !notApproved[d.sector],
  );
}

export interface SectorApprovalHoursStat {
  sector: Sector;
  label: string;
  color: string;
  avgHours: number;
  count: number;
}

/** Average hours from approval start to each sector's last sign-off, final approved round only. */
export function avgApprovalHoursBySector(
  bids: IBid[],
): SectorApprovalHoursStat[] {
  const buckets: { [sector: string]: number[] } = {};
  bids.forEach((b) => {
    const round = getFinalApprovedRound(b);
    if (!round) return;
    approvedSectorDurations(round).forEach((d) => {
      (buckets[d.sector] = buckets[d.sector] || []).push(d.durationHours);
    });
  });

  return SECTORS.map((s) => {
    const vals = buckets[s.value] || [];
    const avg = vals.length ? vals.reduce((a, v) => a + v, 0) / vals.length : 0;
    return {
      sector: s.value,
      label: s.label,
      color: getSectorColor(s.value),
      avgHours: Math.round(avg * 10) / 10,
      count: vals.length,
    };
  })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.avgHours - a.avgHours);
}

export type ApprovalDueCategory =
  | "onTime"
  | "lateDueToApproval"
  | "lateBeforeApproval";

export interface ApprovalDueImpact {
  bid: IBid;
  startedDate: Date;
  finishedDate: Date;
  dueDate: string;
  category: ApprovalDueCategory;
  daysLate: number;
  slowestSector: ISectorApprovalDuration | null;
}

/**
 * Where the final approved round sits against the due date in effect when it finished:
 * started after the due day = already late; started on time but finished after it = late due to approval.
 */
export function getApprovalDueImpact(bid: IBid): ApprovalDueImpact | null {
  const round = getFinalApprovedRound(bid);
  if (!round) return null;
  let firstReq: number | null = null;
  let lastResp: number | null = null;
  for (const a of round.approvals || []) {
    const req = toTime(a.requestedDate);
    const resp = toTime(a.respondedDate);
    if (req != null && (firstReq == null || req < firstReq)) firstReq = req;
    if (resp != null && (lastResp == null || resp > lastResp)) lastResp = resp;
  }
  const started =
    parseDate(round.startedDate) ||
    (firstReq != null ? new Date(firstReq) : null);
  const finished =
    parseDate(round.completedDate) ||
    (lastResp != null ? new Date(lastResp) : null);
  if (!started || !finished) return null;

  const dueDate = getDueDateAt(bid, finished);
  if (!parseDate(dueDate)) return null;

  const category: ApprovalDueCategory = isPastDue(dueDate, started)
    ? "lateBeforeApproval"
    : isPastDue(dueDate, finished)
      ? "lateDueToApproval"
      : "onTime";
  const durations = approvedSectorDurations(round);
  const slowestSector = durations.reduce<ISectorApprovalDuration | null>(
    (m, d) => (!m || d.durationHours > m.durationHours ? d : m),
    null,
  );
  return {
    bid,
    startedDate: started,
    finishedDate: finished,
    dueDate,
    category,
    daysLate: Math.max(0, -(getDaysUntil(dueDate, finished) || 0)),
    slowestSector,
  };
}

export interface PendingApprovalDueRisk {
  bid: IBid;
  dueDate: string;
  startedBeforeDue: boolean;
}

export interface ApprovalDueSummary {
  impacts: ApprovalDueImpact[];
  counts: { [k in ApprovalDueCategory]: number };
}

/** Final approved rounds of `bids` against their due date, with per-category counts. */
export function summarizeApprovalDueImpact(bids: IBid[]): ApprovalDueSummary {
  const impacts: ApprovalDueImpact[] = [];
  const counts = { onTime: 0, lateDueToApproval: 0, lateBeforeApproval: 0 };
  bids.forEach((b) => {
    const impact = getApprovalDueImpact(b);
    if (!impact) return;
    impacts.push(impact);
    counts[impact.category] += 1;
  });
  return { impacts, counts };
}

/** BID currently waiting on approvals whose due date has already passed. */
export function getPendingApprovalDueRisk(
  bid: IBid,
): PendingApprovalDueRisk | null {
  if (bid.approvalStatus !== "pending") return null;
  const rounds = bid.approvalRounds || [];
  const last = rounds[rounds.length - 1];
  if (!last || last.status !== "pending") return null;
  const dueDate = bid.desiredDueDate || bid.dueDate;
  if (!dueDate || !isPastDue(dueDate)) return null;
  const started = parseDate(last.startedDate);
  return {
    bid,
    dueDate,
    startedBeforeDue: !!started && !isPastDue(dueDate, started),
  };
}

/** Override recorded on the latest approval round, if any. */
export function getActiveApprovalOverride(
  bid: IBid,
): IApprovalOverride | undefined {
  const rounds = bid.approvalRounds || [];
  return rounds.length > 0 ? rounds[rounds.length - 1].override : undefined;
}

/** Overall approval cycle time (days) for a bid — earliest request to latest completion. */
export function computeApprovalCycleTime(bid: IBid): number | null {
  const durations = computeBidSectorDurations(bid);
  if (durations.length === 0) return null;
  let minReq = Infinity;
  let maxComp = -Infinity;
  durations.forEach((d) => {
    const req = new Date(d.requestedDate).getTime();
    const comp = new Date(d.completedDate).getTime();
    if (req < minReq) minReq = req;
    if (comp > maxComp) maxComp = comp;
  });
  if (!isFinite(minReq) || !isFinite(maxComp)) return null;
  return Math.round(((maxComp - minReq) / MS_PER_DAY) * 10) / 10;
}

export const APPROVAL_FLOW_ACTOR = "Approval flow";

function completionEntry(round: number, timestamp: string): IActivityLogEntry {
  return {
    id: `log-apr-r${round}-completed`,
    type: "STATUS_CHANGED",
    timestamp,
    actor: "",
    actorName: APPROVAL_FLOW_ACTOR,
    description: `Status changed from "Pending Approval" to "Completed" - BID fully approved (Round ${round})`,
    metadata: {
      fromStatus: "Pending Approval",
      toStatus: "Completed",
      round,
      note: `BID fully approved by all approvers (Round ${round})`,
    },
  };
}

/**
 * Activity entries for approval decisions and approval-driven completion that the
 * BID log still lacks (the Teams flow writes them straight into the BID JSON).
 * Ids are deterministic, so re-running never duplicates entries.
 */
export function getMissingApprovalActivityEntries(
  bid: IBid,
): IActivityLogEntry[] {
  const seen: Record<string, boolean> = {};
  (bid.activityLog || []).forEach((e) => {
    seen[e.id] = true;
  });
  const out: IActivityLogEntry[] = [];
  const add = (entry: IActivityLogEntry): void => {
    if (seen[entry.id]) return;
    seen[entry.id] = true;
    out.push(entry);
  };

  const rounds = bid.approvalRounds || [];
  const addDecision = (a: IBidApproval, fallbackRound: number): void => {
    if (a.status !== "approved" && a.status !== "rejected") return;
    if (!a.respondedDate) return;
    const round = a.round || fallbackRound;
    const approved = a.status === "approved";
    const name = a.stakeholder?.name || a.stakeholder?.email || "Approver";
    add({
      id: `log-apr-r${round}-${a.id}-${a.status}`,
      type: approved ? "APPROVAL_RESPONSE" : "APPROVAL_REJECTED",
      timestamp: a.respondedDate,
      actor: a.stakeholder?.email || "",
      actorName: name,
      description: `${name} ${approved ? "approved" : "rejected"} the BID as ${a.stakeholderRole} (Round ${round})`,
      metadata: {
        round,
        sector: a.sector || "",
        stakeholderRole: a.stakeholderRole,
        decision: a.status,
        comments: a.comments || "",
        approvedVia: a.approvedVia || "",
      },
    });
  };
  rounds.forEach((r) =>
    (r.approvals || []).forEach((a) => addDecision(a, r.round)),
  );
  (bid.approvals || []).forEach((a) => addDecision(a, rounds.length || 1));

  // Overridden rounds are already logged as APPROVAL_OVERRIDE.
  rounds.forEach((r) => {
    if (r.status !== "approved" || r.override) return;
    const when = r.completedDate || bid.completedDate;
    if (when) add(completionEntry(r.round, when));
  });

  // Legacy BIDs approved before rounds history existed.
  const approvals = bid.approvals || [];
  if (
    rounds.length === 0 &&
    approvals.length > 0 &&
    bid.approvalStatus === "approved" &&
    bid.currentStatus === "Completed" &&
    bid.completedDate &&
    approvals.every((a) => a.status === "approved")
  ) {
    add(completionEntry(approvals[0].round || 1, bid.completedDate));
  }
  return out;
}

/**
 * Phase/status history update for a BID the approval flow set to Completed
 * (the flow only writes currentStatus), or null when the history is in sync.
 */
export function getMissingApprovalHistoryPatch(
  bid: IBid,
): Pick<IBid, "phaseHistory" | "statusHistory"> | null {
  const rounds = bid.approvalRounds || [];
  const latest = rounds.length > 0 ? rounds[rounds.length - 1] : null;
  if (!latest || latest.status !== "approved") return null;
  if (bid.currentStatus !== "Completed") return null;
  const statusHistory = bid.statusHistory || [];
  const phaseHistory = bid.phaseHistory || [];
  if (statusHistory.length === 0) return null;
  const lastStatus = statusHistory[statusHistory.length - 1];
  const lastPhase =
    phaseHistory.length > 0 ? phaseHistory[phaseHistory.length - 1] : null;
  if (lastStatus.status === "Completed") return null;
  const at =
    latest.completedDate || bid.completedDate || new Date().toISOString();
  const actor = latest.override
    ? latest.override.overriddenBy.name
    : APPROVAL_FLOW_ACTOR;
  return buildHistoryTransition(
    {
      currentPhase: lastPhase ? lastPhase.phase : lastStatus.phase,
      currentStatus: lastStatus.status,
      phaseHistory,
      statusHistory,
    },
    "Close Out" as IBid["currentPhase"],
    "Completed",
    actor,
    at,
  );
}

/** One approver of a pending round; a person answering for several sectors is listed once. */
export interface IApprovalPerson {
  name: string;
  email: string;
  sectors: string[];
  color: string;
  /** pending if any of their approvals is pending, else rejected, else approved */
  status: ApprovalStatus;
}

/** A BID waiting for approval, as shown in the Live overview. */
export interface IPendingApprovalRow {
  bid: IBid;
  round: number;
  startedDate: Date | null;
  /** Days since the round started; null without any request date */
  days: number | null;
  total: number;
  approved: number;
  /** Approval statuses ordered approved, rejected, pending (progress segments) */
  statuses: string[];
  people: IApprovalPerson[];
  waiting: IApprovalPerson[];
}

const PERSON_STATUS_RANK: Record<string, number> = {
  approved: 0,
  rejected: 1,
  pending: 2,
};

function buildPendingApprovalRow(bid: IBid): IPendingApprovalRow {
  const approvals = bid.approvals || [];
  const rounds = bid.approvalRounds || [];
  const last = rounds.length > 0 ? rounds[rounds.length - 1] : undefined;
  let started = parseDate(last?.startedDate);
  if (!started) {
    approvals.forEach((a) => {
      const d = parseDate(a.requestedDate);
      if (d && (!started || d.getTime() < started.getTime())) started = d;
    });
  }
  const days = started ? Math.max(0, -(getDaysUntil(started) || 0)) : null;

  const byKey: Record<string, IApprovalPerson> = {};
  const people: IApprovalPerson[] = [];
  approvals.forEach((a) => {
    const sector = getApprovalSector(a);
    const label = sector ? getSectorLabel(sector) : a.stakeholderRole;
    const key = (
      a.stakeholder?.email ||
      a.stakeholder?.name ||
      a.id
    ).toLowerCase();
    const existing = byKey[key];
    if (existing) {
      if (existing.sectors.indexOf(label) < 0) existing.sectors.push(label);
      if (
        (PERSON_STATUS_RANK[a.status] ?? 2) >
        (PERSON_STATUS_RANK[existing.status] ?? 2)
      ) {
        existing.status = a.status;
      }
      return;
    }
    byKey[key] = {
      name: a.stakeholder?.name || a.stakeholder?.email || "Unknown",
      email: a.stakeholder?.email || "",
      sectors: [label],
      color: sector ? getSectorColor(sector) : "",
      status: a.status,
    };
    people.push(byKey[key]);
  });

  return {
    bid,
    round: rounds.length || approvals[0]?.round || 1,
    startedDate: started,
    days,
    total: approvals.length,
    approved: approvals.filter((a) => a.status === "approved").length,
    statuses: approvals
      .map((a) => a.status as string)
      .sort(
        (a, b) => (PERSON_STATUS_RANK[a] ?? 2) - (PERSON_STATUS_RANK[b] ?? 2),
      ),
    people,
    waiting: people.filter((p) => p.status === "pending"),
  };
}

/** BIDs waiting for approval, longest waiting first. */
export function buildPendingApprovalRows(bids: IBid[]): IPendingApprovalRow[] {
  return bids
    .filter((b) => b.approvalStatus === "pending")
    .map(buildPendingApprovalRow)
    .sort((a, b) => (b.days ?? -1) - (a.days ?? -1));
}

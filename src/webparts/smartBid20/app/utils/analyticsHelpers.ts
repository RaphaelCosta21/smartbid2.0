/**
 * analyticsHelpers — Pure aggregation functions for the Analytics pages.
 *
 * No React / config dependencies: pages pass in the BID array (and, where
 * relevant, the config-driven terminal-status list). Colors are resolved by
 * the page via useStatusColors — helpers return raw dimension keys + numbers.
 */
import { IBid, BidPhase, ITeamMember, IPersonRef } from "../models";
import { getErnLinks } from "./ernHelpers";

export type Granularity = "week" | "month" | "quarter";
export type DurationStat = "avg" | "median" | "max";
export type TeamRole = "engineer" | "analyst" | "pm" | "all";

/** Canonical phase order (mirrors models/IBidStatus BidPhase). */
export const PHASE_ORDER: BidPhase[] = [
  "Request Submitted",
  "Bid Kick Off",
  "Technical Analysis",
  "Cost & Resources",
  "Technical Proposal",
  "Close Out",
  "Rework",
];

export const DEFAULT_TERMINAL_STATUSES = [
  "Completed",
  "Canceled",
  "No Bid",
  "Returned to Commercial",
  "Client Canceled",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const MS_PER_DAY = 86400000;

/* ------------------------------------------------------------------ */
/* Internal date helpers                                               */
/* ------------------------------------------------------------------ */

function toDate(s?: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function daysBetween(start: Date, end: Date): number {
  return Math.max(0, (end.getTime() - start.getTime()) / MS_PER_DAY);
}

function isoWeek(date: Date): { year: number; week: number } {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / MS_PER_DAY + 1) / 7,
  );
  return { year: d.getUTCFullYear(), week };
}

function periodStart(d: Date, gran: Granularity): Date {
  if (gran === "month") return new Date(d.getFullYear(), d.getMonth(), 1);
  if (gran === "quarter") {
    return new Date(d.getFullYear(), Math.floor(d.getMonth() / 3) * 3, 1);
  }
  const nd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (nd.getDay() + 6) % 7; // days since Monday
  nd.setDate(nd.getDate() - day);
  return nd;
}

function addPeriod(d: Date, gran: Granularity): Date {
  const nd = new Date(d);
  if (gran === "month") nd.setMonth(nd.getMonth() + 1);
  else if (gran === "quarter") nd.setMonth(nd.getMonth() + 3);
  else nd.setDate(nd.getDate() + 7);
  return nd;
}

function periodKey(d: Date, gran: Granularity): string {
  const y = d.getFullYear();
  if (gran === "month") {
    return `${y}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }
  if (gran === "quarter") {
    return `${y}-Q${Math.floor(d.getMonth() / 3) + 1}`;
  }
  const w = isoWeek(d);
  return `${w.year}-W${String(w.week).padStart(2, "0")}`;
}

function periodLabel(key: string, gran: Granularity): string {
  const parts = key.split("-");
  const yy = parts[0].slice(2);
  if (gran === "month") return `${MONTHS[parseInt(parts[1], 10) - 1]} ${yy}`;
  return `${parts[1]} ${yy}`; // Q1 25 / W03 25
}

/**
 * Build an ordered, gap-free list of period keys spanning all provided dates.
 */
function buildPeriodSequence(dates: Date[], gran: Granularity): string[] {
  if (dates.length === 0) return [];
  let min = dates[0];
  let max = dates[0];
  dates.forEach((d) => {
    if (d.getTime() < min.getTime()) min = d;
    if (d.getTime() > max.getTime()) max = d;
  });
  const keys: string[] = [];
  let cursor = periodStart(min, gran);
  const end = periodStart(max, gran);
  let guard = 0;
  while (cursor.getTime() <= end.getTime() && guard < 600) {
    keys.push(periodKey(cursor, gran));
    cursor = addPeriod(cursor, gran);
    guard++;
  }
  return keys;
}

function aggregate(values: number[], stat: DurationStat): number {
  if (values.length === 0) return 0;
  if (stat === "max") {
    return values.reduce((m, v) => (v > m ? v : m), values[0]);
  }
  if (stat === "median") {
    const s = values.slice().sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function personMatches(list: IPersonRef[] | undefined, email: string): boolean {
  if (!list) return false;
  const target = email.toLowerCase();
  return list.some((p) => (p.email || "").toLowerCase() === target);
}

export function isBidActive(
  bid: IBid,
  terminalStatuses: string[] = DEFAULT_TERMINAL_STATUSES,
): boolean {
  return terminalStatuses.indexOf(bid.currentStatus) < 0;
}

/* ------------------------------------------------------------------ */
/* Trend shapes (Performance Trends)                                   */
/* ------------------------------------------------------------------ */

export interface VolumePoint {
  key: string;
  period: string;
  created: number;
  completed: number;
}

export function volumeTrend(bids: IBid[], gran: Granularity): VolumePoint[] {
  const dates: Date[] = [];
  bids.forEach((b) => {
    const c = toDate(b.createdDate);
    if (c) dates.push(c);
    const d = toDate(b.completedDate);
    if (d) dates.push(d);
  });
  const keys = buildPeriodSequence(dates, gran);
  const created: { [k: string]: number } = {};
  const completed: { [k: string]: number } = {};
  bids.forEach((b) => {
    const c = toDate(b.createdDate);
    if (c) {
      const k = periodKey(c, gran);
      created[k] = (created[k] || 0) + 1;
    }
    const d = toDate(b.completedDate);
    if (d) {
      const k = periodKey(d, gran);
      completed[k] = (completed[k] || 0) + 1;
    }
  });
  return keys.map((k) => ({
    key: k,
    period: periodLabel(k, gran),
    created: created[k] || 0,
    completed: completed[k] || 0,
  }));
}

export interface ErnTrendPoint {
  key: string;
  period: string;
  erns: number;
}

/**
 * ERN volume over time — counts ERN links per period, keyed by when each ERN
 * was linked/created (falls back to the BID's created date).
 */
export function ernTrend(bids: IBid[], gran: Granularity): ErnTrendPoint[] {
  const dates: Date[] = [];
  const counts: { [k: string]: number } = {};
  bids.forEach((b) => {
    getErnLinks(b).forEach((l) => {
      const d = toDate(l.linkedDate || b.createdDate);
      if (!d) return;
      dates.push(d);
      const k = periodKey(d, gran);
      counts[k] = (counts[k] || 0) + 1;
    });
  });
  const keys = buildPeriodSequence(dates, gran);
  return keys.map((k) => ({
    key: k,
    period: periodLabel(k, gran),
    erns: counts[k] || 0,
  }));
}

export interface CompletionPoint {
  key: string;
  period: string;
  avgDays: number;
  count: number;
}

export function completionTimeTrend(
  bids: IBid[],
  gran: Granularity,
): CompletionPoint[] {
  const buckets: { [k: string]: number[] } = {};
  const dates: Date[] = [];
  bids.forEach((b) => {
    const created = toDate(b.createdDate);
    const done = toDate(b.completedDate);
    if (created && done) {
      const k = periodKey(done, gran);
      (buckets[k] = buckets[k] || []).push(daysBetween(created, done));
      dates.push(done);
    }
  });
  return buildPeriodSequence(dates, gran).map((k) => {
    const vals = buckets[k] || [];
    return {
      key: k,
      period: periodLabel(k, gran),
      avgDays: vals.length ? Math.round(aggregate(vals, "avg") * 10) / 10 : 0,
      count: vals.length,
    };
  });
}

export interface WinRatePoint {
  key: string;
  period: string;
  winRate: number;
  won: number;
  lost: number;
}

export function winRateTrend(bids: IBid[], gran: Granularity): WinRatePoint[] {
  const won: { [k: string]: number } = {};
  const lost: { [k: string]: number } = {};
  const dates: Date[] = [];
  bids.forEach((b) => {
    const outcome = b.bidResult?.outcome;
    if (outcome !== "Won" && outcome !== "Loss") return;
    const ref = toDate(b.bidResult?.outcomeDate) || toDate(b.completedDate);
    if (!ref) return;
    const k = periodKey(ref, gran);
    if (outcome === "Won") won[k] = (won[k] || 0) + 1;
    else lost[k] = (lost[k] || 0) + 1;
    dates.push(ref);
  });
  return buildPeriodSequence(dates, gran).map((k) => {
    const w = won[k] || 0;
    const l = lost[k] || 0;
    const decided = w + l;
    return {
      key: k,
      period: periodLabel(k, gran),
      winRate: decided ? Math.round((w / decided) * 100) : 0,
      won: w,
      lost: l,
    };
  });
}

export interface OtdPoint {
  key: string;
  period: string;
  onTime: number;
  late: number;
  otdRate: number;
}

export function otdTrend(bids: IBid[], gran: Granularity): OtdPoint[] {
  const onTime: { [k: string]: number } = {};
  const late: { [k: string]: number } = {};
  const dates: Date[] = [];
  bids.forEach((b) => {
    const done = toDate(b.completedDate);
    const due = toDate(b.desiredDueDate) || toDate(b.dueDate);
    if (!done || !due) return;
    const k = periodKey(done, gran);
    if (done.getTime() <= due.getTime() + MS_PER_DAY) {
      onTime[k] = (onTime[k] || 0) + 1;
    } else {
      late[k] = (late[k] || 0) + 1;
    }
    dates.push(done);
  });
  return buildPeriodSequence(dates, gran).map((k) => {
    const on = onTime[k] || 0;
    const lt = late[k] || 0;
    const total = on + lt;
    return {
      key: k,
      period: periodLabel(k, gran),
      onTime: on,
      late: lt,
      otdRate: total ? Math.round((on / total) * 100) : 0,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Bottleneck shapes                                                   */
/* ------------------------------------------------------------------ */

export interface PhaseDurationRow {
  phase: BidPhase;
  days: number;
  count: number;
}

export function durationByPhase(
  bids: IBid[],
  stat: DurationStat = "avg",
): PhaseDurationRow[] {
  const buckets: { [phase: string]: number[] } = {};
  bids.forEach((b) => {
    (b.phaseHistory || []).forEach((e) => {
      if (e.durationHours != null && e.durationHours >= 0) {
        (buckets[e.phase] = buckets[e.phase] || []).push(e.durationHours / 24);
      }
    });
  });
  return PHASE_ORDER.filter((p) => buckets[p] && buckets[p].length > 0).map(
    (p) => ({
      phase: p,
      days: Math.round(aggregate(buckets[p], stat) * 10) / 10,
      count: buckets[p].length,
    }),
  );
}

export interface StatusDurationRow {
  status: string;
  days: number;
  count: number;
}

export function durationByStatus(
  bids: IBid[],
  stat: DurationStat = "avg",
): StatusDurationRow[] {
  const buckets: { [status: string]: number[] } = {};
  bids.forEach((b) => {
    (b.statusHistory || []).forEach((e) => {
      if (e.durationHours != null && e.durationHours >= 0) {
        (buckets[e.status] = buckets[e.status] || []).push(
          e.durationHours / 24,
        );
      }
    });
  });
  return Object.keys(buckets)
    .map((s) => ({
      status: s,
      days: Math.round(aggregate(buckets[s], stat) * 10) / 10,
      count: buckets[s].length,
    }))
    .sort((a, b) => b.days - a.days);
}

export interface HeatmapMatrix {
  divisions: string[];
  phases: BidPhase[];
  /** cells[division][phase] = { days, count } */
  cells: {
    [division: string]: { [phase: string]: { days: number; count: number } };
  };
  maxDays: number;
}

export function divisionPhaseMatrix(
  bids: IBid[],
  stat: DurationStat = "avg",
): HeatmapMatrix {
  const raw: { [div: string]: { [phase: string]: number[] } } = {};
  const divisionsSet: { [d: string]: true } = {};
  bids.forEach((b) => {
    const div = b.division || "—";
    divisionsSet[div] = true;
    (b.phaseHistory || []).forEach((e) => {
      if (e.durationHours != null && e.durationHours >= 0) {
        raw[div] = raw[div] || {};
        (raw[div][e.phase] = raw[div][e.phase] || []).push(
          e.durationHours / 24,
        );
      }
    });
  });
  const divisions = Object.keys(divisionsSet);
  const phases = PHASE_ORDER.filter((p) =>
    divisions.some((d) => raw[d] && raw[d][p] && raw[d][p].length > 0),
  );
  const cells: HeatmapMatrix["cells"] = {};
  let maxDays = 0;
  divisions.forEach((d) => {
    cells[d] = {};
    phases.forEach((p) => {
      const vals = (raw[d] && raw[d][p]) || [];
      const days = vals.length
        ? Math.round(aggregate(vals, stat) * 10) / 10
        : 0;
      cells[d][p] = { days, count: vals.length };
      if (days > maxDays) maxDays = days;
    });
  });
  return { divisions, phases, cells, maxDays };
}

export interface FunnelRow {
  phase: BidPhase;
  count: number;
}

export function phaseFunnel(bids: IBid[]): FunnelRow[] {
  const reached: { [phase: string]: number } = {};
  bids.forEach((b) => {
    const seen: { [p: string]: true } = {};
    (b.phaseHistory || []).forEach((e) => {
      seen[e.phase] = true;
    });
    // Ensure current phase and everything before it counts as reached
    const currentIdx = PHASE_ORDER.indexOf(b.currentPhase);
    PHASE_ORDER.forEach((p, idx) => {
      if (seen[p] || (currentIdx >= 0 && idx <= currentIdx)) {
        reached[p] = (reached[p] || 0) + 1;
      }
    });
  });
  return PHASE_ORDER.filter((p) => p !== "Rework").map((p) => ({
    phase: p,
    count: reached[p] || 0,
  }));
}

export interface SlowBidRow {
  bid: IBid;
  days: number;
  active: boolean;
}

export function slowestBids(
  bids: IBid[],
  limit = 10,
  scope: "all" | "active" | "completed" = "all",
  terminalStatuses: string[] = DEFAULT_TERMINAL_STATUSES,
): SlowBidRow[] {
  const now = new Date();
  const rows: SlowBidRow[] = [];
  bids.forEach((b) => {
    const active = isBidActive(b, terminalStatuses);
    if (scope === "active" && !active) return;
    if (scope === "completed" && active) return;
    const created = toDate(b.createdDate);
    if (!created) return;
    const endRef = toDate(b.completedDate) || now;
    const days =
      b.kpis && b.kpis.totalDaysElapsed
        ? b.kpis.totalDaysElapsed
        : Math.round(daysBetween(created, endRef));
    rows.push({ bid: b, days, active });
  });
  return rows.sort((a, b) => b.days - a.days).slice(0, limit);
}

export interface DivisionLoadRow {
  division: string;
  active: number;
  overdue: number;
}

export function divisionLoad(
  bids: IBid[],
  terminalStatuses: string[] = DEFAULT_TERMINAL_STATUSES,
): DivisionLoadRow[] {
  const now = new Date();
  const map: { [div: string]: DivisionLoadRow } = {};
  bids.forEach((b) => {
    if (!isBidActive(b, terminalStatuses)) return;
    const div = b.division || "—";
    const row = (map[div] = map[div] || {
      division: div,
      active: 0,
      overdue: 0,
    });
    row.active++;
    const due = toDate(b.desiredDueDate) || toDate(b.dueDate);
    if (due && due.getTime() < now.getTime()) row.overdue++;
  });
  return Object.keys(map)
    .map((k) => map[k])
    .sort((a, b) => b.active - a.active);
}

/* ------------------------------------------------------------------ */
/* Team shapes                                                         */
/* ------------------------------------------------------------------ */

export interface TeamMemberStats {
  member: ITeamMember;
  active: number;
  completed: number;
  total: number;
  avgCycleDays: number;
  winRate: number;
  ernsCreated: number;
}

function bidHasRole(bid: IBid, email: string, role: TeamRole): boolean {
  if (role === "engineer") return personMatches(bid.engineerResponsible, email);
  if (role === "analyst") return personMatches(bid.analyst, email);
  if (role === "pm") return personMatches(bid.projectManager, email);
  return (
    personMatches(bid.engineerResponsible, email) ||
    personMatches(bid.analyst, email) ||
    personMatches(bid.projectManager, email)
  );
}

export function teamWorkload(
  bids: IBid[],
  members: ITeamMember[],
  role: TeamRole = "all",
  terminalStatuses: string[] = DEFAULT_TERMINAL_STATUSES,
): TeamMemberStats[] {
  return members
    .map((m) => {
      const owned = bids.filter((b) => bidHasRole(b, m.email, role));
      const active = owned.filter((b) =>
        isBidActive(b, terminalStatuses),
      ).length;
      const completedBids = owned.filter(
        (b) => b.completedDate && b.createdDate,
      );
      const cycles = completedBids.map((b) =>
        daysBetween(
          new Date(b.createdDate),
          new Date(b.completedDate as string),
        ),
      );
      const decided = owned.filter(
        (b) =>
          b.bidResult?.outcome === "Won" || b.bidResult?.outcome === "Loss",
      );
      const won = decided.filter((b) => b.bidResult?.outcome === "Won").length;
      // ERNs created by this member (across all bids in the set)
      let ernsCreated = 0;
      bids.forEach((b) => {
        getErnLinks(b).forEach((l) => {
          if (
            l.linkedBy?.email &&
            l.linkedBy.email.toLowerCase() === m.email.toLowerCase()
          ) {
            ernsCreated++;
          }
        });
      });
      return {
        member: m,
        active,
        completed: completedBids.length,
        total: owned.length,
        avgCycleDays: cycles.length
          ? Math.round(aggregate(cycles, "avg") * 10) / 10
          : 0,
        winRate: decided.length ? Math.round((won / decided.length) * 100) : 0,
        ernsCreated,
      };
    })
    .filter((s) => s.total > 0 || s.ernsCreated > 0)
    .sort((a, b) => b.active - a.active);
}

/* ------------------------------------------------------------------ */
/* Deltas                                                              */
/* ------------------------------------------------------------------ */

export interface Delta {
  value: number;
  direction: "up" | "down" | "neutral";
  percent: number;
}

export function periodDelta(current: number, previous: number): Delta {
  const diff = current - previous;
  const direction = diff > 0 ? "up" : diff < 0 ? "down" : "neutral";
  const percent =
    previous !== 0 ? Math.round((diff / Math.abs(previous)) * 100) : 0;
  return { value: Math.round(diff * 10) / 10, direction, percent };
}

/** Split a value series into the last two windows for delta comparison. */
export function lastTwoSum(values: number[], window: number): [number, number] {
  const recent = values.slice(-window).reduce((a, b) => a + b, 0);
  const prior = values.slice(-window * 2, -window).reduce((a, b) => a + b, 0);
  return [recent, prior];
}

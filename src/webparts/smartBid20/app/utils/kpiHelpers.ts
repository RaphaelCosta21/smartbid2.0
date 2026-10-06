import { addMonths } from "date-fns";
import { IBid, IKPITargets, IPriorityRules, ISystemConfig } from "../models";
import { BidPriority } from "../models/IBidStatus";
import {
  BID_PRIORITIES,
  DEFAULT_KPI_TARGETS,
  DEFAULT_PRIORITY_RULES,
  OTIF_REVISION_WINDOW_MONTHS,
} from "../config/kpi.config";
import { isPastDue, parseDate } from "./formatters";
import { getDueDateAt } from "./bidHelpers";
import { countBusinessDays } from "./businessDays";

/* ------------------------------------------------------------------ */
/* Config resolvers                                                    */
/* ------------------------------------------------------------------ */

const num = (value: unknown, fallback: number): number =>
  typeof value === "number" && isFinite(value) ? value : fallback;

/** Targets saved in SharePoint merged over the defaults; legacy keys are dropped. */
export function resolveKpiTargets(
  config: ISystemConfig | null | undefined,
): IKPITargets {
  const raw = (config?.kpiTargets || {}) as Partial<IKPITargets>;
  const d = DEFAULT_KPI_TARGETS;
  const savedByPriority = (raw.targetAvgCompletionDaysByPriority ||
    {}) as Partial<Record<BidPriority, number>>;
  const byPriority = {} as Record<BidPriority, number>;
  BID_PRIORITIES.forEach((p) => {
    byPriority[p] = num(
      savedByPriority[p],
      d.targetAvgCompletionDaysByPriority[p],
    );
  });
  return {
    targetOnTimeDelivery: num(raw.targetOnTimeDelivery, d.targetOnTimeDelivery),
    targetOTIF: num(raw.targetOTIF, d.targetOTIF),
    targetAvgCompletionDaysByPriority: byPriority,
    targetFirstPassApproval: num(
      raw.targetFirstPassApproval,
      d.targetFirstPassApproval,
    ),
    targetApprovalCycleDays: num(
      raw.targetApprovalCycleDays,
      d.targetApprovalCycleDays,
    ),
    targetOverdueRate: num(raw.targetOverdueRate, d.targetOverdueRate),
    targetWinRate: num(raw.targetWinRate, d.targetWinRate),
  };
}

/** Null when valid, otherwise a user-facing message. */
export function validatePriorityRules(rules: IPriorityRules): string | null {
  const u = rules.urgentMaxBusinessDays;
  const n = rules.normalMaxBusinessDays;
  if (
    !isFinite(u) ||
    !isFinite(n) ||
    Math.floor(u) !== u ||
    Math.floor(n) !== n
  )
    return "Limits must be whole numbers of business days.";
  if (u < 0) return "The Urgent limit cannot be negative.";
  if (n <= u) return "The Normal limit must be greater than the Urgent limit.";
  if (n > 365) return "The Normal limit cannot exceed 365 business days.";
  return null;
}

export function resolvePriorityRules(
  config: ISystemConfig | null | undefined,
): IPriorityRules {
  const raw = config?.priorityRules;
  const rules: IPriorityRules = {
    urgentMaxBusinessDays: num(
      raw?.urgentMaxBusinessDays,
      DEFAULT_PRIORITY_RULES.urgentMaxBusinessDays,
    ),
    normalMaxBusinessDays: num(
      raw?.normalMaxBusinessDays,
      DEFAULT_PRIORITY_RULES.normalMaxBusinessDays,
    ),
  };
  return validatePriorityRules(rules) ? DEFAULT_PRIORITY_RULES : rules;
}

/** Business-day range label of each urgency, e.g. Urgent "0-4", Low "15+". */
export function getPriorityRangeLabels(
  rules: IPriorityRules,
): Record<BidPriority, string> {
  return {
    Urgent: `0-${rules.urgentMaxBusinessDays}`,
    Normal: `${rules.urgentMaxBusinessDays + 1}-${rules.normalMaxBusinessDays}`,
    Low: `${rules.normalMaxBusinessDays + 1}+`,
  };
}

/* ------------------------------------------------------------------ */
/* Target evaluation                                                   */
/* ------------------------------------------------------------------ */

export type TargetTone = "success" | "warning" | "danger" | "neutral";

/** Met = success; missed by up to 10% of the target (min 1 unit) = warning; worse = danger. */
export function targetTone(
  value: number | null,
  target: number,
  higherIsBetter: boolean,
): TargetTone {
  if (value === null || !isFinite(value)) return "neutral";
  const met = higherIsBetter ? value >= target : value <= target;
  if (met) return "success";
  const gap = higherIsBetter ? target - value : value - target;
  return gap <= Math.max(Math.abs(target) * 0.1, 1) ? "warning" : "danger";
}

/** "Target >= 85%" / "Target <= 4 bd" */
export function formatTarget(
  target: number,
  unit: string,
  higherIsBetter: boolean,
): string {
  return `Target ${higherIsBetter ? "≥" : "≤"} ${target}${unit}`;
}

export interface RateStat {
  hits: number;
  total: number;
  /** 0-100, null when there is nothing to measure. */
  rate: number | null;
}

function toRate(hits: number, total: number): RateStat {
  return {
    hits,
    total,
    rate: total ? Math.round((hits / total) * 100) : null,
  };
}

/* ------------------------------------------------------------------ */
/* Delivery                                                            */
/* ------------------------------------------------------------------ */

/** First time the BID reached Completed; later re-completions after revisions are ignored. */
export function getFirstDeliveryDate(bid: IBid): Date | null {
  let first: Date | null = null;
  for (const entry of bid.statusHistory || []) {
    if (entry.status !== "Completed") continue;
    const at = parseDate(entry.start);
    if (at && (!first || at.getTime() < first.getTime())) first = at;
  }
  return first || parseDate(bid.completedDate);
}

/** Null when the BID was not delivered yet or has no valid due date. */
export function isDeliveredOnTime(bid: IBid): boolean | null {
  const delivered = getFirstDeliveryDate(bid);
  if (!delivered) return null;
  const due = getDueDateAt(bid, delivered);
  if (!parseDate(due)) return null;
  return !isPastDue(due, delivered);
}

export function computeOnTimeDelivery(bids: IBid[]): RateStat {
  let hits = 0;
  let total = 0;
  bids.forEach((b) => {
    const onTime = isDeliveredOnTime(b);
    if (onTime === null) return;
    total++;
    if (onTime) hits++;
  });
  return toRate(hits, total);
}

/* ------------------------------------------------------------------ */
/* Approval                                                            */
/* ------------------------------------------------------------------ */

const FAILED_APPROVAL = ["rejected", "revision-requested"];

/**
 * First closed approval round approved with nobody rejecting / asking for a revision
 * and no override. Null while no round has closed (or no approval history).
 */
export function isFirstPassApproved(bid: IBid): boolean | null {
  const rounds = (bid.approvalRounds || [])
    .slice()
    .sort((a, b) => a.round - b.round);
  if (rounds.length > 0) {
    for (const r of rounds) {
      const failed = (r.approvals || []).some(
        (a) => FAILED_APPROVAL.indexOf(a.status) >= 0,
      );
      if (failed || FAILED_APPROVAL.indexOf(r.status) >= 0) return false;
      if (r.status === "approved") return !r.override;
    }
    return null;
  }

  // Legacy BIDs: flat approvals tagged with their round number
  const approvals = bid.approvals || [];
  if (approvals.length === 0) return null;
  const firstRound = approvals.reduce(
    (m, a) => Math.min(m, a.round || 0),
    Infinity,
  );
  const first = approvals.filter((a) => (a.round || 0) === firstRound);
  if (first.some((a) => FAILED_APPROVAL.indexOf(a.status) >= 0)) return false;
  return first.every((a) => a.status === "approved") ? true : null;
}

export function computeFirstPassApproval(bids: IBid[]): RateStat {
  let hits = 0;
  let total = 0;
  bids.forEach((b) => {
    const firstPass = isFirstPassApproved(b);
    if (firstPass === null) return;
    total++;
    if (firstPass) hits++;
  });
  return toRate(hits, total);
}

/* ------------------------------------------------------------------ */
/* OTIF                                                                */
/* ------------------------------------------------------------------ */

export interface OtifResult {
  otif: boolean;
  /** OTIF so far, but a revision can still be opened inside the window. */
  provisional: boolean;
}

/** On time + first-pass approval (skipped without approval history) + no revision within the window. */
export function getOtif(bid: IBid, now: Date = new Date()): OtifResult | null {
  const delivered = getFirstDeliveryDate(bid);
  if (!delivered) return null;
  const onTime = isDeliveredOnTime(bid);
  if (onTime === null) return null;
  const windowEnd = addMonths(delivered, OTIF_REVISION_WINDOW_MONTHS);
  const revisedInWindow = (bid.revisions || []).some((r) => {
    const opened = parseDate(r.openedDate);
    return (
      !!opened &&
      opened.getTime() >= delivered.getTime() &&
      opened.getTime() <= windowEnd.getTime()
    );
  });
  const otif = onTime && isFirstPassApproved(bid) !== false && !revisedInWindow;
  return { otif, provisional: otif && now.getTime() < windowEnd.getTime() };
}

export interface OtifStat extends RateStat {
  provisional: number;
}

export function computeOtif(bids: IBid[], now: Date = new Date()): OtifStat {
  let hits = 0;
  let total = 0;
  let provisional = 0;
  bids.forEach((b) => {
    const r = getOtif(b, now);
    if (!r) return;
    total++;
    if (r.otif) hits++;
    if (r.provisional) provisional++;
  });
  return { ...toRate(hits, total), provisional };
}

/* ------------------------------------------------------------------ */
/* Cycle time by urgency                                               */
/* ------------------------------------------------------------------ */

/** Business days from creation to first delivery. */
export function getCycleBusinessDays(bid: IBid): number | null {
  const created = parseDate(bid.createdDate);
  const delivered = getFirstDeliveryDate(bid);
  if (!created || !delivered) return null;
  return countBusinessDays(created, delivered);
}

export interface PriorityCycleStat {
  avg: number | null;
  count: number;
  target: number;
  tone: TargetTone;
}

export interface CycleSummary {
  overall: { avg: number | null; count: number };
  byPriority: Record<BidPriority, PriorityCycleStat>;
  /** Urgency categories with data that meet their target. */
  onTarget: number;
  measured: number;
}

const average = (values: number[]): number | null =>
  values.length
    ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10
    : null;

export function computeCycleByPriority(
  bids: IBid[],
  targets: IKPITargets,
): CycleSummary {
  const all: number[] = [];
  const buckets: { [p: string]: number[] } = {};
  bids.forEach((b) => {
    const days = getCycleBusinessDays(b);
    if (days === null) return;
    all.push(days);
    if (BID_PRIORITIES.indexOf(b.priority) >= 0) {
      (buckets[b.priority] = buckets[b.priority] || []).push(days);
    }
  });

  const byPriority = {} as Record<BidPriority, PriorityCycleStat>;
  let onTarget = 0;
  let measured = 0;
  BID_PRIORITIES.forEach((p) => {
    const values = buckets[p] || [];
    const avg = average(values);
    const target = targets.targetAvgCompletionDaysByPriority[p];
    const tone = targetTone(avg, target, false);
    if (avg !== null) {
      measured++;
      if (tone === "success") onTarget++;
    }
    byPriority[p] = { avg, count: values.length, target, tone };
  });

  return {
    overall: { avg: average(all), count: all.length },
    byPriority,
    onTarget,
    measured,
  };
}

/** Tone for "N of M urgency categories on target". */
export function cycleTargetTone(cycle: CycleSummary): TargetTone {
  if (cycle.measured === 0) return "neutral";
  if (cycle.onTarget === cycle.measured) return "success";
  return cycle.onTarget === 0 ? "danger" : "warning";
}

/** KPI card rows: average business days per urgency against its target. */
export function buildCycleBreakdown(
  cycle: CycleSummary,
  colorOf: (priority: BidPriority) => string,
): {
  label: string;
  value: string;
  color: string;
  tone: TargetTone;
  hint: string;
}[] {
  return BID_PRIORITIES.map((p) => {
    const s = cycle.byPriority[p];
    return {
      label: `${p} (${s.count})`,
      value: s.avg === null ? "-" : `${s.avg} bd`,
      color: colorOf(p),
      tone: s.tone,
      hint: `≤ ${s.target}`,
    };
  });
}

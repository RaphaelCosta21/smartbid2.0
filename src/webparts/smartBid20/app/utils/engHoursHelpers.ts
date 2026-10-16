/**
 * engHoursHelpers — engineering-hours demand aggregations for the dashboard
 * (Won = confirmed, pipeline = may come if won, lost = no demand).
 */
import { addMonths, format } from "date-fns";
import { IBid } from "../models";
import { getEngineeringHours } from "./bidHelpers";
import { parseDate } from "./formatters";
import { OPEN_STATUS, PENDING_STATUS } from "./reportHelpers";

export type DemandBucket = "won" | "pipeline" | "lost";

/** Undecided results: their hours become demand only if the BID is won. */
const PIPELINE_RESULTS = [OPEN_STATUS, PENDING_STATUS, "Renegotiation"];

export function getDemandBucket(result: string): DemandBucket {
  if (result === "Won") return "won";
  return PIPELINE_RESULTS.indexOf(result) >= 0 ? "pipeline" : "lost";
}

export type EngHoursTimelineMode = "created" | "operationStart";

export const NO_DATE_KEY = "none";

export interface IEngHoursItem {
  bid: IBid;
  hours: number;
  result: string;
  bucket: DemandBucket;
  /** Win chance 0-1 for pipeline BIDs (null = no history). */
  chance: number | null;
}

export interface IEngHoursMonthRow {
  key: string;
  label: string;
  won: number;
  /** Awaiting a result (Pending / Renegotiation) */
  awaiting: number;
  /** Still in engineering (Open) */
  inEngineering: number;
  /** Won + pipeline weighted by win chance */
  expected: number;
  bidCount: number;
}

export function buildEngHoursItems(
  bids: IBid[],
  getResult: (b: IBid) => string,
  getChance: (b: IBid) => number | null,
): IEngHoursItem[] {
  const out: IEngHoursItem[] = [];
  bids.forEach((bid) => {
    const hours = getEngineeringHours(bid);
    if (hours <= 0) return;
    const result = getResult(bid);
    const bucket = getDemandBucket(result);
    out.push({
      bid,
      hours,
      result,
      bucket,
      chance: bucket === "pipeline" ? getChance(bid) : null,
    });
  });
  return out;
}

function monthKey(raw: string | null | undefined): string | null {
  const d = parseDate(raw);
  return d ? format(d, "yyyy-MM") : null;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  return format(new Date(Number(y), Number(m) - 1, 1), "MMM yy");
}

/** Monthly won / pipeline hours (lost excluded); gaps between months are filled. */
export function buildEngHoursTimeline(
  items: IEngHoursItem[],
  mode: EngHoursTimelineMode,
): IEngHoursMonthRow[] {
  const rows: Record<string, IEngHoursMonthRow> = {};
  const row = (key: string): IEngHoursMonthRow =>
    rows[key] ||
    (rows[key] = {
      key,
      label: key === NO_DATE_KEY ? "No date" : monthLabel(key),
      won: 0,
      awaiting: 0,
      inEngineering: 0,
      expected: 0,
      bidCount: 0,
    });

  items.forEach((it) => {
    if (it.bucket === "lost") return;
    const raw =
      mode === "created"
        ? it.bid.createdDate
        : it.bid.opportunityInfo?.operationStartDate;
    const r = row(monthKey(raw) || NO_DATE_KEY);
    r.bidCount++;
    if (it.bucket === "won") {
      r.won += it.hours;
      r.expected += it.hours;
      return;
    }
    if (it.result === OPEN_STATUS) r.inEngineering += it.hours;
    else r.awaiting += it.hours;
    r.expected += it.hours * (it.chance || 0);
  });

  const months = Object.keys(rows)
    .filter((k) => k !== NO_DATE_KEY)
    .sort();
  if (months.length > 1) {
    const [fy, fm] = months[0].split("-").map(Number);
    const last = months[months.length - 1];
    let cursor = new Date(fy, fm - 1, 1);
    let key = format(cursor, "yyyy-MM");
    while (key < last) {
      row(key);
      cursor = addMonths(cursor, 1);
      key = format(cursor, "yyyy-MM");
    }
  }

  const ordered = Object.keys(rows)
    .filter((k) => k !== NO_DATE_KEY)
    .sort()
    .map((k) => rows[k]);
  if (rows[NO_DATE_KEY]) ordered.push(rows[NO_DATE_KEY]);
  ordered.forEach((r) => {
    r.won = Math.round(r.won);
    r.awaiting = Math.round(r.awaiting);
    r.inEngineering = Math.round(r.inEngineering);
    r.expected = Math.round(r.expected);
  });
  return ordered;
}

export function formatHours(h: number): string {
  return `${Math.round(h).toLocaleString()} h`;
}

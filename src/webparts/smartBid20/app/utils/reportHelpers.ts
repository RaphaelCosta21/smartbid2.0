/**
 * reportHelpers — Config-driven aggregations for the Reports / BID Analytics
 * Panorama. Result status comes from config.bidResultOptions (like Follow Up);
 * "Open" is a synthetic bucket for active (non-terminal) BIDs. Divisions and
 * service lines come from config.
 */
import { IBid } from "../models";

export interface StatusOption {
  value: string;
  label: string;
  color: string;
}

export const OPEN_STATUS = "Open";
export const PENDING_STATUS = "Pending";

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

/** Result status of a BID: its outcome, or Open (active) / Pending (terminal, no outcome). */
export function getResultStatus(bid: IBid, terminalStatuses: string[]): string {
  const outcome = bid.bidResult && bid.bidResult.outcome;
  if (outcome) return outcome;
  const isTerminal = terminalStatuses.indexOf(bid.currentStatus) >= 0;
  return isTerminal ? PENDING_STATUS : OPEN_STATUS;
}

function monthKey(iso: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-");
  return `${MONTHS[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

export interface StatusCount {
  value: string;
  label: string;
  color: string;
  count: number;
}

export function statusCounts(
  bids: IBid[],
  options: StatusOption[],
  terminalStatuses: string[],
): StatusCount[] {
  const counts: { [k: string]: number } = {};
  bids.forEach((b) => {
    const s = getResultStatus(b, terminalStatuses);
    counts[s] = (counts[s] || 0) + 1;
  });
  return options.map((o) => ({
    value: o.value,
    label: o.label,
    color: o.color,
    count: counts[o.value] || 0,
  }));
}

export interface DimensionCount {
  value: string;
  label: string;
  color: string;
  count: number;
}

export function divisionCounts(
  bids: IBid[],
  divisions: StatusOption[],
): DimensionCount[] {
  const counts: { [k: string]: number } = {};
  bids.forEach((b) => {
    counts[b.division] = (counts[b.division] || 0) + 1;
  });
  return divisions
    .map((d) => ({
      value: d.value,
      label: d.label,
      color: d.color,
      count: counts[d.value] || 0,
    }))
    .filter((d) => d.count > 0);
}

export function serviceLineCounts(
  bids: IBid[],
  serviceLines: StatusOption[],
): DimensionCount[] {
  const counts: { [k: string]: number } = {};
  bids.forEach((b) => {
    if (b.serviceLine) counts[b.serviceLine] = (counts[b.serviceLine] || 0) + 1;
  });
  return serviceLines
    .map((s) => ({
      value: s.value,
      label: s.label,
      color: s.color,
      count: counts[s.value] || 0,
    }))
    .filter((s) => s.count > 0);
}

export interface MonthlyStatusRow {
  key: string;
  period: string;
  total: number;
  [status: string]: number | string;
}

export function monthlyStatusStacked(
  bids: IBid[],
  statusValues: string[],
  terminalStatuses: string[],
): MonthlyStatusRow[] {
  const byMonth: { [key: string]: { [status: string]: number } } = {};
  bids.forEach((b) => {
    const k = monthKey(b.createdDate);
    if (!k) return;
    const s = getResultStatus(b, terminalStatuses);
    byMonth[k] = byMonth[k] || {};
    byMonth[k][s] = (byMonth[k][s] || 0) + 1;
  });
  return Object.keys(byMonth)
    .sort()
    .map((k) => {
      const row: MonthlyStatusRow = {
        key: k,
        period: monthLabel(k),
        total: 0,
      };
      let total = 0;
      statusValues.forEach((s) => {
        const c = byMonth[k][s] || 0;
        row[s] = c;
        total += c;
      });
      row.total = total;
      return row;
    });
}

export interface ClientStatusRow {
  client: string;
  total: number;
  [status: string]: number | string;
}

export function statusByClient(
  bids: IBid[],
  topN: number,
  statusValues: string[],
  terminalStatuses: string[],
): ClientStatusRow[] {
  const byClient: { [client: string]: { [status: string]: number } } = {};
  bids.forEach((b) => {
    const client = (b.opportunityInfo && b.opportunityInfo.client) || "—";
    const s = getResultStatus(b, terminalStatuses);
    byClient[client] = byClient[client] || {};
    byClient[client][s] = (byClient[client][s] || 0) + 1;
  });
  return Object.keys(byClient)
    .map((client) => {
      const row: ClientStatusRow = { client, total: 0 };
      let total = 0;
      statusValues.forEach((s) => {
        const c = byClient[client][s] || 0;
        row[s] = c;
        total += c;
      });
      row.total = total;
      return row;
    })
    .sort((a, b) => b.total - a.total)
    .slice(0, topN);
}

export interface ClientWinRate {
  client: string;
  winRate: number;
  won: number;
  decided: number;
  total: number;
}

export function winRateByClient(
  bids: IBid[],
  topN: number,
  order: "desc" | "asc" | "az",
): ClientWinRate[] {
  const byClient: {
    [client: string]: { won: number; lost: number; total: number };
  } = {};
  bids.forEach((b) => {
    const client = (b.opportunityInfo && b.opportunityInfo.client) || "—";
    const rec = (byClient[client] = byClient[client] || {
      won: 0,
      lost: 0,
      total: 0,
    });
    rec.total++;
    const outcome = b.bidResult && b.bidResult.outcome;
    if (outcome === "Won") rec.won++;
    else if (outcome === "Loss") rec.lost++;
  });
  const rows = Object.keys(byClient).map((client) => {
    const r = byClient[client];
    const decided = r.won + r.lost;
    return {
      client,
      won: r.won,
      decided,
      total: r.total,
      winRate: decided > 0 ? Math.round((r.won / decided) * 100) : 0,
    };
  });
  rows.sort((a, b) => {
    if (order === "az") return a.client.localeCompare(b.client);
    if (order === "asc") return a.winRate - b.winRate;
    return b.winRate - a.winRate;
  });
  return rows.slice(0, topN);
}

export interface RequesterRow {
  name: string;
  total: number;
  won: number;
}

export function byCommercialRequester(bids: IBid[]): RequesterRow[] {
  const byReq: { [name: string]: { total: number; won: number } } = {};
  bids.forEach((b) => {
    const name = (b.commercialRequester && b.commercialRequester.name) || "—";
    const rec = (byReq[name] = byReq[name] || { total: 0, won: 0 });
    rec.total++;
    if (b.bidResult && b.bidResult.outcome === "Won") rec.won++;
  });
  return Object.keys(byReq)
    .map((name) => ({ name, total: byReq[name].total, won: byReq[name].won }))
    .sort((a, b) => b.total - a.total);
}

export interface ClientPerfRow {
  client: string;
  total: number;
  won: number;
  lost: number;
  winRate: number;
}

export interface ClientPerformance {
  summary: { total: number; won: number; lostCanceled: number };
  highEffortLowReturn: ClientPerfRow[];
  topPerformers: ClientPerfRow[];
  timeWasters: ClientPerfRow[];
}

export function clientPerformanceByDivision(
  bids: IBid[],
  division: string,
): ClientPerformance {
  const divBids = bids.filter((b) => b.division === division);
  const byClient: {
    [client: string]: {
      total: number;
      won: number;
      lost: number;
      canceled: number;
    };
  } = {};
  divBids.forEach((b) => {
    const client = (b.opportunityInfo && b.opportunityInfo.client) || "—";
    const rec = (byClient[client] = byClient[client] || {
      total: 0,
      won: 0,
      lost: 0,
      canceled: 0,
    });
    rec.total++;
    const outcome = b.bidResult && b.bidResult.outcome;
    if (outcome === "Won") rec.won++;
    else if (outcome === "Loss") rec.lost++;
    else if (outcome === "Client Canceled") rec.canceled++;
  });

  const rows: ClientPerfRow[] = Object.keys(byClient).map((client) => {
    const r = byClient[client];
    const decided = r.won + r.lost;
    return {
      client,
      total: r.total,
      won: r.won,
      lost: r.lost + r.canceled,
      winRate: decided > 0 ? Math.round((r.won / decided) * 100) : 0,
    };
  });

  const summary = rows.reduce(
    (acc, r) => {
      acc.total += r.total;
      acc.won += r.won;
      acc.lostCanceled += r.lost;
      return acc;
    },
    { total: 0, won: 0, lostCanceled: 0 },
  );

  const highEffortLowReturn = rows
    .filter((r) => r.total >= 3 && r.winRate <= 25)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const topPerformers = rows
    .filter((r) => r.won > 0)
    .sort((a, b) => b.won - a.won || b.winRate - a.winRate)
    .slice(0, 5);

  const timeWasters = rows
    .filter((r) => r.won === 0 && r.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return { summary, highEffortLowReturn, topPerformers, timeWasters };
}

export interface BidTableRow {
  bidNumber: string;
  title: string;
  requester: string;
  crm: string;
  client: string;
  status: string;
  justificative: string;
  division: string;
  businessLine: string;
  created: string;
  assignedTo: string;
}

export function bidTableRows(
  bids: IBid[],
  terminalStatuses: string[],
): BidTableRow[] {
  return bids.map((b) => ({
    bidNumber: b.bidNumber,
    title: (b.opportunityInfo && b.opportunityInfo.projectName) || "—",
    requester: (b.commercialRequester && b.commercialRequester.name) || "—",
    crm: b.crmNumber || "—",
    client: (b.opportunityInfo && b.opportunityInfo.client) || "—",
    status: getResultStatus(b, terminalStatuses),
    justificative:
      (b.bidResult && (b.bidResult.lostReason || b.bidResult.feedbackNotes)) ||
      "",
    division: b.division,
    businessLine: b.serviceLine || "—",
    created: b.createdDate || "",
    assignedTo:
      (b.engineerResponsible &&
        b.engineerResponsible[0] &&
        b.engineerResponsible[0].name) ||
      "—",
  }));
}

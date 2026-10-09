/**
 * bidPresentation — pure logic behind the BID Presentation page.
 * Every figure comes from the same canonical cost breakdown the Assets Breakdown tab uses,
 * so the presentation can never disagree with the numbers the team edits.
 */
import { IAssetBreakdownItem, IBid, IScopeItem } from "../models";
import {
  getAssetCostBreakdown,
  IContingencyOpts,
  isNoCostAvailability,
  isWorkshopAcq,
} from "./costCalculations";

// ─── Text helpers ───

const INVALID_PNS = ["", "—", "-", "n/a", "na", "tbd", "tbc", "none", "nan"];

export function normalizeText(v?: string | null): string {
  return (v || "").trim().toLowerCase().replace(/\s+/g, " ");
}

/** A part number that actually identifies equipment (not a TBD/TBC placeholder) */
export function isValidPn(pn?: string | null): boolean {
  return INVALID_PNS.indexOf(normalizeText(pn)) === -1;
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ─── Acquisition labels ───

/** How the item is being supplied: availability first, acquisition type as a fallback */
export function acquisitionLabel(a: IAssetBreakdownItem): string {
  const avail = (a.availabilityStatus || "").trim();
  if (avail) return avail;
  const acq = (a.acquisitionType || "").trim();
  return acq && acq !== "N/A" ? acq : "Unspecified";
}

/** Theme token for an acquisition label, so the same mode always has the same color */
export function acquisitionToken(label: string): string {
  const n = normalizeText(label);
  if (n.indexOf("in house") !== -1 || n.indexOf("in-house") !== -1) {
    return "var(--success)";
  }
  if (n.indexOf("onboard") !== -1) return "var(--tertiary-accent)";
  if (n.indexOf("purchase") !== -1) return "var(--primary-accent)";
  if (n.indexOf("rental") !== -1) return "var(--info)";
  if (n.indexOf("workshop") !== -1) return "var(--warning)";
  if (n.indexOf("not available") !== -1 || n.indexOf("not offered") !== -1) {
    return "var(--danger)";
  }
  return "var(--text-muted)";
}

/** Items that legitimately carry no equipment cost (in house, onboard, workshop…) */
function isCostExempt(a: IAssetBreakdownItem): boolean {
  const avail = normalizeText(a.availabilityStatus);
  return (
    isNoCostAvailability(a.availabilityStatus) ||
    avail === "in house" ||
    isWorkshopAcq(a.acquisitionType) ||
    normalizeText(a.acquisitionType) === "in house"
  );
}

// ─── Items ───

export function getBidContingency(bid: IBid): IContingencyOpts | undefined {
  const perYear = bid.assetsContingencyPerYear || 0;
  return perYear > 0 ? { perYear, applied: true } : undefined;
}

export interface IPresentationItem {
  key: string;
  assetId: string;
  lineNumber: number;
  description: string;
  partNumber: string;
  hasPn: boolean;
  /** Resource type — the Pareto category */
  category: string;
  acquisition: string;
  asset: IAssetBreakdownItem;
  scopeItem: IScopeItem;
  totalUSD: number;
  /** The equipment's own cost (splits included) */
  ownUSD: number;
  feesUSD: number;
  subItemsUSD: number;
  pcfUSD: number;
  capexUSD: number;
  opexUSD: number;
  uncategorizedUSD: number;
  /** True when it should have a price but doesn't */
  missingCost: boolean;
}

export function buildPresentationItems(bid: IBid): IPresentationItem[] {
  const cont = getBidContingency(bid);
  const scopeById = new Map<string, IScopeItem>();
  const lineById: Record<string, number> = {};
  (bid.scopeItems || [])
    .filter((s) => !s.isSection)
    .forEach((s, i) => {
      scopeById.set(s.id, s);
      lineById[s.id] = i + 1;
    });

  const items: IPresentationItem[] = [];
  (bid.assetBreakdown || []).forEach((asset) => {
    const si = scopeById.get(asset.scopeItemId);
    if (!si) return;
    const bd = getAssetCostBreakdown(asset, si, cont);
    items.push({
      key: asset.id,
      assetId: asset.id,
      lineNumber: lineById[si.id],
      description: si.equipmentOffer || si.description || "",
      partNumber: si.partNumber || "",
      hasPn: isValidPn(si.partNumber),
      category: si.resourceType || "Other",
      acquisition: acquisitionLabel(asset),
      asset,
      scopeItem: si,
      totalUSD: bd.total,
      ownUSD: bd.splits.length > 0 ? bd.splitsTotal : bd.main.base,
      feesUSD: bd.main.fees,
      subItemsUSD: bd.subItemsTotal,
      pcfUSD: asset.costFromPCF ? bd.pcfTotal : 0,
      capexUSD: bd.capex,
      opexUSD: bd.opex,
      uncategorizedUSD: bd.uncategorized,
      missingCost: bd.total <= 0 && !isCostExempt(asset),
    });
  });
  return items;
}

/** Priced items, most expensive first — the cards and the Pareto */
export function rankItems(items: IPresentationItem[]): IPresentationItem[] {
  return items
    .filter((i) => i.totalUSD > 0)
    .sort((a, b) => b.totalUSD - a.totalUSD);
}

export interface IPresentationStats {
  totalUSD: number;
  capexUSD: number;
  opexUSD: number;
  uncategorizedUSD: number;
  itemCount: number;
  pricedCount: number;
  withoutPn: number;
  withoutCost: number;
  /** % of items that have a real PN and a price (or are priced-exempt) */
  readiness: number;
}

export function computeStats(items: IPresentationItem[]): IPresentationStats {
  let capex = 0;
  let opex = 0;
  let uncategorized = 0;
  let priced = 0;
  let withoutPn = 0;
  let withoutCost = 0;
  let ready = 0;
  items.forEach((i) => {
    capex += i.capexUSD;
    opex += i.opexUSD;
    uncategorized += i.uncategorizedUSD;
    if (i.totalUSD > 0) priced += 1;
    if (!i.hasPn) withoutPn += 1;
    if (i.missingCost) withoutCost += 1;
    if (i.hasPn && !i.missingCost) ready += 1;
  });
  return {
    totalUSD: capex + opex + uncategorized,
    capexUSD: capex,
    opexUSD: opex,
    uncategorizedUSD: uncategorized,
    itemCount: items.length,
    pricedCount: priced,
    withoutPn,
    withoutCost,
    readiness: items.length ? Math.round((ready / items.length) * 100) : 0,
  };
}

// ─── Pareto ───

export interface IParetoRow {
  key: string;
  label: string;
  /** Value in the display currency */
  value: number;
  /** Cumulative share 0–100 */
  pct: number;
  rank: number;
}

/** `ranked` is already sorted; ranks stay aligned with the cards even when rows are filtered out */
export function buildParetoRows(
  ranked: IPresentationItem[],
  minValue: number,
  rate: number,
): IParetoRow[] {
  const base = ranked
    .map((it, index) => ({
      key: it.key,
      label: it.description || it.partNumber || "(no description)",
      value: it.totalUSD * rate,
      rank: index + 1,
    }))
    .filter((r) => r.value >= minValue && r.value > 0);
  const grand = base.reduce((s, r) => s + r.value, 0);
  let cum = 0;
  return base.map((r) => {
    cum += r.value;
    return { ...r, pct: grand > 0 ? (cum / grand) * 100 : 0 };
  });
}

// ─── Cost composition / acquisition mix ───

export interface IAcquisitionGroup {
  label: string;
  count: number;
  /** Share of items 0–100 */
  pct: number;
  valueUSD: number;
  items: IPresentationItem[];
}

export function groupByAcquisition(
  items: IPresentationItem[],
): IAcquisitionGroup[] {
  const map = new Map<string, IPresentationItem[]>();
  items.forEach((i) => {
    const list = map.get(i.acquisition);
    if (list) list.push(i);
    else map.set(i.acquisition, [i]);
  });
  const groups: IAcquisitionGroup[] = [];
  map.forEach((list, label) => {
    groups.push({
      label,
      count: list.length,
      pct: items.length ? (list.length / items.length) * 100 : 0,
      valueUSD: list.reduce((s, i) => s + i.totalUSD, 0),
      items: list,
    });
  });
  return groups.sort((a, b) => b.count - a.count);
}

// ─── Hours ───

export interface IHoursByPhase {
  phase: string;
  hours: number;
}

export function buildHoursByPhase(bid: IBid): {
  rows: IHoursByPhase[];
  totalHours: number;
  roles: number;
} {
  const byPhase: Record<string, number> = {};
  const roles: Record<string, boolean> = {};
  const hs = bid.hoursSummary;
  const sources = hs
    ? [
        (hs.onshoreHours && hs.onshoreHours.items) || [],
        (hs.offshoreHours && hs.offshoreHours.items) || [],
      ]
    : [];
  sources.forEach((list) =>
    list.forEach((it) => {
      if (it.isSeparator || !(it.totalHours > 0)) return;
      const phase = it.phase || "(no phase)";
      byPhase[phase] = (byPhase[phase] || 0) + it.totalHours;
      if (it.function) roles[it.function] = true;
    }),
  );
  const rows = Object.keys(byPhase)
    .map((phase) => ({ phase, hours: byPhase[phase] }))
    .sort((a, b) => b.hours - a.hours);
  return {
    rows,
    totalHours: rows.reduce((s, r) => s + r.hours, 0),
    roles: Object.keys(roles).length,
  };
}

// ─── Cross-BID history ───

export interface IHistoryEntry {
  bidNumber: string;
  project: string;
  acquisition: string;
  totalUSD: number;
  /** The equipment's own cost (splits included) */
  ownUSD: number;
  /** Services & fees, sub-items and PCF on top of the equipment */
  extrasUSD: number;
  description: string;
  partNumber: string;
  etText: string;
  category: string;
  pnKey: string;
  etKey: string;
  descKey: string;
  bigrams: Map<string, number>;
  bigramCount: number;
}

export interface IHistoryIndex {
  entries: IHistoryEntry[];
  byPn: Map<string, IHistoryEntry[]>;
  byEt: Map<string, IHistoryEntry[]>;
}

export interface IHistoryRecord {
  bidNumber: string;
  project: string;
  acquisition: string;
  totalUSD: number;
  ownUSD: number;
  extrasUSD: number;
  description: string;
}

/** What to look for in the other BIDs */
export interface IHistoryQuery {
  /** Normalized client requirement text; wins over the part number when present */
  etKey: string;
  /** Normalized part number; empty when the item has none */
  pnKey: string;
  description: string;
}

export interface IAcquisitionStat {
  label: string;
  count: number;
  /** Share of the matched occurrences 0–100 */
  pct: number;
}

export interface IItemHistory {
  /** Other BIDs that offered the same item */
  records: IHistoryRecord[];
  /** How the item was offered across all BIDs, current one included */
  acquisition: IAcquisitionStat[];
}

const DESCRIPTION_THRESHOLD = 0.65;

function bigramsOf(s: string): Map<string, number> {
  const m = new Map<string, number>();
  for (let i = 0; i < s.length - 1; i++) {
    const bg = s.substr(i, 2);
    m.set(bg, (m.get(bg) || 0) + 1);
  }
  return m;
}

function pushTo(
  map: Map<string, IHistoryEntry[]>,
  key: string,
  entry: IHistoryEntry,
): void {
  const list = map.get(key);
  if (list) list.push(entry);
  else map.set(key, [entry]);
}

/** Indexes every priced-or-not asset of every BID once, so each card's lookup is cheap */
export function buildHistoryIndex(bids: IBid[]): IHistoryIndex {
  const entries: IHistoryEntry[] = [];
  const byPn = new Map<string, IHistoryEntry[]>();
  const byEt = new Map<string, IHistoryEntry[]>();

  bids.forEach((bid) => {
    const cont = getBidContingency(bid);
    const scopeById = new Map<string, IScopeItem>();
    (bid.scopeItems || []).forEach((s) => scopeById.set(s.id, s));
    const project =
      (bid.opportunityInfo && bid.opportunityInfo.projectName) || "";
    (bid.assetBreakdown || []).forEach((asset) => {
      const si = scopeById.get(asset.scopeItemId);
      if (!si || si.isSection) return;
      const descKey = normalizeText(si.equipmentOffer || si.description);
      const bd = getAssetCostBreakdown(asset, si, cont);
      const ownUSD = bd.splits.length > 0 ? bd.splitsTotal : bd.main.base;
      const entry: IHistoryEntry = {
        bidNumber: bid.bidNumber,
        project,
        acquisition: acquisitionLabel(asset),
        totalUSD: bd.total,
        ownUSD,
        extrasUSD: Math.max(bd.total - ownUSD, 0),
        description: si.equipmentOffer || si.description || "",
        partNumber: si.partNumber || "",
        etText: (si.clientRequirement || "").trim(),
        category: si.resourceType || "Other",
        pnKey: isValidPn(si.partNumber) ? normalizeText(si.partNumber) : "",
        etKey: normalizeText(si.clientRequirement),
        descKey,
        bigrams: bigramsOf(descKey),
        bigramCount: Math.max(descKey.length - 1, 0),
      };
      entries.push(entry);
      if (entry.etKey) pushTo(byEt, entry.etKey, entry);
      if (entry.pnKey) pushTo(byPn, entry.pnKey, entry);
    });
  });
  return { entries, byPn, byEt };
}

function describeScore(
  queryKey: string,
  queryBigrams: Map<string, number>,
  queryBigramCount: number,
  entry: IHistoryEntry,
): number {
  if (!queryKey || !entry.descKey) return 0;
  if (queryKey === entry.descKey) return 1;
  if (queryBigramCount === 0 || entry.bigramCount === 0) return 0;
  let shared = 0;
  queryBigrams.forEach((count, bg) => {
    const other = entry.bigrams.get(bg);
    if (other) shared += Math.min(count, other);
  });
  let score = (2 * shared) / (queryBigramCount + entry.bigramCount);
  // The whole-word boost can add at most 0.3, so weak matches can skip the regex work
  if (score < DESCRIPTION_THRESHOLD - 0.3) return score;
  const words = queryKey.split(" ").filter((w) => w.length > 2);
  if (words.length > 0) {
    const hits = words.filter((w) =>
      new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(
        entry.descKey,
      ),
    ).length;
    score = Math.min(score + (hits / words.length) * 0.3, 1);
  }
  return score;
}

/**
 * Finds the same requirement in other BIDs: by the client requirement text first, then by
 * part number, and by description similarity when the item has neither.
 */
export function getItemHistory(
  index: IHistoryIndex,
  item: IPresentationItem,
  currentBidNumber: string,
): IItemHistory {
  return getHistoryForQuery(
    index,
    {
      etKey: normalizeText(item.scopeItem.clientRequirement),
      pnKey: item.hasPn ? normalizeText(item.partNumber) : "",
      description: item.description,
    },
    currentBidNumber,
  );
}

/** Same lookup for a plain query — what an item search across all BIDs needs */
export function getHistoryForQuery(
  index: IHistoryIndex,
  query: IHistoryQuery,
  currentBidNumber: string,
): IItemHistory {
  const { etKey, pnKey } = query;
  const matched: IHistoryEntry[] = [];

  if (etKey && index.byEt.has(etKey)) {
    matched.push(...(index.byEt.get(etKey) as IHistoryEntry[]));
  } else if (pnKey && index.byPn.has(pnKey)) {
    matched.push(...(index.byPn.get(pnKey) as IHistoryEntry[]));
  } else if (!etKey && !pnKey) {
    // One best match per BID keeps weak, ambiguous matches from inflating the stats
    const queryKey = normalizeText(query.description);
    const queryBigrams = bigramsOf(queryKey);
    const queryCount = Math.max(queryKey.length - 1, 0);
    const best = new Map<string, { score: number; entry: IHistoryEntry }>();
    index.entries.forEach((entry) => {
      const score = describeScore(queryKey, queryBigrams, queryCount, entry);
      if (score < DESCRIPTION_THRESHOLD) return;
      const prev = best.get(entry.bidNumber);
      if (!prev || score > prev.score)
        best.set(entry.bidNumber, { score, entry });
    });
    best.forEach((b) => matched.push(b.entry));
  }

  const records: IHistoryRecord[] = matched
    .filter((e) => e.bidNumber !== currentBidNumber)
    .map((e) => ({
      bidNumber: e.bidNumber,
      project: e.project,
      acquisition: e.acquisition,
      totalUSD: e.totalUSD,
      ownUSD: e.ownUSD,
      extrasUSD: e.extrasUSD,
      description: e.description,
    }));

  // Each acquisition mode counts once per BID, so a BID offering both shows both
  const seen: Record<string, boolean> = {};
  const counts: Record<string, number> = {};
  let total = 0;
  matched.forEach((e) => {
    const k = `${e.bidNumber}|${normalizeText(e.acquisition)}`;
    if (seen[k]) return;
    seen[k] = true;
    counts[e.acquisition] = (counts[e.acquisition] || 0) + 1;
    total += 1;
  });
  const acquisition = Object.keys(counts)
    .map((label) => ({
      label,
      count: counts[label],
      pct: total ? (counts[label] / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return { records, acquisition };
}

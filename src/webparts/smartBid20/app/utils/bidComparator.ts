/**
 * bidComparator — pure logic behind the Bid Comparator.
 * Compares the items of one BID against one or more earlier BIDs, using the same cost
 * breakdown as the Assets Breakdown tab. Items are paired by part number first, then by
 * description similarity; prices are compared per unit, in USD.
 */
import { IBid } from "../models";
import { COMPARATOR_CONFIG } from "../config/comparator.config";
import {
  buildPresentationItems,
  median,
  normalizeText,
} from "./bidPresentation";
import { similarityAtLeast, tokenSortKey } from "./textSimilarity";

// ─── Types ───

/** One item of a BID, reduced to what the comparison needs */
export interface IComparableLine {
  bidNumber: string;
  description: string;
  partNumber: string;
  category: string;
  acquisition: string;
  qty: number;
  totalUSD: number;
  /** Cost of one unit: the item's total over its quantity */
  unitUSD: number;
  /** Normalized part number; empty when the item has none */
  pnKey: string;
  descKey: string;
}

export interface IMatchedLine {
  key: string;
  description: string;
  historicalDescription: string;
  partNumber: string;
  category: string;
  acquisitionNew: string;
  acquisitionHist: string;
  qtyNew: number;
  qtyHist: number;
  unitNewUSD: number;
  unitHistUSD: number;
  deltaUSD: number;
  /** Percent change against history; 0 when either side carries no price */
  deltaPct: number;
  /** False when one side has no price (in house, onboard…), so a % would mislead */
  comparable: boolean;
  histBids: string[];
  matchMethod: "pn" | "fuzzy";
  /** 0–1 */
  similarity: number;
}

export interface INewLine {
  key: string;
  description: string;
  partNumber: string;
  category: string;
  acquisition: string;
  qty: number;
  unitUSD: number;
  totalUSD: number;
}

export interface IMissingLine extends INewLine {
  /** Earlier BIDs that had it */
  histBids: string[];
}

export interface IBidTotal {
  bidNumber: string;
  totalUSD: number;
}

export interface IComparisonResult {
  newBid: string;
  histBids: string[];
  matched: IMatchedLine[];
  newItems: INewLine[];
  missing: IMissingLine[];
  totalNewUSD: number;
  /** Average of the selected BIDs' totals */
  totalHistUSD: number;
  /** Percent; null without a historical baseline */
  variancePct: number | null;
  histTotals: IBidTotal[];
}

export interface IComparisonInsights {
  increased: IMatchedLine[];
  decreased: IMatchedLine[];
  modelChanges: IMatchedLine[];
  newItemsUSD: number;
  missingUSD: number;
}

// ─── Lines ───

export function toComparableLines(bid: IBid): IComparableLine[] {
  return buildPresentationItems(bid).map((item) => {
    const si = item.scopeItem;
    const qty = (si.qtyOperational || 0) + (si.qtySpare || 0) || 1;
    return {
      bidNumber: bid.bidNumber,
      description: item.description,
      partNumber: item.partNumber,
      category: item.category,
      acquisition: item.acquisition,
      qty,
      totalUSD: item.totalUSD,
      unitUSD: item.totalUSD / qty,
      pnKey: item.hasPn ? normalizeText(item.partNumber) : "",
      descKey: tokenSortKey(item.description),
    };
  });
}

// ─── Matching ───

interface IPair {
  newIdx: number;
  histIdx: number;
  score: number;
  method: "pn" | "fuzzy";
}

/** One-to-one pairing within a single historical BID: part number first, then similarity */
function matchLines(
  newLines: IComparableLine[],
  histLines: IComparableLine[],
  threshold: number,
): IPair[] {
  const pairs: IPair[] = [];
  const newUsed: boolean[] = [];
  const histUsed: boolean[] = [];

  const byPn = new Map<string, number[]>();
  histLines.forEach((h, j) => {
    if (!h.pnKey) return;
    const list = byPn.get(h.pnKey);
    if (list) list.push(j);
    else byPn.set(h.pnKey, [j]);
  });
  newLines.forEach((n, i) => {
    const list = n.pnKey ? byPn.get(n.pnKey) : undefined;
    const j = list ? list.shift() : undefined;
    if (j === undefined) return;
    newUsed[i] = true;
    histUsed[j] = true;
    pairs.push({ newIdx: i, histIdx: j, score: 1, method: "pn" });
  });

  // Best similarities are assigned first, so the result doesn't depend on item order
  const candidates: IPair[] = [];
  newLines.forEach((n, i) => {
    if (newUsed[i] || !n.descKey) return;
    histLines.forEach((h, j) => {
      if (histUsed[j] || !h.descKey) return;
      const score = similarityAtLeast(n.descKey, h.descKey, threshold);
      if (score > 0) {
        candidates.push({ newIdx: i, histIdx: j, score, method: "fuzzy" });
      }
    });
  });
  candidates.sort(
    (a, b) => b.score - a.score || a.newIdx - b.newIdx || a.histIdx - b.histIdx,
  );
  candidates.forEach((c) => {
    if (newUsed[c.newIdx] || histUsed[c.histIdx]) return;
    newUsed[c.newIdx] = true;
    histUsed[c.histIdx] = true;
    pairs.push(c);
  });
  return pairs;
}

interface IHistMatch {
  line: IComparableLine;
  score: number;
  method: "pn" | "fuzzy";
}

function sumTotals(lines: IComparableLine[]): number {
  return lines.reduce((s, l) => s + l.totalUSD, 0);
}

export function compareBids(
  newBid: IBid,
  histBids: IBid[],
  thresholdPct: number,
): IComparisonResult {
  const threshold = thresholdPct / 100;
  const newLines = toComparableLines(newBid);
  const matchesByNew: IHistMatch[][] = newLines.map(() => []);
  const unmatchedHist: IComparableLine[] = [];
  const histTotals: IBidTotal[] = [];

  histBids.forEach((hist) => {
    const histLines = toComparableLines(hist);
    histTotals.push({
      bidNumber: hist.bidNumber,
      totalUSD: sumTotals(histLines),
    });
    const used: boolean[] = [];
    matchLines(newLines, histLines, threshold).forEach((p) => {
      used[p.histIdx] = true;
      matchesByNew[p.newIdx].push({
        line: histLines[p.histIdx],
        score: p.score,
        method: p.method,
      });
    });
    histLines.forEach((l, j) => {
      if (!used[j]) unmatchedHist.push(l);
    });
  });

  const matched: IMatchedLine[] = [];
  const newItems: INewLine[] = [];
  newLines.forEach((n, i) => {
    const found = matchesByNew[i];
    const key = `${i}`;
    if (found.length === 0) {
      newItems.push({
        key,
        description: n.description,
        partNumber: n.partNumber,
        category: n.category,
        acquisition: n.acquisition,
        qty: n.qty,
        unitUSD: n.unitUSD,
        totalUSD: n.totalUSD,
      });
      return;
    }
    const best = found.slice().sort((a, b) => b.score - a.score)[0];
    // Several earlier BIDs: the median keeps one outlier quote from setting the baseline
    const unitHist =
      median(found.map((f) => f.line.unitUSD).filter((v) => v > 0)) || 0;
    const comparable = n.unitUSD > 0 && unitHist > 0;
    matched.push({
      key,
      description: n.description,
      historicalDescription: best.line.description,
      partNumber: n.partNumber,
      category: n.category,
      acquisitionNew: n.acquisition,
      acquisitionHist: best.line.acquisition,
      qtyNew: n.qty,
      qtyHist: best.line.qty,
      unitNewUSD: n.unitUSD,
      unitHistUSD: unitHist,
      deltaUSD: n.unitUSD - unitHist,
      deltaPct: comparable ? ((n.unitUSD - unitHist) / unitHist) * 100 : 0,
      comparable,
      histBids: found.map((f) => f.line.bidNumber),
      matchMethod: found.some((f) => f.method === "pn") ? "pn" : "fuzzy",
      similarity: best.score,
    });
  });

  // The same removed item in several earlier BIDs is one row
  const missingGroups = new Map<string, IComparableLine[]>();
  unmatchedHist.forEach((l) => {
    const k = l.pnKey ? `pn:${l.pnKey}` : `d:${l.descKey}`;
    const list = missingGroups.get(k);
    if (list) list.push(l);
    else missingGroups.set(k, [l]);
  });
  const missing: IMissingLine[] = [];
  missingGroups.forEach((lines, k) => {
    const first = lines[0];
    const unit = median(lines.map((l) => l.unitUSD)) || 0;
    const total = median(lines.map((l) => l.totalUSD)) || 0;
    missing.push({
      key: k,
      description: first.description,
      partNumber: first.partNumber,
      category: first.category,
      acquisition: first.acquisition,
      qty: first.qty,
      unitUSD: unit,
      totalUSD: total,
      histBids: lines.map((l) => l.bidNumber),
    });
  });

  newItems.sort((a, b) => b.totalUSD - a.totalUSD);
  missing.sort((a, b) => b.totalUSD - a.totalUSD);

  const totalNewUSD = sumTotals(newLines);
  const totalHistUSD = histTotals.length
    ? histTotals.reduce((s, t) => s + t.totalUSD, 0) / histTotals.length
    : 0;
  return {
    newBid: newBid.bidNumber,
    histBids: histBids.map((b) => b.bidNumber),
    matched,
    newItems,
    missing,
    totalNewUSD,
    totalHistUSD,
    variancePct:
      totalHistUSD > 0
        ? ((totalNewUSD - totalHistUSD) / totalHistUSD) * 100
        : null,
    histTotals,
  };
}

// ─── Reading the result ───

const UNSPECIFIED = "unspecified";

/** The item is now supplied in a different way (purchase → rental, in house → purchase…) */
export function hasModelChange(m: IMatchedLine): boolean {
  const a = normalizeText(m.acquisitionNew);
  const h = normalizeText(m.acquisitionHist);
  return a !== h && a !== UNSPECIFIED && h !== UNSPECIFIED;
}

/** Money impact of a unit-price change, over the quantity being bid now */
export function priceImpactUSD(m: IMatchedLine): number {
  return m.deltaUSD * m.qtyNew;
}

export function isIncrease(m: IMatchedLine): boolean {
  return m.comparable && m.deltaPct > COMPARATOR_CONFIG.significantChangePct;
}

export function isDecrease(m: IMatchedLine): boolean {
  return m.comparable && m.deltaPct < -COMPARATOR_CONFIG.significantChangePct;
}

export function buildInsights(result: IComparisonResult): IComparisonInsights {
  const byImpact = (a: IMatchedLine, b: IMatchedLine): number =>
    Math.abs(priceImpactUSD(b)) - Math.abs(priceImpactUSD(a));
  return {
    increased: result.matched.filter(isIncrease).sort(byImpact),
    decreased: result.matched.filter(isDecrease).sort(byImpact),
    modelChanges: result.matched.filter(hasModelChange),
    newItemsUSD: result.newItems.reduce((s, n) => s + n.totalUSD, 0),
    missingUSD: result.missing.reduce((s, m) => s + m.totalUSD, 0),
  };
}

// ─── Export ───

export type ComparisonExportRow = Record<string, string | number>;

const money = (usd: number, rate: number): number =>
  Math.round(usd * rate * 100) / 100;

/** One flat row per item — matched, new and removed — in the display currency */
export function buildComparisonExportRows(
  result: IComparisonResult,
  rate: number,
): ComparisonExportRow[] {
  const rows: ComparisonExportRow[] = [];
  result.matched.forEach((m) =>
    rows.push({
      Status: "Matched",
      Description: m.description,
      "Historical description": m.historicalDescription,
      PN: m.partNumber,
      Category: m.category,
      "Qty (historical)": m.qtyHist,
      "Qty (new)": m.qtyNew,
      "Historical unit": money(m.unitHistUSD, rate),
      "New unit": money(m.unitNewUSD, rate),
      Delta: money(m.deltaUSD, rate),
      "Delta %": m.comparable ? Math.round(m.deltaPct * 10) / 10 : "",
      "Acquisition (historical)": m.acquisitionHist,
      "Acquisition (new)": m.acquisitionNew,
      Match:
        m.matchMethod === "pn"
          ? "Part number"
          : `Description ${Math.round(m.similarity * 100)}%`,
      "Historical BIDs": m.histBids.join(", "),
    }),
  );
  result.newItems.forEach((n) =>
    rows.push({
      Status: "New",
      Description: n.description,
      PN: n.partNumber,
      Category: n.category,
      "Qty (new)": n.qty,
      "New unit": money(n.unitUSD, rate),
      "Acquisition (new)": n.acquisition,
    }),
  );
  result.missing.forEach((m) =>
    rows.push({
      Status: "Removed",
      Description: m.description,
      PN: m.partNumber,
      Category: m.category,
      "Qty (historical)": m.qty,
      "Historical unit": money(m.unitUSD, rate),
      "Acquisition (historical)": m.acquisition,
      "Historical BIDs": m.histBids.join(", "),
    }),
  );
  return rows;
}

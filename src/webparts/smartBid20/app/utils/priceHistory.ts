/**
 * priceHistory — pure logic behind the Price History page: ranking the cost of one BID,
 * searching how an item was priced across all BIDs, and the labor effort recorded.
 * Money is USD (the common unit across BIDs); labor cost is BRL, as it is stored.
 */
import { IBid } from "../models";
import { getSubCostAmount, getSubItemNode } from "./costCalculations";
import {
  getBidContingency,
  IHistoryEntry,
  IHistoryIndex,
  IHistoryQuery,
  IPresentationItem,
  median,
  normalizeText,
} from "./bidPresentation";

// ─── BID ranking ───

/** Items without a price that are not expected to have one (in house, onboard, workshop…) */
export function isNoCostItem(item: IPresentationItem): boolean {
  return item.totalUSD <= 0 && !item.missingCost;
}

export interface IRankRow {
  key: string;
  label: string;
  valueUSD: number;
  /** Share of the BID total 0–100 */
  pctOfBid: number;
}

/** The items contributing the most to one cost bucket (CAPEX or OPEX), biggest first */
export function rankByBucket(
  items: IPresentationItem[],
  bucket: "capexUSD" | "opexUSD",
  totalUSD: number,
  limit: number,
): IRankRow[] {
  return items
    .filter((i) => i[bucket] > 0)
    .sort((a, b) => b[bucket] - a[bucket])
    .slice(0, limit)
    .map((i) => ({
      key: i.key,
      label: i.description || i.partNumber || "(no description)",
      valueUSD: i[bucket],
      pctOfBid: totalUSD > 0 ? (i[bucket] / totalUSD) * 100 : 0,
    }));
}

export function rankByCategory(
  items: IPresentationItem[],
  totalUSD: number,
): IRankRow[] {
  const sums = new Map<string, number>();
  items.forEach((i) => {
    if (i.totalUSD > 0)
      sums.set(i.category, (sums.get(i.category) || 0) + i.totalUSD);
  });
  const rows: IRankRow[] = [];
  sums.forEach((value, category) =>
    rows.push({
      key: category,
      label: category,
      valueUSD: value,
      pctOfBid: totalUSD > 0 ? (value / totalUSD) * 100 : 0,
    }),
  );
  return rows.sort((a, b) => b.valueUSD - a.valueUSD);
}

export interface IAccessoryRow {
  key: string;
  /** The item it belongs to */
  parent: string;
  label: string;
  partNumber: string;
  kind: "Services & fees" | "Sub-item" | "PCF";
  valueUSD: number;
}

/** Every priced service, fee, sub-item and PCF line hanging off the given items */
export function buildAccessoryRows(
  bid: IBid,
  items: IPresentationItem[],
): IAccessoryRow[] {
  const cont = getBidContingency(bid);
  const rows: IAccessoryRow[] = [];

  items.forEach((item) => {
    const { asset, scopeItem } = item;
    const parent = item.description || item.partNumber || "(no description)";

    // With availability splits the asset-level fees are not counted, so they are not listed
    if (!asset.availabilitySplits || asset.availabilitySplits.length === 0) {
      (asset.subCosts || []).forEach((sc) => {
        const value = getSubCostAmount(sc, asset.dailyRate || 0);
        if (value > 0) {
          rows.push({
            key: `${item.key}:fee:${sc.id}`,
            parent,
            label: sc.description || "Service / fee",
            partNumber: "",
            kind: "Services & fees",
            valueUSD: value,
          });
        }
      });
    }

    const children = (
      costs: typeof asset.subItemCosts,
      pool: typeof scopeItem.subItems,
      kind: IAccessoryRow["kind"],
    ): void => {
      (costs || []).forEach((sic) => {
        const value = getSubItemNode(sic, scopeItem, cont).total;
        if (value <= 0) return;
        const sub = (pool || []).find((s) => s.id === sic.subItemId);
        rows.push({
          key: `${item.key}:${kind}:${sic.id || sic.subItemId}`,
          parent,
          label: (sub && (sub.equipmentOffer || sub.description)) || "Sub-item",
          partNumber: (sub && sub.partNumber) || "",
          kind,
          valueUSD: value,
        });
      });
    };
    children(asset.subItemCosts, scopeItem.subItems, "Sub-item");
    if (asset.costFromPCF) children(asset.pcfCosts, scopeItem.pcfItems, "PCF");
  });

  return rows.sort((a, b) => b.valueUSD - a.valueUSD);
}

// ─── Item search across every BID ───

export interface IItemGroup {
  key: string;
  /** What the group was consolidated by: part number, client requirement, or description */
  kind: "pn" | "et" | "desc";
  label: string;
  /** The most expensive occurrence — what the card shows as its reference */
  representative: IHistoryEntry;
  occurrences: number;
  bidCount: number;
  /** Different descriptions that were folded into the group */
  aliases: string[];
  medianUSD: number | null;
  query: IHistoryQuery;
}

const MAX_GROUPS = 60;

/**
 * Every item matching all the words typed (in its description, part number or requirement),
 * consolidated so different spellings of the same part or requirement become one result.
 */
export function searchItemGroups(
  index: IHistoryIndex,
  text: string,
  limit: number = MAX_GROUPS,
): IItemGroup[] {
  const words = normalizeText(text).split(" ").filter(Boolean);
  if (words.length === 0) return [];

  interface IBuild {
    group: IItemGroup;
    bids: Record<string, boolean>;
    aliases: Record<string, boolean>;
    totals: number[];
  }
  const builds = new Map<string, IBuild>();

  index.entries.forEach((e) => {
    const haystack = `${e.descKey} ${e.pnKey} ${e.etKey}`;
    if (!words.every((w) => haystack.indexOf(w) !== -1)) return;

    const kind: IItemGroup["kind"] = e.pnKey ? "pn" : e.etKey ? "et" : "desc";
    const key = `${kind}:${e.pnKey || e.etKey || e.descKey}`;
    let b = builds.get(key);
    if (!b) {
      b = {
        group: {
          key,
          kind,
          label: kind === "et" ? e.etText : e.description,
          representative: e,
          occurrences: 0,
          bidCount: 0,
          aliases: [],
          medianUSD: null,
          query: {
            etKey: kind === "et" ? e.etKey : "",
            pnKey: kind === "pn" ? e.pnKey : "",
            description: e.description,
          },
        },
        bids: {},
        aliases: {},
        totals: [],
      };
      builds.set(key, b);
    }
    b.group.occurrences += 1;
    if (e.totalUSD > b.group.representative.totalUSD)
      b.group.representative = e;
    if (e.description) b.aliases[e.description.trim()] = true;
    b.bids[e.bidNumber] = true;
    if (e.totalUSD > 0) b.totals.push(e.totalUSD);
  });

  const groups: IItemGroup[] = [];
  builds.forEach((b) => {
    b.group.bidCount = Object.keys(b.bids).length;
    b.group.aliases = Object.keys(b.aliases);
    b.group.medianUSD = median(b.totals);
    groups.push(b.group);
  });
  return groups
    .sort((a, b) => b.bidCount - a.bidCount || b.occurrences - a.occurrences)
    .slice(0, limit);
}

// ─── Reading an item's history ───

export interface IHistoryStats {
  /** Average full cost (equipment + extras) of the records that carry a price */
  avgFullUSD: number;
  avgEquipmentUSD: number;
  avgExtrasUSD: number;
}

function mean(values: number[]): number {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

export function computeHistoryStats(
  records: Array<{ totalUSD: number; ownUSD: number; extrasUSD: number }>,
): IHistoryStats {
  return {
    avgFullUSD: mean(records.map((r) => r.totalUSD).filter((v) => v > 0)),
    avgEquipmentUSD: mean(records.map((r) => r.ownUSD).filter((v) => v > 0)),
    avgExtrasUSD: mean(records.map((r) => r.extrasUSD)),
  };
}

/** Percent the current cost is above (+) or below (−) the historical average; null without both */
export function divergencePct(
  currentUSD: number,
  avgUSD: number,
): number | null {
  if (!(currentUSD > 0) || !(avgUSD > 0)) return null;
  return ((currentUSD - avgUSD) / avgUSD) * 100;
}

/** Beyond ±10% of the average counts as a real divergence */
export const DIVERGENCE_THRESHOLD_PCT = 10;

// ─── Labor ───

export interface ILaborRow {
  key: string;
  bidNumber: string;
  function: string;
  type: "Onshore" | "Offshore";
  phase: string;
  hoursPerDay: number;
  people: number;
  days: number;
  utilizationPercent: number;
  totalHours: number;
  costBRL: number;
  /** BRL per hour */
  rateBRL: number;
}

/** Every onshore and offshore labor line recorded in the given BIDs */
export function buildLaborRows(bids: IBid[]): ILaborRow[] {
  const rows: ILaborRow[] = [];
  bids.forEach((bid) => {
    const hs = bid.hoursSummary;
    if (!hs) return;
    const sources: Array<["Onshore" | "Offshore", typeof hs.onshoreHours]> = [
      ["Onshore", hs.onshoreHours],
      ["Offshore", hs.offshoreHours],
    ];
    sources.forEach(([type, section]) => {
      ((section && section.items) || []).forEach((it) => {
        if (it.isSeparator || !it.function) return;
        rows.push({
          key: `${bid.bidNumber}:${it.id}`,
          bidNumber: bid.bidNumber,
          function: it.function,
          type,
          phase: it.phase || "",
          hoursPerDay: it.hoursPerDay || 0,
          people: it.pplQty || 0,
          days: it.workDays || 0,
          utilizationPercent: it.utilizationPercent || 0,
          totalHours: it.totalHours || 0,
          costBRL: it.costBRL || 0,
          rateBRL: it.totalHours > 0 ? (it.costBRL || 0) / it.totalHours : 0,
        });
      });
    });
  });
  return rows;
}

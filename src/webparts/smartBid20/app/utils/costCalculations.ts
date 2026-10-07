import {
  IBid,
  ICostSummary,
  IAssetBreakdownItem,
  IScopeItem,
  IScopeSubItem,
  IExchangeRate,
  IExchangeRateSnapshot,
  ISubItemCost,
  IAvailabilitySplit,
  IAssetSubCost,
} from "../models";
import { isEngSolutionsSubType } from "./scopeHelpers";

/** Per-resource-type asset cost breakdown */
export interface IAssetResourceTypeCost {
  resourceType: string;
  capexUSD: number;
  opexUSD: number;
  uncategorizedUSD: number;
  totalUSD: number;
}

/** Discount (%) assumed for a transit rate that doesn't carry one of its own. */
export const TRANSIT_DEFAULT_DISCOUNT = 50;

/** Effective cost bucket. "UNCATEGORIZED" is a real bucket, never silently folded into CAPEX. */
export type CostCategory = "CAPEX" | "OPEX" | "UNCATEGORIZED";

/** One costed node (asset, split, sub-item or PCF entry), with its fees kept separate. */
export interface ICostNode {
  /** Own cost before fees: unit x qty, or daily rate x days x qty */
  base: number;
  /** Sum of this node's own sub-costs (services & fees, transit rates included) */
  fees: number;
  total: number;
  category: CostCategory;
  /** Per-split nodes, when this node's cost is driven by availability splits */
  splits: ICostNode[];
}

/** Full cost picture of one asset row, layer by layer. */
export interface IAssetCostBreakdown {
  /** The asset's own cost. `base` is 0 when splits or a roll-up drive the cost. */
  main: ICostNode;
  splits: ICostNode[];
  subItems: ICostNode[];
  pcf: ICostNode[];
  splitsTotal: number;
  subItemsTotal: number;
  pcfTotal: number;
  /** Asset-level fees left uncounted because the splits own the costs. */
  orphanFees: number;
  capex: number;
  opex: number;
  uncategorized: number;
  total: number;
}

export interface IContingencyOpts {
  perYear: number;
  applied: boolean;
  /** Flat % added to the typed unit cost of Eng. Solutions items (0 = off) */
  engSolutionsPct?: number;
}

/** Contingency settings saved on a BID; undefined when every contingency is off. */
export function getBidContingency(bid: IBid): IContingencyOpts | undefined {
  const perYear = bid.assetsContingencyPerYear || 0;
  const hasEngSolutions = (bid.scopeItems || []).some(
    (s) => !s.isSection && isEngSolutionsSubType(s.resourceSubType),
  );
  const engSolutionsPct = hasEngSolutions
    ? bid.assetsEngSolutionsContingencyPct || 0
    : 0;
  if (perYear <= 0 && engSolutionsPct <= 0) return undefined;
  return { perYear, applied: perYear > 0, engSolutionsPct };
}

const NO_COST_AVAILABILITY = ["onboard", "call out", "not offered"];

const norm = (v?: string): string => (v || "").toLowerCase().trim();

/** Availability statuses that carry no equipment cost (services may still apply). */
export function isNoCostAvailability(status?: string): boolean {
  return NO_COST_AVAILABILITY.indexOf(norm(status)) !== -1;
}

/** Config ships suffixed values such as "Rental (ope)", so match on the prefix. */
export function isRentalAcq(acqType?: string): boolean {
  return norm(acqType).indexOf("rental") === 0;
}

/** Matches both "Workshop" and "Workshop/Refurbishment". */
export function isWorkshopAcq(acqType?: string): boolean {
  return norm(acqType).indexOf("workshop") === 0;
}

/** Age-based contingency %: `perYear` for every calendar year since the date reference. */
export function getAgeContingencyPct(
  dateRef: string | undefined,
  perYear: number,
): number {
  if (!dateRef || perYear <= 0) return 0;
  const refDate = new Date(dateRef);
  if (isNaN(refDate.getTime())) return 0;
  const years = new Date().getFullYear() - refDate.getFullYear();
  return years > 0 ? years * perYear : 0;
}

/** Typed unit cost with its contingencies: historical per-year first, then Eng. Solutions on the corrected price. */
export function applyContingencyToCost(
  unitCost: number,
  dateRef: string | undefined,
  cont: IContingencyOpts | undefined,
  isEngSolutions = false,
): number {
  if (!cont || unitCost <= 0) return unitCost;
  const agePct = cont.applied ? getAgeContingencyPct(dateRef, cont.perYear) : 0;
  const engPct = isEngSolutions ? Math.max(0, cont.engSolutionsPct || 0) : 0;
  return unitCost * (1 + agePct / 100) * (1 + engPct / 100);
}

/**
 * Amount of a single sub-cost. Transit rates are recomputed from the parent's daily rate rather
 * than read from the persisted `costUSD`, so the formula shown and the value summed cannot diverge.
 */
export function getSubCostAmount(
  sc: IAssetSubCost,
  parentDailyRate: number,
): number {
  if (!sc) return 0;
  if (!sc.isTransitRate) return sc.costUSD || 0;
  const days = (sc.importDays || 0) + (sc.exportDays || 0);
  const discount =
    sc.transitDiscount === undefined || sc.transitDiscount === null
      ? TRANSIT_DEFAULT_DISCOUNT
      : sc.transitDiscount;
  return (parentDailyRate || 0) * (1 - discount / 100) * days;
}

/** Sum of a node's services & fees. */
export function getFeesTotal(
  subCosts: IAssetSubCost[] | undefined,
  parentDailyRate: number,
): number {
  return (subCosts || []).reduce(
    (s, sc) => s + getSubCostAmount(sc, parentDailyRate),
    0,
  );
}

/** Determine effective CAPEX/OPEX bucket for any costed entity */
export function getEffectiveCategory(a: {
  acquisitionType?: string;
  costCategory?: string;
}): CostCategory {
  if (isRentalAcq(a.acquisitionType) || isWorkshopAcq(a.acquisitionType)) {
    return "OPEX";
  }
  if (a.costCategory === "CAPEX") return "CAPEX";
  if (a.costCategory === "OPEX") return "OPEX";
  return "UNCATEGORIZED";
}

function makeNode(
  base: number,
  fees: number,
  category: CostCategory,
  splits: ICostNode[],
): ICostNode {
  return { base, fees, total: base + fees, category, splits: splits || [] };
}

/** Add a node's money to the CAPEX/OPEX/uncategorized buckets, split by split when applicable. */
function accumulateNode(
  node: ICostNode,
  add: (c: CostCategory, v: number) => void,
): void {
  if (node.splits.length > 0) {
    node.splits.forEach((sn) => add(sn.category, sn.total));
    if (node.fees) add(node.category, node.fees);
    return;
  }
  add(node.category, node.total);
}

/** Cost node of a single availability split, its own fees included. */
export function getSplitNode(
  split: IAvailabilitySplit,
  cont?: IContingencyOpts,
  isEngSolutions = false,
): ICostNode {
  const fees = getFeesTotal(split.subCosts, split.dailyRate || 0);
  const qty = split.qty || 0;
  let base = 0;
  if (
    isNoCostAvailability(split.availabilityStatus) ||
    isWorkshopAcq(split.acquisitionType)
  ) {
    base = 0;
  } else if (isRentalAcq(split.acquisitionType)) {
    base = (split.dailyRate || 0) * (split.rentalDays || 0) * qty;
  } else {
    base =
      applyContingencyToCost(
        split.unitCostUSD || 0,
        split.dateReference,
        cont,
        isEngSolutions,
      ) * qty;
  }
  return makeNode(base, fees, getEffectiveCategory(split), []);
}

/** Compute the cost of a single availability split entry */
export function getSplitCost(
  split: IAvailabilitySplit,
  cont?: IContingencyOpts,
  isEngSolutions = false,
): number {
  return getSplitNode(split, cont, isEngSolutions).total;
}

/** qty of the scope child (sub-item or PCF item) a cost entry points at */
function resolveChildQty(
  scopeItem: IScopeItem | undefined,
  subItemId: string,
): number {
  if (!scopeItem) return 1;
  const sub =
    (scopeItem.subItems || []).find((s) => s.id === subItemId) ||
    ((scopeItem as any).pcfItems || []).find((s: any) => s.id === subItemId);
  return (sub && sub.qty) || 1;
}

/** Cost node of a single sub-item / PCF entry, its own fees and splits included. */
export function getSubItemNode(
  sic: ISubItemCost,
  scopeItem: IScopeItem | undefined,
  cont?: IContingencyOpts,
  isEngSolutions = false,
): ICostNode {
  const fees = getFeesTotal(sic.subCosts, sic.dailyRate || 0);
  const category = getEffectiveCategory(sic);
  const splits = (sic.availabilitySplits || []).map((sp) =>
    getSplitNode(sp, cont, isEngSolutions),
  );
  if (splits.length > 0) {
    const base = splits.reduce((s, n) => s + n.total, 0);
    return makeNode(base, fees, category, splits);
  }
  if (isNoCostAvailability(sic.availabilityStatus)) {
    return makeNode(0, fees, category, []);
  }
  const qty = resolveChildQty(scopeItem, sic.subItemId);
  const base = isRentalAcq(sic.acquisitionType)
    ? (sic.dailyRate || 0) * (sic.rentalDays || 0) * qty
    : applyContingencyToCost(
        sic.unitCostUSD || 0,
        sic.dateReference,
        cont,
        isEngSolutions,
      ) * qty;
  return makeNode(base, fees, category, []);
}

/** Compute the effective total for a sub-item / PCF cost entry */
export function getSubItemCostTotal(
  sic: ISubItemCost,
  scopeItem: IScopeItem | undefined,
  cont?: IContingencyOpts,
  isEngSolutions = false,
): number {
  return getSubItemNode(sic, scopeItem, cont, isEngSolutions).total;
}

/**
 * Canonical cost breakdown for one asset row. Every total in the app — row cells, section headers,
 * tab cards, Overview and the BID cost summary — must go through this so they cannot disagree.
 */
export function getAssetCostBreakdown(
  asset: IAssetBreakdownItem,
  scopeItem: IScopeItem | undefined,
  cont?: IContingencyOpts,
): IAssetCostBreakdown {
  // Sub-items carry their own sub-types; the item, its splits and its PCF are the Eng. Solutions cost
  const engSol = isEngSolutionsSubType(scopeItem && scopeItem.resourceSubType);
  const splits = (asset.availabilitySplits || []).map((sp) =>
    getSplitNode(sp, cont, engSol),
  );
  const hasSplits = splits.length > 0;
  const subItems = (asset.subItemCosts || []).map((sic) =>
    getSubItemNode(sic, scopeItem, cont),
  );
  const pcf = (asset.pcfCosts || []).map((pc) =>
    getSubItemNode(pc, scopeItem, cont, engSol),
  );

  const assetFees = getFeesTotal(asset.subCosts, asset.dailyRate || 0);
  const category = getEffectiveCategory(asset);
  const isRollup = !!asset.costFromSubItems || !!asset.costFromPCF;

  let main: ICostNode;
  if (hasSplits) {
    // Splits own the asset's costs, so asset-level fees are reported as orphans, not counted.
    main = makeNode(0, 0, category, splits);
  } else if (isRollup) {
    main = makeNode(0, assetFees, category, []);
  } else {
    const qty =
      (scopeItem
        ? (scopeItem.qtyOperational || 0) + (scopeItem.qtySpare || 0)
        : 0) || 1;
    let base = 0;
    if (
      isNoCostAvailability(asset.availabilityStatus) ||
      isWorkshopAcq(asset.acquisitionType)
    ) {
      base = 0;
    } else if (isRentalAcq(asset.acquisitionType)) {
      base = (asset.dailyRate || 0) * (asset.rentalDays || 0) * qty;
    } else {
      base =
        applyContingencyToCost(
          asset.unitCostUSD || 0,
          asset.dateReference,
          cont,
          engSol,
        ) * qty;
    }
    main = makeNode(base, assetFees, category, []);
  }

  const buckets = { CAPEX: 0, OPEX: 0, UNCATEGORIZED: 0 };
  const add = (c: CostCategory, v: number): void => {
    buckets[c] += v;
  };
  accumulateNode(main, add);
  subItems.forEach((n) => accumulateNode(n, add));
  if (asset.costFromPCF) pcf.forEach((n) => accumulateNode(n, add));

  return {
    main,
    splits,
    subItems,
    pcf,
    splitsTotal: splits.reduce((s, n) => s + n.total, 0),
    subItemsTotal: subItems.reduce((s, n) => s + n.total, 0),
    pcfTotal: pcf.reduce((s, n) => s + n.total, 0),
    orphanFees: hasSplits ? assetFees : 0,
    capex: buckets.CAPEX,
    opex: buckets.OPEX,
    uncategorized: buckets.UNCATEGORIZED,
    total: buckets.CAPEX + buckets.OPEX + buckets.UNCATEGORIZED,
  };
}

/** How many Assets Breakdown rows still have no cost mapped. */
export interface IAssetsCostCompleteness {
  itemsMissing: number;
  itemsTotal: number;
  subItemsMissing: number;
  subItemsTotal: number;
  pcfItemsMissing: number;
  pcfItemsTotal: number;
  totalMissing: number;
  totalItems: number;
}

/** Rows that legitimately carry no cost and are left out of the completeness check. */
function isNoCostEntry(e: {
  availabilityStatus?: string;
  acquisitionType?: string;
}): boolean {
  const acq = (e.acquisitionType || "").toLowerCase();
  return (
    isNoCostAvailability(e.availabilityStatus) ||
    acq === "workshop" ||
    acq === "in house"
  );
}

/**
 * Cost-mapping completeness of the Assets Breakdown ("All items have costs mapped").
 * Scope rows without a cost entry count as missing, mirroring the blank rows the tab auto-creates.
 */
export function getAssetsCostCompleteness(
  scopeItems: IScopeItem[],
  assets: IAssetBreakdownItem[],
  cont?: IContingencyOpts,
): IAssetsCostCompleteness {
  const r: IAssetsCostCompleteness = {
    itemsMissing: 0,
    itemsTotal: 0,
    subItemsMissing: 0,
    subItemsTotal: 0,
    pcfItemsMissing: 0,
    pcfItemsTotal: 0,
    totalMissing: 0,
    totalItems: 0,
  };
  const assetByScope = new Map<string, IAssetBreakdownItem>();
  (assets || []).forEach((a) => assetByScope.set(a.scopeItemId, a));

  const countChildren = (
    si: IScopeItem,
    children: IScopeSubItem[],
    costs: ISubItemCost[],
    kind: "sub" | "pcf",
  ): void => {
    const costById = new Map<string, ISubItemCost>();
    costs.forEach((c) => costById.set(c.subItemId, c));
    children.forEach((child) => {
      const c = costById.get(child.id);
      if (c && isNoCostEntry(c)) return;
      const missing = !c || getSubItemNode(c, si, cont).total === 0;
      if (kind === "sub") {
        r.subItemsTotal++;
        if (missing) r.subItemsMissing++;
      } else {
        r.pcfItemsTotal++;
        if (missing) r.pcfItemsMissing++;
      }
    });
  };

  (scopeItems || []).forEach((si) => {
    if (si.isSection) return;
    const a = assetByScope.get(si.id);
    const pcfScope = si.pcfItems || [];
    if (!a) {
      r.itemsTotal++;
      r.itemsMissing++;
    } else {
      // costFromPCF is dropped by the tab once no PCF items remain
      const costFromPCF = !!a.costFromPCF && pcfScope.length > 0;
      if (!isNoCostEntry(a) && !a.costFromSubItems && !costFromPCF) {
        r.itemsTotal++;
        const bd = getAssetCostBreakdown({ ...a, costFromPCF }, si, cont);
        const total = bd.splits.length > 0 ? bd.splitsTotal : bd.main.total;
        if (total === 0) r.itemsMissing++;
      }
    }
    countChildren(si, si.subItems || [], (a && a.subItemCosts) || [], "sub");
    countChildren(si, pcfScope, (a && a.pcfCosts) || [], "pcf");
  });

  r.totalMissing = r.itemsMissing + r.subItemsMissing + r.pcfItemsMissing;
  r.totalItems = r.itemsTotal + r.subItemsTotal + r.pcfItemsTotal;
  return r;
}

/** Calculate assets totals from breakdown array */
export function calculateAssetsTotals(
  assets: IAssetBreakdownItem[],
  ptax: number,
  scopeItems?: IScopeItem[],
  contingency?: IContingencyOpts,
): {
  totalUSD: number;
  capexUSD: number;
  opexUSD: number;
  uncategorizedUSD: number;
  totalBRL: number;
} {
  const scopeMap = new Map<string, IScopeItem>();
  (scopeItems || []).forEach((si) => scopeMap.set(si.id, si));

  let capexUSD = 0;
  let opexUSD = 0;
  let uncategorizedUSD = 0;

  (assets || []).forEach((a) => {
    const bd = getAssetCostBreakdown(
      a,
      scopeMap.get(a.scopeItemId),
      contingency,
    );
    capexUSD += bd.capex;
    opexUSD += bd.opex;
    uncategorizedUSD += bd.uncategorized;
  });

  const totalUSD = capexUSD + opexUSD + uncategorizedUSD;
  return {
    totalUSD,
    capexUSD,
    opexUSD,
    uncategorizedUSD,
    totalBRL: totalUSD * (ptax || 0),
  };
}

/** Calculate assets totals broken down by resource type (via scope item lookup) */
export function calculateAssetsByResourceType(
  assets: IAssetBreakdownItem[],
  scopeItems: IScopeItem[],
  contingency?: IContingencyOpts,
): IAssetResourceTypeCost[] {
  const scopeMap = new Map<string, IScopeItem>();
  (scopeItems || []).forEach((si) => scopeMap.set(si.id, si));

  const byType: Record<
    string,
    { capex: number; opex: number; uncategorized: number }
  > = {};

  (assets || []).forEach((a) => {
    const si = scopeMap.get(a.scopeItemId);
    const rt =
      (si && si.resourceType) ||
      (si && si.integratedDivision
        ? `${si.integratedDivision} Asset`
        : "Other");
    if (!byType[rt]) byType[rt] = { capex: 0, opex: 0, uncategorized: 0 };

    const bd = getAssetCostBreakdown(a, si, contingency);
    byType[rt].capex += bd.capex;
    byType[rt].opex += bd.opex;
    byType[rt].uncategorized += bd.uncategorized;
  });

  const result: IAssetResourceTypeCost[] = [];
  Object.keys(byType).forEach((rt) => {
    const entry = byType[rt];
    result.push({
      resourceType: rt,
      capexUSD: entry.capex,
      opexUSD: entry.opex,
      uncategorizedUSD: entry.uncategorized,
      totalUSD: entry.capex + entry.opex + entry.uncategorized,
    });
  });
  return result;
}

/** Calculate hours totals from hoursSummary sections */
export function calculateHoursTotals(bid: IBid): {
  engineeringBRL: number;
  onshoreBRL: number;
  offshoreBRL: number;
  engineeringHours: number;
  onshoreHours: number;
  offshoreHours: number;
  totalHours: number;
  totalBRL: number;
  totalUSD: number;
} {
  const hs = bid.hoursSummary;
  const engBRL = hs?.engineeringHours?.totalCostBRL || 0;
  const onBRL = hs?.onshoreHours?.totalCostBRL || 0;
  const offBRL = hs?.offshoreHours?.totalCostBRL || 0;
  const engH = hs?.engineeringHours?.totalHours || 0;
  const onH = hs?.onshoreHours?.totalHours || 0;
  const offH = hs?.offshoreHours?.totalHours || 0;
  const totalBRL = engBRL + onBRL + offBRL;
  const ptax = getBidFx(bid).brlRate;
  return {
    engineeringBRL: engBRL,
    onshoreBRL: onBRL,
    offshoreBRL: offBRL,
    engineeringHours: engH,
    onshoreHours: onH,
    offshoreHours: offH,
    totalHours: engH + onH + offH,
    totalBRL,
    totalUSD: ptax > 0 ? totalBRL / ptax : 0,
  };
}

/** Exchange rates registered on a BID (Overview → Exchange Rates). */
export interface IBidFx {
  /** Units of each currency per 1 USD */
  rates: IExchangeRateSnapshot[];
  /** BRL per 1 USD; 0 when no BRL rate is registered */
  brlRate: number;
  capturedDate: string;
}

/** A line item priced in its own currency */
export interface IMultiCurrencyItem {
  totalCost: number;
  originalCurrency: string;
}

export interface IMultiCurrencyTotals {
  totalUSD: number;
  totalBRL: number;
  /** Currencies used by items but without a registered rate (left out of the totals) */
  missingCurrencies: string[];
}

export function getBidFx(bid: IBid): IBidFx {
  const opp = bid?.opportunityInfo;
  const rates = opp?.exchangeRatesSnapshot || [];
  const brl = rates.find((r) => (r.currency || "").toUpperCase() === "BRL");
  return {
    rates,
    brlRate: brl && brl.rate > 0 ? brl.rate : opp?.ptax > 0 ? opp.ptax : 0,
    capturedDate: (rates[0] && rates[0].capturedDate) || opp?.ptaxDate || "",
  };
}

/** Convert an amount to USD with the BID rates; null when the currency has no rate. */
export function toUSDWithBidRates(
  amount: number,
  currency: string,
  fx: IBidFx,
): number | null {
  const cur = (currency || "USD").toUpperCase().trim();
  if (cur === "USD") return amount || 0;
  if (cur === "BRL" && fx.brlRate > 0) return (amount || 0) / fx.brlRate;
  const rate = fx.rates.find((r) => (r.currency || "").toUpperCase() === cur);
  return rate && rate.rate > 0 ? (amount || 0) / rate.rate : null;
}

/** Sum items priced in mixed currencies, converted to USD (and BRL) with the BID rates. */
export function calculateMultiCurrencyTotals(
  items: IMultiCurrencyItem[],
  fx: IBidFx,
): IMultiCurrencyTotals {
  let totalUSD = 0;
  const missingCurrencies: string[] = [];
  (items || []).forEach((i) => {
    const cost = i.totalCost || 0;
    if (!cost) return;
    const usd = toUSDWithBidRates(cost, i.originalCurrency, fx);
    if (usd === null) {
      const cur = (i.originalCurrency || "").toUpperCase();
      if (missingCurrencies.indexOf(cur) < 0) missingCurrencies.push(cur);
      return;
    }
    totalUSD += usd;
  });
  return { totalUSD, totalBRL: totalUSD * fx.brlRate, missingCurrencies };
}

/** Build full ICostSummary from bid data */
export function buildCostSummary(bid: IBid): ICostSummary {
  const fx = getBidFx(bid);
  const ptax = fx.brlRate;
  const assets = calculateAssetsTotals(
    bid.assetBreakdown || [],
    ptax,
    bid.scopeItems || [],
    getBidContingency(bid),
  );
  const hours = calculateHoursTotals(bid);
  const logistics = calculateMultiCurrencyTotals(
    bid.logisticsBreakdown || [],
    fx,
  );
  const certs = calculateMultiCurrencyTotals(
    bid.certificationsBreakdown || [],
    fx,
  );
  const rts = calculateMultiCurrencyTotals(bid.rtsItems || [], fx);
  const mobilization = calculateMultiCurrencyTotals(
    bid.mobilizationItems || [],
    fx,
  );
  const consumables = calculateMultiCurrencyTotals(
    bid.consumableItems || [],
    fx,
  );
  const missingRateCurrencies: string[] = [];
  [logistics, certs, rts, mobilization, consumables].forEach((t) =>
    t.missingCurrencies.forEach((c) => {
      if (missingRateCurrencies.indexOf(c) < 0) missingRateCurrencies.push(c);
    }),
  );

  const totalCostUSD =
    assets.totalUSD +
    hours.totalUSD +
    logistics.totalUSD +
    certs.totalUSD +
    rts.totalUSD +
    mobilization.totalUSD +
    consumables.totalUSD;
  const totalCostBRL =
    assets.totalBRL +
    hours.totalBRL +
    logistics.totalBRL +
    certs.totalBRL +
    rts.totalBRL +
    mobilization.totalBRL +
    consumables.totalBRL;

  return {
    assetsCostUSD: assets.totalUSD,
    assetsCostBRL: assets.totalBRL,
    assetsCapexUSD: assets.capexUSD,
    assetsOpexUSD: assets.opexUSD,
    onshoreHoursCostBRL: hours.onshoreBRL,
    offshoreHoursCostBRL: hours.offshoreBRL,
    engineeringHoursCostBRL: hours.engineeringBRL,
    totalHoursCostBRL: hours.totalBRL,
    totalHoursCostUSD: hours.totalUSD,
    logisticsCostUSD: logistics.totalUSD,
    logisticsCostBRL: logistics.totalBRL,
    certificationsCostUSD: certs.totalUSD,
    certificationsCostBRL: certs.totalBRL,
    rtsCostUSD: rts.totalUSD,
    rtsCostBRL: rts.totalBRL,
    mobilizationCostUSD: mobilization.totalUSD,
    mobilizationCostBRL: mobilization.totalBRL,
    consumablesCostUSD: consumables.totalUSD,
    consumablesCostBRL: consumables.totalBRL,
    totalCostUSD,
    totalCostBRL,
    currency: bid.opportunityInfo?.currency || "USD",
    ptaxUsed: ptax,
    missingRateCurrencies,
    notes: bid.costSummary?.notes || "",
  };
}

/** Drops cost rows whose Scope item (or sub-item / PCF item) no longer exists, as the tabs already hide them. */
export function pruneOrphanCosts<T extends IBid>(bid: T): T {
  const scopeById = new Map<string, IScopeItem>();
  (bid.scopeItems || []).forEach((si) => {
    if (!si.isSection) scopeById.set(si.id, si);
  });

  let assetsChanged = false;
  const assets: IAssetBreakdownItem[] = [];
  (bid.assetBreakdown || []).forEach((a) => {
    const si = scopeById.get(a.scopeItemId);
    if (!si) {
      assetsChanged = true;
      return;
    }
    const subIds = new Set((si.subItems || []).map((s) => s.id));
    const pcfIds = new Set((si.pcfItems || []).map((p) => p.id));
    const subItemCosts = (a.subItemCosts || []).filter((c) =>
      subIds.has(c.subItemId),
    );
    const pcfCosts = (a.pcfCosts || []).filter((c) => pcfIds.has(c.subItemId));
    const subPruned = subItemCosts.length !== (a.subItemCosts || []).length;
    const pcfPruned = pcfCosts.length !== (a.pcfCosts || []).length;
    const dropPcfRollup = !!a.costFromPCF && pcfIds.size === 0;
    if (!subPruned && !pcfPruned && !dropPcfRollup) {
      assets.push(a);
      return;
    }
    assetsChanged = true;
    assets.push({
      ...a,
      ...(subPruned ? { subItemCosts } : {}),
      ...(pcfPruned ? { pcfCosts } : {}),
      ...(dropPcfRollup ? { costFromPCF: false } : {}),
    });
  });

  const certs = bid.certificationsBreakdown || [];
  const keptCerts = certs.filter((c) => {
    if (c.isSection || !c.scopeItemId) return true;
    const si = scopeById.get(c.scopeItemId);
    return !!si && !!si.needsCertification;
  });
  const certsChanged = keptCerts.length !== certs.length;

  if (!assetsChanged && !certsChanged) return bid;
  return {
    ...bid,
    ...(assetsChanged ? { assetBreakdown: assets } : {}),
    ...(certsChanged ? { certificationsBreakdown: keptCerts } : {}),
  };
}

/** The BID without orphaned cost rows and with `costSummary` rebuilt, so the stored JSON stays in sync. */
export function withCostSummary<T extends IBid>(bid: T): T {
  try {
    const pruned = pruneOrphanCosts(bid);
    return { ...pruned, costSummary: buildCostSummary(pruned) };
  } catch {
    return bid;
  }
}

/**
 * Convert an amount from a given currency to USD using exchange rates
 * from SystemConfiguration. Rates are stored as units-per-USD
 * (e.g., BRL rate 5.65 means 5.65 BRL = 1 USD).
 * If currency is already USD or rate not found, returns the original amount.
 */
export function convertToUSD(
  amount: number,
  fromCurrency: string,
  exchangeRates: IExchangeRate[],
): number {
  if (!amount || !fromCurrency) return amount || 0;
  const cur = fromCurrency.toUpperCase().trim();
  if (cur === "USD") return amount;

  const rate = (exchangeRates || []).find(
    (r) => r.currency.toUpperCase() === cur,
  );
  if (rate && rate.rate > 0) {
    return amount / rate.rate;
  }
  // If no rate found, return original (cannot convert)
  return amount;
}

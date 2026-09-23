import {
  IBid,
  ICostSummary,
  IAssetBreakdownItem,
  ILogisticsItem,
  ICertificationItem,
  IRTSItem,
  IMobilizationItem,
  IConsumableItem,
  IScopeItem,
  IExchangeRate,
  ISubItemCost,
  IAvailabilitySplit,
  IAssetSubCost,
} from "../models";

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

/** Apply contingency adjustment to a unit cost based on date reference age */
export function applyContingencyToCost(
  unitCost: number,
  dateRef: string | undefined,
  pctPerYear: number,
): number {
  if (!dateRef || pctPerYear <= 0 || unitCost <= 0) return unitCost;
  const refDate = new Date(dateRef);
  if (isNaN(refDate.getTime())) return unitCost;
  const years = new Date().getFullYear() - refDate.getFullYear();
  if (years <= 0) return unitCost;
  return unitCost * (1 + (years * pctPerYear) / 100);
}

function contAdj(
  cost: number,
  dateRef: string | undefined,
  cont?: IContingencyOpts,
): number {
  if (!cont || !cont.applied || cont.perYear <= 0 || cost <= 0) return cost;
  return applyContingencyToCost(cost, dateRef, cont.perYear);
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
    base = contAdj(split.unitCostUSD || 0, split.dateReference, cont) * qty;
  }
  return makeNode(base, fees, getEffectiveCategory(split), []);
}

/** Compute the cost of a single availability split entry */
export function getSplitCost(
  split: IAvailabilitySplit,
  cont?: IContingencyOpts,
): number {
  return getSplitNode(split, cont).total;
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
): ICostNode {
  const fees = getFeesTotal(sic.subCosts, sic.dailyRate || 0);
  const category = getEffectiveCategory(sic);
  const splits = (sic.availabilitySplits || []).map((sp) =>
    getSplitNode(sp, cont),
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
    : contAdj(sic.unitCostUSD || 0, sic.dateReference, cont) * qty;
  return makeNode(base, fees, category, []);
}

/** Compute the effective total for a sub-item / PCF cost entry */
export function getSubItemCostTotal(
  sic: ISubItemCost,
  scopeItem: IScopeItem | undefined,
  cont?: IContingencyOpts,
): number {
  return getSubItemNode(sic, scopeItem, cont).total;
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
  const splits = (asset.availabilitySplits || []).map((sp) =>
    getSplitNode(sp, cont),
  );
  const hasSplits = splits.length > 0;
  const subItems = (asset.subItemCosts || []).map((sic) =>
    getSubItemNode(sic, scopeItem, cont),
  );
  const pcf = (asset.pcfCosts || []).map((pc) =>
    getSubItemNode(pc, scopeItem, cont),
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
      base = contAdj(asset.unitCostUSD || 0, asset.dateReference, cont) * qty;
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
    totalBRL: totalUSD * (ptax || 1),
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
  const ptax = bid.opportunityInfo?.ptax || 1;
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

/** Calculate logistics totals — items may have different currencies */
export function calculateLogisticsTotals(
  items: ILogisticsItem[],
  ptax: number,
): { totalOriginal: number; totalUSD: number; totalBRL: number } {
  let totalBRL = 0;
  let totalUSD = 0;

  (items || []).forEach((i) => {
    const cost = i.totalCost || 0;
    const cur = (i.originalCurrency || "BRL").toUpperCase();
    if (cur === "USD") {
      totalUSD += cost;
      totalBRL += cost * (ptax || 1);
    } else {
      // Treat as BRL
      totalBRL += cost;
      totalUSD += ptax > 0 ? cost / ptax : 0;
    }
  });

  return { totalOriginal: totalBRL + totalUSD, totalUSD, totalBRL };
}

/** Calculate certifications totals */
export function calculateCertificationsTotals(
  items: ICertificationItem[],
  ptax: number,
): { totalUSD: number; totalBRL: number } {
  let totalUSD = 0;
  let totalBRL = 0;

  (items || []).forEach((i) => {
    const cost = i.totalCost || 0;
    const cur = (i.originalCurrency || "USD").toUpperCase();
    if (cur === "USD") {
      totalUSD += cost;
      totalBRL += cost * (ptax || 1);
    } else {
      totalBRL += cost;
      totalUSD += ptax > 0 ? cost / ptax : 0;
    }
  });

  return { totalUSD, totalBRL };
}

/** Calculate RTS totals */
export function calculateRTSTotals(
  items: IRTSItem[],
  ptax: number,
): { totalUSD: number; totalBRL: number } {
  let totalUSD = 0;
  let totalBRL = 0;
  (items || []).forEach((i) => {
    const cost = i.totalCost || 0;
    const cur = (i.originalCurrency || "USD").toUpperCase();
    if (cur === "USD") {
      totalUSD += cost;
      totalBRL += cost * (ptax || 1);
    } else {
      totalBRL += cost;
      totalUSD += ptax > 0 ? cost / ptax : 0;
    }
  });
  return { totalUSD, totalBRL };
}

/** Calculate Mobilization totals */
export function calculateMobilizationTotals(
  items: IMobilizationItem[],
  ptax: number,
): { totalUSD: number; totalBRL: number } {
  let totalUSD = 0;
  let totalBRL = 0;
  (items || []).forEach((i) => {
    const cost = i.totalCost || 0;
    const cur = (i.originalCurrency || "USD").toUpperCase();
    if (cur === "USD") {
      totalUSD += cost;
      totalBRL += cost * (ptax || 1);
    } else {
      totalBRL += cost;
      totalUSD += ptax > 0 ? cost / ptax : 0;
    }
  });
  return { totalUSD, totalBRL };
}

/** Calculate Consumables totals */
export function calculateConsumablesTotals(
  items: IConsumableItem[],
  ptax: number,
): { totalUSD: number; totalBRL: number } {
  let totalUSD = 0;
  let totalBRL = 0;
  (items || []).forEach((i) => {
    const cost = i.totalCost || 0;
    const cur = (i.originalCurrency || "USD").toUpperCase();
    if (cur === "USD") {
      totalUSD += cost;
      totalBRL += cost * (ptax || 1);
    } else {
      totalBRL += cost;
      totalUSD += ptax > 0 ? cost / ptax : 0;
    }
  });
  return { totalUSD, totalBRL };
}

/** Build full ICostSummary from bid data */
export function buildCostSummary(bid: IBid): ICostSummary {
  const ptax = bid.opportunityInfo?.ptax || 1;
  const contRate = bid.assetsContingencyPerYear || 0;
  const contingency =
    contRate > 0 ? { perYear: contRate, applied: true } : undefined;
  const assets = calculateAssetsTotals(
    bid.assetBreakdown || [],
    ptax,
    bid.scopeItems || [],
    contingency,
  );
  const hours = calculateHoursTotals(bid);
  const logistics = calculateLogisticsTotals(
    bid.logisticsBreakdown || [],
    ptax,
  );
  const certs = calculateCertificationsTotals(
    bid.certificationsBreakdown || [],
    ptax,
  );
  const rts = calculateRTSTotals(bid.rtsItems || [], ptax);
  const mobilization = calculateMobilizationTotals(
    bid.mobilizationItems || [],
    ptax,
  );
  const consumables = calculateConsumablesTotals(
    bid.consumableItems || [],
    ptax,
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
    notes: bid.costSummary?.notes || "",
  };
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

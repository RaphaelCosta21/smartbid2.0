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
} from "../models";

/** Per-resource-type asset cost breakdown */
export interface IAssetResourceTypeCost {
  resourceType: string;
  capexUSD: number;
  opexUSD: number;
  totalUSD: number;
}

/**
 * Compute the effective total for a single asset's main cost (excludes subItemCosts),
 * matching the logic used in AssetsBreakdownTab.getEffectiveTotal.
 */
function getAssetMainCost(
  a: IAssetBreakdownItem,
  scopeItems: IScopeItem[],
): number {
  const si = scopeItems.find((s) => s.id === a.scopeItemId);
  const qty = (si ? (si.qtyOperational || 0) + (si.qtySpare || 0) : 0) || 1;
  const avail = (a.availabilityStatus || "").toLowerCase();
  const acqType = (a.acquisitionType || "").toLowerCase();
  const subCostsSum = (a.subCosts || []).reduce(
    (s, sc) => s + (sc.costUSD || 0),
    0,
  );

  if (avail === "onboard" || avail === "call out" || avail === "not offered") {
    return subCostsSum;
  }
  if (acqType === "workshop") {
    return subCostsSum;
  }
  if (acqType === "rental") {
    return (a.dailyRate || 0) * (a.rentalDays || 0) * qty + subCostsSum;
  }
  return (a.unitCostUSD || 0) * qty + subCostsSum;
}

/** Compute the effective total for a sub-item cost entry */
function getSubItemCostTotal(
  sic: ISubItemCost,
  scopeItem: IScopeItem | undefined,
): number {
  const avail = (sic.availabilityStatus || "").toLowerCase();
  if (avail === "onboard" || avail === "call out" || avail === "not offered")
    return 0;
  const sub = scopeItem
    ? (scopeItem.subItems || []).find((s) => s.id === sic.subItemId)
    : undefined;
  const qty = sub?.qty || 1;
  const isRental = (sic.acquisitionType || "").toLowerCase() === "rental";
  if (isRental) return (sic.dailyRate || 0) * (sic.rentalDays || 0) * qty;
  return (sic.unitCostUSD || 0) * qty;
}

/** Determine effective CAPEX/OPEX category for an asset */
function getEffectiveCategory(a: {
  acquisitionType?: string;
  costCategory?: string;
}): string {
  const acqType = (a.acquisitionType || "").toLowerCase();
  if (acqType === "rental" || acqType === "workshop") return "OPEX";
  return a.costCategory || "CAPEX";
}

/** Calculate assets totals from breakdown array, matching AssetsBreakdownTab logic */
export function calculateAssetsTotals(
  assets: IAssetBreakdownItem[],
  ptax: number,
  scopeItems?: IScopeItem[],
): { totalUSD: number; capexUSD: number; opexUSD: number; totalBRL: number } {
  let capexUSD = 0;
  let opexUSD = 0;
  const items = scopeItems || [];

  (assets || []).forEach((a) => {
    const si = items.find((s) => s.id === a.scopeItemId);
    const mainCost = getAssetMainCost(a, items);
    const cat = getEffectiveCategory(a);

    if (cat === "CAPEX") capexUSD += mainCost;
    else opexUSD += mainCost;

    // Categorize sub-item costs by their own category
    (a.subItemCosts || []).forEach((sic) => {
      const sicCost = getSubItemCostTotal(sic, si);
      const sicCat = getEffectiveCategory(sic);
      if (sicCat === "CAPEX") capexUSD += sicCost;
      else opexUSD += sicCost;
    });
  });

  const totalUSD = capexUSD + opexUSD;
  return { totalUSD, capexUSD, opexUSD, totalBRL: totalUSD * (ptax || 1) };
}

/** Calculate assets totals broken down by resource type (via scope item lookup) */
export function calculateAssetsByResourceType(
  assets: IAssetBreakdownItem[],
  scopeItems: IScopeItem[],
): IAssetResourceTypeCost[] {
  const scopeMap = new Map<string, IScopeItem>();
  (scopeItems || []).forEach((si) => scopeMap.set(si.id, si));
  const items = scopeItems || [];

  const byType: Record<string, { capex: number; opex: number }> = {};

  (assets || []).forEach((a) => {
    const si = scopeMap.get(a.scopeItemId);
    const rt = (si && si.resourceType) || "Other";
    if (!byType[rt]) byType[rt] = { capex: 0, opex: 0 };

    const mainCost = getAssetMainCost(a, items);
    const cat = getEffectiveCategory(a);
    if (cat === "OPEX") byType[rt].opex += mainCost;
    else byType[rt].capex += mainCost;

    // Sub-item costs inherit resource type from parent scope item
    (a.subItemCosts || []).forEach((sic) => {
      const sicCost = getSubItemCostTotal(sic, si);
      const sicCat = getEffectiveCategory(sic);
      if (sicCat === "OPEX") byType[rt].opex += sicCost;
      else byType[rt].capex += sicCost;
    });
  });

  const result: IAssetResourceTypeCost[] = [];
  Object.keys(byType).forEach((rt) => {
    const entry = byType[rt];
    result.push({
      resourceType: rt,
      capexUSD: entry.capex,
      opexUSD: entry.opex,
      totalUSD: entry.capex + entry.opex,
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
  const assets = calculateAssetsTotals(
    bid.assetBreakdown || [],
    ptax,
    bid.scopeItems || [],
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

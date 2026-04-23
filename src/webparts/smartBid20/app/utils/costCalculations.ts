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
} from "../models";

/** Per-resource-type asset cost breakdown */
export interface IAssetResourceTypeCost {
  resourceType: string;
  capexUSD: number;
  opexUSD: number;
  totalUSD: number;
}

/** Calculate assets totals from breakdown array */
export function calculateAssetsTotals(
  assets: IAssetBreakdownItem[],
  ptax: number,
): { totalUSD: number; capexUSD: number; opexUSD: number; totalBRL: number } {
  let capexUSD = 0;
  let opexUSD = 0;

  (assets || []).forEach((a) => {
    const cost = a.totalCostUSD || 0;
    if (a.costCategory === "CAPEX") capexUSD += cost;
    else if (a.costCategory === "OPEX") opexUSD += cost;
    else capexUSD += cost; // default to CAPEX
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

  const byType: Record<string, { capex: number; opex: number }> = {};

  (assets || []).forEach((a) => {
    const si = scopeMap.get(a.scopeItemId);
    const rt = (si && si.resourceType) || "Other";
    if (!byType[rt]) byType[rt] = { capex: 0, opex: 0 };
    const cost = a.totalCostUSD || 0;
    if (a.costCategory === "OPEX") byType[rt].opex += cost;
    else byType[rt].capex += cost;
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
  totalBRL: number;
  totalUSD: number;
} {
  const hs = bid.hoursSummary;
  const engBRL = hs?.engineeringHours?.totalCostBRL || 0;
  const onBRL = hs?.onshoreHours?.totalCostBRL || 0;
  const offBRL = hs?.offshoreHours?.totalCostBRL || 0;
  const totalBRL = engBRL + onBRL + offBRL;
  const ptax = bid.opportunityInfo?.ptax || 1;
  return {
    engineeringBRL: engBRL,
    onshoreBRL: onBRL,
    offshoreBRL: offBRL,
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
  const assets = calculateAssetsTotals(bid.assetBreakdown || [], ptax);
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

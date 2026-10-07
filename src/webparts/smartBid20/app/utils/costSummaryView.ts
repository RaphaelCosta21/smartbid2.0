import { IBid, ICostSummary, IHoursItem } from "../models";
import {
  IAssetResourceTypeCost,
  IBidFx,
  IMultiCurrencyItem,
  buildCostSummary,
  calculateAssetsByResourceType,
  calculateHoursTotals,
  calculateMultiCurrencyTotals,
  getBidContingency,
  getBidFx,
} from "./costCalculations";

/** One line of the Cost Summary breakdown table (shared by the UI and the Excel export). */
export interface ICostBreakdownRow {
  label: string;
  usd: number;
  brl: number;
  /** Sub-category (resource type / division) of the previous main row */
  indent: boolean;
  hours?: number;
}

export interface ICostSegment {
  label: string;
  usd: number;
  brl: number;
  /** Non-asset costs (hours, logistics, certifications, prep & mob) */
  isServices?: boolean;
}

export interface ICostBucket {
  usd: number;
  brl: number;
  segments: ICostSegment[];
}

export interface ICostSummaryView {
  summary: ICostSummary;
  fx: IBidFx;
  isIntegrated: boolean;
  divisions: string[];
  assetsByType: IAssetResourceTypeCost[];
  assetsUncategorizedUSD: number;
  rows: ICostBreakdownRow[];
  hours: {
    engineering: number;
    onshore: number;
    offshore: number;
    total: number;
  };
  capex: ICostBucket;
  opex: ICostBucket;
  uncategorized: { usd: number; brl: number };
  /** Currencies of the priced line items that carry a cost */
  itemCurrencies: string[];
}

export const SERVICES_SEGMENT_LABEL = "Services & Others";

const INTEGRATED_DIVISIONS = ["ROV", "SURVEY"];

interface IDivisionHours {
  engBRL: number;
  engH: number;
  onBRL: number;
  onH: number;
  offBRL: number;
  offH: number;
}

function sumBy<T>(items: T[], pick: (i: T) => number): number {
  return items.reduce((s, i) => s + (pick(i) || 0), 0);
}

function hoursByDivision(bid: IBid, div: string): IDivisionHours {
  const hs = bid.hoursSummary;
  const engItems: IHoursItem[] = (hs?.engineeringHours?.items || []).filter(
    (i) => i.integratedDivision === div,
  );
  // Deliverable-based engineering items are linked via scope item / sub-item ids
  const divScopeIds = new Set<string>();
  (bid.scopeItems || [])
    .filter((si) => si.integratedDivision === div)
    .forEach((si) => {
      divScopeIds.add(si.id);
      (si.subItems || []).forEach((sub) => divScopeIds.add(sub.id));
    });
  const engDeliverableHours = sumBy(
    (hs?.engineeringHours?.engineeringItems || []).filter((ei) =>
      ei.source === "manual" || !ei.scopeItemId
        ? ei.integratedDivision === div
        : divScopeIds.has(ei.scopeItemId),
    ),
    (ei) => ei.totalHours,
  );
  const onItems = (hs?.onshoreHours?.items || []).filter(
    (i) => i.integratedDivision === div,
  );
  const offItems = (hs?.offshoreHours?.items || []).filter(
    (i) => i.integratedDivision === div,
  );
  return {
    engBRL: sumBy(engItems, (i) => i.costBRL),
    engH: sumBy(engItems, (i) => i.totalHours) + engDeliverableHours,
    onBRL: sumBy(onItems, (i) => i.costBRL),
    onH: sumBy(onItems, (i) => i.totalHours),
    offBRL: sumBy(offItems, (i) => i.costBRL),
    offH: sumBy(offItems, (i) => i.totalHours),
  };
}

/** Everything the Cost Summary shows, computed once so the UI and the exports cannot disagree. */
export function buildCostSummaryView(bid: IBid): ICostSummaryView {
  const s = buildCostSummary(bid);
  const fx = getBidFx(bid);
  const hoursTotals = calculateHoursTotals(bid);
  const ptax = s.ptaxUsed;
  const assetsByType = calculateAssetsByResourceType(
    bid.assetBreakdown || [],
    bid.scopeItems || [],
    getBidContingency(bid),
  );
  const isIntegrated = (bid.serviceLine || "").toLowerCase() === "integrated";
  const divisions = isIntegrated ? INTEGRATED_DIVISIONS : [];

  const itemCurrencies = [
    ...(bid.logisticsBreakdown || []),
    ...(bid.certificationsBreakdown || []),
    ...(bid.rtsItems || []),
    ...(bid.mobilizationItems || []),
    ...(bid.consumableItems || []),
  ]
    .filter((i) => (i.totalCost || 0) !== 0)
    .map((i) => i.originalCurrency);

  const divHours: Record<string, IDivisionHours> = {};
  divisions.forEach((div) => {
    divHours[div] = hoursByDivision(bid, div);
  });

  const rows: ICostBreakdownRow[] = [];
  const toUSD = (brl: number): number => (ptax > 0 ? brl / ptax : 0);

  const pushAssetBucket = (
    label: string,
    total: number,
    pick: (rt: IAssetResourceTypeCost) => number,
  ): void => {
    rows.push({ label, usd: total, brl: total * ptax, indent: false });
    assetsByType.forEach((rt) => {
      const v = pick(rt);
      if (v > 0) {
        rows.push({
          label: rt.resourceType,
          usd: v,
          brl: v * ptax,
          indent: true,
        });
      }
    });
  };

  const assetsUncategorizedUSD = sumBy(
    assetsByType,
    (rt) => rt.uncategorizedUSD,
  );
  pushAssetBucket("Assets (CAPEX)", s.assetsCapexUSD, (rt) => rt.capexUSD);
  pushAssetBucket("Assets (OPEX)", s.assetsOpexUSD, (rt) => rt.opexUSD);
  if (assetsUncategorizedUSD > 0) {
    pushAssetBucket(
      "Assets (Uncategorized)",
      assetsUncategorizedUSD,
      (rt) => rt.uncategorizedUSD,
    );
  }

  // Item totals, since section.totalHours can be stale
  const divSum = (pick: (d: IDivisionHours) => number): number =>
    divisions.reduce((sum, div) => sum + pick(divHours[div]), 0);
  const engH = isIntegrated
    ? divSum((d) => d.engH)
    : hoursTotals.engineeringHours;
  const onH = isIntegrated ? divSum((d) => d.onH) : hoursTotals.onshoreHours;
  const offH = isIntegrated ? divSum((d) => d.offH) : hoursTotals.offshoreHours;

  const pushHours = (
    label: string,
    brl: number,
    hours: number,
    pickBRL: (d: IDivisionHours) => number,
    pickH: (d: IDivisionHours) => number,
  ): void => {
    rows.push({
      label,
      usd: toUSD(brl),
      brl,
      indent: false,
      hours: hours > 0 ? hours : undefined,
    });
    divisions.forEach((div) => {
      const d = divHours[div];
      if (pickBRL(d) > 0 || pickH(d) > 0) {
        rows.push({
          label: div,
          usd: toUSD(pickBRL(d)),
          brl: pickBRL(d),
          indent: true,
          hours: pickH(d) > 0 ? pickH(d) : undefined,
        });
      }
    });
  };

  pushHours(
    "Engineering Hours",
    s.engineeringHoursCostBRL,
    engH,
    (d) => d.engBRL,
    (d) => d.engH,
  );
  pushHours(
    "Onshore Hours",
    s.onshoreHoursCostBRL,
    onH,
    (d) => d.onBRL,
    (d) => d.onH,
  );
  pushHours(
    "Offshore Hours",
    s.offshoreHoursCostBRL,
    offH,
    (d) => d.offBRL,
    (d) => d.offH,
  );

  const pushItems = (
    label: string,
    usd: number,
    brl: number,
    items: (IMultiCurrencyItem & { integratedDivision?: string })[],
  ): void => {
    rows.push({ label, usd, brl, indent: false });
    divisions.forEach((div) => {
      const t = calculateMultiCurrencyTotals(
        items.filter((i) => i.integratedDivision === div),
        fx,
      );
      if (t.totalUSD > 0 || t.totalBRL > 0) {
        rows.push({
          label: div,
          usd: t.totalUSD,
          brl: t.totalBRL,
          indent: true,
        });
      }
    });
  };

  pushItems(
    "Logistics",
    s.logisticsCostUSD,
    s.logisticsCostBRL,
    bid.logisticsBreakdown || [],
  );
  pushItems(
    "Certifications",
    s.certificationsCostUSD,
    s.certificationsCostBRL,
    bid.certificationsBreakdown || [],
  );
  pushItems(
    "RTS (Ready To Service)",
    s.rtsCostUSD,
    s.rtsCostBRL,
    bid.rtsItems || [],
  );
  pushItems(
    "Mobilization",
    s.mobilizationCostUSD,
    s.mobilizationCostBRL,
    bid.mobilizationItems || [],
  );
  pushItems(
    "Consumables",
    s.consumablesCostUSD,
    s.consumablesCostBRL,
    bid.consumableItems || [],
  );

  // Hours, logistics, certifications and prep & mob are booked as CAPEX
  const servicesBRL =
    s.engineeringHoursCostBRL +
    s.onshoreHoursCostBRL +
    s.offshoreHoursCostBRL +
    s.logisticsCostBRL +
    s.certificationsCostBRL +
    s.rtsCostBRL +
    s.mobilizationCostBRL +
    s.consumablesCostBRL;
  const servicesUSD =
    s.totalHoursCostUSD +
    s.logisticsCostUSD +
    s.certificationsCostUSD +
    s.rtsCostUSD +
    s.mobilizationCostUSD +
    s.consumablesCostUSD;

  const capexSegments: ICostSegment[] = [];
  const opexSegments: ICostSegment[] = [];
  assetsByType.forEach((rt) => {
    if (rt.capexUSD > 0) {
      capexSegments.push({
        label: rt.resourceType,
        usd: rt.capexUSD,
        brl: rt.capexUSD * ptax,
      });
    }
    if (rt.opexUSD > 0) {
      opexSegments.push({
        label: rt.resourceType,
        usd: rt.opexUSD,
        brl: rt.opexUSD * ptax,
      });
    }
  });
  if (servicesBRL > 0) {
    capexSegments.push({
      label: SERVICES_SEGMENT_LABEL,
      usd: servicesUSD,
      brl: servicesBRL,
      isServices: true,
    });
  }

  return {
    summary: s,
    fx,
    isIntegrated,
    divisions,
    assetsByType,
    assetsUncategorizedUSD,
    rows,
    hours: {
      engineering: engH,
      onshore: onH,
      offshore: offH,
      total: engH + onH + offH,
    },
    capex: {
      usd: s.assetsCapexUSD + servicesUSD,
      brl: s.assetsCapexUSD * ptax + servicesBRL,
      segments: capexSegments,
    },
    opex: {
      usd: s.assetsOpexUSD,
      brl: s.assetsOpexUSD * ptax,
      segments: opexSegments,
    },
    uncategorized: {
      usd: assetsUncategorizedUSD,
      brl: assetsUncategorizedUSD * ptax,
    },
    itemCurrencies,
  };
}

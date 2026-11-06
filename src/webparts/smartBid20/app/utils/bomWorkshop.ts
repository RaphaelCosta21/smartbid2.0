/**
 * bomWorkshop - Brings the workshop (assembly & test) of a BOM Cost Analysis into a BID:
 * hours → Hours & Personnel › Onshore Hours, cost → Assets Breakdown › Services & Fees.
 * Rows are tagged with `bomWorkshop`, so importing again replaces them instead of duplicating.
 */
import {
  IAssetBreakdownItem,
  IAssetSubCost,
  IBomCostAnalysis,
  IBomWorkshopRef,
  IHoursItem,
  IHoursSection,
  IHoursSectionGroup,
  IHoursSummary,
  IScopeItem,
} from "../models";
import { hasWorkshop } from "./bomCostHelpers";
import {
  BOM_WORKSHOP_GROUP_PREFIX,
  IBidFx,
  createBlankAsset,
} from "./costCalculations";
import { formatCurrency } from "./formatters";
import { makeId } from "./idGenerator";

type Division = "ROV" | "SURVEY" | "OPG" | "";

export interface IBomWorkshopImport {
  analysisId: string;
  scopeItemId: string;
  partNumber: string;
  description: string;
  revision: string;
  /** Scope quantity (Oper + Spare) the per-unit workshop is multiplied by */
  qty: number;
  hoursPerUnit: number;
  totalHours: number;
  costPerUnitUSD: number;
  totalCostUSD: number;
  /** Cost per unit as entered on the BOM */
  sourceCost: number;
  sourceCurrency: "BRL" | "USD";
  /** BRL per 1 USD used to convert a BRL cost */
  rateUsed?: number;
  /** "bid" = BID exchange rate, "bom" = system rate saved on the BOM */
  rateSource?: "bid" | "bom";
  jobFunction?: string;
  phase?: string;
  notes?: string;
  division?: Division;
}

export type BomWorkshopScopeRef = Pick<
  IScopeItem,
  "id" | "qtyOperational" | "qtySpare" | "integratedDivision"
>;

export const BOM_WORKSHOP_GROUP_TITLE =
  "Workshop - Assembly & Test (BOM Costs)";
const HOURS_PER_DAY = 8;

const round = (v: number, digits: number): number => {
  const f = Math.pow(10, digits);
  return Math.round(v * f) / f;
};

/** Scope quantity that drives the asset total (Oper + Spare, at least 1). */
export function scopeUnits(
  si: Pick<IScopeItem, "qtyOperational" | "qtySpare">,
): number {
  return (si.qtyOperational || 0) + (si.qtySpare || 0) || 1;
}

/** Workshop of the analysis for one Scope item, or null when the BOM has none. */
export function buildBomWorkshopImport(
  analysis: IBomCostAnalysis,
  scopeItem: BomWorkshopScopeRef,
  fx?: IBidFx | null,
): IBomWorkshopImport | null {
  const ws = analysis.workshop;
  if (!ws || !hasWorkshop(ws)) return null;
  const qty = scopeUnits(scopeItem);
  const cost = ws.cost || 0;
  let unitUSD = cost;
  let rateUsed: number | undefined;
  let rateSource: "bid" | "bom" | undefined;
  if (ws.currency === "BRL" && cost > 0) {
    if (fx && fx.brlRate > 0) {
      unitUSD = cost / fx.brlRate;
      rateUsed = fx.brlRate;
      rateSource = "bid";
    } else {
      unitUSD = ws.costUSD || 0;
      rateUsed = ws.rateUsed;
      rateSource = "bom";
    }
  }
  const hours = ws.hours || 0;
  return {
    analysisId: analysis.id,
    scopeItemId: scopeItem.id,
    partNumber: analysis.mainPartNumber,
    description: analysis.mainDescription,
    revision: analysis.revision || "",
    qty,
    hoursPerUnit: hours,
    totalHours: round(hours * qty, 2),
    costPerUnitUSD: unitUSD,
    totalCostUSD: round(unitUSD * qty, 2),
    sourceCost: cost,
    sourceCurrency: ws.currency === "BRL" ? "BRL" : "USD",
    rateUsed,
    rateSource,
    jobFunction: ws.jobFunction,
    phase: ws.phase,
    notes: ws.notes,
    division: scopeItem.integratedDivision || "",
  };
}

const refOf = (imp: IBomWorkshopImport): IBomWorkshopRef => ({
  bomAnalysisId: imp.analysisId,
  scopeItemId: imp.scopeItemId,
  partNumber: imp.partNumber,
});

const bomLabel = (imp: IBomWorkshopImport): string =>
  `${imp.partNumber}${imp.revision ? ` Rev ${imp.revision}` : ""}`;

const units = (n: number): string => `${n} unit${n === 1 ? "" : "s"}`;

/** "R$ 5,000.00 per unit at 5.65 BRL/USD (BID rate)" */
export function describeWorkshopCost(imp: IBomWorkshopImport): string {
  const unit = `${formatCurrency(imp.sourceCost, imp.sourceCurrency)} per unit`;
  if (imp.sourceCurrency !== "BRL") return unit;
  if (!imp.rateUsed) return `${unit} (no BRL rate - not converted)`;
  return `${unit} at ${imp.rateUsed} BRL/USD (${imp.rateSource === "bid" ? "BID rate" : "system rate"})`;
}

function hoursNote(imp: IBomWorkshopImport): string {
  const lines = [
    `Workshop assembly & test from BOM Costs ${bomLabel(imp)}: ${imp.hoursPerUnit} h × ${units(imp.qty)} = ${imp.totalHours} h.`,
  ];
  if (imp.totalCostUSD > 0) {
    lines.push(
      `Cost (${formatCurrency(imp.totalCostUSD)}) is in Assets Breakdown > Services & Fees.`,
    );
  }
  if (imp.notes) lines.push(imp.notes);
  return lines.join(" ");
}

function feeNote(imp: IBomWorkshopImport): string {
  const lines = [
    `From BOM Costs ${bomLabel(imp)}: ${describeWorkshopCost(imp)} × ${units(imp.qty)}.`,
  ];
  if (imp.totalHours > 0) {
    lines.push(
      `Hours (${imp.totalHours} h) are in Hours & Personnel > Onshore Hours.`,
    );
  }
  if (imp.notes) lines.push(imp.notes);
  return lines.join(" ");
}

export function workshopGroupId(division?: string): string {
  return division
    ? `${BOM_WORKSHOP_GROUP_PREFIX}-${division}`
    : BOM_WORKSHOP_GROUP_PREFIX;
}

function sumSection<T extends IHoursSection>(section: T): T {
  const data = section.items.filter((i) => !i.isSeparator);
  return {
    ...section,
    totalHours: data.reduce((s, i) => s + (i.totalHours || 0), 0),
    totalCostBRL: data.reduce((s, i) => s + (i.costBRL || 0), 0),
  };
}

/** Recomputes the onshore section and the grand totals after onshore rows changed. */
export function withOnshoreTotals(summary: IHoursSummary): IHoursSummary {
  const onshore = sumSection(summary.onshoreHours);
  const eng = summary.engineeringHours;
  const off = summary.offshoreHours;
  return {
    ...summary,
    onshoreHours: onshore,
    grandTotalHours:
      (eng?.totalHours || 0) + onshore.totalHours + (off?.totalHours || 0),
    grandTotalCostBRL:
      (eng?.totalCostBRL || 0) +
      onshore.totalCostBRL +
      (off?.totalCostBRL || 0),
  };
}

const EMPTY_SECTION: IHoursSection = {
  totalHours: 0,
  totalCostBRL: 0,
  items: [],
};

/**
 * Replaces the workshop hour lines of the given Scope items with the new ones, inside a
 * "Workshop - Assembly & Test (BOM Costs)" group of Onshore Hours (one group per division).
 */
export function upsertWorkshopHours(
  summary: IHoursSummary,
  imports: IBomWorkshopImport[],
): IHoursSummary {
  if (imports.length === 0) return summary;
  const replaced = new Set(imports.map((i) => i.scopeItemId));
  const onshore = summary.onshoreHours || EMPTY_SECTION;
  const items: IHoursItem[] = onshore.items.filter(
    (i) => !(i.bomWorkshop && replaced.has(i.bomWorkshop.scopeItemId)),
  );
  const groups: IHoursSectionGroup[] = (onshore.sections || []).slice();

  imports.forEach((imp) => {
    if (imp.totalHours <= 0) return;
    const groupId = workshopGroupId(imp.division);
    if (!groups.some((g) => g.id === groupId)) {
      groups.push({
        id: groupId,
        title: BOM_WORKSHOP_GROUP_TITLE,
        integratedDivision: imp.division || undefined,
      });
    }
    const workDays = round(imp.totalHours / HOURS_PER_DAY, 4);
    items.push({
      id: makeId("hrs"),
      lineNumber: 0,
      sectionId: groupId,
      requirementName: `${imp.partNumber} - ${imp.description}`,
      function: imp.jobFunction || "",
      phase: imp.phase || "",
      hoursPerDay: HOURS_PER_DAY,
      pplQty: 1,
      workDays,
      utilizationPercent: 100,
      totalHours: round(HOURS_PER_DAY * workDays, 2),
      costBRL: 0,
      integratedDivision: imp.division || undefined,
      notes: hoursNote(imp),
      bomWorkshop: refOf(imp),
    });
  });

  // An auto-created group left without lines goes away with them
  const usedGroups = new Set(items.map((i) => i.sectionId || ""));
  const keptGroups = groups.filter(
    (g) =>
      g.id.indexOf(BOM_WORKSHOP_GROUP_PREFIX) !== 0 || usedGroups.has(g.id),
  );

  return withOnshoreTotals({
    ...summary,
    onshoreHours: { ...onshore, items, sections: keptGroups },
  });
}

/** Adds (or replaces) the workshop fee in the asset's Services & Fees. */
export function upsertWorkshopFee(
  asset: IAssetBreakdownItem,
  imp: IBomWorkshopImport,
): IAssetBreakdownItem {
  const current = asset.subCosts || [];
  const idx = current.findIndex((sc) => !!sc.bomWorkshop);
  const others = current.filter((sc) => !sc.bomWorkshop);
  if (imp.totalCostUSD <= 0) return { ...asset, subCosts: others };
  const fee: IAssetSubCost = {
    id: idx >= 0 ? current[idx].id : makeId("sc"),
    description: `Workshop - Assembly & Test (${imp.partNumber})`,
    costUSD: imp.totalCostUSD,
    costReference: "BOM COST",
    leadTimeDays: 0,
    notes: feeNote(imp),
    bomWorkshop: refOf(imp),
  };
  const subCosts = others.slice();
  subCosts.splice(
    idx >= 0 ? Math.min(idx, subCosts.length) : subCosts.length,
    0,
    fee,
  );
  return { ...asset, subCosts };
}

/** Workshop fees applied to the asset rows, creating the asset row when the item has none yet. */
export function applyWorkshopFees(
  assets: IAssetBreakdownItem[],
  imports: IBomWorkshopImport[],
): IAssetBreakdownItem[] {
  let out = assets.slice();
  imports.forEach((imp) => {
    const idx = out.findIndex((a) => a.scopeItemId === imp.scopeItemId);
    if (idx >= 0) {
      out[idx] = upsertWorkshopFee(out[idx], imp);
    } else if (imp.totalCostUSD > 0) {
      const blank = createBlankAsset(imp.scopeItemId);
      out = out.concat(
        upsertWorkshopFee(
          { ...blank, integratedDivision: imp.division || undefined },
          imp,
        ),
      );
    }
  });
  return out;
}

/** True when the Scope item already holds workshop rows from a BOM (hours or fee). */
export function hasWorkshopRows(
  scopeItemId: string,
  summary: IHoursSummary | undefined,
  assets: IAssetBreakdownItem[] | undefined,
): boolean {
  const inHours = (summary?.onshoreHours?.items || []).some(
    (i) => !!i.bomWorkshop && i.bomWorkshop.scopeItemId === scopeItemId,
  );
  if (inHours) return true;
  const asset = (assets || []).find((a) => a.scopeItemId === scopeItemId);
  return !!asset && (asset.subCosts || []).some((sc) => !!sc.bomWorkshop);
}

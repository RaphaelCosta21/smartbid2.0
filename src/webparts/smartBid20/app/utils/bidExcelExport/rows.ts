import {
  IAssetBreakdownItem,
  IAvailabilitySplit,
  IBid,
  IScopeItem,
  IScopeSubItem,
  ISubItemCost,
} from "../../models";
import {
  CostCategory,
  IContingencyOpts,
  applyContingencyToCost,
  getAssetCostBreakdown,
  getEffectiveCategory,
  getSplitNode,
  getSubItemNode,
  isNoCostAvailability,
  isRentalAcq,
  isWorkshopAcq,
} from "../costCalculations";

/** Same contingency rule as buildCostSummary, so every export total matches the Cost Summary. */
export function getBidContingency(bid: IBid): IContingencyOpts | undefined {
  const perYear = bid.assetsContingencyPerYear || 0;
  return perYear > 0 ? { perYear, applied: true } : undefined;
}

export function fmtUSD(v: number): string {
  return (
    "US$ " +
    (v || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function categoryLabel(c: CostCategory): string {
  return c === "UNCATEGORIZED" ? "Uncategorized" : c;
}

function unique(values: (string | undefined | null)[]): string[] {
  const out: string[] = [];
  values.forEach((v) => {
    const s = (v || "").trim();
    if (s && out.indexOf(s) < 0) out.push(s);
  });
  return out;
}

function maxLead(values: (number | undefined | null)[]): number | null {
  const nums = values.filter((v): v is number => !!v && v > 0);
  return nums.length ? Math.max(...nums) : null;
}

export interface IScopeGroup<T> {
  section: IScopeItem | null;
  items: T[];
}

/**
 * Scope-ordered groups: unsectioned first, then each section in scope order (same as the tabs).
 * Items pointing to a missing section stay in the unsectioned group so totals still reconcile.
 */
export function groupBySection<T>(
  scopeItems: IScopeItem[],
  items: T[],
  sectionIdOf: (item: T) => string | null | undefined,
): IScopeGroup<T>[] {
  const sections = (scopeItems || []).filter((s) => s.isSection);
  const ids = new Set(sections.map((s) => s.id));
  const groups: IScopeGroup<T>[] = [
    {
      section: null,
      items: items.filter((i) => {
        const sid = sectionIdOf(i);
        return !sid || !ids.has(sid);
      }),
    },
  ];
  sections.forEach((sec) => {
    groups.push({
      section: sec,
      items: items.filter((i) => sectionIdOf(i) === sec.id),
    });
  });
  return groups;
}

function scopeMapOf(bid: IBid): Map<string, IScopeItem> {
  const m = new Map<string, IScopeItem>();
  (bid.scopeItems || []).forEach((s) => m.set(s.id, s));
  return m;
}

function findChild(
  si: IScopeItem | undefined,
  id: string,
): IScopeSubItem | undefined {
  if (!si) return undefined;
  return (
    (si.subItems || []).find((s) => s.id === id) ||
    (si.pcfItems || []).find((s) => s.id === id)
  );
}

/* ─── Assets Breakdown (summarized, one row per item) ─── */

export interface IAssetSummaryRow {
  /** Position of the item in Scope of Supply (same "#" as the Assets tab); null when orphaned */
  lineNo: number | null;
  division: string;
  equipmentOffer: string;
  partNumber: string;
  resourceType: string;
  subType: string;
  qtyOp: number;
  qtySp: number;
  availability: string;
  acqType: string;
  unitCost: number | null;
  unitIsDaily: boolean;
  total: number;
  capex: number;
  opex: number;
  uncategorized: number;
  category: string;
  supplier: string;
  costRef: string;
  dateRef: string;
  leadTime: number | null;
  includes: string;
  notes: string;
  notOffered: boolean;
}

export interface IAssetSummaryGroup {
  section: IScopeItem | null;
  rows: IAssetSummaryRow[];
  total: number;
  capex: number;
  opex: number;
  uncategorized: number;
}

type CostEntry = {
  availabilityStatus?: string;
  acquisitionType?: string;
  supplier?: string;
  leadTimeDays?: number;
  costReference?: string;
};

function isProcured(e: CostEntry): boolean {
  return (
    !isNoCostAvailability(e.availabilityStatus) &&
    !isWorkshopAcq(e.acquisitionType)
  );
}

function summarizeAsset(
  asset: IAssetBreakdownItem,
  si: IScopeItem | undefined,
  lineNo: number | null,
  cont: IContingencyOpts | undefined,
): IAssetSummaryRow {
  const bd = getAssetCostBreakdown(asset, si, cont);
  const splits = asset.availabilitySplits || [];
  const hasSplits = splits.length > 0;
  const rollup = asset.costFromSubItems
    ? "sub-items"
    : asset.costFromPCF
      ? "PCF"
      : "";
  const avail = (asset.availabilityStatus || "").trim();
  const notOffered = !hasSplits && avail.toLowerCase() === "not offered";
  const noCost = !hasSplits && isNoCostAvailability(avail);
  const workshop = !hasSplits && isWorkshopAcq(asset.acquisitionType);
  const rental = !hasSplits && isRentalAcq(asset.acquisitionType);

  // Children whose costs roll into this row (splits override their parent's fields)
  const children: (ISubItemCost | IAvailabilitySplit)[] = [];
  const addChild = (c: ISubItemCost): void => {
    const sp = c.availabilitySplits || [];
    if (sp.length > 0) sp.forEach((s) => children.push(s));
    else children.push(c);
  };
  (asset.subItemCosts || []).forEach(addChild);
  if (asset.costFromPCF) (asset.pcfCosts || []).forEach(addChild);
  const procuredChildren = children.filter(isProcured);
  const procuredSplits = splits.filter(isProcured);

  // Supplier / lead time cover everything rolled into this row's total
  const own: CostEntry[] = hasSplits
    ? procuredSplits
    : rollup || noCost || workshop
      ? []
      : [asset];
  const sources = own.concat(procuredChildren);
  const supplier = unique(sources.map((e) => e.supplier)).join("; ");
  const leadTime = maxLead(sources.map((e) => e.leadTimeDays));
  const costRef = hasSplits
    ? unique(procuredSplits.map((s) => s.costReference)).join("; ")
    : rollup
      ? `from ${rollup}`
      : !noCost && !workshop
        ? asset.costReference || ""
        : "";

  let unitCost: number | null = null;
  let contPct = 0;
  if (!hasSplits && !rollup && !noCost && !workshop) {
    if (rental) {
      unitCost = asset.dailyRate || 0;
    } else {
      const raw = asset.unitCostUSD || 0;
      unitCost = cont
        ? applyContingencyToCost(raw, asset.dateReference, cont.perYear)
        : raw;
      if (raw > 0 && unitCost > raw) {
        contPct = Math.round((unitCost / raw - 1) * 100);
      }
    }
  }

  const includes: string[] = [];
  if (hasSplits) includes.push(`${splits.length} availability splits`);
  if (rollup) includes.push(`Σ ${rollup}`);
  if (bd.subItems.length > 0 && bd.subItemsTotal > 0) {
    includes.push(
      `Sub-items (${bd.subItems.length}) ${fmtUSD(bd.subItemsTotal)}`,
    );
  }
  if (asset.costFromPCF && bd.pcfTotal > 0) {
    includes.push(`PCF (${bd.pcf.length}) ${fmtUSD(bd.pcfTotal)}`);
  }
  const fees = bd.main.fees + bd.splits.reduce((s, n) => s + n.fees, 0);
  if (fees > 0) includes.push(`Services & fees ${fmtUSD(fees)}`);
  if (contPct > 0) includes.push(`Contingency +${contPct}%`);

  const buckets: string[] = [];
  if (bd.capex > 0) buckets.push("CAPEX");
  if (bd.opex > 0) buckets.push("OPEX");
  if (bd.uncategorized > 0) buckets.push("Uncategorized");
  let category = buckets.length > 1 ? "Mixed" : buckets[0] || "";
  if (!category) {
    const eff = getEffectiveCategory(asset);
    category = eff === "UNCATEGORIZED" ? "-" : eff;
  }

  return {
    lineNo,
    division: (si && si.integratedDivision) || asset.integratedDivision || "",
    equipmentOffer: (si && (si.equipmentOffer || si.description)) || "-",
    partNumber: (si && si.partNumber) || "",
    resourceType: (si && si.resourceType) || "",
    subType: (si && si.resourceSubType) || "",
    qtyOp: (si && si.qtyOperational) || 0,
    qtySp: (si && si.qtySpare) || 0,
    availability: hasSplits ? `Split (${splits.length})` : avail || "-",
    acqType: hasSplits
      ? unique(splits.map((s) => s.acquisitionType)).join(" / ") || "-"
      : noCost
        ? notOffered
          ? "Not Offered"
          : "N/A"
        : asset.acquisitionType || "-",
    unitCost,
    unitIsDaily: rental && unitCost !== null,
    total: bd.total,
    capex: bd.capex,
    opex: bd.opex,
    uncategorized: bd.uncategorized,
    category,
    supplier,
    costRef,
    dateRef:
      !hasSplits && !rollup && !noCost && !workshop
        ? asset.dateReference || ""
        : "",
    leadTime,
    includes: includes.join(" · "),
    notes: asset.notes || "",
    notOffered,
  };
}

export function buildAssetSummary(bid: IBid): IAssetSummaryGroup[] {
  const scopeMap = scopeMapOf(bid);
  const cont = getBidContingency(bid);
  const scopeIndex: Record<string, number> = {};
  (bid.scopeItems || [])
    .filter((s) => !s.isSection)
    .forEach((s, i) => {
      scopeIndex[s.id] = i + 1;
    });
  const groups = groupBySection(
    bid.scopeItems || [],
    bid.assetBreakdown || [],
    (a) => {
      const si = scopeMap.get(a.scopeItemId);
      return si ? si.sectionId : null;
    },
  );
  return groups
    .map((g) => {
      const rows = g.items.map((a) =>
        summarizeAsset(
          a,
          scopeMap.get(a.scopeItemId),
          scopeIndex[a.scopeItemId] || null,
          cont,
        ),
      );
      return {
        section: g.section,
        rows,
        total: rows.reduce((s, r) => s + r.total, 0),
        capex: rows.reduce((s, r) => s + r.capex, 0),
        opex: rows.reduce((s, r) => s + r.opex, 0),
        uncategorized: rows.reduce((s, r) => s + r.uncategorized, 0),
      };
    })
    .filter((g) => g.rows.length > 0);
}

/* ─── Suppliers & Lead Time (every procured entry, itemized) ─── */

export type SupplierLevel = "Main" | "Split" | "Sub-item" | "PCF";

export interface ISupplierRow {
  leadTime: number | null;
  item: string;
  level: SupplierLevel;
  parent: string;
  partNumber: string;
  qty: number;
  acqType: string;
  supplier: string;
  costRef: string;
  quoteRef: string;
  dateRef: string;
  unitCost: number;
  unitIsDaily: boolean;
  total: number;
  category: string;
  resourceType: string;
  division: string;
}

export interface ISupplierSummary {
  supplier: string;
  items: number;
  totalUSD: number;
  maxLeadTime: number | null;
}

export const NO_SUPPLIER_LABEL = "(No supplier informed)";

export function buildSupplierRows(bid: IBid): ISupplierRow[] {
  const scopeMap = scopeMapOf(bid);
  const cont = getBidContingency(bid);
  const rows: ISupplierRow[] = [];

  (bid.assetBreakdown || []).forEach((asset) => {
    const si = scopeMap.get(asset.scopeItemId);
    const parentName = (si && (si.equipmentOffer || si.description)) || "-";
    const base = {
      parent: "",
      resourceType: (si && si.resourceType) || "",
      division: (si && si.integratedDivision) || asset.integratedDivision || "",
    };
    const unitOf = (
      e: CostEntry & {
        unitCostUSD?: number;
        dailyRate?: number | null;
        dateReference?: string;
      },
    ): { unitCost: number; unitIsDaily: boolean } => {
      if (isRentalAcq(e.acquisitionType)) {
        return { unitCost: e.dailyRate || 0, unitIsDaily: true };
      }
      const raw = e.unitCostUSD || 0;
      return {
        unitCost: cont
          ? applyContingencyToCost(raw, e.dateReference, cont.perYear)
          : raw,
        unitIsDaily: false,
      };
    };
    const push = (
      level: SupplierLevel,
      item: string,
      parent: string,
      partNumber: string,
      qty: number,
      e: CostEntry & {
        unitCostUSD?: number;
        dailyRate?: number | null;
        dateReference?: string;
        quotationReference?: string | null;
        costCategory?: string;
      },
      total: number,
    ): void => {
      if (!isProcured(e)) return;
      if (
        !(total > 0) &&
        !(e.supplier || "").trim() &&
        !(e.leadTimeDays || 0)
      ) {
        return;
      }
      rows.push({
        ...base,
        level,
        item,
        parent,
        partNumber,
        qty,
        acqType: e.acquisitionType || "",
        supplier: (e.supplier || "").trim(),
        costRef: e.costReference || "",
        quoteRef: e.quotationReference || "",
        dateRef: e.dateReference || "",
        leadTime: e.leadTimeDays && e.leadTimeDays > 0 ? e.leadTimeDays : null,
        total,
        category: categoryLabel(getEffectiveCategory(e)),
        ...unitOf(e),
      });
    };

    const splits = asset.availabilitySplits || [];
    if (splits.length > 0) {
      splits.forEach((sp, i) =>
        push(
          "Split",
          `${parentName} (split ${i + 1})`,
          "",
          (si && si.partNumber) || "",
          sp.qty || 0,
          sp,
          getSplitNode(sp, cont).total,
        ),
      );
    } else if (!asset.costFromSubItems && !asset.costFromPCF) {
      const bd = getAssetCostBreakdown(asset, si, cont);
      const qty = (si ? (si.qtyOperational || 0) + (si.qtySpare || 0) : 0) || 1;
      push(
        "Main",
        parentName,
        "",
        (si && si.partNumber) || "",
        qty,
        asset,
        bd.main.total,
      );
    }

    const pushChildren = (level: SupplierLevel, list: ISubItemCost[]): void => {
      list.forEach((sic) => {
        const child = findChild(si, sic.subItemId);
        const name =
          (child && (child.equipmentOffer || child.description)) || "-";
        const pn = (child && child.partNumber) || "";
        const childSplits = sic.availabilitySplits || [];
        if (childSplits.length > 0) {
          childSplits.forEach((sp, i) =>
            push(
              level,
              `${name} (split ${i + 1})`,
              parentName,
              pn,
              sp.qty || 0,
              sp,
              getSplitNode(sp, cont).total,
            ),
          );
          return;
        }
        push(
          level,
          name,
          parentName,
          pn,
          (child && child.qty) || 1,
          sic,
          getSubItemNode(sic, si, cont).total,
        );
      });
    };
    pushChildren("Sub-item", asset.subItemCosts || []);
    if (asset.costFromPCF) pushChildren("PCF", asset.pcfCosts || []);
  });

  return rows.sort((a, b) => {
    const la = a.leadTime === null ? -1 : a.leadTime;
    const lb = b.leadTime === null ? -1 : b.leadTime;
    if (lb !== la) return lb - la;
    return b.total - a.total;
  });
}

export function summarizeSuppliers(rows: ISupplierRow[]): ISupplierSummary[] {
  const map: Record<string, ISupplierSummary> = {};
  rows.forEach((r) => {
    const key = r.supplier || NO_SUPPLIER_LABEL;
    if (!map[key]) {
      map[key] = { supplier: key, items: 0, totalUSD: 0, maxLeadTime: null };
    }
    const s = map[key];
    s.items++;
    s.totalUSD += r.total;
    if (r.leadTime !== null) {
      s.maxLeadTime =
        s.maxLeadTime === null
          ? r.leadTime
          : Math.max(s.maxLeadTime, r.leadTime);
    }
  });
  return Object.keys(map)
    .map((k) => map[k])
    .sort((a, b) => b.totalUSD - a.totalUSD);
}

import { IHoursSectionGroup } from "../../../models";
import { MOB_TYPES, RTS_TYPES } from "../../../config/prepMobilization.config";
import { IBidExcelContext, newSheet } from "../context";
import {
  IXlColumnDef,
  NUM,
  XL_COLORS,
  XlValue,
  activeColumns,
  colOf,
  qtyFmt,
} from "../excelStyles";
import {
  ICurrencyLine,
  moneyCell,
  usdCell,
  writeCurrencyFooter,
  writeCurrencyTable,
} from "./currencyTable";

interface IPrepLine extends ICurrencyLine {
  lineNumber: number;
  unitCost: number;
  qty: number;
  description: string;
  costReference: string;
  notes: string;
  integratedDivision?: string;
}

export function buildPrepMobSheet(ctx: IBidExcelContext): void {
  const { bid, view, opts } = ctx;
  const s = view.summary;
  const fx = view.fx;
  const baseCols = activeColumns([
    { key: "no", header: "#", width: 5, align: "center" },
    { key: "ref", header: "", width: 28, wrap: true },
    { key: "desc", header: "Description", width: 40, wrap: true },
    { key: "type", header: "Type", width: 16 },
    { key: "cur", header: "Currency", width: 10, align: "center" },
    { key: "qty", header: "Qty", width: 8, align: "right", numFmt: NUM.int },
    { key: "unit", header: "Unit Cost", width: 17, align: "right" },
    { key: "total", header: "Total", width: 18, align: "right" },
    {
      key: "usd",
      header: "Total (USD)",
      width: 18,
      align: "right",
      numFmt: NUM.usd,
    },
    { key: "costRef", header: "Cost Ref", width: 18, wrap: true },
    {
      key: "div",
      header: "Division",
      width: 10,
      align: "center",
      when: view.isIntegrated,
    },
    {
      key: "notes",
      header: "Notes",
      width: 32,
      wrap: true,
      when: opts.includeNotes,
    },
  ]);
  const x = newSheet(
    ctx,
    "prepMob",
    baseCols.map((c) => c.width),
  );
  const span = x.lastCol;
  const usdCol = colOf(baseCols, "usd");
  x.banner("PREPARATION & MOBILIZATION", ctx.subtitle);

  const scopeName = (id: string | null | undefined): string => {
    if (!id) return "";
    const si = (bid.scopeItems || []).find((i) => i.id === id && !i.isSection);
    return si
      ? si.equipmentOffer || si.description || si.partNumber || "Scope Item"
      : "";
  };
  const dash: XlValue = { value: "—", color: XL_COLORS.textMuted };
  const toGroups = (
    secs?: IHoursSectionGroup[],
  ): { id: string; title: string; color?: string }[] =>
    (secs || []).map((g) => ({ id: g.id, title: g.title, color: g.color }));

  const block = <T extends IPrepLine>(
    title: string,
    refHeader: string,
    typeHeader: string,
    items: T[],
    sections: IHoursSectionGroup[] | undefined,
    refOf: (i: T) => XlValue,
    typeOf: (i: T) => XlValue,
    totalUSD: number,
  ): void => {
    x.sectionTitle(title, span);
    if (items.length === 0) {
      x.note("No items.", span, "muted");
      x.total(`${title} total`, span, [
        { col: usdCol, value: 0, numFmt: NUM.usd },
      ]);
      x.gap(18);
      return;
    }
    const cols: IXlColumnDef[] = baseCols.map((c) =>
      c.key === "ref"
        ? { ...c, header: refHeader }
        : c.key === "type"
          ? { ...c, header: typeHeader }
          : c,
    );
    writeCurrencyTable(x, cols, items, toGroups(sections), fx, (i) => ({
      no: i.lineNumber || null,
      ref: refOf(i),
      desc: i.description,
      type: typeOf(i),
      cur: (i.originalCurrency || "USD").toUpperCase(),
      qty: { value: i.qty || 0, numFmt: qtyFmt(i.qty) },
      unit: moneyCell(i.unitCost, i.originalCurrency),
      total: moneyCell(i.totalCost, i.originalCurrency),
      usd: usdCell(i.totalCost, i.originalCurrency, fx),
      costRef: i.costReference,
      div: i.integratedDivision || "",
      notes: i.notes,
    }));
    x.total(`${title} total`, span, [
      { col: usdCol, value: totalUSD, numFmt: NUM.usd },
    ]);
    x.gap(18);
  };

  const rtsLabel = (v: string): string => {
    const t = RTS_TYPES.find((r) => r.value === v);
    return t ? t.label : v;
  };
  const mobLabel = (v: string): string => {
    const t = MOB_TYPES.find((r) => r.value === v);
    return t ? t.label : v;
  };

  const rts = bid.rtsItems || [];
  const mob = bid.mobilizationItems || [];
  const cons = bid.consumableItems || [];

  block(
    "RTS (Ready To Service)",
    "Linked Asset",
    "Type",
    rts,
    bid.rtsSections,
    (i) => {
      const n = scopeName(i.scopeItemId);
      return n ? { value: n, bold: true } : dash;
    },
    (i) => (i.costType ? rtsLabel(i.costType) : dash),
    s.rtsCostUSD,
  );
  block(
    "Mobilization",
    "Reference",
    "Type",
    mob,
    bid.mobSections,
    () => dash,
    (i) => (i.costType ? mobLabel(i.costType) : dash),
    s.mobilizationCostUSD,
  );
  block(
    "Consumables",
    "Item",
    "Type",
    cons,
    bid.consSections,
    (i) => (i.item ? { value: i.item, bold: true } : dash),
    () => dash,
    s.consumablesCostUSD,
  );

  const all: ICurrencyLine[] = [...rts, ...mob, ...cons];
  writeCurrencyFooter(
    x,
    "TOTAL PREP & MOBILIZATION",
    usdCol,
    s.rtsCostUSD + s.mobilizationCostUSD + s.consumablesCostUSD,
    s.ptaxUsed,
    fx,
    all.filter((i) => (i.totalCost || 0) !== 0).map((i) => i.originalCurrency),
  );
}

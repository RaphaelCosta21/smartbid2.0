import { IBidExcelContext, newSheet } from "../context";
import { NUM, XL_COLORS, activeColumns, colOf, qtyFmt } from "../excelStyles";
import {
  moneyCell,
  usdCell,
  writeCurrencyFooter,
  writeCurrencyTable,
} from "./currencyTable";

export function buildCertificationsSheet(ctx: IBidExcelContext): void {
  const { bid, view, opts } = ctx;
  const all = bid.certificationsBreakdown || [];
  const items = all.filter((i) => !i.isSection);
  const groups = all
    .filter((i) => i.isSection)
    .map((s) => ({
      id: s.id,
      title: s.sectionTitle || "",
      color: s.sectionColor,
    }));
  const scopeName = (id: string | null): string => {
    if (!id) return "";
    const si = (bid.scopeItems || []).find((s) => s.id === id);
    return si
      ? si.equipmentOffer || si.description || si.partNumber || "Scope Item"
      : "";
  };
  const cols = activeColumns([
    { key: "no", header: "#", width: 5, align: "center" },
    { key: "scope", header: "Linked Scope Item", width: 32, wrap: true },
    { key: "ref", header: "Item Ref", width: 18, wrap: true },
    { key: "qty", header: "Qty", width: 8, align: "right", numFmt: NUM.int },
    { key: "expiry", header: "Expiry Period", width: 14, align: "center" },
    { key: "cur", header: "Currency", width: 10, align: "center" },
    { key: "unit", header: "Unit Cost", width: 17, align: "right" },
    { key: "total", header: "Total Cost", width: 18, align: "right" },
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
      width: 34,
      wrap: true,
      when: opts.includeNotes,
    },
  ]);
  const x = newSheet(
    ctx,
    "certifications",
    cols.map((c) => c.width),
  );
  x.banner("CERTIFICATIONS", ctx.subtitle);
  if (items.length === 0) {
    x.note(
      "No certification items registered on this BID.",
      x.lastCol,
      "muted",
    );
    return;
  }
  const headerRow = x.row;
  writeCurrencyTable(x, cols, items, groups, view.fx, (i) => {
    const linked = scopeName(i.scopeItemId);
    return {
      no: i.lineNumber || null,
      scope: linked
        ? { value: linked, bold: true }
        : { value: "Manual", italic: true, color: XL_COLORS.textMuted },
      ref: i.itemRef,
      qty: { value: i.qty || 0, numFmt: qtyFmt(i.qty) },
      expiry: i.expiryPeriod,
      cur: (i.originalCurrency || "USD").toUpperCase(),
      unit: moneyCell(i.unitCost, i.originalCurrency),
      total: moneyCell(i.totalCost, i.originalCurrency),
      usd: usdCell(i.totalCost, i.originalCurrency, view.fx),
      costRef: i.costReference,
      div: i.integratedDivision || "",
      notes: i.notes,
    };
  });
  x.freeze(headerRow);
  x.printTitles(headerRow);
  writeCurrencyFooter(
    x,
    "TOTAL CERTIFICATIONS",
    colOf(cols, "usd"),
    view.summary.certificationsCostUSD,
    view.summary.ptaxUsed,
    view.fx,
    items
      .filter((i) => (i.totalCost || 0) !== 0)
      .map((i) => i.originalCurrency),
  );
}

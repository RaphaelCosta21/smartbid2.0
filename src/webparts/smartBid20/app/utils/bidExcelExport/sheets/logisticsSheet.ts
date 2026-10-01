import { IBidExcelContext, newSheet } from "../context";
import { NUM, activeColumns, colOf, qtyFmt } from "../excelStyles";
import { moneyCell, usdCell, writeCurrencyFooter, writeCurrencyTable } from "./currencyTable";

export function buildLogisticsSheet(ctx: IBidExcelContext): void {
  const { bid, view, opts } = ctx;
  const items = (bid.logisticsBreakdown || []).slice();
  const cols = activeColumns([
    { key: "no", header: "#", width: 5, align: "center" },
    { key: "item", header: "Item", width: 26, wrap: true },
    { key: "desc", header: "Description", width: 42, wrap: true },
    { key: "cur", header: "Currency", width: 10, align: "center" },
    { key: "qty", header: "Qty", width: 8, align: "right", numFmt: NUM.int },
    { key: "unit", header: "Unit Cost", width: 17, align: "right" },
    { key: "total", header: "Total Cost", width: 18, align: "right" },
    { key: "usd", header: "Total (USD)", width: 18, align: "right", numFmt: NUM.usd },
    { key: "div", header: "Division", width: 10, align: "center", when: view.isIntegrated },
    { key: "notes", header: "Notes", width: 36, wrap: true, when: opts.includeNotes },
  ]);
  const x = newSheet(ctx, "logistics", cols.map((c) => c.width));
  x.banner("LOGISTICS", ctx.subtitle);
  if (items.length === 0) {
    x.note("No logistics items registered on this BID.", x.lastCol, "muted");
    return;
  }
  const headerRow = x.row;
  writeCurrencyTable(x, cols, items, [], view.fx, (i) => ({
    no: i.lineNumber || null,
    item: { value: i.item, bold: true },
    desc: i.description,
    cur: (i.originalCurrency || "USD").toUpperCase(),
    qty: { value: i.qty || 0, numFmt: qtyFmt(i.qty) },
    unit: moneyCell(i.unitCost, i.originalCurrency),
    total: moneyCell(i.totalCost, i.originalCurrency),
    usd: usdCell(i.totalCost, i.originalCurrency, view.fx),
    div: i.integratedDivision || "",
    notes: i.notes,
  }));
  x.freeze(headerRow);
  x.printTitles(headerRow);
  writeCurrencyFooter(
    x,
    "TOTAL LOGISTICS",
    colOf(cols, "usd"),
    view.summary.logisticsCostUSD,
    view.summary.ptaxUsed,
    view.fx,
    items.filter((i) => (i.totalCost || 0) !== 0).map((i) => i.originalCurrency),
  );
}

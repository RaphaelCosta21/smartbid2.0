import { IBidExcelContext, newSheet } from "../context";
import {
  IXlRange,
  NUM,
  XL_COLORS,
  activeColumns,
  colOf,
  pickRow,
  qtyFmt,
  toExcelDate,
} from "../excelStyles";
import { NO_SUPPLIER_LABEL, buildSupplierRows, summarizeSuppliers } from "../rows";

export function buildSuppliersSheet(ctx: IBidExcelContext): void {
  const { bid, view } = ctx;
  const rows = buildSupplierRows(bid);
  const cols = activeColumns([
    { key: "lead", header: "Lead Time (days)", width: 11, align: "right", numFmt: NUM.int },
    { key: "item", header: "Item", width: 34, wrap: true },
    { key: "level", header: "Level", width: 10, align: "center" },
    { key: "parent", header: "Parent Item", width: 26, wrap: true },
    { key: "pn", header: "OII/MFG PN", width: 18, wrap: true },
    { key: "qty", header: "Qty", width: 7, align: "right", numFmt: NUM.int },
    { key: "acq", header: "Acq. Type", width: 15, wrap: true },
    { key: "supplier", header: "Supplier", width: 24, wrap: true },
    { key: "costRef", header: "Cost Ref", width: 16, wrap: true },
    { key: "quote", header: "Quotation Ref", width: 16, wrap: true },
    { key: "dateRef", header: "Date Ref", width: 12, align: "center", numFmt: NUM.date },
    { key: "unit", header: "Unit Cost USD", width: 17, align: "right", numFmt: NUM.usd },
    { key: "total", header: "Total Cost USD", width: 18, align: "right", numFmt: NUM.usd },
    { key: "cat", header: "CAPEX/OPEX", width: 13, align: "center" },
    { key: "resType", header: "Res. Type", width: 16, wrap: true },
    { key: "div", header: "Division", width: 10, align: "center", when: view.isIntegrated },
  ]);
  const x = newSheet(ctx, "suppliers", cols.map((c) => c.width));
  const span = x.lastCol;
  x.banner("SUPPLIERS & LEAD TIME", ctx.subtitle);

  const leads = rows.map((r) => r.leadTime || 0);
  const longest = leads.length ? Math.max(...leads) : 0;
  const suppliers = summarizeSuppliers(rows);
  const named = suppliers.filter((s) => s.supplier !== NO_SUPPLIER_LABEL);
  const noSupplier = rows.filter((r) => !r.supplier).length;
  const noLead = rows.filter((r) => r.leadTime === null).length;
  x.kpis([
    {
      label: "Longest lead time",
      value: longest > 0 ? `${longest} days` : "—",
      sub: longest > 0 ? `≈ ${Math.ceil(longest / 7)} weeks` : "No lead time informed",
      from: 1,
      to: 2,
    },
    { label: "Suppliers", value: named.length, sub: `${rows.length} procured lines`, from: 3, to: 4 },
    {
      label: "Lines without supplier",
      value: noSupplier,
      sub: noSupplier > 0 ? "Check before pricing" : "All informed",
      from: 5,
      to: 7,
    },
    {
      label: "Lines without lead time",
      value: noLead,
      sub: noLead > 0 ? "Check before pricing" : "All informed",
      from: 8,
      to: 9,
    },
  ]);
  x.gap(14);

  if (rows.length === 0) {
    x.note("No items to purchase or rent on this BID.", span, "muted");
    return;
  }

  x.sectionTitle("Procured Items", span, "Sorted by lead time, longest first");
  const headerRow = x.header(cols);
  rows.forEach((r, i) => {
    x.dataRow(
      cols,
      pickRow(cols, {
        lead: { value: r.leadTime, bold: true },
        item: { value: r.item, bold: r.level === "Main" || r.level === "Split" },
        level: r.level,
        parent: r.parent,
        pn: r.partNumber,
        qty: { value: r.qty, numFmt: qtyFmt(r.qty) },
        acq: r.acqType,
        supplier: r.supplier || { value: "Not informed", italic: true, color: XL_COLORS.warningText },
        costRef: r.costRef,
        quote: r.quoteRef,
        dateRef: toExcelDate(r.dateRef),
        unit: { value: r.unitCost, numFmt: r.unitIsDaily ? NUM.usdPerDay : NUM.usd },
        total: { value: r.total, bold: true },
        cat: r.category,
        resType: r.resourceType,
        div: r.division,
      }),
      { zebra: i % 2 === 1 },
    );
  });
  const lastRow = x.row - 1;
  x.ws.autoFilter = {
    from: { row: headerRow, column: 1 },
    to: { row: lastRow, column: span },
  };
  x.printTitles(headerRow);
  x.total(
    `${rows.length} lines`,
    span,
    [{ col: colOf(cols, "total"), value: rows.reduce((t, r) => t + r.total, 0), numFmt: NUM.usd }],
    "grand",
  );
  x.gap(6);
  x.note(
    "Lists every purchase / rental line counted in the cost (main items, availability splits, sub-items and PCF items that drive the cost). Onboard, Call Out, Not Offered and Workshop lines are excluded. Line totals include their own services & fees.",
    span,
    "info",
  );
  x.gap(18);

  x.sectionTitle("By Supplier", span, "Sorted by total cost");
  const ranges: IXlRange[] = [
    { header: "Supplier", width: 0, from: 1, to: 2 },
    { header: "Lines", width: 0, align: "right", numFmt: NUM.int, from: 3, to: 3 },
    { header: "Longest Lead Time (days)", width: 0, align: "right", numFmt: NUM.int, from: 4, to: 4 },
    { header: "Total Cost USD", width: 0, align: "right", numFmt: NUM.usd, from: 5, to: 6 },
  ];
  x.rangeHeader(ranges);
  suppliers.forEach((sp, i) =>
    x.rangeRow(
      ranges,
      [
        sp.supplier === NO_SUPPLIER_LABEL
          ? { value: sp.supplier, italic: true, color: XL_COLORS.warningText }
          : { value: sp.supplier, bold: true },
        sp.items,
        sp.maxLeadTime,
        sp.totalUSD,
      ],
      { zebra: i % 2 === 1 },
    ),
  );
}

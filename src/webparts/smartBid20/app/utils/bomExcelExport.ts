/**
 * bomExcelExport - Styled ExcelJS workbook for a BOM Cost Analysis
 * (Summary sheet + BOM Costs tree), same look as the BID Details export.
 */
import {
  IBomCostAnalysis,
  IBomCostItem,
  IBomWorkshop,
} from "../models/IBomCostAnalysis";
import { downloadBlob } from "./exportHelpers";
import { formatCurrency } from "./formatters";
import {
  BomItemStatus,
  countTaxedItems,
  dateAgeBucket,
  formatDateDMY,
  getBomCostBreakdown,
  getBomCoverage,
  getImportTaxByRow,
  getMaxLeadTimeItem,
} from "./bomCostHelpers";
import {
  IXlPlacedValue,
  IXlRange,
  NUM,
  XL_COLORS,
  XL_TAB_COLORS,
  XlSheet,
  XlValue,
  activeColumns,
  colOf,
  currencyFmt,
  pickRow,
  toExcelDate,
} from "./bidExcelExport/excelStyles";
import {
  LOGO_ASPECT,
  XLSX_MIME,
  loadExcelJS,
  loadLogoDataUrl,
  sanitizeFilePart,
} from "./bidExcelExport/runtime";

export interface IBomExcelOptions {
  analysis: IBomCostAnalysis;
  /** Live items (the page may hold edits that are not saved yet) */
  items: IBomCostItem[];
  contingencyPerYear: number;
  /** Import tax % applied to Global BU prices */
  importTaxPercent?: number;
  /** Workshop assembly & test of the main item (live value) */
  workshop?: IBomWorkshop;
  exportedBy?: string;
}

const BID_DESTINATION =
  "In a BID: hours go to Hours & Personnel > Onshore Hours and the cost to Assets Breakdown > Services & Fees of the item (both × the item quantity).";

const STATUS_LABEL: Record<BomItemStatus, string> = {
  costed: "Costed",
  rolled: "Rolled up",
  partial: "Rolled up (partial)",
  missing: "Missing cost",
  covered: "Covered by parent",
};

const STATUS_COLOR: Record<BomItemStatus, string> = {
  costed: XL_COLORS.success,
  rolled: XL_COLORS.infoText,
  partial: XL_COLORS.warningText,
  missing: XL_COLORS.danger,
  covered: XL_COLORS.textMuted,
};

function sourceLabel(item: IBomCostItem): string {
  if (item.isRolledUp) return "Rolled Up";
  if (item.sourceTab === "Financials") return item.costReference || "FIN";
  if (item.sourceTab === "manual") return "Manual";
  if (item.sourceTab === "QUOTATION") return "Quotation";
  return item.sourceTab || "-";
}

export function getBomExcelFilename(analysis: IBomCostAnalysis): string {
  const pn = sanitizeFilePart(
    analysis.mainPartNumber +
      (analysis.revision ? ` Rev ${analysis.revision}` : ""),
  );
  return `${pn || "BOM"} - BOM Costs - ${new Date().toISOString().slice(0, 10)}.xlsx`;
}

/** Builds the workbook and downloads it. Returns the file name. */
export async function exportBomCostsToExcel(
  opts: IBomExcelOptions,
): Promise<string> {
  const { analysis, items, contingencyPerYear } = opts;
  const taxRate = opts.importTaxPercent || 0;
  const workshop =
    opts.workshop &&
    ((opts.workshop.hours || 0) > 0 || (opts.workshop.cost || 0) > 0)
      ? opts.workshop
      : undefined;
  const [ExcelJS, logo] = await Promise.all([loadExcelJS(), loadLogoDataUrl()]);
  const wb = new ExcelJS.Workbook();
  const now = new Date();
  wb.creator = opts.exportedBy || "SmartBid 2.0";
  wb.lastModifiedBy = wb.creator;
  wb.created = now;
  wb.modified = now;
  wb.title = `BOM Costs - ${analysis.mainPartNumber}`;
  wb.subject = analysis.mainDescription;
  wb.company = "Oceaneering";

  const cov = getBomCoverage(items);
  const bd = getBomCostBreakdown(items, workshop);
  const total = bd.total;
  const taxedCount = countTaxedItems(items);
  const taxByRow = getImportTaxByRow(items);
  const showTax = taxRate > 0 || bd.importTax > 0;
  const maxLead = getMaxLeadTimeItem(items);
  const missingCount = cov.missingIds.length;
  const revision = analysis.revision ? `Rev ${analysis.revision}` : "";
  const subtitle = [
    analysis.mainPartNumber,
    revision,
    analysis.mainDescription,
    `Analysis ${formatDateDMY(analysis.analysisDate)}`,
  ]
    .filter(Boolean)
    .join("   ·   ");
  const notice =
    missingCount > 0
      ? `INCOMPLETE - ${missingCount} item${missingCount > 1 ? "s" : ""} without cost. The total does not include them.`
      : undefined;
  const footerLabel = `SmartBid 2.0 · BOM Costs · ${analysis.mainPartNumber}`;
  const logoId = logo
    ? wb.addImage({ base64: logo, extension: "png" })
    : undefined;
  const byId = new Map<string, IBomCostItem>();
  items.forEach((i) => byId.set(i.id, i));

  // ─── Summary ───
  {
    const widths = [24, 20, 16, 16, 16, 16, 16, 16];
    const x = new XlSheet(wb, {
      name: "Summary",
      tabColor: XL_COLORS.accent,
      widths,
      footerLabel,
      notice,
      logoId,
      logoAspect: LOGO_ASPECT,
    });
    const span = x.lastCol;
    x.banner("BOM COST ANALYSIS", subtitle);

    x.kpis([
      {
        label: "Total cost (USD)",
        value: total,
        numFmt: NUM.usd,
        from: 1,
        to: 2,
        sub:
          bd.importTax > 0 || bd.workshop > 0
            ? [
                `Materials ${formatCurrency(bd.materials)}`,
                bd.importTax > 0 ? `Tax ${formatCurrency(bd.importTax)}` : "",
                bd.workshop > 0
                  ? `Workshop ${formatCurrency(bd.workshop)}`
                  : "",
              ]
                .filter(Boolean)
                .join(" · ")
            : contingencyPerYear > 0
              ? `Contingency ${contingencyPerYear}% / year`
              : "Contingency not applied",
      },
      {
        label: "Costed",
        value: `${cov.costed} / ${cov.eligible}`,
        from: 3,
        to: 4,
        sub:
          cov.covered > 0
            ? `${cov.covered} covered by a parent cost`
            : "No covered items",
      },
      {
        label: "Max lead time",
        value: maxLead ? `${maxLead.leadTimeDays} days` : "-",
        from: 5,
        to: 6,
        sub: maxLead ? maxLead.partNumber : "",
      },
      {
        label: "Status",
        value: cov.isComplete ? "Complete" : "Incomplete",
        from: 7,
        to: 8,
        sub: `${items.length} items in the BOM`,
      },
    ]);
    x.gap(14);

    x.sectionTitle("Analysis", span);
    x.keyValue("Main Part Number", analysis.mainPartNumber, {
      valueEnd: 5,
      bold: true,
    });
    x.keyValue("Description", analysis.mainDescription, {
      valueEnd: 5,
      wrap: true,
    });
    x.keyValue("Revision", analysis.revision, { valueEnd: 5 });
    x.keyValue("Analysis Date", formatDateDMY(analysis.analysisDate), {
      valueEnd: 5,
    });
    x.keyValue("Created By", analysis.createdBy, { valueEnd: 5 });
    x.keyValue("Last Modified", formatDateDMY(analysis.lastModified), {
      valueEnd: 5,
    });
    x.keyValue(
      "Contingency / year",
      contingencyPerYear > 0 ? contingencyPerYear / 100 : "",
      { valueEnd: 5, numFmt: NUM.pct },
    );
    x.keyValue("Import Tax Rate", taxRate > 0 ? taxRate / 100 : "", {
      valueEnd: 5,
      numFmt: NUM.pct,
    });
    x.keyValue(
      "Workshop (per unit)",
      workshop
        ? [
            workshop.hours > 0 ? `${workshop.hours} h` : "",
            workshop.cost > 0
              ? formatCurrency(workshop.cost, workshop.currency)
              : "",
          ]
            .filter(Boolean)
            .join(" · ")
        : "",
      { valueEnd: 5 },
    );
    x.gap(14);

    // Composition of the total: materials, import tax, workshop
    {
      const ranges: IXlRange[] = [
        { header: "Component", width: 0, from: 1, to: 2 },
        { header: "Basis", width: 0, wrap: true, from: 3, to: 5 },
        {
          header: "Total USD",
          width: 0,
          align: "right",
          numFmt: NUM.usd,
          from: 6,
          to: 7,
        },
        {
          header: "% of Total",
          width: 0,
          align: "right",
          numFmt: NUM.pct,
          from: 8,
          to: 8,
        },
      ];
      const pct = (v: number): number => (total > 0 ? v / total : 0);
      x.sectionTitle("Cost Composition", span, "What makes up the Total Cost");
      x.rangeHeader(ranges);
      x.rangeRow(ranges, [
        { value: "Materials", bold: true },
        contingencyPerYear > 0
          ? `BOM items incl. contingency ${contingencyPerYear}% / year`
          : "BOM items (no contingency)",
        bd.materials,
        pct(bd.materials),
      ]);
      x.rangeRow(
        ranges,
        [
          { value: "Import tax", bold: true, color: XL_COLORS.accentDark },
          taxRate > 0
            ? `${taxedCount} item${taxedCount === 1 ? "" : "s"} × ${taxRate}% (Global BU prices)`
            : "Not applied",
          bd.importTax,
          pct(bd.importTax),
        ],
        { zebra: true },
      );
      x.rangeRow(ranges, [
        { value: "Workshop - Assembly & Test", bold: true },
        workshop
          ? `${workshop.hours || 0} h per unit${workshop.jobFunction ? ` · ${workshop.jobFunction}` : ""}`
          : "Not informed",
        bd.workshop,
        pct(bd.workshop),
      ]);
      x.total("TOTAL BOM COST", span, [
        { col: 6, value: total, numFmt: NUM.usd },
        { col: 8, value: total > 0 ? 1 : 0, numFmt: NUM.pct },
      ]);
      x.gap(14);
    }

    if (workshop) {
      x.sectionTitle(
        "Workshop - Assembly & Test",
        span,
        "Per unit of the main item",
      );
      x.keyValue("Hours", workshop.hours || 0, {
        valueEnd: 5,
        numFmt: NUM.hours,
        bold: true,
      });
      x.keyValue("Function", workshop.jobFunction || "", { valueEnd: 5 });
      x.keyValue("Phase", workshop.phase || "", { valueEnd: 5 });
      x.keyValue("Cost (as entered)", workshop.cost || 0, {
        valueEnd: 5,
        numFmt: currencyFmt(workshop.currency),
      });
      if (workshop.currency === "BRL") {
        x.keyValue("Rate (BRL per 1 USD)", workshop.rateUsed || "", {
          valueEnd: 5,
          numFmt: NUM.rate,
        });
      }
      x.keyValue("Cost (USD)", workshop.costUSD || 0, {
        valueEnd: 5,
        numFmt: NUM.usd,
        bold: true,
      });
      x.keyValue("Notes", workshop.notes || "", { valueEnd: 5, wrap: true });
      x.note(BID_DESTINATION, span, "info");
      x.gap(14);
    }

    // Cost sources: only items whose own cost is in the total
    const bySource = new Map<
      string,
      { count: number; usd: number; tax: number }
    >();
    items.forEach((i) => {
      if (cov.statuses.get(i.id) !== "costed") return;
      const key = sourceLabel(i);
      const cur = bySource.get(key) || { count: 0, usd: 0, tax: 0 };
      cur.count++;
      cur.usd += i.totalCostInclCont;
      cur.tax += taxByRow.get(i.id) || 0;
      bySource.set(key, cur);
    });
    const sources: string[] = [];
    bySource.forEach((_v, k) => sources.push(k));
    sources.sort((a, b) => bySource.get(b)!.usd - bySource.get(a)!.usd);

    if (sources.length > 0) {
      const ranges: IXlRange[] = [
        { header: "Cost Source", width: 0, from: 1, to: 2 },
        {
          header: "Items",
          width: 0,
          align: "right",
          numFmt: NUM.int,
          from: 3,
          to: 3,
        },
        {
          header: showTax ? "Total USD (incl. tax)" : "Total USD",
          width: 0,
          align: "right",
          numFmt: NUM.usd,
          from: 4,
          to: 5,
        },
        {
          header: "Import Tax USD",
          width: 0,
          align: "right",
          numFmt: NUM.usd,
          from: 6,
          to: 6,
        },
        {
          header: "% of BOM Items",
          width: 0,
          align: "right",
          numFmt: NUM.pct,
          from: 7,
          to: 8,
        },
      ];
      x.sectionTitle("Cost Sources", span, "Items priced directly");
      x.rangeHeader(ranges);
      sources.forEach((s, i) => {
        const v = bySource.get(s)!;
        x.rangeRow(
          ranges,
          [
            { value: s, bold: true },
            v.count,
            v.usd,
            v.tax > 0 ? { value: v.tax, color: XL_COLORS.accentDark } : null,
            bd.items > 0 ? v.usd / bd.items : 0,
          ],
          { zebra: i % 2 === 1 },
        );
      });
      x.gap(14);
    }

    // Date freshness
    const fresh = { recent: 0, warn: 0, old: 0 };
    items.forEach((i) => {
      if (cov.statuses.get(i.id) !== "costed") return;
      const b = dateAgeBucket(i.dateReference);
      if (b) fresh[b]++;
    });
    const dated = fresh.recent + fresh.warn + fresh.old;
    if (dated > 0) {
      const ranges: IXlRange[] = [
        { header: "Date Freshness", width: 0, from: 1, to: 2 },
        {
          header: "Items",
          width: 0,
          align: "right",
          numFmt: NUM.int,
          from: 3,
          to: 4,
        },
        {
          header: "% of Dated",
          width: 0,
          align: "right",
          numFmt: NUM.pct,
          from: 5,
          to: 6,
        },
        { header: "Rule", width: 0, from: 7, to: 8 },
      ];
      x.sectionTitle("Date Freshness", span, "Age of the cost reference date");
      x.rangeHeader(ranges);
      const rows: Array<[string, number, string, string]> = [
        ["Recent", fresh.recent, XL_COLORS.success, "Less than 1 year"],
        ["Over 1 year", fresh.warn, XL_COLORS.warningText, "1 to 2 years"],
        ["Over 2 years", fresh.old, XL_COLORS.danger, "2 years or more"],
      ];
      rows.forEach((r, i) => {
        x.rangeRow(
          ranges,
          [{ value: r[0], bold: true, color: r[2] }, r[1], r[1] / dated, r[3]],
          { zebra: i % 2 === 1 },
        );
      });
      x.gap(14);
    }

    const rates: string[] = Object.keys(analysis.currencyRatesUsed || {});
    if (rates.length > 0) {
      const ranges: IXlRange[] = [
        { header: "Currency", width: 0, from: 1, to: 2 },
        {
          header: "Rate (per 1 USD)",
          width: 0,
          align: "right",
          numFmt: NUM.rate,
          from: 3,
          to: 4,
        },
      ];
      x.sectionTitle("Exchange Rates Used", span);
      x.rangeHeader(ranges);
      rates.forEach((cur, i) => {
        x.rangeRow(
          ranges,
          [{ value: cur, bold: true }, analysis.currencyRatesUsed[cur]],
          { zebra: i % 2 === 1 },
        );
      });
      x.gap(14);
    }

    if (missingCount > 0) {
      const ranges: IXlRange[] = [
        { header: "Item", width: 0, from: 1, to: 1 },
        { header: "Part Number", width: 0, from: 2, to: 3 },
        { header: "Description", width: 0, from: 4, to: 6 },
        {
          header: "Qty",
          width: 0,
          align: "right",
          numFmt: NUM.int,
          from: 7,
          to: 7,
        },
        { header: "Parent", width: 0, from: 8, to: 8 },
      ];
      x.sectionTitle("Items Missing Cost", span, `${missingCount} to review`);
      x.rangeHeader(ranges);
      cov.missingIds.forEach((id, i) => {
        const it = byId.get(id)!;
        const parent = it.parentId ? byId.get(it.parentId) : undefined;
        x.rangeRow(
          ranges,
          [
            { value: `${it.level}.${it.findNumber || ""}`, bold: true },
            { value: it.partNumber || "-", bold: true },
            it.description || "-",
            it.qty,
            parent ? parent.partNumber : "-",
          ],
          { fill: XL_COLORS.warningFill, zebra: i % 2 === 1 },
        );
      });
      x.gap(14);
    }

    x.note(
      "Total = BOM items priced directly (incl. contingency and import tax) + workshop. Rolled-up parents are skipped (their children are summed) and children of a parent with its own cost are not counted again.",
      span,
      "info",
    );
    x.note(
      "Contingency per year corrects past prices to today's value: each year between the cost Date Ref. and the current year adds this percentage to the item cost.",
      span,
      "muted",
    );
    x.note(
      `Import tax${taxRate > 0 ? ` (${taxRate}%)` : ""} applies to items priced in Global BUs (Financials): item cost incl. contingency × (1 + rate). BUMBL, BUMBR, Quotation and Manual prices are not taxed unless switched on for the row.`,
      span,
      "muted",
    );
    x.note(
      `Workshop = hours and cost to assemble and test one unit of the main item. ${BID_DESTINATION}`,
      span,
      "muted",
    );
    x.note(
      "Search priority: 1st BUMBL, 2nd BUMBR, 3rd Global BUs (Financials), using the most recent Last Order Date when a part exists in several Business Units.",
      span,
      "muted",
    );
  }

  // ─── BOM Costs ───
  {
    const cols = activeColumns([
      { key: "item", header: "Item", width: 8, align: "center" },
      { key: "pn", header: "Part Number", width: 28 },
      { key: "desc", header: "Description", width: 42, wrap: true },
      { key: "qty", header: "Qty", width: 7, align: "right", numFmt: NUM.int },
      {
        key: "unit",
        header: "Cost / Item USD",
        width: 17,
        align: "right",
        numFmt: NUM.usd,
      },
      { key: "orig", header: "Original Cost", width: 16, align: "right" },
      {
        key: "cont",
        header: "Cont. %",
        width: 9,
        align: "right",
        numFmt: NUM.pctWhole,
      },
      {
        key: "tax",
        header: "Import Tax %",
        width: 10,
        align: "right",
        numFmt: NUM.pctWhole,
        when: showTax,
      },
      {
        key: "taxUsd",
        header: "Import Tax USD",
        width: 15,
        align: "right",
        numFmt: NUM.usd,
        when: showTax,
      },
      {
        key: "total",
        header: showTax ? "Total USD (Cont. + Tax)" : "Total USD",
        width: 18,
        align: "right",
        numFmt: NUM.usd,
      },
      {
        key: "lead",
        header: "Lead Time (days)",
        width: 11,
        align: "right",
        numFmt: NUM.int,
      },
      { key: "src", header: "Source", width: 14, align: "center" },
      { key: "ref", header: "Cost Ref", width: 14, wrap: true },
      {
        key: "date",
        header: "Date Ref",
        width: 13,
        align: "center",
        numFmt: NUM.date,
      },
      { key: "status", header: "Status", width: 19, align: "center" },
      { key: "comments", header: "Comments", width: 32, wrap: true },
    ]);
    const x = new XlSheet(wb, {
      name: "BOM Costs",
      tabColor: XL_TAB_COLORS.assets,
      widths: cols.map((c) => c.width),
      footerLabel,
      notice,
      logoId,
      logoAspect: LOGO_ASPECT,
    });
    const span = x.lastCol;
    const pnCol = colOf(cols, "pn");
    const totalCol = colOf(cols, "total");
    x.banner("BOM COSTS", subtitle);

    const headerRow = x.header(cols);
    x.freeze(headerRow, pnCol);
    x.printTitles(headerRow);

    items.forEach((it, i) => {
      const status = cov.statuses.get(it.id) || "costed";
      const age = dateAgeBucket(it.dateReference);
      const hasOrig =
        it.originalCost > 0 &&
        !!it.originalCurrency &&
        it.originalCurrency.toUpperCase() !== "USD";
      const muted = status === "covered";
      const values = pickRow(cols, {
        item: `${it.level}.${it.findNumber || ""}`,
        pn: {
          value: it.partNumber || "-",
          bold: it.level === 1 || it.isRolledUp || status === "costed",
        },
        desc: it.description,
        qty: it.qty > 0 ? it.qty : null,
        unit: it.costPerItemUSD > 0 ? it.costPerItemUSD : null,
        orig: hasOrig
          ? { value: it.originalCost, numFmt: currencyFmt(it.originalCurrency) }
          : null,
        cont:
          it.contingencyPercent > 0 && !it.isRolledUp
            ? it.contingencyPercent
            : null,
        tax:
          (it.importTaxPercent || 0) > 0 && !it.isRolledUp
            ? it.importTaxPercent
            : null,
        taxUsd:
          (taxByRow.get(it.id) || 0) > 0
            ? {
                value: taxByRow.get(it.id) || 0,
                color: muted ? undefined : XL_COLORS.accentDark,
              }
            : null,
        total:
          it.totalCostInclCont > 0
            ? { value: it.totalCostInclCont, bold: !muted }
            : null,
        lead: it.leadTimeDays > 0 ? it.leadTimeDays : null,
        src: sourceLabel(it),
        ref: it.isRolledUp ? "" : it.costReference,
        date: it.isRolledUp
          ? null
          : {
              value: toExcelDate(it.dateReference),
              color:
                age === "recent"
                  ? XL_COLORS.success
                  : age === "warn"
                    ? XL_COLORS.warningText
                    : age === "old"
                      ? XL_COLORS.danger
                      : undefined,
              bold: age === "old",
            },
        status: {
          value: STATUS_LABEL[status],
          bold: true,
          color: STATUS_COLOR[status],
        },
        comments: it.comments,
      } as Record<string, XlValue>);
      x.dataRow(cols, values, {
        zebra: i % 2 === 1,
        fill:
          status === "missing"
            ? XL_COLORS.warningFill
            : it.level === 1
              ? XL_COLORS.accentTint
              : undefined,
        bold: it.level === 1,
        italic: it.isRolledUp,
        muted,
        indentCol: pnCol,
        indent: Math.min(15, Math.max(0, it.level - 1)),
      });
    });

    if (items.length > 0) {
      x.ws.autoFilter = {
        from: { row: headerRow, column: 1 },
        to: { row: x.row - 1, column: span },
      };
    }
    if (showTax || workshop) {
      const taxUsdCol = showTax ? colOf(cols, "taxUsd") : 0;
      const itemValues: IXlPlacedValue[] = [
        { col: totalCol, value: bd.items, numFmt: NUM.usd },
      ];
      if (taxUsdCol > 0) {
        itemValues.push({
          col: taxUsdCol,
          value: bd.importTax,
          numFmt: NUM.usd,
        });
      }
      x.total(
        showTax ? "BOM ITEMS (MATERIALS + IMPORT TAX)" : "BOM ITEMS",
        span,
        itemValues,
        "sub",
        1,
      );
      if (workshop) {
        x.total(
          `WORKSHOP - ASSEMBLY & TEST (${workshop.hours || 0} h per unit)`,
          span,
          [{ col: totalCol, value: bd.workshop, numFmt: NUM.usd }],
          "sub",
          1,
        );
      }
    }
    x.total(
      "TOTAL BOM COST",
      span,
      [{ col: totalCol, value: total, numFmt: NUM.usd }],
      "grand",
      1,
    );
    x.gap(10);
    x.note(
      "Italic rows are sums of their children. Grey rows are already included in a parent that has its own cost. Highlighted rows have no cost yet.",
      span,
      "muted",
    );
    if (showTax) {
      x.note(
        `Import Tax USD = item cost incl. contingency × ${taxRate}%; it is already inside the Total column. Rolled-up rows show the tax summed from their children.`,
        span,
        "muted",
      );
    }
    if (workshop) {
      x.note(
        `Workshop is not a BOM line: it is added once to the total. ${BID_DESTINATION}`,
        span,
        "muted",
      );
    }
  }

  const buffer = await wb.xlsx.writeBuffer();
  const fileName = getBomExcelFilename(analysis);
  downloadBlob(new Blob([buffer], { type: XLSX_MIME }), fileName);
  return fileName;
}

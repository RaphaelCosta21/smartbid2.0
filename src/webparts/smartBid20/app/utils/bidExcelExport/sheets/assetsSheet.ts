import { getAssetsCostCompleteness } from "../../costCalculations";
import { IBidExcelContext, newSheet } from "../context";
import {
  IXlRange,
  NUM,
  XL_COLORS,
  XlValue,
  activeColumns,
  colOf,
  pickRow,
  qtyFmt,
  toExcelDate,
} from "../excelStyles";
import {
  IAssetSummaryRow,
  buildAssetSummary,
  fmtUSD,
  getBidContingency,
} from "../rows";

const DASH: XlValue = {
  value: "-",
  color: XL_COLORS.textMuted,
  align: "center",
};

export function buildAssetsSheet(ctx: IBidExcelContext): void {
  const { bid, view, opts } = ctx;
  const cols = activeColumns([
    { key: "no", header: "#", width: 5, align: "center" },
    {
      key: "div",
      header: "Division",
      width: 10,
      align: "center",
      when: view.isIntegrated,
    },
    { key: "offer", header: "Equipment Offer", width: 34, wrap: true },
    { key: "pn", header: "OII/MFG PN", width: 18, wrap: true },
    { key: "resType", header: "Res. Type", width: 15, wrap: true },
    { key: "subType", header: "Sub-Type", width: 15, wrap: true },
    {
      key: "qtyOp",
      header: "Qty Op",
      width: 7,
      align: "right",
      numFmt: NUM.int,
    },
    {
      key: "qtySp",
      header: "Qty Sp",
      width: 7,
      align: "right",
      numFmt: NUM.int,
    },
    { key: "avail", header: "Availability", width: 13, wrap: true },
    { key: "acq", header: "Acq. Type", width: 15, wrap: true },
    {
      key: "unit",
      header: "Unit Cost USD",
      width: 17,
      align: "right",
      numFmt: NUM.usd,
    },
    {
      key: "total",
      header: "Total Cost USD",
      width: 18,
      align: "right",
      numFmt: NUM.usd,
    },
    { key: "cat", header: "CAPEX/OPEX", width: 13, align: "center" },
    { key: "supplier", header: "Supplier", width: 22, wrap: true },
    { key: "costRef", header: "Cost Ref", width: 16, wrap: true },
    {
      key: "dateRef",
      header: "Date Ref",
      width: 12,
      align: "center",
      numFmt: NUM.date,
    },
    {
      key: "lead",
      header: "Lead Time (days)",
      width: 10,
      align: "right",
      numFmt: NUM.int,
    },
    { key: "includes", header: "Includes", width: 34, wrap: true },
    {
      key: "notes",
      header: "Notes",
      width: 30,
      wrap: true,
      when: opts.includeNotes,
    },
  ]);
  const x = newSheet(
    ctx,
    "assets",
    cols.map((c) => c.width),
  );
  const span = x.lastCol;
  const totalCol = colOf(cols, "total");
  const s = view.summary;

  x.banner("ASSETS BREAKDOWN", ctx.subtitle);
  const cont = getBidContingency(bid);

  const groups = buildAssetSummary(bid);
  if (groups.length === 0) {
    x.note("No assets registered on this BID.", span, "muted");
    return;
  }

  const headerRow = x.header(cols);
  x.freeze(headerRow, colOf(cols, "offer"));
  x.printTitles(headerRow);

  const rowValues = (r: IAssetSummaryRow): XlValue[] =>
    pickRow(cols, {
      no: r.lineNo === null ? DASH : r.lineNo,
      div: r.division,
      offer: { value: r.equipmentOffer, bold: true },
      pn: r.partNumber,
      resType: r.resourceType,
      subType: r.subType,
      qtyOp: { value: r.qtyOp, numFmt: qtyFmt(r.qtyOp) },
      qtySp: { value: r.qtySp, numFmt: qtyFmt(r.qtySp) },
      avail: r.availability,
      acq: r.notOffered
        ? { value: r.acqType, color: XL_COLORS.danger, bold: true }
        : r.acqType,
      unit:
        r.unitCost === null
          ? DASH
          : {
              value: r.unitCost,
              numFmt: r.unitIsDaily ? NUM.usdPerDay : NUM.usd,
            },
      total: { value: r.total, bold: true },
      cat: r.category,
      supplier: r.supplier,
      costRef: r.costRef,
      dateRef: toExcelDate(r.dateRef),
      lead: r.leadTime,
      includes: { value: r.includes, color: XL_COLORS.textSecondary },
      notes: r.notes,
    });

  const multiGroup = groups.length > 1;
  groups.forEach((g) => {
    if (g.section || multiGroup) {
      const parts = [
        g.section
          ? g.section.sectionTitle || "Untitled Section"
          : "Items without section",
        `${g.rows.length} items`,
      ];
      if (g.capex > 0) parts.push(`CAPEX ${fmtUSD(g.capex)}`);
      if (g.opex > 0) parts.push(`OPEX ${fmtUSD(g.opex)}`);
      if (g.uncategorized > 0)
        parts.push(`Uncategorized ${fmtUSD(g.uncategorized)}`);
      x.band(parts.join("   ·   "), span, {
        color: g.section ? g.section.sectionColor : undefined,
        values: [{ col: totalCol, value: g.total, numFmt: NUM.usd }],
      });
    }
    g.rows.forEach((r, i) =>
      x.dataRow(cols, rowValues(r), { zebra: i % 2 === 1 }),
    );
  });

  x.total(
    "TOTAL ASSETS",
    span,
    [{ col: totalCol, value: s.assetsCostUSD, numFmt: NUM.usd }],
    "grand",
  );
  x.gap(18);

  // ─── Totals by bucket and by resource type, aligned with the Total Cost USD column ───
  const labelTo = Math.max(1, colOf(cols, "pn"));
  const hasUncat = view.assetsUncategorizedUSD > 0;
  const money = { width: 0, align: "right" as const, numFmt: NUM.usd };
  const ranges: IXlRange[] = [
    { header: "Resource Type", width: 0, from: 1, to: labelTo },
  ];
  if (hasUncat) {
    ranges.push({
      ...money,
      header: "CAPEX USD",
      from: labelTo + 1,
      to: labelTo + 2,
    });
    ranges.push({
      ...money,
      header: "OPEX USD",
      from: labelTo + 3,
      to: labelTo + 5,
    });
    ranges.push({
      ...money,
      header: "Uncategorized USD",
      from: labelTo + 6,
      to: totalCol - 1,
    });
  } else {
    ranges.push({
      ...money,
      header: "CAPEX USD",
      from: labelTo + 1,
      to: labelTo + 3,
    });
    ranges.push({
      ...money,
      header: "OPEX USD",
      from: labelTo + 4,
      to: totalCol - 1,
    });
  }
  ranges.push({ ...money, header: "Total USD", from: totalCol, to: totalCol });
  ranges.push({
    header: "% of Assets",
    width: 0,
    align: "right",
    numFmt: NUM.pct,
    from: totalCol + 1,
    to: totalCol + 1,
  });

  x.sectionTitle(
    "Assets Totals by Resource Type",
    span,
    "Tooling, ROV, Survey, OPG… · CAPEX / OPEX split",
  );
  x.rangeHeader(ranges);
  const assetsTotal = s.assetsCostUSD;
  view.assetsByType
    .filter((rt) => rt.totalUSD !== 0)
    .forEach((rt, i) => {
      const vals: XlValue[] = [rt.resourceType, rt.capexUSD, rt.opexUSD];
      if (hasUncat) vals.push(rt.uncategorizedUSD);
      vals.push({ value: rt.totalUSD, bold: true });
      vals.push(assetsTotal > 0 ? rt.totalUSD / assetsTotal : 0);
      x.rangeRow(ranges, vals, { zebra: i % 2 === 1 });
    });
  const totalVals: XlValue[] = [
    { value: "TOTAL ASSETS", bold: true },
    { value: s.assetsCapexUSD, bold: true },
    { value: s.assetsOpexUSD, bold: true },
  ];
  if (hasUncat)
    totalVals.push({ value: view.assetsUncategorizedUSD, bold: true });
  totalVals.push({ value: assetsTotal, bold: true });
  totalVals.push({ value: assetsTotal > 0 ? 1 : 0, bold: true });
  x.rangeRow(ranges, totalVals, {
    fill: XL_COLORS.accentTint,
    fontColor: XL_COLORS.navy,
  });
  x.gap(6);
  x.note(
    `Assets in BRL: ${fmtBRL(assetsTotal * s.ptaxUsed)} (USD × PTAX ${s.ptaxUsed > 0 ? s.ptaxUsed.toFixed(4) : "-"}).`,
    span,
    "muted",
  );
  x.note(
    "One line per item. Total Cost USD rolls up everything tied to the item - equipment, availability splits, sub-items, PCF (when it drives the cost) and services & fees - exactly as counted in the Cost Summary.",
    span,
    "info",
  );
  if (cont && cont.perYear > 0) {
    x.note(
      `Contingency of ${cont.perYear}% per year applied on unit costs, based on the age of each Date Ref.`,
      span,
      "info",
    );
  }
  if (cont && (cont.engSolutionsPct || 0) > 0) {
    x.note(
      `Eng. Solutions contingency of ${cont.engSolutionsPct}% applied on the unit costs of Eng. Solutions items (incl. their splits and PCF), on top of the price already corrected by the contingency per year.`,
      span,
      "info",
    );
  }
  const completeness = getAssetsCostCompleteness(
    bid.scopeItems || [],
    bid.assetBreakdown || [],
    cont,
  );
  if (completeness.totalMissing > 0) {
    x.note(
      `${completeness.totalMissing} of ${completeness.totalItems} asset lines (items, sub-items, PCF) still have no cost mapped.`,
      span,
      "warning",
    );
  }
}

function fmtBRL(v: number): string {
  return (
    "R$ " +
    (v || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

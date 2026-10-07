import { getAssetsCostCompleteness } from "../../costCalculations";
import { IBidExcelContext, newSheet } from "../context";
import {
  IXlColumn,
  NUM,
  XL_COLORS,
  displayDate,
  toExcelDate,
} from "../excelStyles";
import { getBidContingency } from "../rows";

export function buildCostSummarySheet(ctx: IBidExcelContext): void {
  const { bid, view } = ctx;
  const s = view.summary;
  const totalUSD = s.totalCostUSD;
  const pctOf = (v: number): number => (totalUSD > 0 ? v / totalUSD : 0);
  const x = newSheet(ctx, "costSummary", [44, 22, 22, 19, 16]);
  const span = x.lastCol;

  x.banner("COST SUMMARY", ctx.subtitle);

  const capexPct = pctOf(view.capex.usd);
  const opexPct = pctOf(view.opex.usd);
  x.kpis([
    {
      label: "Total Cost USD",
      value: totalUSD,
      numFmt: NUM.usd,
      from: 1,
      to: 1,
    },
    {
      label: "Total Cost BRL",
      value: s.totalCostBRL,
      numFmt: NUM.brl,
      from: 2,
      to: 3,
    },
    {
      label: "PTAX used (USD→BRL)",
      value: s.ptaxUsed > 0 ? s.ptaxUsed : "-",
      numFmt: NUM.rate,
      sub: view.fx.capturedDate
        ? `Registered ${displayDate(view.fx.capturedDate)}`
        : "No BRL rate registered",
      from: 4,
      to: 5,
    },
  ]);
  x.gap(6);
  x.kpis([
    {
      label: "CAPEX",
      value: view.capex.usd,
      numFmt: NUM.usd,
      sub: `${(capexPct * 100).toFixed(1)}% of total`,
      from: 1,
      to: 1,
    },
    {
      label: "OPEX",
      value: view.opex.usd,
      numFmt: NUM.usd,
      sub: `${(opexPct * 100).toFixed(1)}% of total`,
      from: 2,
      to: 3,
    },
    {
      label: "Service Line · Currency",
      value: `${(bid.serviceLine || "N/A").toUpperCase()} · ${s.currency}`,
      from: 4,
      to: 5,
    },
  ]);
  x.gap(14);

  // ─── Cost Breakdown (same rows as the Cost Summary tab) ───
  x.sectionTitle(
    "Cost Breakdown",
    span,
    "Values in USD and BRL · % of total cost",
  );
  const cols: IXlColumn[] = [
    { header: "Category", width: 44 },
    { header: "USD", width: 22, align: "right", numFmt: NUM.usd },
    { header: "BRL", width: 22, align: "right", numFmt: NUM.brl },
    { header: "% of Total", width: 19, align: "right", numFmt: NUM.pct },
    { header: "Hours", width: 16, align: "right", numFmt: NUM.hours },
  ];
  x.header(cols);
  view.rows.forEach((r) => {
    x.dataRow(
      cols,
      [
        r.label,
        r.usd,
        r.brl,
        pctOf(r.usd),
        r.hours === undefined ? null : r.hours,
      ],
      r.indent
        ? { muted: true, indentCol: 1, indent: 2 }
        : { bold: true, fontColor: XL_COLORS.navy },
    );
  });
  x.total(
    "TOTAL",
    span,
    [
      { col: 2, value: totalUSD, numFmt: NUM.usd },
      { col: 3, value: s.totalCostBRL, numFmt: NUM.brl },
      { col: 4, value: totalUSD > 0 ? 1 : 0, numFmt: NUM.pct },
      { col: 5, value: view.hours.total || null, numFmt: NUM.hours },
    ],
    "grand",
  );
  x.gap(16);

  // ─── CAPEX x OPEX ───
  x.sectionTitle(
    "BID CAPEX x OPEX",
    span,
    "Hours, logistics, certifications and prep & mob are booked as CAPEX",
  );
  const bucketCols: IXlColumn[] = [
    { header: "Bucket", width: 44 },
    { header: "USD", width: 22, align: "right", numFmt: NUM.usd },
    { header: "BRL", width: 22, align: "right", numFmt: NUM.brl },
    { header: "% of Total", width: 19, align: "right", numFmt: NUM.pct },
    { header: "", width: 16 },
  ];
  x.header(bucketCols);
  const bucket = (
    label: string,
    b: {
      usd: number;
      brl: number;
      segments?: { label: string; usd: number; brl: number }[];
    },
  ): void => {
    x.dataRow(bucketCols, [label, b.usd, b.brl, pctOf(b.usd), null], {
      bold: true,
      fontColor: XL_COLORS.navy,
    });
    (b.segments || []).forEach((seg) =>
      x.dataRow(
        bucketCols,
        [seg.label, seg.usd, seg.brl, pctOf(seg.usd), null],
        {
          muted: true,
          indentCol: 1,
          indent: 2,
        },
      ),
    );
  };
  bucket("CAPEX", view.capex);
  bucket("OPEX", view.opex);
  if (view.uncategorized.usd > 0) {
    bucket("Uncategorized assets (no CAPEX/OPEX set)", view.uncategorized);
  }
  x.total(
    "TOTAL",
    span,
    [
      { col: 2, value: totalUSD, numFmt: NUM.usd },
      { col: 3, value: s.totalCostBRL, numFmt: NUM.brl },
      { col: 4, value: totalUSD > 0 ? 1 : 0, numFmt: NUM.pct },
    ],
    "grand",
  );
  x.gap(16);

  // ─── Assets by resource type (Tooling, ROV, Survey, OPG…) ───
  const types = view.assetsByType.filter((rt) => rt.totalUSD !== 0);
  if (types.length > 0) {
    const hasUncat = view.assetsUncategorizedUSD > 0;
    const assetsTotal = s.assetsCostUSD;
    x.sectionTitle("Assets by Resource Type", span, "USD");
    const typeCols: IXlColumn[] = hasUncat
      ? [
          { header: "Resource Type", width: 44 },
          { header: "CAPEX USD", width: 22, align: "right", numFmt: NUM.usd },
          { header: "OPEX USD", width: 22, align: "right", numFmt: NUM.usd },
          {
            header: "Uncategorized USD",
            width: 19,
            align: "right",
            numFmt: NUM.usd,
          },
          { header: "Total USD", width: 16, align: "right", numFmt: NUM.usd },
        ]
      : [
          { header: "Resource Type", width: 44 },
          { header: "CAPEX USD", width: 22, align: "right", numFmt: NUM.usd },
          { header: "OPEX USD", width: 22, align: "right", numFmt: NUM.usd },
          { header: "Total USD", width: 19, align: "right", numFmt: NUM.usd },
          { header: "% of Assets", width: 16, align: "right", numFmt: NUM.pct },
        ];
    x.header(typeCols);
    types.forEach((rt, i) => {
      x.dataRow(
        typeCols,
        hasUncat
          ? [
              rt.resourceType,
              rt.capexUSD,
              rt.opexUSD,
              rt.uncategorizedUSD,
              rt.totalUSD,
            ]
          : [
              rt.resourceType,
              rt.capexUSD,
              rt.opexUSD,
              rt.totalUSD,
              assetsTotal > 0 ? rt.totalUSD / assetsTotal : 0,
            ],
        { zebra: i % 2 === 1 },
      );
    });
    x.total(
      "TOTAL ASSETS",
      span,
      hasUncat
        ? [
            { col: 2, value: s.assetsCapexUSD, numFmt: NUM.usd },
            { col: 3, value: s.assetsOpexUSD, numFmt: NUM.usd },
            { col: 4, value: view.assetsUncategorizedUSD, numFmt: NUM.usd },
            { col: 5, value: assetsTotal, numFmt: NUM.usd },
          ]
        : [
            { col: 2, value: s.assetsCapexUSD, numFmt: NUM.usd },
            { col: 3, value: s.assetsOpexUSD, numFmt: NUM.usd },
            { col: 4, value: assetsTotal, numFmt: NUM.usd },
            { col: 5, value: assetsTotal > 0 ? 1 : 0, numFmt: NUM.pct },
          ],
      "sub",
    );
    x.gap(16);
  }

  // ─── Exchange rates & data quality ───
  x.sectionTitle("Exchange Rates Used", span);
  const fxCols: IXlColumn[] = [
    { header: "Currency", width: 44 },
    { header: "1 USD =", width: 22, align: "right", numFmt: NUM.rate },
    { header: "Rate Date", width: 22, align: "center", numFmt: NUM.date },
    { header: "Source", width: 19 },
    { header: "Registered", width: 16, align: "center", numFmt: NUM.date },
  ];
  const rates = view.fx.rates.filter(
    (r) => (r.currency || "").toUpperCase() !== "USD",
  );
  if (rates.length > 0) {
    x.header(fxCols);
    rates.forEach((r, i) =>
      x.dataRow(
        fxCols,
        [
          (r.currency || "").toUpperCase(),
          r.rate,
          toExcelDate(r.rateDate),
          r.source || "",
          toExcelDate(r.capturedDate),
        ],
        { zebra: i % 2 === 1 },
      ),
    );
  } else if (s.ptaxUsed > 0) {
    x.header(fxCols);
    x.dataRow(fxCols, [
      "BRL (PTAX)",
      s.ptaxUsed,
      toExcelDate(bid.opportunityInfo?.ptaxDate),
      "",
      null,
    ]);
  }
  x.gap(6);
  x.note(
    "All USD values are converted with the exchange rates registered on this BID (Overview → Exchange Rates). BRL = USD × PTAX, except hours, which are priced in BRL.",
    span,
    "info",
  );
  const missing = s.missingRateCurrencies || [];
  if (missing.length > 0) {
    x.note(
      `No exchange rate registered on this BID for ${missing.join(", ")} - these values are left out of the USD totals. Update the rates on the Overview tab.`,
      span,
      "warning",
    );
  }
  const cont = getBidContingency(bid);
  if (cont && cont.perYear > 0) {
    x.note(
      `Assets contingency of ${cont.perYear}% per year applied on unit costs, based on the age of each cost's date reference.`,
      span,
      "info",
    );
  }
  if (cont && (cont.engSolutionsPct || 0) > 0) {
    x.note(
      `Eng. Solutions contingency of ${cont.engSolutionsPct}% applied on the unit costs of Eng. Solutions items, on top of the price already corrected by the contingency per year.`,
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
      `${completeness.totalMissing} of ${completeness.totalItems} asset lines (items, sub-items, PCF) have no cost mapped yet - the assets total may be understated.`,
      span,
      "warning",
    );
  }
  if (s.notes) {
    x.gap(6);
    x.note(`Notes: ${s.notes}`, span, "muted");
  }
}

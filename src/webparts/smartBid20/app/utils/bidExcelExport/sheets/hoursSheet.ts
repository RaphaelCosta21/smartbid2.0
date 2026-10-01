import {
  IEngineeringHoursItem,
  IHoursItem,
  IHoursSection,
  IHoursSectionGroup,
} from "../../../models";
import { IBidExcelContext, newSheet } from "../context";
import {
  IXlColumnDef,
  IXlRange,
  NUM,
  XL_COLORS,
  XlSheet,
  activeColumns,
  colOf,
  pickRow,
  qtyFmt,
} from "../excelStyles";

export function buildHoursSheet(ctx: IBidExcelContext): void {
  const { bid, view, opts } = ctx;
  const s = view.summary;
  const ptax = s.ptaxUsed;
  const usdOf = (brl: number): number => (ptax > 0 ? brl / ptax : 0);
  const hs = bid.hoursSummary;

  const cols = activeColumns([
    { key: "fn", header: "Function", width: 34, wrap: true },
    { key: "phase", header: "Phase", width: 18, wrap: true },
    { key: "hpd", header: "Hrs/Day", width: 9, align: "right", numFmt: NUM.dec },
    { key: "ppl", header: "People", width: 8, align: "right", numFmt: NUM.int },
    { key: "days", header: "Work Days", width: 10, align: "right", numFmt: NUM.dec },
    { key: "util", header: "Util %", width: 8, align: "right", numFmt: NUM.pctWhole },
    { key: "hours", header: "Total Hrs", width: 11, align: "right", numFmt: NUM.hours },
    { key: "brl", header: "Cost (BRL)", width: 18, align: "right", numFmt: NUM.brl },
    { key: "usd", header: "Cost (USD)", width: 18, align: "right", numFmt: NUM.usd },
    { key: "div", header: "Division", width: 10, align: "center", when: view.isIntegrated },
    { key: "notes", header: "Notes", width: 34, wrap: true, when: opts.includeNotes },
  ]);
  const x = newSheet(ctx, "hours", cols.map((c) => c.width));
  const span = x.lastCol;
  const hoursCol = colOf(cols, "hours");
  const brlCol = colOf(cols, "brl");
  const usdCol = colOf(cols, "usd");

  x.banner("HOURS & PERSONNEL", ctx.subtitle);

  // ─── Summary (same figures as the Cost Summary) ───
  x.sectionTitle("Summary", span, "USD = BRL ÷ PTAX");
  const sumRanges: IXlRange[] = [
    { header: "Category", width: 0, from: 1, to: hoursCol - 1 },
    { header: "Total Hrs", width: 0, align: "right", numFmt: NUM.hours, from: hoursCol, to: hoursCol },
    { header: "Cost (BRL)", width: 0, align: "right", numFmt: NUM.brl, from: brlCol, to: brlCol },
    { header: "Cost (USD)", width: 0, align: "right", numFmt: NUM.usd, from: usdCol, to: usdCol },
  ];
  x.rangeHeader(sumRanges);
  const sumRow = (label: string, h: number, brl: number, i: number): void => {
    x.rangeRow(sumRanges, [label, h, brl, usdOf(brl)], { zebra: i % 2 === 1 });
  };
  sumRow("Engineering Hours", view.hours.engineering, s.engineeringHoursCostBRL, 0);
  sumRow("Onshore Hours", view.hours.onshore, s.onshoreHoursCostBRL, 1);
  sumRow("Offshore Hours", view.hours.offshore, s.offshoreHoursCostBRL, 2);
  x.rangeRow(
    sumRanges,
    [
      { value: "TOTAL", bold: true },
      { value: view.hours.total, bold: true },
      { value: s.totalHoursCostBRL, bold: true },
      { value: s.totalHoursCostUSD, bold: true },
    ],
    { fill: XL_COLORS.teal, fontColor: XL_COLORS.white },
  );
  x.gap(18);

  // ─── Engineering (deliverable-based) ───
  const engItems: IEngineeringHoursItem[] = (hs && hs.engineeringHours && hs.engineeringHours.engineeringItems) || [];
  const engLegacy: IHoursItem[] = (hs && hs.engineeringHours && hs.engineeringHours.items) || [];
  x.sectionTitle("Engineering Hours", span, "Deliverables per item · hours by resource");
  if (engItems.length > 0) {
    writeEngineeringItems(x, cols, engItems);
  }
  if (engLegacy.length > 0) {
    if (engItems.length > 0) x.gap(8);
    writeHoursTable(x, cols, engLegacy, (hs && hs.engineeringHours && hs.engineeringHours.sections) || [], usdOf);
  }
  if (engItems.length === 0 && engLegacy.length === 0) {
    x.note("No engineering hours.", span, "muted");
  }
  x.total(
    "Engineering Hours total",
    span,
    [
      { col: hoursCol, value: view.hours.engineering, numFmt: NUM.hours },
      { col: brlCol, value: s.engineeringHoursCostBRL, numFmt: NUM.brl },
      { col: usdCol, value: usdOf(s.engineeringHoursCostBRL), numFmt: NUM.usd },
    ],
  );
  x.gap(18);

  const writeSection = (
    title: string,
    section: IHoursSection | undefined,
    totalH: number,
    totalBRL: number,
  ): void => {
    x.sectionTitle(title, span);
    const items = (section && section.items) || [];
    if (items.length === 0) {
      x.note("No items.", span, "muted");
    } else {
      writeHoursTable(x, cols, items, (section && section.sections) || [], usdOf);
    }
    x.total(
      `${title} total`,
      span,
      [
        { col: hoursCol, value: totalH, numFmt: NUM.hours },
        { col: brlCol, value: totalBRL, numFmt: NUM.brl },
        { col: usdCol, value: usdOf(totalBRL), numFmt: NUM.usd },
      ],
    );
    x.gap(18);
  };
  writeSection("Onshore Hours", hs && hs.onshoreHours, view.hours.onshore, s.onshoreHoursCostBRL);
  writeSection("Offshore Hours", hs && hs.offshoreHours, view.hours.offshore, s.offshoreHoursCostBRL);
}

function writeHoursTable(
  x: XlSheet,
  cols: IXlColumnDef[],
  items: IHoursItem[],
  groups: IHoursSectionGroup[],
  usdOf: (brl: number) => number,
): void {
  const span = x.lastCol;
  x.header(cols);
  const write = (list: IHoursItem[]): void => {
    let zebra = false;
    list.forEach((i) => {
      if (i.isSeparator) {
        x.dataRow(cols, pickRow(cols, { fn: i.separatorLabel || "—" }), {
          italic: true,
          muted: true,
          fill: XL_COLORS.band,
        });
        return;
      }
      x.dataRow(
        cols,
        pickRow(cols, {
          fn: i.function || i.requirementName,
          phase: i.phase,
          hpd: { value: i.hoursPerDay || 0, numFmt: qtyFmt(i.hoursPerDay) },
          ppl: i.pplQty || 0,
          days: { value: i.workDays || 0, numFmt: qtyFmt(i.workDays) },
          util: i.utilizationPercent || 0,
          hours: i.totalHours || 0,
          brl: i.costBRL || 0,
          usd: usdOf(i.costBRL || 0),
          div: i.integratedDivision || "",
          notes: i.notes || "",
        }),
        { zebra },
      );
      zebra = !zebra;
    });
  };
  const ids = new Set(groups.map((g) => g.id));
  write(items.filter((i) => !i.sectionId || !ids.has(i.sectionId)));
  groups.forEach((g) => {
    const gi = items.filter((i) => i.sectionId === g.id);
    const real = gi.filter((i) => !i.isSeparator);
    const h = real.reduce((t, i) => t + (i.totalHours || 0), 0);
    const brl = real.reduce((t, i) => t + (i.costBRL || 0), 0);
    x.band(`${g.title || "Untitled Section"}   ·   ${real.length} rows`, span, {
      color: g.color,
      values: [
        { col: colOf(cols, "hours"), value: h, numFmt: NUM.hours },
        { col: colOf(cols, "brl"), value: brl, numFmt: NUM.brl },
        { col: colOf(cols, "usd"), value: usdOf(brl), numFmt: NUM.usd },
      ],
    });
    write(gi);
  });
}

function writeEngineeringItems(
  x: XlSheet,
  cols: IXlColumnDef[],
  items: IEngineeringHoursItem[],
): void {
  const hoursCol = colOf(cols, "hours");
  const ranges: IXlRange[] = [
    { header: "Item / Deliverable", width: 0, from: 1, to: 1 },
    { header: "Section", width: 0, from: 2, to: 2 },
    { header: "Equipment Offer · Hours by resource", width: 0, from: 3, to: hoursCol - 1 },
    { header: "Total Hrs", width: 0, align: "right", from: hoursCol, to: hoursCol },
    { header: "", width: 0, from: colOf(cols, "brl"), to: colOf(cols, "usd") },
  ];
  const divCol = colOf(cols, "div");
  const notesCol = colOf(cols, "notes");
  if (divCol) ranges.push({ header: "Division", width: 0, align: "center", from: divCol, to: divCol });
  if (notesCol) ranges.push({ header: "Notes", width: 0, from: notesCol, to: notesCol });
  x.rangeHeader(ranges);

  items.forEach((item, idx) => {
    const offer = [item.equipmentOffer, item.includeManufacturing ? "incl. Manufacturing Support (20%)" : ""]
      .filter(Boolean)
      .join(" · ");
    x.dataRow(
      cols,
      pickRow(cols, {
        fn: { value: `${idx + 1}. ${item.description || "—"}`, bold: true },
        phase: item.sectionName || (item.source === "manual" || !item.scopeItemId ? "Manual" : ""),
        hpd: offer ? { value: offer, align: "left", color: XL_COLORS.textSecondary } : null,
        hours: { value: item.totalHours || 0, bold: true },
        div: item.integratedDivision || "",
        notes: item.notes || "",
      }),
      { zebra: idx % 2 === 1 },
    );
    (item.deliverables || []).forEach((d) => {
      const byRes = d.hoursByResource || {};
      const parts = Object.keys(byRes)
        .filter((k) => (byRes[k] || 0) > 0)
        .map((k) => `${k} ${byRes[k]}h`);
      const detail = parts.length ? parts.join(" · ") : d.resourceType || "";
      x.dataRow(
        cols,
        pickRow(cols, {
          fn: d.deliverableType,
          hpd: detail ? { value: detail, align: "left" } : null,
          hours: d.hours || 0,
        }),
        { muted: true, indentCol: 1, indent: 2 },
      );
    });
  });
}

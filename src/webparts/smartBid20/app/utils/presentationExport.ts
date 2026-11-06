/**
 * presentationExport — BID Presentation as a PowerPoint deck (native, editable charts and
 * tables via pptxgenjs) or a PDF report (jsPDF, with the on-screen charts captured).
 * Both libraries are loaded on demand to keep them out of the main SPFx chunk.
 */
import type { IPresentationModel } from "../hooks/usePresentationModel";
import type PptxGenJS from "pptxgenjs";
import { buildReportPdf, captureElementToPng, PdfChartImage, PdfTable } from "./pdfExport";
import { formatDate, formatNumber, formatSignedPercent } from "./formatters";
import { approverName, EFFORT_LABELS } from "./presentationView";

export interface IExportChart {
  title: string;
  el: HTMLElement | null;
}

/** Document colors: slides are white, so text follows the light-theme text tokens. */
const DOC = {
  ink: "1E293B",
  inkSoft: "475569",
  muted: "94A3B8",
  line: "E2E8F0",
  panel: "F1F5F9",
  cover: "0F172A",
  white: "FFFFFF",
};

const hex = (color: string): string => {
  const c = (color || "").replace("#", "");
  return /^[0-9a-f]{6}$/i.test(c) ? c.toUpperCase() : DOC.inkSoft;
};

function fileBase(model: IPresentationModel): string {
  return `BID_${model.bid.bidNumber}_Presentation`.replace(/[^\w.-]+/g, "_");
}

function projectOf(model: IPresentationModel): string {
  return (
    (model.bid.opportunityInfo && model.bid.opportunityInfo.projectName) ||
    "Proposal"
  );
}

function clientOf(model: IPresentationModel): string {
  return (model.bid.opportunityInfo && model.bid.opportunityInfo.client) || "";
}

const pctOf = (part: number, whole: number): string =>
  whole > 0 ? `${((part / whole) * 100).toFixed(1)}%` : "-";

const hoursText = (h: number): string => `${formatNumber(Math.round(h))} h`;

function deltaText(model: IPresentationModel, key: string): string {
  const insight = model.insights.get(key);
  if (!insight || insight.deltaPct === null) return "No history";
  return formatSignedPercent(insight.deltaPct, 0);
}

function kpis(model: IPresentationModel): { label: string; value: string }[] {
  const c = model.commercial;
  return [
    { label: "Total BID value", value: model.money(model.totalUSD) },
    { label: "CAPEX", value: model.money(model.view.capex.usd) },
    { label: "OPEX", value: model.money(model.view.opex.usd) },
    { label: "Labor hours", value: hoursText(model.effort.totalHours) },
    {
      label: "Clarifications answered",
      value: `${c.answeredClarifications} / ${c.clarifications.length}`,
    },
  ];
}

// ─── PDF ───

export async function exportPresentationPdf(
  model: IPresentationModel,
  charts: IExportChart[],
  chartBackground: string,
): Promise<void> {
  const images: PdfChartImage[] = [];
  for (const chart of charts) {
    if (!chart.el) continue;
    try {
      images.push({
        title: chart.title,
        dataUrl: await captureElementToPng(chart.el, chartBackground),
      });
    } catch {
      // A chart that can't be rasterized is left out; its numbers are in the tables
    }
  }

  const c = model.commercial;
  const tables: PdfTable[] = [
    {
      title: "How the price is built",
      head: ["Category", "Value", "% of BID"],
      body: model.steps
        .map((s) => [s.label, model.money(s.usd), `${s.pct.toFixed(1)}%`])
        .concat([["Total", model.money(model.totalUSD), "100%"]]),
    },
    {
      title: "Top items",
      head: ["#", "Item", "Resource type", "Acquisition", "Value", "% of BID", "vs. past BIDs"],
      body: model.ranked.slice(0, 20).map((i, idx) => [
        idx + 1,
        i.description || i.partNumber || "-",
        i.category,
        i.acquisition,
        model.money(i.totalUSD),
        pctOf(i.totalUSD, model.totalUSD),
        deltaText(model, i.key),
      ]),
    },
    {
      title: "How it's supplied",
      head: ["Acquisition mode", "Items", "Value", "% of BID"],
      body: model.acquisitionGroups.map((g) => [
        g.label,
        g.count,
        model.money(g.valueUSD),
        pctOf(g.valueUSD, model.totalUSD),
      ]),
    },
    {
      title: "Effort",
      head: ["Discipline", "Role", "Hours"],
      body: model.effort.groups.reduce<(string | number)[][]>((rows, g) => {
        g.roles.forEach((r) => rows.push([g.label, r.role, hoursText(r.hours)]));
        return rows;
      }, []),
    },
    {
      title: "Clarifications",
      head: ["Reference", "Clarification", "Client response"],
      body: c.clarifications.map((cl) => [
        [cl.item, cl.description].filter(Boolean).join(" · ") || "-",
        cl.clarification || "-",
        cl.clientResponse || "Awaiting client",
      ]),
    },
    {
      title: "Qualifications",
      head: ["Category", "Qualification"],
      body: c.qualifications.map((q) => [q.category, q.text]),
    },
    {
      title: "Approval",
      head: ["Sector", "Status", "Approvers"],
      body: c.approval.sectors.map((s) => [
        s.label,
        s.status,
        s.approvals.map(approverName).join(", "),
      ]),
    },
  ].filter((t) => t.body.length > 0);

  await buildReportPdf({
    title: `BID ${model.bid.bidNumber} — ${projectOf(model)}`,
    subtitle: [
      clientOf(model),
      `Values in ${model.display.currency}`,
      `Generated ${formatDate(new Date().toISOString())}`,
    ]
      .filter(Boolean)
      .join(" · "),
    kpis: kpis(model),
    charts: images,
    tables,
    fileName: `${fileBase(model)}.pdf`,
    orientation: "l",
  });
}

// ─── PowerPoint ───

type Slide = PptxGenJS.Slide;

const W = 13.33;
const MARGIN = 0.5;

function addHeader(slide: Slide, eyebrow: string, title: string, accent: string): void {
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: 0.12,
    h: 7.5,
    fill: { color: accent },
    line: { color: accent, width: 0 },
  });
  slide.addText(eyebrow.toUpperCase(), {
    x: MARGIN,
    y: 0.3,
    w: W - 2 * MARGIN,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: accent,
    charSpacing: 2,
  });
  slide.addText(title, {
    x: MARGIN,
    y: 0.58,
    w: W - 2 * MARGIN,
    h: 0.6,
    fontSize: 24,
    bold: true,
    color: DOC.ink,
    fontFace: "Montserrat",
  });
}

function addFooter(slide: Slide, model: IPresentationModel): void {
  slide.addText(`BID ${model.bid.bidNumber} · ${projectOf(model)}`, {
    x: MARGIN,
    y: 7.05,
    w: 9,
    h: 0.3,
    fontSize: 9,
    color: DOC.muted,
  });
}

function addKpi(
  slide: Slide,
  x: number,
  y: number,
  w: number,
  label: string,
  value: string,
  accent: string,
): void {
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h: 0.95,
    rectRadius: 0.08,
    fill: { color: DOC.panel },
    line: { color: DOC.line, width: 0.75 },
  });
  slide.addText(label.toUpperCase(), {
    x: x + 0.15,
    y: y + 0.1,
    w: w - 0.3,
    h: 0.28,
    fontSize: 8,
    bold: true,
    color: accent,
    charSpacing: 1,
  });
  slide.addText(value, {
    x: x + 0.15,
    y: y + 0.38,
    w: w - 0.3,
    h: 0.45,
    fontSize: 16,
    bold: true,
    color: DOC.ink,
    fit: "shrink",
  });
}

function tableRows(
  head: string[],
  body: (string | number)[][],
): PptxGenJS.TableRow[] {
  const header: PptxGenJS.TableRow = head.map((h) => ({
    text: h,
    options: { bold: true, color: DOC.white, fill: { color: DOC.cover } },
  }));
  return [header].concat(
    body.map((row, i) =>
      row.map((cell) => ({
        text: String(cell),
        options: i % 2 ? { fill: { color: DOC.panel } } : {},
      })),
    ),
  );
}

function addTable(
  slide: Slide,
  head: string[],
  body: (string | number)[][],
  opts: { x: number; y: number; w: number; colW: number[]; h?: number },
): void {
  slide.addTable(tableRows(head, body), {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    colW: opts.colW,
    fontSize: 9,
    color: DOC.ink,
    border: { type: "solid", color: DOC.line, pt: 0.5 },
    valign: "middle",
    margin: 0.04,
  });
}

export async function exportPresentationPptx(
  model: IPresentationModel,
): Promise<void> {
  const mod = await import(/* webpackChunkName: 'pptxgenjs' */ "pptxgenjs");
  const Ctor = ((mod as unknown as { default?: typeof PptxGenJS }).default ||
    (mod as unknown as typeof PptxGenJS)) as typeof PptxGenJS;
  const pptx = new Ctor();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SmartBid 2.0";
  pptx.title = `BID ${model.bid.bidNumber} — ${projectOf(model)}`;

  const theme = model.colors.theme;
  const accent = hex(theme.accent);
  const rate = model.display.rate;
  const moneyFormat = model.display.currency === "BRL" ? '"R$" #,##0' : '"$"#,##0';
  const c = model.commercial;

  // 1 · Cover
  const cover = pptx.addSlide();
  cover.background = { color: DOC.cover };
  cover.addShape("rect", {
    x: 0,
    y: 0,
    w: W,
    h: 0.12,
    fill: { color: accent },
    line: { color: accent, width: 0 },
  });
  cover.addText(`BID ${model.bid.bidNumber} · BID PRESENTATION`, {
    x: 0.8,
    y: 2.0,
    w: 11.7,
    h: 0.4,
    fontSize: 12,
    bold: true,
    color: accent,
    charSpacing: 3,
  });
  cover.addText(projectOf(model), {
    x: 0.8,
    y: 2.45,
    w: 11.7,
    h: 1.3,
    fontSize: 36,
    bold: true,
    color: DOC.white,
    fontFace: "Montserrat",
    fit: "shrink",
  });
  cover.addText(clientOf(model), {
    x: 0.8,
    y: 3.75,
    w: 11.7,
    h: 0.5,
    fontSize: 18,
    color: DOC.muted,
  });
  cover.addText(
    [
      { text: "TOTAL BID VALUE\n", options: { fontSize: 11, bold: true, color: DOC.muted, charSpacing: 2 } },
      { text: model.money(model.totalUSD), options: { fontSize: 30, bold: true, color: DOC.white } },
    ],
    { x: 0.8, y: 4.7, w: 8, h: 1.2 },
  );
  cover.addText(`Generated ${formatDate(new Date().toISOString())} · SmartBid 2.0`, {
    x: 0.8,
    y: 6.8,
    w: 11.7,
    h: 0.3,
    fontSize: 10,
    color: DOC.muted,
  });

  // 2 · Executive summary + price build-up
  const summary = pptx.addSlide();
  addHeader(summary, "Executive summary", "What the BID is worth and how the price is built", accent);
  const kpiList = kpis(model);
  const kpiW = (W - 2 * MARGIN - 0.2 * (kpiList.length - 1)) / kpiList.length;
  kpiList.forEach((k, i) =>
    addKpi(summary, MARGIN + i * (kpiW + 0.2), 1.35, kpiW, k.label, k.value, accent),
  );
  if (model.steps.length > 0) {
    const steps = model.steps.slice().reverse();
    summary.addChart(
      pptx.ChartType.bar,
      [
        {
          name: "Value",
          labels: steps.map((s) => s.label),
          values: steps.map((s) => Math.round(s.usd * rate)),
        },
      ],
      {
        x: MARGIN,
        y: 2.55,
        w: 7.6,
        h: 4.3,
        barDir: "bar",
        chartColors: [accent],
        showValue: true,
        dataLabelFormatCode: moneyFormat,
        dataLabelFontSize: 9,
        dataLabelColor: DOC.ink,
        catAxisLabelFontSize: 10,
        catAxisLabelColor: DOC.inkSoft,
        valAxisHidden: true,
        valGridLine: { style: "none" },
        showLegend: false,
        showTitle: true,
        title: "How the price is built",
        titleFontSize: 12,
        titleColor: DOC.ink,
      },
    );
  }
  const facts = model.facts.map((f) => [f.label, f.value]);
  if (facts.length > 0) {
    addTable(summary, ["Opportunity", ""], facts, {
      x: 8.4,
      y: 2.65,
      w: 4.4,
      colW: [1.6, 2.8],
    });
  }
  addFooter(summary, model);

  // 3 · Asset value + supply
  const assets = pptx.addSlide();
  addHeader(assets, "Assets", "Where the asset value is and how it's supplied", accent);
  if (model.assetGroups.length > 0) {
    const groups = model.assetGroups.slice(0, 12).reverse();
    assets.addChart(
      pptx.ChartType.bar,
      [
        {
          name: "Value",
          labels: groups.map((g) => g.category),
          values: groups.map((g) => Math.round(g.usd * rate)),
        },
      ],
      {
        x: MARGIN,
        y: 1.35,
        w: 7.2,
        h: 5.5,
        barDir: "bar",
        chartColors: [hex(theme.accentSecondary)],
        showValue: true,
        dataLabelFormatCode: moneyFormat,
        dataLabelFontSize: 9,
        dataLabelColor: DOC.ink,
        catAxisLabelFontSize: 10,
        catAxisLabelColor: DOC.inkSoft,
        valAxisHidden: true,
        valGridLine: { style: "none" },
        showLegend: false,
        showTitle: true,
        title: "Asset value by resource type",
        titleFontSize: 12,
        titleColor: DOC.ink,
      },
    );
  }
  if (model.acquisitionGroups.length > 0) {
    addTable(
      assets,
      ["Acquisition mode", "Items", "Value", "% of BID"],
      model.acquisitionGroups.map((g) => [
        g.label,
        g.count,
        model.money(g.valueUSD),
        pctOf(g.valueUSD, model.totalUSD),
      ]),
      { x: 8.0, y: 1.45, w: 4.8, colW: [1.8, 0.7, 1.5, 0.8] },
    );
  }
  addFooter(assets, model);

  // 4 · Top items
  if (model.ranked.length > 0) {
    const top = pptx.addSlide();
    addHeader(top, "Top items", "The items that weigh most on the BID", accent);
    addTable(
      top,
      ["#", "Item", "Resource type", "Acquisition", "Value", "% of BID", "vs. past BIDs"],
      model.ranked.slice(0, 14).map((i, idx) => [
        idx + 1,
        i.description || i.partNumber || "-",
        i.category,
        i.acquisition,
        model.money(i.totalUSD),
        pctOf(i.totalUSD, model.totalUSD),
        deltaText(model, i.key),
      ]),
      { x: MARGIN, y: 1.35, w: W - 2 * MARGIN, colW: [0.4, 4.6, 1.9, 1.6, 1.6, 0.9, 1.33] },
    );
    addFooter(top, model);
  }

  // 5 · Effort
  if (model.effort.totalHours > 0) {
    const effort = pptx.addSlide();
    addHeader(effort, "Effort", `${hoursText(model.effort.totalHours)} of labor`, accent);
    effort.addChart(
      pptx.ChartType.doughnut,
      [
        {
          name: "Hours",
          labels: model.effort.groups.map((g) => EFFORT_LABELS[g.kind]),
          values: model.effort.groups.map((g) => Math.round(g.hours)),
        },
      ],
      {
        x: MARGIN,
        y: 1.4,
        w: 5.6,
        h: 5.2,
        holeSize: 58,
        chartColors: model.effort.groups.map((g) => hex(model.colors.effort[g.kind])),
        showPercent: true,
        showLegend: true,
        legendPos: "b",
        legendFontSize: 10,
        dataLabelColor: DOC.white,
        dataLabelFontSize: 10,
      },
    );
    const roles = model.effort.groups
      .reduce<(string | number)[][]>((rows, g) => {
        g.roles.forEach((r) => rows.push([r.role, g.label, hoursText(r.hours)]));
        return rows;
      }, [])
      .slice(0, 16);
    addTable(effort, ["Role", "Discipline", "Hours"], roles, {
      x: 6.6,
      y: 1.45,
      w: 6.2,
      colW: [3.2, 1.6, 1.4],
    });
    addFooter(effort, model);
  }

  // 6 · Commercial context
  const commercial = pptx.addSlide();
  addHeader(commercial, "Commercial context", "Team, clarifications, qualifications and approval", accent);
  addKpi(
    commercial,
    MARGIN,
    1.35,
    3.0,
    "Clarifications answered",
    `${c.answeredClarifications} / ${c.clarifications.length}`,
    accent,
  );
  addKpi(commercial, MARGIN + 3.2, 1.35, 3.0, "Qualifications", formatNumber(c.qualifications.length), accent);
  addKpi(commercial, MARGIN + 6.4, 1.35, 3.0, "Approval", c.approval.status, accent);
  addTable(
    commercial,
    ["Team", ""],
    c.team.map((t) => [t.role, t.people.map((p) => p.name || p.email).join(", ")]),
    { x: MARGIN, y: 2.55, w: 6.0, colW: [1.8, 4.2] },
  );
  if (c.approval.sectors.length > 0) {
    addTable(
      commercial,
      ["Approval sector", "Status"],
      c.approval.sectors.map((s) => [s.label, s.status]),
      { x: 6.8, y: 2.55, w: 6.0, colW: [3.6, 2.4] },
    );
  }
  if (c.qualificationCategories.length > 0) {
    addTable(
      commercial,
      ["Qualification category", "Count"],
      c.qualificationCategories.slice(0, 8).map((q) => [q.label, q.count]),
      { x: MARGIN, y: 4.75, w: 6.0, colW: [4.8, 1.2] },
    );
  }
  addFooter(commercial, model);

  await pptx.writeFile({ fileName: `${fileBase(model)}.pptx` });
}

import { IPersonRef } from "../../../models";
import { getPhaseDef, getStatusDef } from "../../../config/status.config";
import { BID_EXCEL_SHEETS, IBidExcelContext, newSheet } from "../context";
import {
  IXlColumn,
  NUM,
  XL_COLORS,
  displayDate,
  toExcelDate,
  toExcelDateTime,
} from "../excelStyles";

function people(list?: (IPersonRef | null)[] | null): string {
  return (list || [])
    .filter((p): p is IPersonRef => !!p && !!p.name)
    .map((p) => p.name)
    .join("; ");
}

export function buildInfoSheet(ctx: IBidExcelContext): void {
  const { bid, view } = ctx;
  const s = view.summary;
  const opp = bid.opportunityInfo || ({} as typeof bid.opportunityInfo);
  const x = newSheet(ctx, "info", [30, 24, 24, 24, 24], true);
  const span = x.lastCol;
  const kv = (
    label: string,
    value: string | number | Date | null | undefined,
    o: { numFmt?: string; bold?: boolean; wrap?: boolean } = {},
  ): void =>
    x.keyValue(label, value === undefined ? null : value, {
      labelCol: 1,
      valueCol: 2,
      valueEnd: span,
      ...o,
    });

  x.banner("BID COST EXPORT", ctx.subtitle);

  x.sectionTitle("Key Figures", span);
  x.kpis([
    {
      label: "Total Cost USD",
      value: s.totalCostUSD,
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
      value: s.ptaxUsed > 0 ? s.ptaxUsed : "—",
      numFmt: NUM.rate,
      from: 4,
      to: 5,
    },
  ]);
  x.gap(6);
  x.kpis([
    { label: "CAPEX", value: view.capex.usd, numFmt: NUM.usd, from: 1, to: 1 },
    { label: "OPEX", value: view.opex.usd, numFmt: NUM.usd, from: 2, to: 3 },
    {
      label: "Total Hours",
      value: view.hours.total,
      numFmt: NUM.hours,
      from: 4,
      to: 5,
    },
  ]);
  x.gap(14);

  x.sectionTitle("Identification", span);
  kv("BID Number", bid.bidNumber, { bold: true });
  kv("Revision", ctx.revision);
  kv("CRM Number", bid.crmNumber);
  const erns = (bid.ernLinks || [])
    .map((e) => (e.division ? `${e.ernNumber} (${e.division})` : e.ernNumber))
    .filter(Boolean);
  kv("ERN", erns.length ? erns.join("; ") : bid.ernNumber || "");
  kv("Division", bid.division);
  kv("Service Line", bid.serviceLine);
  kv("Type / Size", [bid.bidType, bid.bidSize].filter(Boolean).join(" / "));
  kv("Priority", bid.priority);
  const status = getStatusDef(bid.currentStatus);
  kv("Status", status ? status.label : bid.currentStatus);
  const phase = getPhaseDef(bid.currentPhase);
  kv("Phase", phase ? phase.label : bid.currentPhase);
  x.gap(14);

  x.sectionTitle("Client & Project", span);
  kv("Client", opp.client);
  kv("Client Contact", opp.clientContact);
  kv("Project Name", opp.projectName, { bold: true });
  kv("Region", opp.region);
  kv("Vessel", opp.vessel);
  kv("Field", opp.field);
  kv(
    "Water Depth",
    opp.waterDepth
      ? `${opp.waterDepth} ${opp.waterDepthUnit || ""}`.trim()
      : "",
  );
  kv("Operation Start", toExcelDate(opp.operationStartDate), {
    numFmt: NUM.date,
  });
  kv(
    "Total Duration",
    opp.totalDuration
      ? `${opp.totalDuration} ${opp.totalDurationUnit || ""}`.trim()
      : "",
  );
  x.gap(14);

  x.sectionTitle("Dates", span);
  kv("Created", toExcelDate(bid.createdDate), { numFmt: NUM.date });
  kv("Desired Due Date", toExcelDate(bid.desiredDueDate || bid.dueDate), {
    numFmt: NUM.date,
  });
  kv("Started", toExcelDate(bid.startDate), { numFmt: NUM.date });
  kv("Completed", toExcelDate(bid.completedDate), { numFmt: NUM.date });
  kv("Last Modified", toExcelDate(bid.lastModified), { numFmt: NUM.date });
  x.gap(14);

  x.sectionTitle("Team", span);
  kv("Created by", people([bid.creator]));
  kv("Commercial Requester", people([bid.commercialRequester]));
  kv("Engineer Responsible", people(bid.engineerResponsible), { wrap: true });
  kv("Project Manager", people(bid.projectManager), { wrap: true });
  kv("Analyst", people(bid.analyst), { wrap: true });
  kv("Reviewers", people(bid.reviewers), { wrap: true });
  x.gap(14);

  x.sectionTitle("Exchange Rates (registered on this BID)", span);
  const rates = view.fx.rates.filter(
    (r) => (r.currency || "").toUpperCase() !== "USD" && r.rate > 0,
  );
  if (rates.length === 0 && s.ptaxUsed > 0) {
    kv("BRL", `1 USD = ${s.ptaxUsed.toFixed(4)} BRL`);
  }
  rates.forEach((r) => {
    const parts = [
      `1 USD = ${r.rate.toFixed(4)} ${(r.currency || "").toUpperCase()}`,
    ];
    if (r.rateDate) parts.push(`rate of ${displayDate(r.rateDate)}`);
    if (r.source) parts.push(r.source);
    if (r.capturedDate) parts.push(`registered ${displayDate(r.capturedDate)}`);
    kv((r.currency || "").toUpperCase(), parts.join(" · "));
  });
  if (rates.length === 0 && !(s.ptaxUsed > 0)) {
    x.note("No exchange rate registered on this BID.", span, "warning");
  }
  x.gap(14);

  const general = (bid.bidNotes || ({} as Record<string, string>)).general;
  if (opp.projectDescription || general || bid.engineerBidOverview) {
    x.sectionTitle("Descriptions", span);
    if (opp.projectDescription) {
      kv("Project Description", opp.projectDescription, { wrap: true });
    }
    if (general) kv("Request Notes", general, { wrap: true });
    if (bid.engineerBidOverview) {
      kv("Engineer BID Overview", bid.engineerBidOverview, { wrap: true });
    }
    x.gap(14);
  }

  x.sectionTitle("Contents", span, "Click a sheet name to open it");
  const tocCols: IXlColumn[] = [
    { header: "Sheet", width: 30 },
    { header: "Content", width: 24 },
  ];
  BID_EXCEL_SHEETS.filter(
    (d) =>
      d.key !== "info" && (d.required || ctx.opts.sheets.indexOf(d.key) >= 0),
  ).forEach((d) => {
    const r = x.dataRow(tocCols, [
      { value: { text: d.name, hyperlink: `#'${d.name}'!A1` } },
      { value: d.description, color: XL_COLORS.textSecondary },
    ]);
    r.getCell(1).font = {
      name: "Calibri",
      size: 10,
      bold: true,
      underline: true,
      color: { argb: XL_COLORS.link },
    };
  });
  x.gap(14);

  x.sectionTitle("Export", span);
  kv("Exported by", ctx.opts.exportedBy);
  kv("Exported at", toExcelDateTime(ctx.exportedAt), { numFmt: NUM.dateTime });
  kv("Source", "SmartBid 2.0 — values as shown on the BID Details screens");
  x.gap(8);
  x.note(
    "Generated from SmartBid 2.0. Costs reflect the BID data at the export time; edit the BID in SmartBid and export again to refresh this workbook.",
    span,
    "muted",
  );
}

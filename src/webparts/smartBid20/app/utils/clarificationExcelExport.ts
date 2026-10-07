/**
 * clarificationExcelExport — Client-facing "Clarification Form" (ExcelJS), same
 * banner and table look as the BID cost export.
 */
import { IBid, IClarificationItem } from "../models";
import { ISystemConfig } from "../models/ISystemConfig";
import { getCurrentRevisionLetter } from "../components/bid/RevisionsTab";
import { downloadBlob } from "./exportHelpers";
import {
  allCategoryOptions,
  cleanClientDocRef,
  configOptionLabel,
} from "./clarificationHelpers";
import {
  NUM,
  XL_COLORS,
  XlSheet,
  activeColumns,
  colOf,
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

export interface IClarificationExcelOptions {
  bid: IBid;
  items: IClarificationItem[];
  config: ISystemConfig | null;
  /** Workbook author metadata */
  exportedBy?: string;
}

export function getClarificationExcelFilename(bid: IBid): string {
  const opp = bid.opportunityInfo;
  const parts = [
    (opp && opp.projectName) || "",
    (opp && opp.client) || "",
    bid.crmNumber || bid.bidNumber || "",
  ]
    .map(sanitizeFilePart)
    .filter(Boolean);
  return `${parts.length ? parts.join(" - ") : "BID"} - Clarifications.xlsx`;
}

/** Builds the workbook and downloads it. Returns the file name. */
export async function exportClarificationsToExcel(
  opts: IClarificationExcelOptions,
): Promise<string> {
  const { bid, items, config } = opts;
  const [ExcelJS, logo] = await Promise.all([loadExcelJS(), loadLogoDataUrl()]);
  const wb = new ExcelJS.Workbook();
  const now = new Date();
  const opp = bid.opportunityInfo;
  const revision = getCurrentRevisionLetter(bid);
  const id = bid.crmNumber || bid.bidNumber;
  const client = configOptionLabel(
    config?.clientList,
    (opp && opp.client) || "",
  );
  const divisionLine = [
    configOptionLabel(config?.divisions, bid.division || ""),
    configOptionLabel(config?.serviceLines, bid.serviceLine || ""),
  ]
    .filter(Boolean)
    .join(" / ");

  wb.creator = opts.exportedBy || "SmartBid 2.0";
  wb.lastModifiedBy = wb.creator;
  wb.created = now;
  wb.modified = now;
  wb.title = `Clarification Form - ${id}`;
  wb.subject = [client, opp && opp.projectName].filter(Boolean).join(" · ");
  wb.company = "Oceaneering";

  const cols = activeColumns([
    { key: "n", header: "#", width: 5, align: "center" },
    { key: "type", header: "Type", width: 14 },
    {
      key: "category",
      header: "Category",
      width: 16,
      wrap: true,
      when: items.some((c) => !!c.category),
    },
    { key: "ref", header: "Client Doc Ref", width: 18, wrap: true },
    { key: "topic", header: "Topic / Description", width: 32, wrap: true },
    {
      key: "text",
      header: "Clarification / Qualification",
      width: 54,
      wrap: true,
    },
    { key: "response", header: "Client Response", width: 46, wrap: true },
    {
      key: "issued",
      header: "Issued",
      width: 12,
      align: "center",
      numFmt: NUM.date,
    },
    {
      key: "responded",
      header: "Responded",
      width: 12,
      align: "center",
      numFmt: NUM.date,
    },
  ]);
  const x = new XlSheet(wb, {
    name: "Clarification Form",
    tabColor: XL_COLORS.accent,
    widths: cols.map((c) => c.width),
    footerLabel: `${id} Rev ${revision} · Clarification Form`,
    logoId: logo ? wb.addImage({ base64: logo, extension: "png" }) : undefined,
    logoAspect: LOGO_ASPECT,
  });
  const span = x.lastCol;
  x.banner(
    "CLARIFICATION FORM",
    [
      id,
      `Rev ${revision}`,
      client,
      opp && opp.projectName,
      divisionLine,
      bid.crmNumber && bid.bidNumber ? `Ref: ${bid.bidNumber}` : undefined,
    ]
      .filter(Boolean)
      .join("   ·   "),
  );

  const headerRow = x.header(cols);
  const responseCol = colOf(cols, "response");
  // Amber marks the column the client fills in
  const amber = {
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb: XL_COLORS.warningFill },
  };
  const headerCell = x.ws.getRow(headerRow).getCell(responseCol);
  headerCell.fill = amber;
  headerCell.font = {
    name: "Calibri",
    size: 10,
    bold: true,
    color: { argb: XL_COLORS.warningText },
  };

  const categoryLabel = (v?: string): string =>
    configOptionLabel(allCategoryOptions(config), v || "");
  items.forEach((c, i) => {
    const isQual = c.baseType === "Qualification";
    const r = x.dataRow(
      cols,
      pickRow(cols, {
        n: { value: i + 1, bold: true },
        type: {
          value: isQual ? "Qualification" : "Clarification",
          bold: true,
          color: isQual ? XL_COLORS.purple : XL_COLORS.link,
        },
        category: categoryLabel(c.category),
        ref: cleanClientDocRef(c.item),
        topic: { value: c.description || "", bold: true },
        text: c.clarification || "",
        response: c.clientResponse || "",
        issued: toExcelDate(c.createdDate),
        responded: toExcelDate(c.responseDate),
      }),
      { zebra: i % 2 === 1 },
    );
    r.getCell(responseCol).fill = amber;
  });
  if (items.length > 0) {
    x.ws.autoFilter = {
      from: { row: headerRow, column: 1 },
      to: { row: x.row - 1, column: span },
    };
  }
  x.freeze(headerRow);
  x.printTitles(headerRow);

  const buffer = await wb.xlsx.writeBuffer();
  const fileName = getClarificationExcelFilename(bid);
  downloadBlob(new Blob([buffer], { type: XLSX_MIME }), fileName);
  return fileName;
}

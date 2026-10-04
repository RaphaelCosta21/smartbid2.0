import { BidExcelSheetKey, IBid, IBidExcelExportOptions } from "../../models";
import { getCurrentRevisionLetter } from "../../components/bid/RevisionsTab";
import { buildCostSummaryView } from "../costSummaryView";
import { downloadBlob } from "../exportHelpers";
import {
  BID_EXCEL_SHEETS,
  IBidExcelContext,
  getBidApprovalState,
} from "./context";
import {
  LOGO_ASPECT,
  XLSX_MIME,
  loadExcelJS,
  loadLogoDataUrl,
  sanitizeFilePart,
} from "./runtime";
import { buildAssetsSheet } from "./sheets/assetsSheet";
import { buildCertificationsSheet } from "./sheets/certificationsSheet";
import { buildCostSummarySheet } from "./sheets/costSummarySheet";
import { buildHoursSheet } from "./sheets/hoursSheet";
import { buildInfoSheet } from "./sheets/infoSheet";
import { buildLogisticsSheet } from "./sheets/logisticsSheet";
import { buildPrepMobSheet } from "./sheets/prepMobSheet";
import { buildScopeSheet } from "./sheets/scopeSheet";
import { buildSuppliersSheet } from "./sheets/suppliersSheet";

const BUILDERS: Record<BidExcelSheetKey, (ctx: IBidExcelContext) => void> = {
  info: buildInfoSheet,
  costSummary: buildCostSummarySheet,
  scope: buildScopeSheet,
  assets: buildAssetsSheet,
  hours: buildHoursSheet,
  prepMob: buildPrepMobSheet,
  logistics: buildLogisticsSheet,
  certifications: buildCertificationsSheet,
  suppliers: buildSuppliersSheet,
};

export function getBidExcelFilename(bid: IBid): string {
  const opp = bid.opportunityInfo;
  const sanitize = sanitizeFilePart;

  const projectName = sanitize((opp && opp.projectName) || "");
  const client = sanitize((opp && opp.client) || "");
  const crm = sanitize(bid.crmNumber || bid.bidNumber || "");

  const parts = [projectName, client, crm].filter(Boolean);
  const baseName =
    parts.length > 0 ? parts.join(" - ") : bid.bidNumber || "BID";
  return `${baseName}.xlsx`;
}

/** Build the formatted BID workbook and download it. Returns the file name. */
export async function exportBidToExcel(
  bid: IBid,
  opts: IBidExcelExportOptions,
): Promise<string> {
  const [ExcelJS, logo] = await Promise.all([loadExcelJS(), loadLogoDataUrl()]);
  const wb = new ExcelJS.Workbook();
  const now = new Date();
  const revision = getCurrentRevisionLetter(bid);
  const opp = bid.opportunityInfo;
  const approval = getBidApprovalState(bid);
  const approvalNotice = approval.approved
    ? undefined
    : `NOT APPROVED - exported while the BID was in "${approval.statusLabel}" (phase: ${approval.phaseLabel}). ` +
      "Values are preliminary until the BID reaches Close Out · Completed.";

  const titleParts = [
    opp && opp.projectName,
    opp && opp.client,
    bid.crmNumber || bid.bidNumber,
  ]
    .map((s) => (s || "").trim())
    .filter(Boolean);

  wb.creator = opts.exportedBy || "SmartBid 2.0";
  wb.lastModifiedBy = wb.creator;
  wb.created = now;
  wb.modified = now;
  wb.title =
    titleParts.length > 0 ? titleParts.join(" - ") : bid.bidNumber || "BID";
  wb.subject = [opp && opp.client, opp && opp.projectName]
    .filter(Boolean)
    .join(" · ");
  wb.company = "Oceaneering";
  if (!approval.approved) wb.keywords = "NOT APPROVED";

  const ctx: IBidExcelContext = {
    wb,
    bid,
    view: buildCostSummaryView(bid),
    opts,
    revision,
    exportedAt: now,
    subtitle: [
      bid.crmNumber || bid.bidNumber,
      `Rev ${revision}`,
      opp && opp.client,
      opp && opp.projectName,
      bid.crmNumber && bid.bidNumber ? `Ref: ${bid.bidNumber}` : undefined,
    ]
      .filter(Boolean)
      .join("   ·   "),
    footerLabel:
      `SmartBid 2.0 · ${bid.crmNumber || bid.bidNumber} Rev ${revision}` +
      (approval.approved ? "" : " · NOT APPROVED"),
    approved: approval.approved,
    approvalNotice,
    logoId: logo ? wb.addImage({ base64: logo, extension: "png" }) : undefined,
    logoAspect: LOGO_ASPECT,
  };

  BID_EXCEL_SHEETS.forEach((def) => {
    if (def.required || opts.sheets.indexOf(def.key) >= 0) {
      BUILDERS[def.key](ctx);
    }
  });

  const buffer = await wb.xlsx.writeBuffer();
  const fileName = getBidExcelFilename(bid);
  downloadBlob(new Blob([buffer], { type: XLSX_MIME }), fileName);
  return fileName;
}

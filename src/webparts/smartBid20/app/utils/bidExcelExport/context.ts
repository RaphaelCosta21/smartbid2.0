import type { Workbook } from "exceljs";
import { BidExcelSheetKey, IBid, IBidExcelExportOptions } from "../../models";
import { getPhaseDef, getStatusDef } from "../../config/status.config";
import { ICostSummaryView } from "../costSummaryView";
import { XL_TAB_COLORS, XlSheet } from "./excelStyles";

export interface IBidExcelSheetDef {
  key: BidExcelSheetKey;
  name: string;
  description: string;
  required?: boolean;
}

/** Workbook sheets in workbook order (sheet names ≤ 31 chars, no : \ / ? * [ ]). */
export const BID_EXCEL_SHEETS: IBidExcelSheetDef[] = [
  {
    key: "info",
    name: "BID Info",
    description: "Identification, client & project, team, exchange rates",
    required: true,
  },
  {
    key: "costSummary",
    name: "Cost Summary",
    description: "USD / BRL breakdown, CAPEX x OPEX, totals by resource type",
    required: true,
  },
  {
    key: "scope",
    name: "Scope of Supply",
    description: "What we will provide - items, quantities, sub-items",
  },
  {
    key: "assets",
    name: "Assets Breakdown",
    description: "One line per item with costs rolled up, section subtotals",
  },
  {
    key: "hours",
    name: "Hours & Personnel",
    description: "Engineering, onshore and offshore hours and costs",
  },
  {
    key: "prepMob",
    name: "Prep & Mobilization",
    description: "RTS, mobilization and consumables",
  },
  {
    key: "logistics",
    name: "Logistics",
    description: "Logistics items in original currency and USD",
  },
  {
    key: "certifications",
    name: "Certifications",
    description: "Certification items, expiry and costs",
  },
  {
    key: "suppliers",
    name: "Suppliers & Lead Time",
    description: "Everything to buy or rent, by lead time and supplier",
  },
];

export function sheetName(key: BidExcelSheetKey): string {
  const def = BID_EXCEL_SHEETS.find((s) => s.key === key);
  return def ? def.name : key;
}

export interface IBidApprovalState {
  approved: boolean;
  statusLabel: string;
  phaseLabel: string;
}

/** A BID only counts as approved once it reaches Close Out · Completed. */
export function getBidApprovalState(bid: IBid): IBidApprovalState {
  const status = getStatusDef(bid.currentStatus);
  const phase = bid.currentPhase ? getPhaseDef(bid.currentPhase) : undefined;
  return {
    approved:
      bid.currentPhase === "Close Out" && bid.currentStatus === "Completed",
    statusLabel: (status && status.label) || bid.currentStatus || "-",
    phaseLabel: (phase && phase.label) || bid.currentPhase || "-",
  };
}

export interface IBidExcelContext {
  wb: Workbook;
  bid: IBid;
  view: ICostSummaryView;
  opts: IBidExcelExportOptions;
  revision: string;
  exportedAt: Date;
  subtitle: string;
  footerLabel: string;
  approved: boolean;
  /** Warning strip printed under every sheet banner (set when not approved). */
  approvalNotice?: string;
  logoId?: number;
  logoAspect?: number;
}

export function newSheet(
  ctx: IBidExcelContext,
  key: BidExcelSheetKey,
  widths: number[],
  portrait = false,
): XlSheet {
  return new XlSheet(ctx.wb, {
    name: sheetName(key),
    tabColor: XL_TAB_COLORS[key],
    widths,
    footerLabel: ctx.footerLabel,
    notice: ctx.approvalNotice,
    logoId: ctx.logoId,
    logoAspect: ctx.logoAspect,
    portrait,
  });
}

/**
 * Export helpers — formatting utilities for Excel/PDF exports.
 */
import { formatCurrency, formatDate, formatNumber } from "./formatters";
import { IBid } from "../models";

function zeroPad(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

export interface IExportRow {
  [key: string]: string | number;
}

export function bidToExportRow(bid: IBid): IExportRow {
  return {
    "BID Number": bid.bidNumber,
    "CRM Number": bid.crmNumber,
    Division: bid.division,
    "Service Line": bid.serviceLine,
    Client: bid.opportunityInfo.client,
    "Project Name": bid.opportunityInfo.projectName,
    Status: bid.currentStatus,
    Phase: bid.currentPhase,
    Type: bid.bidType,
    Size: bid.bidSize,
    Priority: bid.priority,
    "Engineer Responsible": bid.engineerResponsible?.[0]?.name || "",
    "Due Date": formatDate(bid.dueDate),
    "Created Date": formatDate(bid.createdDate),
    Region: bid.opportunityInfo.region,
    Vessel: bid.opportunityInfo.vessel || "N/A",
    Field: bid.opportunityInfo.field || "N/A",
    "Total Hours": bid.hoursSummary?.grandTotalHours ?? 0,
    "Total Cost (USD)": bid.costSummary?.totalCostUSD ?? 0,
    Result: bid.bidResult?.outcome ?? "N/A",
  };
}

export function formatExportValue(value: unknown, columnType?: string): string {
  if (value === null || value === undefined) return "";
  if (columnType === "currency") return formatCurrency(value as number);
  if (columnType === "number") return formatNumber(value as number);
  if (columnType === "date") return formatDate(value as string);
  return String(value);
}

export function bidsToCSV(bids: IBid[]): string {
  if (bids.length === 0) return "";
  const rows = bids.map(bidToExportRow);
  const headers = Object.keys(rows[0]);
  const csvLines: string[] = [headers.join(",")];
  for (const row of rows) {
    const values = headers.map((h) => {
      const val = String(row[h] ?? "");
      if (val.indexOf(",") >= 0 || val.indexOf('"') >= 0) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    csvLines.push(values.join(","));
  }
  return csvLines.join("\n");
}

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getExportFilename(prefix: string, extension: string): string {
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${zeroPad(now.getMonth() + 1)}-${zeroPad(now.getDate())}`;
  return `${prefix}-${dateStr}.${extension}`;
}

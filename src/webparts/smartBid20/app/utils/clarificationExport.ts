/**
 * clarificationExport — Exports clarification items to a styled Excel file.
 * Uses HTML table → Blob approach for full styling support (background colors,
 * column widths, logo embedding, borders, etc.)
 */
import { IClarificationItem, IBid } from "../models";
import { getExportFilename } from "./exportHelpers";

function zeroPad(n: number): string {
  return n < 10 ? "0" + n : String(n);
}

function formatDateTime(date: Date): string {
  return (
    `${zeroPad(date.getDate())}/${zeroPad(date.getMonth() + 1)}/${date.getFullYear()} ` +
    `${zeroPad(date.getHours())}:${zeroPad(date.getMinutes())}`
  );
}

function formatDateOnly(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return `${zeroPad(d.getDate())}/${zeroPad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface IClarificationExportOptions {
  bid: IBid;
  items: IClarificationItem[];
}

/**
 * Generate and download a styled Excel file for clarification items.
 * Uses HTML table format that Excel reads with full styling.
 */
export async function exportClarificationsToExcel(
  options: IClarificationExportOptions,
): Promise<void> {
  const { bid, items } = options;

  const now = new Date();
  const exportDateTime = formatDateTime(now);
  const projectName = bid.opportunityInfo?.projectName || "N/A";
  const clientName = bid.opportunityInfo?.client || "N/A";
  const bidNumber = bid.bidNumber || "N/A";

  const html = `
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<!--[if gte mso 9]>
<xml>
<x:ExcelWorkbook>
<x:ExcelWorksheets>
<x:ExcelWorksheet>
<x:Name>Clarifications</x:Name>
<x:WorksheetOptions>
<x:DisplayGridlines/>
</x:WorksheetOptions>
</x:ExcelWorksheet>
</x:ExcelWorksheets>
</x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  td, th {
    mso-number-format: "\\@";
    vertical-align: middle;
  }
</style>
</head>
<body>
<table border="0" cellpadding="0" cellspacing="0">
  <!-- Logo & Title Row -->
  <tr>
    <td colspan="2" style="padding: 10px 8px; vertical-align: middle; font-size: 20px; font-weight: bold; font-family: Arial, sans-serif; color: #002060; letter-spacing: 2px;">
      OCEANEERING
    </td>
    <td colspan="4" style="text-align: center; font-size: 22px; font-weight: bold; font-family: Arial, sans-serif; color: #002060; padding: 12px 0;">
      CLARIFICATION FORM
    </td>
  </tr>
  <!-- Spacer -->
  <tr><td colspan="6" style="height: 8px;"></td></tr>
  <!-- Header Info -->
  <tr>
    <td style="font-weight: bold; font-size: 11px; font-family: Arial; color: #333; padding: 4px 8px; width: 140px; background: #f0f4f8;">COMPANY NAME</td>
    <td colspan="3" style="font-size: 11px; font-family: Arial; color: #002060; padding: 4px 8px; font-weight: 600;">OCEANEERING INTERNATIONAL</td>
    <td style="font-weight: bold; font-size: 11px; font-family: Arial; color: #333; padding: 4px 8px; background: #f0f4f8;">BID NUMBER</td>
    <td style="font-size: 11px; font-family: Arial; color: #002060; padding: 4px 8px; font-weight: 600;">${escapeHtml(bidNumber)}</td>
  </tr>
  <tr>
    <td style="font-weight: bold; font-size: 11px; font-family: Arial; color: #333; padding: 4px 8px; background: #f0f4f8;">PROJECT NAME</td>
    <td colspan="3" style="font-size: 11px; font-family: Arial; color: #222; padding: 4px 8px;">${escapeHtml(projectName)}</td>
    <td style="font-weight: bold; font-size: 11px; font-family: Arial; color: #333; padding: 4px 8px; background: #f0f4f8;">EXPORTED</td>
    <td style="font-size: 11px; font-family: Arial; color: #222; padding: 4px 8px;">${exportDateTime}</td>
  </tr>
  <tr>
    <td style="font-weight: bold; font-size: 11px; font-family: Arial; color: #333; padding: 4px 8px; background: #f0f4f8;">CLIENT</td>
    <td colspan="3" style="font-size: 11px; font-family: Arial; color: #222; padding: 4px 8px;">${escapeHtml(clientName)}</td>
    <td colspan="2"></td>
  </tr>
  <!-- Spacer -->
  <tr><td colspan="6" style="height: 12px;"></td></tr>
  <!-- Table Header -->
  <tr style="height: 32px;">
    <th style="background: #002060; color: #ffffff; font-size: 11px; font-family: Arial; font-weight: bold; padding: 8px 10px; border: 1px solid #001040; text-align: center; width: 40px;">#</th>
    <th style="background: #002060; color: #ffffff; font-size: 11px; font-family: Arial; font-weight: bold; padding: 8px 10px; border: 1px solid #001040; text-align: left; width: 140px;">Client Doc Ref</th>
    <th style="background: #002060; color: #ffffff; font-size: 11px; font-family: Arial; font-weight: bold; padding: 8px 10px; border: 1px solid #001040; text-align: left; width: 220px;">Description</th>
    <th style="background: #002060; color: #ffffff; font-size: 11px; font-family: Arial; font-weight: bold; padding: 8px 10px; border: 1px solid #001040; text-align: left; width: 280px;">Clarification / Qualification</th>
    <th style="background: #FFFFCC; color: #333; font-size: 11px; font-family: Arial; font-weight: bold; padding: 8px 10px; border: 1px solid #999; text-align: left; width: 220px;">Client Response</th>
    <th style="background: #002060; color: #ffffff; font-size: 11px; font-family: Arial; font-weight: bold; padding: 8px 10px; border: 1px solid #001040; text-align: center; width: 100px;">Date Issued</th>
  </tr>
  <!-- Data Rows -->
  ${items
    .map(
      (item, idx) => `
  <tr style="height: 26px;">
    <td style="text-align: center; font-size: 11px; font-family: Arial; padding: 6px 8px; border: 1px solid #d0d5dd; font-weight: 600; background: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">${idx + 1}</td>
    <td style="font-size: 11px; font-family: Arial; padding: 6px 8px; border: 1px solid #d0d5dd; background: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">${escapeHtml(item.item || "")}</td>
    <td style="font-size: 11px; font-family: Arial; padding: 6px 8px; border: 1px solid #d0d5dd; background: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">${escapeHtml(item.description || "")}</td>
    <td style="font-size: 11px; font-family: Arial; padding: 6px 8px; border: 1px solid #d0d5dd; background: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">${escapeHtml(item.clarification || "")}</td>
    <td style="font-size: 11px; font-family: Arial; padding: 6px 8px; border: 1px solid #d0d5dd; background: #FFFFF0;">${escapeHtml(item.clientResponse || "")}</td>
    <td style="text-align: center; font-size: 11px; font-family: Arial; padding: 6px 8px; border: 1px solid #d0d5dd; background: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"};">${formatDateOnly(item.createdDate) || formatDateTime(now)}</td>
  </tr>`,
    )
    .join("")}
</table>
</body>
</html>`;

  // Create Blob and download
  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getExportFilename(`Clarification-Form-${bidNumber}`, "xls");
  link.click();
  URL.revokeObjectURL(url);
}

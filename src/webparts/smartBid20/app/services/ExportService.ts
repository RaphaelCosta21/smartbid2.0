/**
 * ExportService — Export Excel/PDF/Print (padrão SmartFlow melhorado).
 * Static singleton pattern.
 */
import { IBid } from "../models";
import { IExportOptions, IExportResult } from "../models/IBidExport";
import { bidToExportRow } from "../utils/exportHelpers";
import { buildReportPdf } from "../utils/pdfExport";

export class ExportService {
  public static async exportToExcel(
    bids: IBid[],
    options: IExportOptions,
  ): Promise<IExportResult> {
    // Dynamic import of SheetJS
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    if (options.includeEquipment) {
      for (const bid of bids) {
        const data = bid.equipmentList.map((eq) => ({
          "Line #": eq.lineNumber,
          "Part Number": eq.partNumber,
          Description: eq.toolDescription,
          "Qty Operational": eq.qtyOperational,
          "Qty Spare": eq.qtySpare,
          "Qty To Buy": eq.qtyToBuy,
          "Unit Cost (USD)": eq.unitCostUSD,
          "Total Cost (USD)": eq.totalCostUSD,
          Category: eq.costCategory,
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, `Equipment-${bid.bidNumber}`);
      }
    }

    if (options.includeCostSummary) {
      const costData = bids.map((bid) => ({
        "BID Number": bid.bidNumber,
        Client: bid.opportunityInfo.client,
        "Assets (USD)": bid.costSummary.assetsCostUSD,
        "Hours (BRL)": bid.costSummary.totalHoursCostBRL,
        "Total (USD)": bid.costSummary.totalCostUSD,
        "Total (BRL)": bid.costSummary.totalCostBRL,
      }));
      const ws = XLSX.utils.json_to_sheet(costData);
      XLSX.utils.book_append_sheet(wb, ws, "Cost Summary");
    }

    const fileName = options.title
      ? `${options.title}.xlsx`
      : `SmartBID-Export-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    return { success: true, fileName, fileSize: 0 };
  }

  public static async exportToPDF(
    bids: IBid[],
    options: IExportOptions,
  ): Promise<IExportResult> {
    const rows = bids.map(bidToExportRow) as Record<string, unknown>[];
    const head = rows.length > 0 ? Object.keys(rows[0]) : [];
    const body = rows.map((r) =>
      head.map((h) => {
        const v = r[h];
        return v === null || v === undefined ? "" : String(v);
      }),
    );
    const fileName =
      (options.title ||
        `SmartBID-Report-${new Date().toISOString().slice(0, 10)}`) + ".pdf";
    try {
      await buildReportPdf({
        title: options.title || "SmartBID Report",
        subtitle: options.subtitle,
        tables: [{ head, body }],
        fileName,
        orientation: "l",
      });
      return { success: true, fileName, fileSize: 0 };
    } catch (err) {
      return {
        success: false,
        fileName: "",
        fileSize: 0,
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  public static print(_bids: IBid[], _options: IExportOptions): void {
    window.print();
  }
}

/**
 * IBidExport — Tipos para exportação multi-tab.
 */
export interface IExportTab {
  name: string;
  data: Record<string, unknown>[];
  columns: IExportColumn[];
}

export interface IExportColumn {
  key: string;
  header: string;
  width?: number;
  format?: "text" | "number" | "currency" | "date" | "percent";
}

export interface IExportOptions {
  format: "xlsx" | "pdf" | "print";
  includeEquipment: boolean;
  includeHours: boolean;
  includeCostSummary: boolean;
  includeApprovalHistory: boolean;
  includeComments: boolean;
  includeActivityLog: boolean;
  dateRange?: { from: string; to: string };
  title?: string;
  subtitle?: string;
}

export interface IExportResult {
  success: boolean;
  fileName: string;
  fileSize: number;
  error?: string;
}

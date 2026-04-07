/**
 * useExport — Hook de exportação.
 */
import * as React from "react";
import { IBid } from "../models";
import { IExportOptions, IExportResult } from "../models/IBidExport";
import { ExportService } from "../services/ExportService";

export function useExport(): {
  isExporting: boolean;
  exportToExcel: (
    bids: IBid[],
    options: IExportOptions,
  ) => Promise<IExportResult>;
  exportToPDF: (
    bids: IBid[],
    options: IExportOptions,
  ) => Promise<IExportResult>;
  print: (bids: IBid[], options: IExportOptions) => void;
} {
  const [isExporting, setIsExporting] = React.useState(false);

  const exportToExcel = React.useCallback(
    async (bids: IBid[], options: IExportOptions) => {
      setIsExporting(true);
      try {
        return await ExportService.exportToExcel(bids, options);
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  const exportToPDF = React.useCallback(
    async (bids: IBid[], options: IExportOptions) => {
      setIsExporting(true);
      try {
        return await ExportService.exportToPDF(bids, options);
      } finally {
        setIsExporting(false);
      }
    },
    [],
  );

  const print = React.useCallback((bids: IBid[], options: IExportOptions) => {
    ExportService.print(bids, options);
  }, []);

  return { isExporting, exportToExcel, exportToPDF, print };
}

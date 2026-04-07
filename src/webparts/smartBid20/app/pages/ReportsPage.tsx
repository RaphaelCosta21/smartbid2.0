import * as React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { ReportsDashboard } from "../components/reports/ReportsDashboard";
import { PeriodPerformanceReport } from "../components/reports/PeriodPerformanceReport";
import { BidDetailsReport } from "../components/reports/BidDetailsReport";
import { OperationalSummaryReport } from "../components/reports/OperationalSummaryReport";
import { ExportOptions } from "../components/reports/ExportOptions";
import { useBids } from "../hooks/useBids";
import { useExport } from "../hooks/useExport";
import {
  bidsToCSV,
  downloadCSV,
  getExportFilename,
} from "../utils/exportHelpers";

type ReportView = "hub" | "period" | "details" | "operational";

export const ReportsPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const [activeReport, setActiveReport] = React.useState<ReportView>(
    (type as ReportView) || "hub",
  );
  const { filteredBids } = useBids();
  const { isExporting: _isExporting, exportToExcel, print } = useExport();

  const handleExport = (format: "xlsx" | "pdf" | "print"): void => {
    if (format === "xlsx") {
      exportToExcel(filteredBids, {
        format: "xlsx",
        includeEquipment: false,
        includeHours: false,
        includeCostSummary: true,
        includeApprovalHistory: false,
        includeComments: false,
        includeActivityLog: false,
        title: getExportFilename("smart-bid-report", "xlsx"),
      });
    } else if (format === "pdf") {
      const csv = bidsToCSV(filteredBids);
      downloadCSV(csv, getExportFilename("smart-bid-report", "csv"));
    } else {
      print(filteredBids, {
        format: "print",
        includeEquipment: false,
        includeHours: false,
        includeCostSummary: false,
        includeApprovalHistory: false,
        includeComments: false,
        includeActivityLog: false,
      });
    }
  };

  const reports: { key: ReportView; label: string }[] = [
    { key: "hub", label: "All Reports" },
    { key: "period", label: "Period Performance" },
    { key: "details", label: "BID Details" },
    { key: "operational", label: "Operational Summary" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <PageHeader
          title="Reports"
          subtitle="Generate and export reports"
          icon={
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          }
        />
        <ExportOptions onExport={handleExport} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {reports.map((r) => (
          <button
            key={r.key}
            onClick={() => setActiveReport(r.key)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border:
                activeReport === r.key
                  ? "none"
                  : "1px solid var(--border-subtle)",
              background:
                activeReport === r.key
                  ? "var(--accent-color, #3B82F6)"
                  : "transparent",
              color: activeReport === r.key ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeReport === r.key ? 600 : 400,
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {activeReport === "hub" && <ReportsDashboard />}
      {activeReport === "period" && <PeriodPerformanceReport />}
      {activeReport === "details" && <BidDetailsReport />}
      {activeReport === "operational" && <OperationalSummaryReport />}
    </div>
  );
};

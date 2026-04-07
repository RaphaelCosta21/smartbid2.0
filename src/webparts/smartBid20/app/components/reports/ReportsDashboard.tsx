import * as React from "react";
import { PageHeader } from "../common/PageHeader";

export const ReportsDashboard: React.FC = () => {
  const reports = [
    {
      id: "period",
      title: "Period Performance",
      description: "BID performance by date range",
      icon: "📊",
    },
    {
      id: "details",
      title: "BID Details Report",
      description: "Detailed report for a specific BID",
      icon: "📋",
    },
    {
      id: "operational",
      title: "Operational Summary",
      description: "Operational overview and metrics",
      icon: "📈",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader title="Reports" subtitle="Generate and export reports" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {reports.map((r) => (
          <div
            key={r.id}
            style={{
              padding: 20,
              borderRadius: 12,
              border: "1px solid var(--border-subtle)",
              background: "var(--card-bg)",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 32 }}>{r.icon}</span>
            <h4 style={{ margin: "12px 0 4px", fontSize: 16, fontWeight: 600 }}>
              {r.title}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              {r.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

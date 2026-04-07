import * as React from "react";
import { PageHeader } from "../common/PageHeader";

export const PerformanceTrends: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Performance Trends"
        subtitle="Track BID performance over time"
      />
      <div
        style={{
          padding: 32,
          background: "var(--card-bg)",
          borderRadius: 12,
          border: "1px solid var(--border-subtle)",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        Performance trends charts will render here with Recharts integration.
      </div>
    </div>
  );
};

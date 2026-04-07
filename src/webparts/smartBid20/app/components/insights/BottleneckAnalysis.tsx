import * as React from "react";
import { PageHeader } from "../common/PageHeader";

export const BottleneckAnalysis: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Bottleneck Analysis"
        subtitle="Identify delays and bottlenecks in the BID process"
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
        Bottleneck analysis visualizations will render here.
      </div>
    </div>
  );
};

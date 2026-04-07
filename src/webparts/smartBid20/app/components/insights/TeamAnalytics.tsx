import * as React from "react";
import { PageHeader } from "../common/PageHeader";

export const TeamAnalytics: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Team Analytics"
        subtitle="Team performance and workload distribution"
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
        Team analytics visualizations will render here.
      </div>
    </div>
  );
};

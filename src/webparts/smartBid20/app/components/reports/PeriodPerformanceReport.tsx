import * as React from "react";

export const PeriodPerformanceReport: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h3>Period Performance Report</h3>
      <p style={{ color: "var(--text-secondary)" }}>
        Select a date range to generate the performance report.
      </p>
      <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
        <input
          type="date"
          style={{
            padding: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
          }}
        />
        <input
          type="date"
          style={{
            padding: 10,
            border: "1px solid var(--border-subtle)",
            borderRadius: 8,
          }}
        />
        <button
          style={{
            padding: "10px 20px",
            background: "var(--accent-color, #3B82F6)",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

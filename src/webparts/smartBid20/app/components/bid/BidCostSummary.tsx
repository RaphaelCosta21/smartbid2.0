import * as React from "react";
import { ICostSummary } from "../../models";

interface BidCostSummaryProps {
  costSummary: ICostSummary;
  className?: string;
}

export const BidCostSummary: React.FC<BidCostSummaryProps> = ({
  costSummary,
  className,
}) => {
  const rows = [
    {
      label: "Assets Cost (USD)",
      value: `$ ${costSummary.assetsCostUSD.toLocaleString()}`,
    },
    {
      label: "Assets Cost (BRL)",
      value: `R$ ${costSummary.assetsCostBRL.toLocaleString()}`,
    },
    {
      label: "Engineering Hours (BRL)",
      value: `R$ ${costSummary.engineeringHoursCostBRL.toLocaleString()}`,
    },
    {
      label: "Onshore Hours (BRL)",
      value: `R$ ${costSummary.onshoreHoursCostBRL.toLocaleString()}`,
    },
    {
      label: "Offshore Hours (BRL)",
      value: `R$ ${costSummary.offshoreHoursCostBRL.toLocaleString()}`,
    },
    {
      label: "Total Hours (BRL)",
      value: `R$ ${costSummary.totalHoursCostBRL.toLocaleString()}`,
      isBold: true,
    },
    {
      label: "Total Hours (USD)",
      value: `$ ${costSummary.totalHoursCostUSD.toLocaleString()}`,
    },
  ];

  return (
    <div
      className={className}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <div style={{ padding: "16px 20px", background: "var(--card-bg)" }}>
        {rows.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid var(--border-subtle)",
              fontWeight: row.isBold ? 600 : 400,
              fontSize: 14,
            }}
          >
            <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: "16px 20px",
          background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
          display: "flex",
          justifyContent: "space-between",
          color: "#fff",
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Total Cost (USD)</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            $ {costSummary.totalCostUSD.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Total Cost (BRL)</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>
            R$ {costSummary.totalCostBRL.toLocaleString()}
          </div>
        </div>
      </div>
      {costSummary.notes && (
        <div
          style={{
            padding: "12px 20px",
            fontSize: 13,
            color: "var(--text-secondary)",
            background: "var(--card-bg)",
          }}
        >
          {costSummary.notes}
        </div>
      )}
    </div>
  );
};

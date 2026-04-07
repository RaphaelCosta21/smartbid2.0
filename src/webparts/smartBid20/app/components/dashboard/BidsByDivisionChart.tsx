import * as React from "react";
import { GlassCard } from "../common/GlassCard";

interface BidsByDivisionChartProps {
  data: { division: string; count: number; color: string }[];
  className?: string;
}

export const BidsByDivisionChart: React.FC<BidsByDivisionChartProps> = ({
  data,
  className,
}) => {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <GlassCard title="BIDs by Division" className={className}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 24,
          padding: "8px 0",
        }}
      >
        <div style={{ position: "relative", width: 120, height: 120 }}>
          <svg
            viewBox="0 0 36 36"
            style={{
              width: "100%",
              height: "100%",
              transform: "rotate(-90deg)",
            }}
          >
            {
              data.reduce(
                (acc, item) => {
                  const percent = (item.count / total) * 100;
                  const el = (
                    <circle
                      key={item.division}
                      r="15.9155"
                      cx="18"
                      cy="18"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${percent} ${100 - percent}`}
                      strokeDashoffset={`-${acc.offset}`}
                    />
                  );
                  acc.elements.push(el);
                  acc.offset += percent;
                  return acc;
                },
                { elements: [] as React.ReactNode[], offset: 0 },
              ).elements
            }
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 700 }}>{total}</span>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              Total
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {data.map((item) => (
            <div
              key={item.division}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              <span>{item.division}</span>
              <span style={{ fontWeight: 600 }}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

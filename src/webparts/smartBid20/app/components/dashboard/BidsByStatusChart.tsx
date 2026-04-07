import * as React from "react";
import { GlassCard } from "../common/GlassCard";

interface BidsByStatusChartProps {
  data: { status: string; count: number; color: string }[];
  className?: string;
}

export const BidsByStatusChart: React.FC<BidsByStatusChartProps> = ({
  data,
  className,
}) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <GlassCard title="BIDs by Status" className={className}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "8px 0",
        }}
      >
        {data.map((item) => (
          <div
            key={item.status}
            style={{ display: "flex", alignItems: "center", gap: 12 }}
          >
            <span
              style={{
                minWidth: 120,
                fontSize: 13,
                color: "var(--text-secondary)",
              }}
            >
              {item.status}
            </span>
            <div
              style={{
                flex: 1,
                height: 24,
                background: "var(--border-subtle)",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  height: "100%",
                  background: item.color,
                  borderRadius: 4,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <span
              style={{
                minWidth: 30,
                textAlign: "right",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

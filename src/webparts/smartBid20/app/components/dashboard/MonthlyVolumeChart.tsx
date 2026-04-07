import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { IMonthlyVolume } from "../../models/IDashboard";

interface MonthlyVolumeChartProps {
  data: IMonthlyVolume[];
  className?: string;
}

export const MonthlyVolumeChart: React.FC<MonthlyVolumeChartProps> = ({
  data,
  className,
}) => {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.created, d.completed, d.cancelled)),
    1,
  );

  return (
    <GlassCard title="Monthly Volume" className={className}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
          padding: "12px 0",
          height: 160,
        }}
      >
        {data.map((m) => (
          <div
            key={m.month}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
                height: 120,
              }}
            >
              <div
                style={{
                  width: 12,
                  height: `${(m.created / maxVal) * 100}%`,
                  background: "#3B82F6",
                  borderRadius: "4px 4px 0 0",
                  minHeight: 2,
                }}
                title={`Created: ${m.created}`}
              />
              <div
                style={{
                  width: 12,
                  height: `${(m.completed / maxVal) * 100}%`,
                  background: "#10B981",
                  borderRadius: "4px 4px 0 0",
                  minHeight: 2,
                }}
                title={`Completed: ${m.completed}`}
              />
            </div>
            <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
              {m.month.slice(5)}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          gap: 16,
          justifyContent: "center",
          fontSize: 12,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#3B82F6",
            }}
          />{" "}
          Created
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: "#10B981",
            }}
          />{" "}
          Completed
        </span>
      </div>
    </GlassCard>
  );
};

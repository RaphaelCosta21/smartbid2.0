import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { IDivisionWorkload } from "../../models/IDashboard";

interface DivisionWorkloadProps {
  data: IDivisionWorkload[];
  className?: string;
}

export const DivisionWorkload: React.FC<DivisionWorkloadProps> = ({
  data,
  className,
}) => {
  return (
    <GlassCard title="Division Workload" className={className}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 12, padding: "8px 0" }}
      >
        {data.map((div) => (
          <div
            key={div.division}
            style={{
              flex: "1 1 200px",
              padding: 16,
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--card-bg)",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
              {div.division}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                fontSize: 12,
              }}
            >
              <div>
                <div style={{ color: "var(--text-secondary)" }}>Active</div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#3B82F6" }}
                >
                  {div.activeBids}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-secondary)" }}>Approvals</div>
                <div
                  style={{ fontSize: 18, fontWeight: 700, color: "#F59E0B" }}
                >
                  {div.pendingApprovals}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-secondary)" }}>Overdue</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: div.overdueBids > 0 ? "#EF4444" : "#10B981",
                  }}
                >
                  {div.overdueBids}
                </div>
              </div>
              <div>
                <div style={{ color: "var(--text-secondary)" }}>Avg Days</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  {div.avgCompletionDays}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

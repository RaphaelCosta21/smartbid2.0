import * as React from "react";
import { GlassCard } from "../common/GlassCard";

interface ApprovalsPendingProps {
  approvals: { bidNumber: string; requester: string; days: number }[];
  onView?: (bidNumber: string) => void;
  className?: string;
}

export const ApprovalsPending: React.FC<ApprovalsPendingProps> = ({
  approvals,
  onView,
  className,
}) => {
  return (
    <GlassCard
      title={`Pending Approvals (${approvals.length})`}
      className={className}
    >
      {approvals.length === 0 ? (
        <div
          style={{ padding: 16, color: "var(--text-secondary)", fontSize: 14 }}
        >
          No pending approvals
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {approvals.map((a) => (
            <div
              key={a.bidNumber}
              onClick={() => onView?.(a.bidNumber)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                borderRadius: 8,
                cursor: onView ? "pointer" : "default",
                background: a.days > 3 ? "#F59E0B08" : "transparent",
              }}
            >
              <div>
                <span style={{ fontWeight: 600, fontSize: 14 }}>
                  {a.bidNumber}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    marginLeft: 8,
                  }}
                >
                  by {a.requester}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color:
                    a.days > 3
                      ? "#EF4444"
                      : a.days > 1
                        ? "#F59E0B"
                        : "var(--text-secondary)",
                }}
              >
                {a.days}d ago
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

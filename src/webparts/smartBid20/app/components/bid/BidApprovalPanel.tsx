import * as React from "react";
import { IBidApproval } from "../../models";

interface BidApprovalPanelProps {
  approvals: IBidApproval[];
  onRequestApproval?: () => void;
  className?: string;
}

export const BidApprovalPanel: React.FC<BidApprovalPanelProps> = ({
  approvals,
  onRequestApproval,
  className,
}) => {
  const statusIcons: Record<string, { icon: string; color: string }> = {
    approved: { icon: "✅", color: "#10B981" },
    rejected: { icon: "❌", color: "#EF4444" },
    pending: { icon: "⏳", color: "#F59E0B" },
    "not-started": { icon: "⚪", color: "#94A3B8" },
    "revision-requested": { icon: "🔄", color: "#F97316" },
  };

  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Approvals</h4>
        {onRequestApproval && (
          <button
            onClick={onRequestApproval}
            style={{
              padding: "8px 16px",
              background: "var(--accent-color, #3B82F6)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Request Approval
          </button>
        )}
      </div>
      {approvals.length === 0 ? (
        <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          No approvals requested yet
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {approvals.map((approval) => {
            const { icon, color } = statusIcons[approval.status] || statusIcons["not-started"];
            return (
              <div
                key={approval.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  border: `1px solid ${color}30`,
                  background: `${color}08`,
                }}
              >
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{approval.stakeholder.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{approval.stakeholderRole}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color }}>{approval.status}</div>
                  {approval.respondedDate && (
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                      {new Date(approval.respondedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

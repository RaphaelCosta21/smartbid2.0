import * as React from "react";
import { IBidApprovalState } from "../../models/IBidApproval";

interface ApprovalRequestCardProps {
  approval: IBidApprovalState;
  onView?: () => void;
  className?: string;
}

export const ApprovalRequestCard: React.FC<ApprovalRequestCardProps> = ({
  approval,
  onView,
  className,
}) => {
  const statusColors: Record<string, string> = {
    pending: "#F59E0B",
    approved: "#10B981",
    rejected: "#EF4444",
    "revision-requested": "#F97316",
    "not-started": "#94A3B8",
  };

  return (
    <div
      className={className}
      onClick={onView}
      style={{
        padding: 16,
        borderRadius: 12,
        border: `1px solid ${statusColors[approval.status] || "#94A3B8"}30`,
        background: "var(--card-bg)",
        cursor: onView ? "pointer" : "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {approval.bidNumber}
        </span>
        <span
          style={{
            padding: "2px 10px",
            borderRadius: 12,
            fontSize: 12,
            fontWeight: 600,
            background: `${statusColors[approval.status]}20`,
            color: statusColors[approval.status],
          }}
        >
          {approval.status}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
        {approval.type} · {approval.approvedCount}/{approval.totalApprovers}{" "}
        approved
      </div>
      <div
        style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}
      >
        Requested by {approval.requestedBy.name} on{" "}
        {new Date(approval.requestedDate).toLocaleDateString()}
      </div>
    </div>
  );
};

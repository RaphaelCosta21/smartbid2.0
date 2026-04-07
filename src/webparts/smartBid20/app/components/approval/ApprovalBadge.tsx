import * as React from "react";
import { ApprovalStatus } from "../../models";

interface ApprovalBadgeProps {
  status: ApprovalStatus;
  className?: string;
}

export const ApprovalBadge: React.FC<ApprovalBadgeProps> = ({
  status,
  className,
}) => {
  const config: Record<ApprovalStatus, { label: string; color: string }> = {
    pending: { label: "Pending", color: "#F59E0B" },
    approved: { label: "Approved", color: "#10B981" },
    rejected: { label: "Rejected", color: "#EF4444" },
    "revision-requested": { label: "Revision Requested", color: "#F97316" },
    "not-started": { label: "Not Started", color: "#94A3B8" },
  };

  const { label, color } = config[status] || config["not-started"];

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
};

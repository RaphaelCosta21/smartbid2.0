import * as React from "react";
import { ApprovalStatus } from "../../models";
import styles from "./ApprovalBadge.module.scss";

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
      className={`${styles.badge} ${className || ""}`}
      style={{
        background: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {label}
    </span>
  );
};

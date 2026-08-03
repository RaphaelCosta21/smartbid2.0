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
    pending: { label: "Pending", color: "var(--warning)" },
    approved: { label: "Approved", color: "var(--success)" },
    rejected: { label: "Rejected", color: "var(--danger)" },
    "revision-requested": {
      label: "Revision Requested",
      color: "var(--warning)",
    },
    "not-started": { label: "Not Started", color: "var(--text-muted)" },
  };

  const { label, color } = config[status] || config["not-started"];

  return (
    <span
      className={`${styles.badge} ${className || ""}`}
      style={{
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
      }}
    >
      {label}
    </span>
  );
};

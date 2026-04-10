import * as React from "react";
import { IBidApprovalState } from "../../models/IBidApproval";
import styles from "./ApprovalRequestCard.module.scss";

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

  const color = statusColors[approval.status] || "#94A3B8";

  return (
    <div
      className={`${styles.card} ${onView ? styles.cardClickable : ""} ${className || ""}`}
      onClick={onView}
      style={{ border: `1px solid ${color}30` }}
    >
      <div className={styles.cardHeader}>
        <span className={styles.bidNumber}>{approval.bidNumber}</span>
        <span
          className={styles.statusBadge}
          style={{ background: `${color}20`, color }}
        >
          {approval.status}
        </span>
      </div>
      <div className={styles.meta}>
        {approval.type} · {approval.approvedCount}/{approval.totalApprovers}{" "}
        approved
      </div>
      <div className={styles.metaSub}>
        Requested by {approval.requestedBy.name} on{" "}
        {new Date(approval.requestedDate).toLocaleDateString()}
      </div>
    </div>
  );
};

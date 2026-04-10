import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import styles from "./ApprovalsPending.module.scss";

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
  const getDaysClass = (days: number): string => {
    if (days > 3) return styles.urgent;
    if (days > 1) return styles.warning;
    return styles.normal;
  };

  return (
    <GlassCard
      title={`Pending Approvals (${approvals.length})`}
      className={className}
    >
      {approvals.length === 0 ? (
        <div className={styles.emptyState}>No pending approvals</div>
      ) : (
        <div className={styles.approvalList}>
          {approvals.map((a) => (
            <div
              key={a.bidNumber}
              className={`${styles.approvalItem} ${a.days > 3 ? styles.stale : ""}`}
              onClick={() => onView?.(a.bidNumber)}
            >
              <div className={styles.approvalInfo}>
                <span className={styles.approvalBid}>{a.bidNumber}</span>
                <span className={styles.approvalRequester}>
                  by {a.requester}
                </span>
              </div>
              <span
                className={`${styles.approvalDays} ${getDaysClass(a.days)}`}
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

import * as React from "react";
import { IBidApproval } from "../../models";
import { formatDate } from "../../utils/formatters";
import styles from "./BidApprovalPanel.module.scss";

interface BidApprovalPanelProps {
  approvals: IBidApproval[];
  onRequestApproval?: () => void;
  className?: string;
}

export const BidApprovalPanel: React.FC<BidApprovalPanelProps> = ({
  approvals = [],
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
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <h4 className={styles.title}>Approvals</h4>
        {onRequestApproval && (
          <button onClick={onRequestApproval} className={styles.requestBtn}>
            Request Approval
          </button>
        )}
      </div>
      {approvals.length === 0 ? (
        <div className={styles.empty}>No approvals requested yet</div>
      ) : (
        <div className={styles.list}>
          {approvals.map((approval) => {
            const { icon, color } =
              statusIcons[approval.status] || statusIcons["not-started"];
            return (
              <div
                key={approval.id}
                className={styles.item}
                style={{
                  border: `1px solid ${color}30`,
                  background: `${color}08`,
                }}
              >
                <span className={styles.itemIcon}>{icon}</span>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>
                    {approval.stakeholder.name}
                  </div>
                  <div className={styles.itemRole}>
                    {approval.stakeholderRole}
                  </div>
                </div>
                <div className={styles.itemStatus}>
                  <div className={styles.itemStatusLabel} style={{ color }}>
                    {approval.status}
                  </div>
                  {approval.respondedDate && (
                    <div className={styles.itemDate}>
                      {formatDate(approval.respondedDate)}
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

import * as React from "react";
import { Check, X, Clock, Circle, RefreshCw } from "lucide-react";
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
  const statusIcons: Record<string, { icon: React.ReactNode; color: string }> =
    {
      approved: {
        icon: <Check size={16} style={{ verticalAlign: "-3px" }} />,
        color: "var(--success)",
      },
      rejected: {
        icon: <X size={16} style={{ verticalAlign: "-3px" }} />,
        color: "var(--danger)",
      },
      pending: {
        icon: <Clock size={16} style={{ verticalAlign: "-3px" }} />,
        color: "var(--warning)",
      },
      "not-started": {
        icon: <Circle size={16} style={{ verticalAlign: "-3px" }} />,
        color: "var(--text-muted)",
      },
      "revision-requested": {
        icon: <RefreshCw size={16} style={{ verticalAlign: "-3px" }} />,
        color: "var(--warning)",
      },
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
                  border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
                  background: `color-mix(in srgb, ${color} 5%, transparent)`,
                }}
              >
                <span className={styles.itemIcon} style={{ color }}>
                  {icon}
                </span>
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

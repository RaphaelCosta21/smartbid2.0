import * as React from "react";
import { IActivityLogEntry } from "../../models";
import { Timeline } from "../common/Timeline";
import { formatDateTime } from "../../utils/formatters";
import styles from "./BidActivityLog.module.scss";

interface BidActivityLogProps {
  entries: IActivityLogEntry[];
  className?: string;
}

export const BidActivityLog: React.FC<BidActivityLogProps> = ({
  entries = [],
  className,
}) => {
  const safeEntries = entries || [];
  const items = safeEntries.map((entry) => ({
    id: entry.id,
    title: entry.description,
    description: `by ${entry.actorName}`,
    timestamp: formatDateTime(entry.timestamp),
    color: getActivityColor(entry.type),
  }));

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <h4 className={styles.title}>Activity Log</h4>
      {items.length === 0 ? (
        <div className={styles.empty}>No activity yet</div>
      ) : (
        <Timeline items={items} />
      )}
    </div>
  );
};

function getActivityColor(type: string): string {
  const colors: Record<string, string> = {
    STATUS_CHANGED: "var(--primary-accent, #3B82F6)",
    PHASE_CHANGED: "var(--accent-purple, #8B5CF6)",
    APPROVAL_REQUESTED: "var(--warning-color, #F59E0B)",
    APPROVAL_RESPONSE: "var(--success-color, #10B981)",
    COMMENT_ADDED: "var(--accent-cyan, #06B6D4)",
    BID_CREATED: "var(--success-color, #22C55E)",
  };
  return colors[type] || "var(--text-tertiary, #94A3B8)";
}

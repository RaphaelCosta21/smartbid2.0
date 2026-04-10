import * as React from "react";
import { IActivityLogEntry } from "../../models";
import { Timeline } from "../common/Timeline";
import styles from "./BidActivityLog.module.scss";

interface BidActivityLogProps {
  entries: IActivityLogEntry[];
  className?: string;
}

export const BidActivityLog: React.FC<BidActivityLogProps> = ({
  entries,
  className,
}) => {
  const items = entries.map((entry) => ({
    id: entry.id,
    title: entry.description,
    description: `by ${entry.actorName}`,
    timestamp: new Date(entry.timestamp).toLocaleString(),
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
    STATUS_CHANGED: "#3B82F6",
    PHASE_CHANGED: "#8B5CF6",
    APPROVAL_REQUESTED: "#F59E0B",
    APPROVAL_RESPONSE: "#10B981",
    COMMENT_ADDED: "#06B6D4",
    BID_CREATED: "#22C55E",
  };
  return colors[type] || "#94A3B8";
}

import * as React from "react";
import { INotification } from "../../models";
import { formatDistanceToNow } from "date-fns";
import { GlassCard } from "../common/GlassCard";
import styles from "./RecentActivity.module.scss";

interface RecentActivityProps {
  notifications: INotification[];
  maxItems?: number;
}

const TYPE_COLORS: Record<string, string> = {
  BID_STATUS_CHANGED: "#00c9a7",
  APPROVAL_REQUESTED: "#f59e0b",
  APPROVAL_RESPONSE: "#10b981",
  BID_OVERDUE: "#ef4444",
  BID_CREATED: "#3b82f6",
  BID_COMPLETED: "#10b981",
  HIGH_PRIORITY: "#ef4444",
  DEADLINE_WARNING: "#f59e0b",
  COMMENT_ADDED: "#8b5cf6",
};

export const RecentActivity: React.FC<RecentActivityProps> = ({
  notifications,
  maxItems = 10,
}) => {
  const items = notifications.slice(0, maxItems);

  return (
    <GlassCard title="Recent Activity">
      {items.length === 0 ? (
        <div className={styles.emptyState}>No recent activity.</div>
      ) : (
        <ul className={styles.activityList}>
          {items.map((item) => (
            <li key={item.id} className={styles.activityItem}>
              <div
                className={styles.activityDot}
                style={{
                  background: TYPE_COLORS[item.type] || "#94a3b8",
                }}
              />
              <div className={styles.activityContent}>
                <div className={styles.activityText}>{item.message}</div>
                <div className={styles.activityTime}>
                  {item.actorName ? `${item.actorName} · ` : ""}
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
};

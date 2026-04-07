/**
 * NotificationsPage — Lists all user notifications with mark-as-read.
 */

import * as React from "react";
import styles from "./NotificationsPage.module.scss";
import { useNotificationStore } from "../stores/useNotificationStore";

const ICON_MAP: Record<string, string> = {
  BID_STATUS_CHANGED: "🔄",
  BID_ASSIGNED: "📌",
  APPROVAL_REQUESTED: "✅",
  BID_OVERDUE: "⏰",
  COMMENT_ADDED: "💬",
  BID_COMPLETED: "🏆",
  SYSTEM: "🔧",
};

export const NotificationsPage: React.FC = () => {
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const [filter, setFilter] = React.useState<"all" | "unread">("all");

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const getTimeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Notifications</h2>
          <p className={styles.subtitle}>
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            className={`${styles.filterBtn} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`${styles.filterBtn} ${filter === "unread" ? styles.active : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button className={styles.markAllBtn} onClick={markAllAsRead}>
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <div className={styles.emptyState}>
            <div style={{ fontSize: 40, opacity: 0.3 }}>🔔</div>
            <p>
              {filter === "unread"
                ? "No unread notifications"
                : "No notifications yet"}
            </p>
          </div>
        )}
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`${styles.notifCard} ${!n.isRead ? styles.unread : ""}`}
            onClick={() => !n.isRead && markAsRead(n.id)}
          >
            <span className={styles.notifIcon}>{ICON_MAP[n.type] || "📣"}</span>
            <div className={styles.notifContent}>
              <span className={styles.notifTitle}>{n.title}</span>
              <span className={styles.notifMessage}>{n.message}</span>
              <div className={styles.notifMeta}>
                {n.bidNumber && (
                  <span className={styles.bidTag}>{n.bidNumber}</span>
                )}
                <span className={styles.timeAgo}>
                  {getTimeAgo(n.timestamp)}
                </span>
              </div>
            </div>
            {!n.isRead && <span className={styles.unreadDot} />}
          </div>
        ))}
      </div>
    </div>
  );
};

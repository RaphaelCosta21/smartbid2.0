import * as React from "react";
import { INotification } from "../../models";
import { formatDistanceToNow } from "date-fns";
import { GlassCard } from "../common/GlassCard";

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
        <div
          style={{
            textAlign: "center",
            padding: 24,
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          No recent activity.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  marginTop: 5,
                  flexShrink: 0,
                  background: TYPE_COLORS[item.type] || "#94a3b8",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-primary)",
                    margin: "0 0 2px",
                  }}
                >
                  {item.message}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
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

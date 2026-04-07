import * as React from "react";
import { IBid } from "../../models";
import { differenceInDays, format } from "date-fns";
import { GlassCard } from "../common/GlassCard";

interface UpcomingDeadlinesProps {
  bids: IBid[];
  maxItems?: number;
  onBidClick?: (bid: IBid) => void;
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  bids,
  maxItems = 5,
  onBidClick,
}) => {
  const now = new Date();
  const upcoming = bids
    .map((b) => ({
      ...b,
      daysLeft: differenceInDays(new Date(b.dueDate), now),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, maxItems);

  const getCountdownColor = (days: number): string => {
    if (days < 0) return "#ef4444";
    if (days <= 3) return "#f59e0b";
    return "#10b981";
  };

  return (
    <GlassCard title="Upcoming Deadlines">
      {upcoming.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 24,
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          No upcoming deadlines.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {upcoming.map((bid) => {
            const color = getCountdownColor(bid.daysLeft);
            return (
              <div
                key={bid.bidNumber}
                onClick={() => onBidClick?.(bid)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border-subtle)",
                  cursor: onBidClick ? "pointer" : "default",
                  transition: "background 200ms ease",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {bid.bidNumber}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {bid.opportunityInfo.client} ·{" "}
                    {format(new Date(bid.dueDate), "MMM d")}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: `${color}18`,
                    color,
                  }}
                >
                  {bid.daysLeft < 0
                    ? `${Math.abs(bid.daysLeft)}d overdue`
                    : bid.daysLeft === 0
                      ? "Today"
                      : `${bid.daysLeft}d`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

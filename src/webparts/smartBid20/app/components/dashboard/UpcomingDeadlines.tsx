import * as React from "react";
import { IBid } from "../../models";
import { differenceInDays, format } from "date-fns";
import { GlassCard } from "../common/GlassCard";
import styles from "./UpcomingDeadlines.module.scss";

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

  const getCountdownClass = (days: number): string => {
    if (days < 0) return styles.urgent;
    if (days <= 3) return styles.warning;
    return styles.ok;
  };

  return (
    <GlassCard title="Upcoming Deadlines">
      {upcoming.length === 0 ? (
        <div className={styles.emptyState}>No upcoming deadlines.</div>
      ) : (
        <div>
          {upcoming.map((bid) => (
            <div
              key={bid.bidNumber}
              className={styles.deadlineItem}
              onClick={() => onBidClick?.(bid)}
            >
              <div className={styles.deadlineInfo}>
                <p className={styles.deadlineBid}>{bid.bidNumber}</p>
                <span className={styles.deadlineClient}>
                  {bid.opportunityInfo.client} ·{" "}
                  {format(new Date(bid.dueDate), "MMM d")}
                </span>
              </div>
              <span
                className={`${styles.deadlineCountdown} ${getCountdownClass(bid.daysLeft)}`}
              >
                {bid.daysLeft < 0
                  ? `${Math.abs(bid.daysLeft)}d overdue`
                  : bid.daysLeft === 0
                    ? "Today"
                    : `${bid.daysLeft}d`}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

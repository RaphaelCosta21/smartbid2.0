import * as React from "react";
import { IBid } from "../../models";
import { formatDate, formatDaysLeft } from "../../utils/formatters";
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
  const upcoming = bids
    .map((b) => ({ ...b, due: formatDaysLeft(b.dueDate) }))
    .filter((b) => b.due.days !== null)
    .sort((a, b) => (a.due.days || 0) - (b.due.days || 0))
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
                  {formatDate(bid.dueDate, "MMM d")}
                </span>
              </div>
              <span
                className={`${styles.deadlineCountdown} ${getCountdownClass(bid.due.days || 0)}`}
              >
                {bid.due.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

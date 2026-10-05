import * as React from "react";
import { IBid } from "../../models";
import { formatDate, formatDaysLeft } from "../../utils/formatters";
import { getDueFreezeDate } from "../../utils/bidHelpers";
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
    .map((b) => ({
      ...b,
      due: formatDaysLeft(b.dueDate, getDueFreezeDate(b)),
    }))
    .filter((b) => b.due.days !== null)
    .sort((a, b) => (a.due.days || 0) - (b.due.days || 0))
    .slice(0, maxItems);

  const getCountdownClass = (days: number): string => {
    if (days < 0) return styles.urgent;
    if (days <= 3) return styles.warning;
    return styles.ok;
  };

  const overdueCount = upcoming.filter((b) => (b.due.days || 0) < 0).length;

  return (
    <GlassCard
      title="Upcoming Deadlines"
      subtitle={
        overdueCount > 0
          ? `${overdueCount} overdue · nearest due first`
          : "Active BIDs, nearest due first"
      }
    >
      {upcoming.length === 0 ? (
        <div className={styles.emptyState}>No upcoming deadlines.</div>
      ) : (
        <div className={styles.list}>
          {upcoming.map((bid) => {
            const project = bid.opportunityInfo?.projectName;
            const client = bid.opportunityInfo?.client;
            return (
              <div
                key={bid.bidNumber}
                className={styles.deadlineItem}
                role="button"
                tabIndex={0}
                onClick={() => onBidClick?.(bid)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onBidClick?.(bid);
                  }
                }}
                title={`Open ${bid.bidNumber}`}
              >
                <div className={styles.deadlineInfo}>
                  <span className={styles.deadlineProject}>
                    {project || client || bid.bidNumber}
                  </span>
                  <span className={styles.deadlineMeta}>
                    <span className={styles.deadlineBid}>{bid.bidNumber}</span>
                    {project && client ? ` · ${client}` : ""}
                    {` · Due ${formatDate(bid.dueDate, "MMM d")}`}
                  </span>
                </div>
                <span
                  className={`${styles.deadlineCountdown} ${getCountdownClass(bid.due.days || 0)}`}
                >
                  {bid.due.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

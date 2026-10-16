import * as React from "react";
import { formatDate } from "../../utils/formatters";
import { IUpcomingDeadline } from "../../utils/bidHelpers";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import {
  FocusButton,
  LiveFocusOverlay,
  useFocusMode,
} from "./LiveFocusOverlay";
import styles from "./UpcomingDeadlines.module.scss";

interface UpcomingDeadlinesProps {
  rows: IUpcomingDeadline[];
  maxItems?: number;
  onBidClick?: (bidNumber: string) => void;
}

const FOCUS_GROUPS: {
  key: string;
  label: string;
  test: (days: number) => boolean;
}[] = [
  { key: "overdue", label: "Overdue", test: (d) => d < 0 },
  { key: "week", label: "Next 7 days", test: (d) => d >= 0 && d <= 7 },
  { key: "later", label: "Later", test: (d) => d > 7 },
];

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({
  rows,
  maxItems = 5,
  onBidClick,
}) => {
  const focus = useFocusMode();
  const upcoming = rows.slice(0, maxItems);

  const getCountdownClass = (days: number): string => {
    if (days < 0) return styles.urgent;
    if (days <= 3) return styles.warning;
    return styles.ok;
  };

  const overdueCount = rows.filter((r) => r.days < 0).length;
  const subtitle =
    overdueCount > 0
      ? `${overdueCount} overdue · nearest due first`
      : "Active BIDs, nearest due first";

  const renderItem = (
    r: IUpcomingDeadline,
    expanded: boolean,
    index: number,
  ): React.ReactNode => {
    const bid = r.bid;
    const project = bid.opportunityInfo?.projectName;
    const client = bid.opportunityInfo?.client;
    const engineers = (bid.engineerResponsible || [])
      .map((p) => p.name)
      .filter(Boolean)
      .join(", ");
    return (
      <div
        key={bid.bidNumber}
        className={`${styles.deadlineItem} ${expanded ? styles.expandedItem : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => onBidClick?.(bid.bidNumber)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onBidClick?.(bid.bidNumber);
          }
        }}
        title={`Open ${bid.bidNumber}`}
        data-focus-item={expanded ? "" : undefined}
        style={
          expanded
            ? ({ "--i": Math.min(index, 12) } as React.CSSProperties)
            : undefined
        }
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
          {expanded && (
            <span className={styles.deadlineExtra}>
              <StatusBadge status={bid.currentStatus} />
              {engineers && (
                <span className={styles.deadlineEngineer}>{engineers}</span>
              )}
            </span>
          )}
        </div>
        <span
          className={`${styles.deadlineCountdown} ${getCountdownClass(r.days)}`}
        >
          {r.text}
        </span>
      </div>
    );
  };

  let focusIndex = 0;

  return (
    <div ref={focus.ref}>
      <GlassCard
        title="Upcoming Deadlines"
        subtitle={subtitle}
        actions={
          rows.length > 0 ? (
            <FocusButton onClick={focus.open} label="Upcoming Deadlines" />
          ) : undefined
        }
      >
        {upcoming.length === 0 ? (
          <div className={styles.emptyState}>No upcoming deadlines.</div>
        ) : (
          <div className={styles.list}>
            {upcoming.map((r, i) => renderItem(r, false, i))}
          </div>
        )}
      </GlassCard>

      <LiveFocusOverlay
        origin={focus.origin}
        onClose={focus.close}
        title="Upcoming Deadlines"
        subtitle={`${rows.length} active BID${rows.length === 1 ? "" : "s"} with a due date · ${subtitle}`}
      >
        {FOCUS_GROUPS.map((g) => {
          const items = rows.filter((r) => g.test(r.days));
          if (items.length === 0) return null;
          return (
            <section key={g.key} className={styles.focusGroup}>
              <h4 className={`${styles.focusGroupTitle} ${styles[g.key]}`}>
                {g.label}
                <span className={styles.focusGroupCount}>{items.length}</span>
              </h4>
              <div className={styles.focusGrid}>
                {items.map((r) => renderItem(r, true, focusIndex++))}
              </div>
            </section>
          );
        })}
      </LiveFocusOverlay>
    </div>
  );
};

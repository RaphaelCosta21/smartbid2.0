import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { PhaseBadge } from "../components/common/PhaseBadge";
import { CountdownTimer } from "../components/common/CountdownTimer";
import { useBids } from "../hooks/useBids";
import { formatDate } from "../utils/formatters";
import { DIVISION_COLORS } from "../utils/constants";
import { isActiveBid } from "../utils/bidHelpers";
import styles from "./TimelinePage.module.scss";

export const TimelinePage: React.FC = () => {
  const { filteredBids } = useBids();
  const activeBids = React.useMemo(
    () =>
      filteredBids
        .filter(isActiveBid)
        .sort(
          (a, b) =>
            new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
        ),
    [filteredBids],
  );

  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() - 7);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 60);
  const totalDays = Math.ceil(
    (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Generate week markers for the header
  const weekMarkers = React.useMemo(() => {
    const markers: { label: string; position: string; isMonth: boolean }[] = [];
    const cursor = new Date(minDate);
    // Align to next Monday
    const dayOfWeek = cursor.getDay();
    const daysToMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
    cursor.setDate(cursor.getDate() + daysToMonday);

    let lastMonth = -1;
    while (cursor <= maxDate) {
      const dayOffset = Math.ceil(
        (cursor.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const position = `${(dayOffset / totalDays) * 100}%`;
      const isNewMonth = cursor.getMonth() !== lastMonth;
      const label = isNewMonth
        ? cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : cursor.getDate().toString();
      markers.push({ label, position, isMonth: isNewMonth });
      lastMonth = cursor.getMonth();
      cursor.setDate(cursor.getDate() + 7);
    }
    return markers;
  }, [totalDays]);

  const getBarStyle = (
    createdDate: string,
    dueDate: string,
  ): { left: string; width: string } => {
    const start = Math.max(
      0,
      Math.ceil(
        (new Date(createdDate).getTime() - minDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const end = Math.min(
      totalDays,
      Math.ceil(
        (new Date(dueDate).getTime() - minDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const barWidth = Math.max(end - start, 2);
    return {
      left: `${(start / totalDays) * 100}%`,
      width: `${(barWidth / totalDays) * 100}%`,
    };
  };

  const todayPosition = `${(Math.ceil((today.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) / totalDays) * 100}%`;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Timeline"
        subtitle={`Gantt view of ${activeBids.length} active BIDs`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        }
      />

      <div className={styles.ganttContainer}>
        {/* Header row with date markers */}
        <div className={styles.ganttHeader}>
          <div className={styles.ganttLabelCol}>BID</div>
          <div className={styles.ganttBarCol}>
            {weekMarkers.map((marker, i) => (
              <div
                key={i}
                className={`${styles.dateMarker} ${marker.isMonth ? styles.dateMarkerMonth : ""}`}
                style={{ left: marker.position }}
              >
                <span className={styles.dateMarkerLabel}>{marker.label}</span>
                <div className={styles.dateMarkerLine} />
              </div>
            ))}
            <div className={styles.todayMarker} style={{ left: todayPosition }}>
              <span className={styles.todayLabel}>Today</span>
              <div className={styles.todayLine} />
            </div>
          </div>
        </div>

        {activeBids.length === 0 ? (
          <div className={styles.emptyState}>No active BIDs to display.</div>
        ) : (
          activeBids.map((bid) => {
            const barStyle = getBarStyle(bid.createdDate, bid.dueDate);
            const divColor = DIVISION_COLORS[bid.division] || "#94a3b8";
            return (
              <div key={bid.bidNumber} className={styles.ganttRow}>
                <div className={styles.ganttRowLabel}>
                  <div className={styles.ganttRowTop}>
                    <span className={styles.ganttBidNumber}>
                      {bid.bidNumber}
                    </span>
                    <StatusBadge status={bid.currentStatus} />
                  </div>
                  <div className={styles.ganttRowBottom}>
                    <span>{bid.opportunityInfo.client}</span>
                    <PhaseBadge phase={bid.currentPhase} />
                    <CountdownTimer targetDate={bid.dueDate} />
                  </div>
                </div>
                <div className={styles.ganttBarArea}>
                  <div
                    className={styles.todayLineRow}
                    style={{ left: todayPosition }}
                  />
                  <div
                    className={styles.ganttBar}
                    style={{
                      ...barStyle,
                      background: `${divColor}30`,
                      border: `1px solid ${divColor}`,
                      color: divColor,
                    }}
                  >
                    {formatDate(bid.createdDate, "MMM d")} —{" "}
                    {formatDate(bid.dueDate, "MMM d")}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

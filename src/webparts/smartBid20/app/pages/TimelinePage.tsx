import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChartGantt, ChevronLeft, ChevronRight, UserRound } from "lucide-react";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { PhaseBadge } from "../components/common/PhaseBadge";
import { CountdownTimer } from "../components/common/CountdownTimer";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import {
  SegmentedControl,
  SegmentOption,
} from "../components/insights/SegmentedControl";
import { useBids } from "../hooks/useBids";
import { IBid } from "../models";
import { formatDate, formatDaysLeft, parseDate } from "../utils/formatters";
import { getDueFreezeDate, isActiveBid } from "../utils/bidHelpers";
import styles from "./TimelinePage.module.scss";

type ZoomWeeks = 4 | 8 | 12;
type DueHealth = "onTrack" | "dueSoon" | "overdue" | "none";
type LabelMode = "inside" | "right" | "left" | "edgeBefore" | "edgeAfter";

// Same warning threshold as CountdownTimer.
const DUE_SOON_DAYS = 3;
// Bars narrower than this share of the window get their label outside.
const MIN_INSIDE_LABEL_PCT = 16;

const ZOOM_SEGMENTS: SegmentOption<ZoomWeeks>[] = [
  { value: 4, label: "4 weeks" },
  { value: 8, label: "8 weeks" },
  { value: 12, label: "12 weeks" },
];

const HEALTH_LEGEND: {
  key: Exclude<DueHealth, "none">;
  label: string;
  title: string;
}[] = [
  {
    key: "onTrack",
    label: "On track",
    title: "Due in more than 3 days, or delivered on time",
  },
  { key: "dueSoon", label: "Due soon", title: "Due in 3 days or less" },
  { key: "overdue", label: "Overdue", title: "Past the due date" },
];

const HEALTH_CLASS: Record<DueHealth, string> = {
  onTrack: styles.healthOnTrack,
  dueSoon: styles.healthDueSoon,
  overdue: styles.healthOverdue,
  none: styles.healthNone,
};

interface BarLayout {
  label: string;
  bar: {
    left: number;
    width: number;
    elapsed: number;
    clipStart: boolean;
    clipEnd: boolean;
  } | null;
  tail: { left: number; width: number; clipStart: boolean } | null;
  dueAt: number | null;
  labelMode: LabelMode;
  labelAt: number;
}

interface TimelineRow {
  bid: IBid;
  freeze: Date | null;
  health: DueHealth;
  layout: BarLayout | null;
}

function getDueHealth(dueDate: string, freeze: Date | null): DueHealth {
  if (!parseDate(dueDate)) return "none";
  const due = formatDaysLeft(dueDate, freeze);
  if (due.isOverdue) return "overdue";
  return due.days !== null && due.days <= DUE_SOON_DAYS ? "dueSoon" : "onTrack";
}

/** Day units are offsets from windowStart; returned positions are % of the window. */
function layoutBar(
  bid: IBid,
  health: DueHealth,
  freeze: Date | null,
  windowStart: Date,
  totalDays: number,
  today: Date,
): BarLayout | null {
  const due = parseDate(bid.dueDate);
  if (!due) return null;
  const created = parseDate(bid.createdDate);
  const dayOf = (d: Date): number => differenceInCalendarDays(d, windowStart);
  const pct = (days: number): number => (days / totalDays) * 100;
  const clamp = (days: number): number =>
    Math.min(Math.max(days, 0), totalDays);

  const end = dayOf(due) + 1;
  const start = created ? Math.min(dayOf(created), end - 1) : end - 1;
  const now = dayOf(today) + 0.5;
  // The overdue delay stops at the freeze date, like the due countdown.
  const delayEnd = freeze ? dayOf(freeze) + 0.5 : now;
  const visStart = clamp(start);
  const visEnd = clamp(end);
  const tailEnd =
    health === "overdue" ? clamp(Math.max(delayEnd, end)) : visEnd;

  const bar =
    visEnd > visStart
      ? {
          left: pct(visStart),
          width: pct(visEnd - visStart),
          elapsed:
            ((clamp(Math.min(Math.max(now, start), end)) - visStart) /
              (visEnd - visStart)) *
            100,
          clipStart: start < 0,
          clipEnd: end > totalDays,
        }
      : null;
  const tail =
    tailEnd > visEnd
      ? { left: pct(visEnd), width: pct(tailEnd - visEnd), clipStart: end < 0 }
      : null;

  const layout: BarLayout = {
    label: created
      ? `${format(created, "MMM d")} - ${format(due, "MMM d")}`
      : `Due ${format(due, "MMM d")}`,
    bar,
    tail,
    dueAt: end > 0 && end < totalDays ? pct(end) : null,
    labelMode: "inside",
    labelAt: 0,
  };

  if (!bar && !tail) {
    layout.labelMode = start >= totalDays ? "edgeAfter" : "edgeBefore";
  } else if (!bar || bar.width < MIN_INSIDE_LABEL_PCT) {
    const right = pct(tailEnd);
    if (right <= 80) {
      layout.labelMode = "right";
      layout.labelAt = right;
    } else {
      layout.labelMode = "left";
      layout.labelAt = bar ? bar.left : pct(visEnd);
    }
  }
  return layout;
}

export const TimelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { filteredBids, isLoading } = useBids();
  const [zoom, setZoom] = React.useState<ZoomWeeks>(8);

  const today = React.useMemo(() => startOfDay(new Date()), []);
  const windowStart = React.useMemo(
    () => startOfWeek(addDays(today, -7), { weekStartsOn: 1 }),
    [today],
  );
  const totalDays = zoom * 7;
  const pctOf = (days: number): string => `${(days / totalDays) * 100}%`;

  const rows = React.useMemo<TimelineRow[]>(() => {
    const active = filteredBids.filter(isActiveBid).sort((a, b) => {
      const da = parseDate(a.dueDate);
      const db = parseDate(b.dueDate);
      if (!da || !db) return da ? -1 : db ? 1 : 0;
      return da.getTime() - db.getTime();
    });
    return active.map((bid) => {
      const freeze = getDueFreezeDate(bid);
      const health = getDueHealth(bid.dueDate, freeze);
      return {
        bid,
        freeze,
        health,
        layout: layoutBar(bid, health, freeze, windowStart, totalDays, today),
      };
    });
  }, [filteredBids, windowStart, totalDays, today]);

  const healthCounts = React.useMemo(() => {
    const counts: Record<DueHealth, number> = {
      onTrack: 0,
      dueSoon: 0,
      overdue: 0,
      none: 0,
    };
    rows.forEach((r) => {
      counts[r.health] += 1;
    });
    return counts;
  }, [rows]);

  const months = React.useMemo(() => {
    const windowEnd = addDays(windowStart, totalDays);
    const list: { key: string; label: string; left: number; width: number }[] =
      [];
    let cursor = startOfMonth(windowStart);
    while (cursor < windowEnd) {
      const next = addMonths(cursor, 1);
      const from = Math.max(0, differenceInCalendarDays(cursor, windowStart));
      const to = Math.min(
        totalDays,
        differenceInCalendarDays(next, windowStart),
      );
      const width = ((to - from) / totalDays) * 100;
      list.push({
        key: format(cursor, "yyyy-MM"),
        label: format(cursor, width >= 14 ? "MMMM yyyy" : "MMM"),
        left: (from / totalDays) * 100,
        width,
      });
      cursor = next;
    }
    return list;
  }, [windowStart, totalDays]);

  const weekStarts = React.useMemo(
    () => Array.from({ length: zoom }, (_, i) => addDays(windowStart, i * 7)),
    [windowStart, zoom],
  );
  const todayOffset = differenceInCalendarDays(today, windowStart);
  const todayLeft = pctOf(todayOffset + 0.5);
  const currentWeek = Math.floor(todayOffset / 7);

  const renderBar = (layout: BarLayout | null): React.ReactNode => {
    if (!layout) return <span className={styles.noDue}>No due date</span>;
    const { bar, tail, labelMode, labelAt, label } = layout;
    return (
      <>
        {bar && (
          <div
            className={`${styles.bar} ${bar.clipStart ? styles.clipStart : ""} ${
              bar.clipEnd ? styles.clipEnd : ""
            } ${tail ? styles.joinTail : ""}`}
            style={{ left: `${bar.left}%`, width: `${bar.width}%` }}
          >
            <span
              className={styles.barElapsed}
              style={{ width: `${bar.elapsed}%` }}
            />
            {labelMode === "inside" && (
              <span className={styles.barLabel}>
                {bar.clipStart && <ChevronLeft size={12} />}
                <span className={styles.barLabelText}>{label}</span>
                {bar.clipEnd && <ChevronRight size={12} />}
              </span>
            )}
          </div>
        )}
        {tail && (
          <div
            className={`${styles.overdueTail} ${tail.clipStart ? styles.clipStart : ""}`}
            style={{ left: `${tail.left}%`, width: `${tail.width}%` }}
          />
        )}
        {layout.dueAt !== null && (
          <span
            className={styles.dueMarker}
            style={{ left: `${layout.dueAt}%` }}
          />
        )}
        {labelMode === "right" && (
          <span
            className={styles.outsideLabel}
            style={{ left: `calc(${labelAt}% + 10px)` }}
          >
            {label}
          </span>
        )}
        {labelMode === "left" && (
          <span
            className={styles.outsideLabel}
            style={{ right: `calc(${100 - labelAt}% + 10px)` }}
          >
            {label}
          </span>
        )}
        {labelMode === "edgeBefore" && (
          <span className={styles.edgeChip}>
            <ChevronLeft size={12} />
            {label}
          </span>
        )}
        {labelMode === "edgeAfter" && (
          <span className={`${styles.edgeChip} ${styles.edgeChipAfter}`}>
            {label}
            <ChevronRight size={12} />
          </span>
        )}
      </>
    );
  };

  const renderRow = (row: TimelineRow): React.ReactNode => {
    const { bid, freeze, health, layout } = row;
    const projectName = bid.opportunityInfo?.projectName?.trim();
    const engineerNames = (
      Array.isArray(bid.engineerResponsible) ? bid.engineerResponsible : []
    )
      .map((e) => e?.name)
      .filter(Boolean);
    const open = (): void => navigate(`/bid/${bid.bidNumber}`);

    return (
      <div
        key={bid.bidNumber}
        className={`${styles.row} ${HEALTH_CLASS[health]}`}
      >
        <div className={styles.rowInfo}>
          <div className={styles.projectCell}>
            <button
              type="button"
              className={`${styles.projectName} ${styles.projectLink} ${projectName ? "" : styles.projectNameEmpty}`}
              title={`Open ${bid.bidNumber}${projectName ? `: ${projectName}` : ""}`}
              onClick={open}
            >
              {projectName || "Untitled project"}
            </button>
            <span className={styles.clientName}>
              {bid.opportunityInfo?.client || "-"}
            </span>
            <span className={styles.metaLine}>
              <span className={styles.bidNumber}>{bid.bidNumber}</span>
              <span className={styles.metaSep} aria-hidden="true">
                ·
              </span>
              <span
                className={`${styles.engineer} ${engineerNames.length ? "" : styles.unassigned}`}
                title={engineerNames.join(", ") || undefined}
              >
                <UserRound size={12} />
                <span className={styles.engineerName}>
                  {engineerNames.length
                    ? `${engineerNames[0]}${engineerNames.length > 1 ? ` +${engineerNames.length - 1}` : ""}`
                    : "Unassigned"}
                </span>
              </span>
            </span>
          </div>
          <div className={styles.statusCell}>
            <PhaseBadge phase={bid.currentPhase} />
            <StatusBadge status={bid.currentStatus} />
          </div>
          <div className={styles.dueCell}>
            {layout && (
              <span className={styles.dueDate}>{formatDate(bid.dueDate)}</span>
            )}
            <CountdownTimer targetDate={bid.dueDate} frozenAt={freeze} />
          </div>
        </div>
        <div className={styles.rowTimeline}>{renderBar(layout)}</div>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Timeline"
        subtitle={`Gantt view of ${rows.length} active BIDs, sorted by due date`}
        icon={<ChartGantt size={28} />}
      />

      <div className={styles.ganttCard}>
        <div className={styles.toolbar}>
          <div className={styles.healthSummary}>
            {HEALTH_LEGEND.map((item) => (
              <span
                key={item.key}
                className={`${styles.healthChip} ${HEALTH_CLASS[item.key]}`}
                title={item.title}
              >
                <span className={styles.healthDot} />
                {item.label}
                <span className={styles.healthCount}>
                  {healthCounts[item.key]}
                </span>
              </span>
            ))}
          </div>
          <div className={styles.toolbarRight}>
            <div className={styles.anatomyLegend} aria-hidden="true">
              <span className={styles.anatomyItem}>
                <span className={`${styles.swatch} ${styles.swatchElapsed}`} />
                Elapsed
              </span>
              <span className={styles.anatomyItem}>
                <span
                  className={`${styles.swatch} ${styles.swatchRemaining}`}
                />
                Remaining
              </span>
              <span className={styles.anatomyItem}>
                <span className={`${styles.swatch} ${styles.swatchOverdue}`} />
                Overdue delay
              </span>
              <span className={styles.anatomyItem}>
                <span className={styles.swatchDue} />
                Due date
              </span>
            </div>
            <SegmentedControl<ZoomWeeks>
              value={zoom}
              segments={ZOOM_SEGMENTS}
              onChange={setZoom}
              size="sm"
              ariaLabel="Timeline zoom"
              className={styles.zoomControl}
            />
          </div>
        </div>

        {isLoading && rows.length === 0 ? (
          <div className={styles.loading}>
            <SkeletonLoader count={5} height={56} borderRadius={10} />
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title="No active BIDs"
            description="Active BIDs that match the current filters will appear here."
          />
        ) : (
          <div className={styles.ganttScroll}>
            <div className={styles.ganttInner}>
              <div className={styles.headRow}>
                <div className={styles.headInfo}>
                  <span className={styles.headLabel}>BID / Project</span>
                  <span className={styles.headLabel}>{"Phase & Status"}</span>
                  <span className={styles.headLabel}>Due</span>
                </div>
                <div className={styles.headTimeline}>
                  <div className={styles.monthTier}>
                    {months.map((m) => (
                      <span
                        key={m.key}
                        className={styles.monthCell}
                        style={{ left: `${m.left}%`, width: `${m.width}%` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>
                  <div className={styles.weekTier}>
                    {weekStarts.map((w, i) => (
                      <span
                        key={w.getTime()}
                        className={`${styles.weekCell} ${i === currentWeek ? styles.weekCellCurrent : ""}`}
                        style={{ left: pctOf(i * 7), width: pctOf(7) }}
                      >
                        {format(w, "MMM d")}
                      </span>
                    ))}
                    <span
                      className={styles.todayPill}
                      style={{ left: todayLeft }}
                    >
                      Today
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.ganttBody}>
                <div className={styles.bodyGrid} aria-hidden="true">
                  {weekStarts.map((w, i) => (
                    <React.Fragment key={w.getTime()}>
                      {i > 0 && (
                        <span
                          className={styles.weekLine}
                          style={{ left: pctOf(i * 7) }}
                        />
                      )}
                      <span
                        className={styles.weekendBand}
                        style={{ left: pctOf(i * 7 + 5), width: pctOf(2) }}
                      />
                    </React.Fragment>
                  ))}
                  {months
                    .filter((m) => m.left > 0)
                    .map((m) => (
                      <span
                        key={m.key}
                        className={styles.monthLine}
                        style={{ left: `${m.left}%` }}
                      />
                    ))}
                </div>
                {rows.map(renderRow)}
                <div className={styles.todayLayer} aria-hidden="true">
                  <span
                    className={styles.todayLine}
                    style={{ left: todayLeft }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

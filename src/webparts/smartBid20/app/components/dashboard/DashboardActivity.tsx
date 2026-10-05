import * as React from "react";
import { IBid } from "../../models";
import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
} from "date-fns";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { EmptyState } from "../common/EmptyState";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { useStatusColors } from "../../hooks/useStatusColors";
import { getPhaseDef } from "../../config/status.config";
import { getMissingApprovalHistoryPatch } from "../../utils/approvalHelpers";
import { parseDate } from "../../utils/formatters";
import styles from "./DashboardActivity.module.scss";

type Mode = "all" | "status" | "phase";

const MODE_SEGMENTS: SegmentOption<Mode>[] = [
  { value: "all", label: "All" },
  { value: "status", label: "Status" },
  { value: "phase", label: "Phase" },
];

const PAGE_SIZE = 10;

interface Transition {
  from: string;
  to: string;
}

interface FeedRow {
  key: string;
  bid: IBid;
  time: number;
  actor: string;
  status?: Transition;
  phase?: Transition;
}

interface DashboardActivityProps {
  bids: IBid[];
  onBidClick: (bidNumber: string) => void;
}

function phaseLabel(value: string): string {
  return getPhaseDef(value)?.label || value;
}

function actorName(actor: string): string {
  return actor.indexOf("@") > 0 ? actor.split("@")[0] : actor;
}

function dayLabel(time: number): string {
  const d = new Date(time);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEEE, MMM d");
}

/** Status and phase transitions across BIDs; same-minute changes share one row. */
function buildFeed(bids: IBid[]): FeedRow[] {
  const byKey: Record<string, FeedRow> = {};
  const rows: FeedRow[] = [];
  const add = (
    bid: IBid,
    start: string,
    actor: string,
    kind: "status" | "phase",
    t: Transition,
  ): void => {
    const d = parseDate(start);
    if (!d) return;
    const key = `${bid.bidNumber}-${Math.floor(d.getTime() / 60000)}`;
    let row = byKey[key];
    if (!row) {
      row = { key, bid, time: d.getTime(), actor: actor || "" };
      byKey[key] = row;
      rows.push(row);
    }
    row[kind] = t;
    if (!row.actor && actor) row.actor = actor;
  };

  bids.forEach((b) => {
    const patch = getMissingApprovalHistoryPatch(b);
    const statusHistory = (patch || b).statusHistory || [];
    const phaseHistory = (patch || b).phaseHistory || [];
    statusHistory.forEach((e, i) => {
      const prev = statusHistory[i - 1];
      if (!prev || prev.status === e.status) return;
      add(b, e.start, e.actor, "status", { from: prev.status, to: e.status });
    });
    phaseHistory.forEach((e, i) => {
      const prev = phaseHistory[i - 1];
      if (!prev || prev.phase === e.phase) return;
      add(b, e.start, e.actor, "phase", { from: prev.phase, to: e.phase });
    });
  });
  return rows.sort((a, b) => b.time - a.time);
}

export const DashboardActivity: React.FC<DashboardActivityProps> = ({
  bids,
  onBidClick,
}) => {
  const { getStatusColor, getPhaseColor } = useStatusColors();
  const [mode, setMode] = React.useState<Mode>("all");
  const [limit, setLimit] = React.useState(PAGE_SIZE);

  const feed = React.useMemo(() => buildFeed(bids), [bids]);

  const filtered = React.useMemo(
    () =>
      mode === "all"
        ? feed
        : feed.filter((r) => (mode === "status" ? !!r.status : !!r.phase)),
    [feed, mode],
  );

  React.useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [mode]);

  const visible = filtered.slice(0, limit);
  const groups: { label: string; rows: FeedRow[] }[] = [];
  visible.forEach((r) => {
    const label = dayLabel(r.time);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.rows.push(r);
    else groups.push({ label, rows: [r] });
  });

  return (
    <GlassCard
      title="Activity"
      subtitle="Latest status & phase changes"
      actions={
        <SegmentedControl<Mode>
          value={mode}
          segments={MODE_SEGMENTS}
          onChange={setMode}
          size="sm"
          ariaLabel="Activity filter"
        />
      }
    >
      {visible.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No recent activity"
          description="Status and phase changes will show up here."
        />
      ) : (
        <div className={styles.feed}>
          {groups.map((g) => (
            <div key={g.label} className={styles.group}>
              <div className={styles.dayLabel}>{g.label}</div>
              <ul className={styles.list}>
                {g.rows.map((r) => {
                  const project = r.bid.opportunityInfo?.projectName;
                  const client = r.bid.opportunityInfo?.client;
                  const dotColor = r.status
                    ? getStatusColor(r.status.to)
                    : r.phase
                      ? getPhaseColor(r.phase.to)
                      : undefined;
                  return (
                    <li
                      key={r.key}
                      className={styles.item}
                      role="button"
                      tabIndex={0}
                      onClick={() => onBidClick(r.bid.bidNumber)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onBidClick(r.bid.bidNumber);
                        }
                      }}
                      title={`Open ${r.bid.bidNumber}`}
                    >
                      <span
                        className={styles.dot}
                        style={dotColor ? { background: dotColor } : undefined}
                      />
                      <div className={styles.content}>
                        <div className={styles.head}>
                          <span className={styles.project}>
                            {project || client || r.bid.bidNumber}
                          </span>
                          <span className={styles.time}>
                            {formatDistanceToNow(r.time, { addSuffix: true })}
                          </span>
                        </div>
                        <div className={styles.meta}>
                          <span className={styles.bidNumber}>
                            {r.bid.bidNumber}
                          </span>
                          {project && client ? ` · ${client}` : ""}
                          {r.actor ? ` · by ${actorName(r.actor)}` : ""}
                        </div>
                        {r.status && mode !== "phase" && (
                          <div className={styles.change}>
                            <span className={styles.kind}>Status</span>
                            <span className={styles.from}>{r.status.from}</span>
                            <span className={styles.arrow}>→</span>
                            <StatusBadge
                              status={r.status.to}
                              color={getStatusColor(r.status.to)}
                            />
                          </div>
                        )}
                        {r.phase && mode !== "status" && (
                          <div className={styles.change}>
                            <span className={styles.kind}>Phase</span>
                            <span className={styles.from}>
                              {phaseLabel(r.phase.from)}
                            </span>
                            <span className={styles.arrow}>→</span>
                            <StatusBadge
                              status={phaseLabel(r.phase.to)}
                              color={getPhaseColor(r.phase.to)}
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filtered.length > limit && (
            <button
              type="button"
              className={styles.moreBtn}
              onClick={() => setLimit((l) => l + PAGE_SIZE)}
            >
              Show more ({filtered.length - limit} left)
            </button>
          )}
        </div>
      )}
    </GlassCard>
  );
};

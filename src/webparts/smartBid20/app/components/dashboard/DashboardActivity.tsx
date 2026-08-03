import * as React from "react";
import { IBid } from "../../models";
import { formatDistanceToNow } from "date-fns";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { EmptyState } from "../common/EmptyState";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { useStatusColors } from "../../hooks/useStatusColors";
import styles from "./DashboardActivity.module.scss";

type Mode = "updated" | "status";

const MODE_SEGMENTS: SegmentOption<Mode>[] = [
  { value: "updated", label: "Updated" },
  { value: "status", label: "Status" },
];

interface FeedRow {
  key: string;
  bidNumber: string;
  status?: string;
  statusText?: string;
  meta?: string;
  when: string;
}

interface DashboardActivityProps {
  bids: IBid[];
  maxItems?: number;
  onBidClick: (bidNumber: string) => void;
}

export const DashboardActivity: React.FC<DashboardActivityProps> = ({
  bids,
  maxItems = 8,
  onBidClick,
}) => {
  const { getStatusColor } = useStatusColors();
  const [mode, setMode] = React.useState<Mode>("updated");

  const rows: FeedRow[] = React.useMemo(() => {
    if (mode === "updated") {
      return bids
        .filter((b) => b.lastModified)
        .slice()
        .sort(
          (a, b) =>
            new Date(b.lastModified).getTime() -
            new Date(a.lastModified).getTime(),
        )
        .slice(0, maxItems)
        .map((b) => ({
          key: b.bidNumber,
          bidNumber: b.bidNumber,
          status: b.currentStatus,
          meta: b.opportunityInfo?.client || b.opportunityInfo?.projectName,
          when: b.lastModified,
        }));
    }

    const all: FeedRow[] = [];
    bids.forEach((b) => {
      (b.statusHistory || []).forEach((e) => {
        if (!e.start) return;
        all.push({
          key: `${b.bidNumber}-${e.id}`,
          bidNumber: b.bidNumber,
          status: e.status,
          statusText: e.status,
          meta: e.actor,
          when: e.start,
        });
      });
    });
    return all
      .sort((a, b) => new Date(b.when).getTime() - new Date(a.when).getTime())
      .slice(0, maxItems);
  }, [bids, mode, maxItems]);

  return (
    <GlassCard
      title="Activity"
      subtitle={
        mode === "updated" ? "Recently updated BIDs" : "Recent status changes"
      }
      actions={
        <SegmentedControl<Mode>
          value={mode}
          segments={MODE_SEGMENTS}
          onChange={setMode}
          size="sm"
          ariaLabel="Activity mode"
        />
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No recent activity"
          description={
            mode === "status"
              ? "No status changes recorded yet."
              : "No BID updates yet."
          }
        />
      ) : (
        <ul className={styles.list}>
          {rows.map((r) => (
            <li
              key={r.key}
              className={styles.item}
              role="button"
              tabIndex={0}
              onClick={() => onBidClick(r.bidNumber)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onBidClick(r.bidNumber);
                }
              }}
              title={`Open ${r.bidNumber}`}
            >
              <span
                className={styles.dot}
                style={{
                  background: r.status
                    ? getStatusColor(r.status)
                    : "var(--text-muted)",
                }}
              />
              <div className={styles.content}>
                <div className={styles.text}>
                  <span className={styles.bidNumber}>{r.bidNumber}</span>
                  {mode === "status" ? (
                    <span className={styles.statusText}>→ {r.statusText}</span>
                  ) : r.status ? (
                    <StatusBadge
                      status={r.status}
                      color={getStatusColor(r.status)}
                    />
                  ) : null}
                </div>
                <div className={styles.time}>
                  {r.meta ? `${r.meta} · ` : ""}
                  {formatDistanceToNow(new Date(r.when), { addSuffix: true })}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
};

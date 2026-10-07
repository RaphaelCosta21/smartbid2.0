import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { EmptyState } from "../common/EmptyState";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { useChartTheme } from "../../hooks/useChartTheme";
import { useResultStatus } from "../../hooks/useResultStatus";
import { IEngHoursItem } from "../../utils/engHoursHelpers";
import styles from "./EngHoursRanking.module.scss";

type Scope = "pipeline" | "won" | "all";

const SCOPE_SEGMENTS: SegmentOption<Scope>[] = [
  { value: "pipeline", label: "Pipeline" },
  { value: "won", label: "Won" },
  { value: "all", label: "All" },
];

const SCOPE_SUBTITLE: Record<Scope, string> = {
  pipeline: "Open & awaiting result: demand if won",
  won: "Confirmed engineering demand",
  all: "Every BID in the period",
};

interface EngHoursRankingProps {
  items: IEngHoursItem[];
  maxItems?: number;
  onBidClick: (bidNumber: string) => void;
}

export const EngHoursRanking: React.FC<EngHoursRankingProps> = ({
  items,
  maxItems = 8,
  onBidClick,
}) => {
  const t = useChartTheme();
  const { getColor, getLabel } = useResultStatus();
  const [scope, setScope] = React.useState<Scope>("pipeline");

  const ranked = React.useMemo(
    () =>
      items
        .filter((r) => scope === "all" || r.bucket === scope)
        .slice()
        .sort((a, b) => b.hours - a.hours)
        .slice(0, maxItems),
    [items, scope, maxItems],
  );

  const maxHours = ranked.length ? ranked[0].hours : 1;

  return (
    <GlassCard
      title="Top BIDs - Engineering Hours"
      subtitle={SCOPE_SUBTITLE[scope]}
      accentColor={t.accentSecondary}
      actions={
        <SegmentedControl<Scope>
          value={scope}
          segments={SCOPE_SEGMENTS}
          onChange={setScope}
          size="sm"
          ariaLabel="Ranking scope"
        />
      }
    >
      {ranked.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No engineering hours"
          description="No BIDs with engineering hours in this scope yet."
        />
      ) : (
        <ol className={styles.list}>
          {ranked.map((r, i) => (
            <li
              key={r.bid.bidNumber}
              className={styles.row}
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
              <span className={styles.rank}>{i + 1}</span>
              <div className={styles.info}>
                <div className={styles.topline}>
                  <span className={styles.project}>
                    {r.bid.opportunityInfo?.projectName ||
                      r.bid.opportunityInfo?.client ||
                      r.bid.bidNumber}
                  </span>
                  <StatusBadge
                    status={getLabel(r.result)}
                    color={getColor(r.result)}
                  />
                  {r.chance !== null && (
                    <span
                      className={styles.chance}
                      title="Win chance (manual or historical)"
                    >
                      {Math.round(r.chance * 100)}% win
                    </span>
                  )}
                </div>
                <div className={styles.subline}>
                  <span className={styles.bidNumber}>
                    {r.bid.bidNumber}
                    <ConfidentialLock bid={r.bid} />
                  </span>
                  {r.bid.opportunityInfo?.projectName &&
                  r.bid.opportunityInfo?.client
                    ? ` · ${r.bid.opportunityInfo.client}`
                    : ""}
                  {r.bid.division ? ` · ${r.bid.division}` : ""}
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(r.hours / maxHours) * 100}%`,
                      background: getColor(r.result),
                    }}
                  />
                </div>
              </div>
              <div className={styles.hours}>
                <span className={styles.hoursValue}>
                  {Math.round(r.hours).toLocaleString()}
                </span>
                <span className={styles.hoursUnit}>h</span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </GlassCard>
  );
};

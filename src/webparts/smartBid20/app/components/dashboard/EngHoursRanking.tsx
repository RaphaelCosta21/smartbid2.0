import * as React from "react";
import { IBid } from "../../models";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { EmptyState } from "../common/EmptyState";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { useChartTheme } from "../../hooks/useChartTheme";
import { useStatusColors } from "../../hooks/useStatusColors";
import { isActiveBid, getEngineeringHours } from "../../utils/bidHelpers";
import styles from "./EngHoursRanking.module.scss";

type Scope = "active" | "closed";

const SCOPE_SEGMENTS: SegmentOption<Scope>[] = [
  { value: "active", label: "Active" },
  { value: "closed", label: "Closed" },
];

interface EngHoursRankingProps {
  bids: IBid[];
  maxItems?: number;
  onBidClick: (bidNumber: string) => void;
}

export const EngHoursRanking: React.FC<EngHoursRankingProps> = ({
  bids,
  maxItems = 8,
  onBidClick,
}) => {
  const t = useChartTheme();
  const { getDivisionColor } = useStatusColors();
  const [scope, setScope] = React.useState<Scope>("active");

  const ranked = React.useMemo(
    () =>
      bids
        .filter((b) => (scope === "active" ? isActiveBid(b) : !isActiveBid(b)))
        .map((b) => ({ bid: b, hours: getEngineeringHours(b) }))
        .filter((r) => r.hours > 0)
        .sort((a, b) => b.hours - a.hours)
        .slice(0, maxItems),
    [bids, scope, maxItems],
  );

  const maxHours = ranked.length ? ranked[0].hours : 1;

  return (
    <GlassCard
      title="Top BIDs · Engineering Hours"
      subtitle={
        scope === "active"
          ? "Highest eng. effort in progress"
          : "Highest eng. effort delivered"
      }
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
                  <span className={styles.bidNumber}>{r.bid.bidNumber}</span>
                  <StatusBadge
                    status={r.bid.division}
                    color={getDivisionColor(r.bid.division)}
                  />
                </div>
                <div className={styles.subline}>
                  {r.bid.opportunityInfo?.client || "—"}
                  {r.bid.opportunityInfo?.projectName
                    ? ` · ${r.bid.opportunityInfo.projectName}`
                    : ""}
                </div>
                <div className={styles.bar}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${(r.hours / maxHours) * 100}%`,
                      background: t.accentSecondary,
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

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { KPICard } from "../common/KPICard";
import { useChartTheme } from "../../hooks/useChartTheme";
import { useKpiTargets } from "../../hooks/useKpiTargets";
import { useStatusColors } from "../../hooks/useStatusColors";
import { formatCurrencyCompact } from "../../utils/formatters";
import {
  CycleSummary,
  RateStat,
  TargetTone,
  buildCycleBreakdown,
  cycleTargetTone,
  formatTarget,
  targetTone,
} from "../../utils/kpiHelpers";
import styles from "./DashboardKPIRow.module.scss";

interface DashboardKPIRowProps {
  activeBids: number;
  overdueBids: number;
  overdueRate: number;
  engHoursClosed: number;
  ernsClosed: number;
  ernsLinked: number;
  onTime: RateStat;
  cycle: CycleSummary;
  winRate: number;
  wonCount: number;
  lostCount: number;
  pipelineValueUSD: number;
}

export const DashboardKPIRow: React.FC<DashboardKPIRowProps> = ({
  activeBids,
  overdueBids,
  overdueRate,
  engHoursClosed,
  ernsClosed,
  ernsLinked,
  onTime,
  cycle,
  winRate,
  wonCount,
  lostCount,
  pipelineValueUSD,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const t = useChartTheme();
  const { targets } = useKpiTargets();
  const { getPriorityColor } = useStatusColors();
  const toneColor = (tone: TargetTone, fallback: string): string =>
    tone === "success"
      ? t.success
      : tone === "warning"
        ? t.warning
        : tone === "danger"
          ? t.danger
          : fallback;

  const overdueTone = activeBids
    ? targetTone(overdueRate, targets.targetOverdueRate, false)
    : "neutral";
  const onTimeTone = targetTone(onTime.rate, targets.targetOnTimeDelivery, true);
  const decided = wonCount + lostCount;
  const winTone = decided
    ? targetTone(winRate, targets.targetWinRate, true)
    : "neutral";

  const compact = !expanded;

  return (
    <div className={styles.kpiRow}>
      <div className={styles.kpiGrid}>
        <KPICard
          label="Active BIDs"
          value={activeBids}
          variant="glass"
          compact={compact}
          accentColor={t.accent}
          subtitle={`In progress, ${overdueRate}% overdue`}
          trend={{
            value: `${overdueBids} overdue`,
            direction: overdueBids > 0 ? "down" : "neutral",
          }}
          target={{
            label: `Overdue target ≤ ${targets.targetOverdueRate}%`,
            tone: overdueTone,
          }}
        />
        <KPICard
          label="Eng. Hours (Closed)"
          value={Math.round(engHoursClosed).toLocaleString()}
          variant="glass"
          compact={compact}
          accentColor={t.accentSecondary}
          subtitle="Delivered on closed BIDs"
        />
        <KPICard
          label="ERNs Closed"
          value={ernsClosed}
          variant="glass"
          compact={compact}
          accentColor={t.success}
          trend={{ value: `of ${ernsLinked} linked`, direction: "neutral" }}
          progress={
            ernsLinked ? { value: ernsClosed, max: ernsLinked } : undefined
          }
          subtitle={`${ernsLinked - ernsClosed} open, ERNs linked to BIDs in the period`}
        />
        <KPICard
          label="On-Time Delivery"
          value={onTime.rate === null ? "-" : `${onTime.rate}%`}
          variant="glass"
          compact={compact}
          accentColor={toneColor(onTimeTone, t.info)}
          progress={
            onTime.rate === null ? undefined : { value: onTime.rate, max: 100 }
          }
          target={{
            label: formatTarget(targets.targetOnTimeDelivery, "%", true),
            tone: onTimeTone,
            at: targets.targetOnTimeDelivery,
          }}
          subtitle={
            onTime.total
              ? `${onTime.hits} of ${onTime.total} delivered BIDs on time`
              : "No delivered BIDs in the period"
          }
        />
        <KPICard
          label="Avg Cycle Time"
          value={cycle.overall.avg === null ? "-" : `${cycle.overall.avg} bd`}
          variant="glass"
          compact={compact}
          accentColor={t.accentTertiary}
          subtitle="Business days, created to first delivery"
          target={{
            label: `${cycle.onTarget} of ${cycle.measured} urgencies on target`,
            tone: cycleTargetTone(cycle),
          }}
          breakdown={buildCycleBreakdown(cycle, getPriorityColor)}
        />
        <KPICard
          label="Win Rate"
          value={`${winRate}%`}
          variant="glass"
          compact={compact}
          accentColor={toneColor(winTone, t.success)}
          progress={{ value: winRate, max: 100 }}
          trend={{
            value: `${wonCount}W / ${lostCount}L`,
            direction: "neutral",
          }}
          target={{
            label: formatTarget(targets.targetWinRate, "%", true),
            tone: winTone,
            at: targets.targetWinRate,
          }}
        />
        <KPICard
          label="Pipeline Value"
          value={formatCurrencyCompact(pipelineValueUSD)}
          variant="glass"
          compact={compact}
          accentColor={t.info}
          subtitle="Open + awaiting client result, total cost (USD)"
        />
      </div>
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide details" : "Show details"}
        <ChevronDown
          size={14}
          className={`${styles.chevron} ${expanded ? styles.chevronOpen : ""}`}
        />
      </button>
    </div>
  );
};

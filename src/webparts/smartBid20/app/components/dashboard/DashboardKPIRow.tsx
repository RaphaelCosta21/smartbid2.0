import * as React from "react";
import { KPICard } from "../common/KPICard";
import { useChartTheme } from "../../hooks/useChartTheme";
import styles from "./DashboardKPIRow.module.scss";

interface DashboardKPIRowProps {
  activeBids: number;
  overdueBids: number;
  engHoursClosed: number;
  onTimePercent: number;
  avgCycleDays: number;
  winRate: number;
  wonCount: number;
  lostCount: number;
  pipelineValueUSD: number;
}

export const DashboardKPIRow: React.FC<DashboardKPIRowProps> = ({
  activeBids,
  overdueBids,
  engHoursClosed,
  onTimePercent,
  avgCycleDays,
  winRate,
  wonCount,
  lostCount,
  pipelineValueUSD,
}) => {
  const t = useChartTheme();
  const onTimeColor =
    onTimePercent >= 90
      ? t.success
      : onTimePercent >= 70
        ? t.warning
        : t.danger;

  return (
    <div className={styles.kpiGrid}>
      <KPICard
        label="Active BIDs"
        value={activeBids}
        variant="glass"
        accentColor={t.accent}
        subtitle="In progress"
        trend={{
          value: `${overdueBids} overdue`,
          direction: overdueBids > 0 ? "down" : "neutral",
        }}
      />
      <KPICard
        label="Eng. Hours (Closed)"
        value={Math.round(engHoursClosed).toLocaleString()}
        variant="glass"
        accentColor={t.accentSecondary}
        subtitle="Delivered on closed BIDs"
      />
      <KPICard
        label="On-Time Delivery"
        value={`${onTimePercent}%`}
        variant="glass"
        accentColor={onTimeColor}
        progress={{ value: onTimePercent, max: 100 }}
        subtitle="Target: 90%"
      />
      <KPICard
        label="Avg Cycle Time"
        value={`${avgCycleDays}d`}
        variant="glass"
        accentColor={t.accentTertiary}
        subtitle="Created → Completed"
      />
      <KPICard
        label="Win Rate"
        value={`${winRate}%`}
        variant="glass"
        accentColor={t.success}
        progress={{ value: winRate, max: 100 }}
        trend={{ value: `${wonCount}W / ${lostCount}L`, direction: "neutral" }}
      />
      <KPICard
        label="Pipeline Value"
        value={`$${(pipelineValueUSD / 1000).toFixed(0)}K`}
        variant="glass"
        accentColor={t.info}
        subtitle="Active BIDs total cost (USD)"
      />
    </div>
  );
};

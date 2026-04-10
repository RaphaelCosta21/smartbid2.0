import * as React from "react";
import { KPICard } from "../common/KPICard";
import styles from "./DashboardKPIRow.module.scss";

interface DashboardKPIRowProps {
  activeBids: number;
  overdueBids: number;
  totalHours: number;
  onTimePercent: number;
  winRate: number;
  wonCount: number;
  lostCount: number;
  pipelineValueUSD: number;
}

export const DashboardKPIRow: React.FC<DashboardKPIRowProps> = ({
  activeBids,
  overdueBids,
  totalHours,
  onTimePercent,
  winRate,
  wonCount,
  lostCount,
  pipelineValueUSD,
}) => (
  <div className={styles.kpiGrid}>
    <KPICard
      label="Active BIDs"
      value={activeBids}
      accentColor="#00c9a7"
      trend={{
        value: `${overdueBids} overdue`,
        direction: overdueBids > 0 ? "down" : "neutral",
      }}
    />
    <KPICard
      label="Eng. Hours (Active)"
      value={totalHours.toLocaleString()}
      accentColor="#3b82f6"
      trend={{ value: "+12%", direction: "up" }}
    />
    <KPICard
      label="On-Time Delivery"
      value={`${onTimePercent}%`}
      accentColor={
        onTimePercent >= 90
          ? "#10b981"
          : onTimePercent >= 70
            ? "#f59e0b"
            : "#ef4444"
      }
      progress={{ value: onTimePercent, max: 100 }}
      subtitle="Target: 90%"
    />
    <KPICard label="BIDs at Risk" value={overdueBids} accentColor="#ef4444" />
    <KPICard
      label="Win Rate"
      value={`${winRate}%`}
      accentColor="#8b5cf6"
      trend={{ value: `${wonCount}W / ${lostCount}L`, direction: "neutral" }}
      progress={{ value: winRate, max: 100 }}
    />
    <KPICard
      label="Pipeline Value"
      value={`$${(pipelineValueUSD / 1000).toFixed(0)}K`}
      accentColor="#06b6d4"
      subtitle="Active BIDs total cost (USD)"
    />
  </div>
);

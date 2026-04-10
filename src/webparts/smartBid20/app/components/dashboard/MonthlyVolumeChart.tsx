import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { IMonthlyVolume } from "../../models/IDashboard";
import styles from "./MonthlyVolumeChart.module.scss";

interface MonthlyVolumeChartProps {
  data: IMonthlyVolume[];
  className?: string;
}

export const MonthlyVolumeChart: React.FC<MonthlyVolumeChartProps> = ({
  data,
  className,
}) => {
  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.created, d.completed, d.cancelled)),
    1,
  );

  return (
    <GlassCard title="Monthly Volume" className={className}>
      <div className={styles.chartArea}>
        {data.map((m) => (
          <div key={m.month} className={styles.barGroup}>
            <div className={styles.bars}>
              <div
                className={`${styles.bar} ${styles.barCreated}`}
                style={{ height: `${(m.created / maxVal) * 100}%` }}
                title={`Created: ${m.created}`}
              />
              <div
                className={`${styles.bar} ${styles.barCompleted}`}
                style={{ height: `${(m.completed / maxVal) * 100}%` }}
                title={`Completed: ${m.completed}`}
              />
            </div>
            <span className={styles.monthLabel}>{m.month.slice(5)}</span>
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendDotCreated}`} />{" "}
          Created
        </span>
        <span className={styles.legendItem}>
          <div className={`${styles.legendDot} ${styles.legendDotCompleted}`} />{" "}
          Completed
        </span>
      </div>
    </GlassCard>
  );
};

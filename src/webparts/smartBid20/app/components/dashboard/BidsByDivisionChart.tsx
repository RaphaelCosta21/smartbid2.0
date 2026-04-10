import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import styles from "./BidsByDivisionChart.module.scss";

interface BidsByDivisionChartProps {
  data: { division: string; count: number; color: string }[];
  className?: string;
}

export const BidsByDivisionChart: React.FC<BidsByDivisionChartProps> = ({
  data,
  className,
}) => {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <GlassCard title="BIDs by Division" className={className}>
      <div className={styles.chartLayout}>
        <div className={styles.donutWrapper}>
          <svg viewBox="0 0 36 36" className={styles.donutSvg}>
            {
              data.reduce(
                (acc, item) => {
                  const percent = (item.count / total) * 100;
                  const el = (
                    <circle
                      key={item.division}
                      r="15.9155"
                      cx="18"
                      cy="18"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${percent} ${100 - percent}`}
                      strokeDashoffset={`-${acc.offset}`}
                    />
                  );
                  acc.elements.push(el);
                  acc.offset += percent;
                  return acc;
                },
                { elements: [] as React.ReactNode[], offset: 0 },
              ).elements
            }
          </svg>
          <div className={styles.donutCenter}>
            <span className={styles.donutTotal}>{total}</span>
            <span className={styles.donutLabel}>Total</span>
          </div>
        </div>
        <div className={styles.legend}>
          {data.map((item) => (
            <div key={item.division} className={styles.legendItem}>
              <div
                className={styles.legendDot}
                style={{ background: item.color }}
              />
              <span>{item.division}</span>
              <span className={styles.legendCount}>{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

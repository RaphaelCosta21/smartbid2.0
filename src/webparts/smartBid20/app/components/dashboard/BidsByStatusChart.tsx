import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import styles from "./BidsByStatusChart.module.scss";

interface BidsByStatusChartProps {
  data: { status: string; count: number; color: string }[];
  className?: string;
}

export const BidsByStatusChart: React.FC<BidsByStatusChartProps> = ({
  data,
  className,
}) => {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <GlassCard title="BIDs by Status" className={className}>
      <div className={styles.chartContainer}>
        {data.map((item) => (
          <div key={item.status} className={styles.pipelineRow}>
            <span className={styles.pipelineLabel}>{item.status}</span>
            <div className={styles.pipelineBar}>
              <div
                className={styles.pipelineBarFill}
                style={{
                  width: `${(item.count / maxCount) * 100}%`,
                  background: item.color,
                }}
              />
            </div>
            <span className={styles.pipelineCount}>{item.count}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

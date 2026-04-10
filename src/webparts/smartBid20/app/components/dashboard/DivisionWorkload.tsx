import * as React from "react";
import { GlassCard } from "../common/GlassCard";
import { IDivisionWorkload } from "../../models/IDashboard";
import styles from "./DivisionWorkload.module.scss";

interface DivisionWorkloadProps {
  data: IDivisionWorkload[];
  className?: string;
}

export const DivisionWorkload: React.FC<DivisionWorkloadProps> = ({
  data,
  className,
}) => {
  return (
    <GlassCard title="Division Workload" className={className}>
      <div className={styles.cardGrid}>
        {data.map((div) => (
          <div key={div.division} className={styles.divisionCard}>
            <div className={styles.divisionName}>{div.division}</div>
            <div className={styles.statsGrid}>
              <div>
                <div className={styles.statLabel}>Active</div>
                <div className={`${styles.statValue} ${styles.statActive}`}>
                  {div.activeBids}
                </div>
              </div>
              <div>
                <div className={styles.statLabel}>Approvals</div>
                <div className={`${styles.statValue} ${styles.statApprovals}`}>
                  {div.pendingApprovals}
                </div>
              </div>
              <div>
                <div className={styles.statLabel}>Overdue</div>
                <div
                  className={`${styles.statValue} ${div.overdueBids > 0 ? styles.statOverdue : styles.statOk}`}
                >
                  {div.overdueBids}
                </div>
              </div>
              <div>
                <div className={styles.statLabel}>Avg Days</div>
                <div className={`${styles.statValue} ${styles.statDefault}`}>
                  {div.avgCompletionDays}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

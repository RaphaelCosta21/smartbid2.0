import * as React from "react";
import styles from "./PeriodPerformanceReport.module.scss";

export const PeriodPerformanceReport: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3>Period Performance Report</h3>
      <p className={styles.subtitle}>
        Select a date range to generate the performance report.
      </p>
      <div className={styles.dateRow}>
        <input type="date" className={styles.dateInput} />
        <input type="date" className={styles.dateInput} />
        <button className={styles.generateBtn}>Generate</button>
      </div>
    </div>
  );
};

import * as React from "react";
import styles from "./OperationalSummaryReport.module.scss";

export const OperationalSummaryReport: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3>Operational Summary Report</h3>
      <p className={styles.subtitle}>
        Overview of operational metrics and BID throughput.
      </p>
    </div>
  );
};

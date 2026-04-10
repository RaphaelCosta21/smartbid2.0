import * as React from "react";
import styles from "./BidDetailsReport.module.scss";

export const BidDetailsReport: React.FC = () => {
  return (
    <div className={styles.container}>
      <h3>BID Details Report</h3>
      <p className={styles.subtitle}>
        Select a BID to generate a detailed report.
      </p>
    </div>
  );
};

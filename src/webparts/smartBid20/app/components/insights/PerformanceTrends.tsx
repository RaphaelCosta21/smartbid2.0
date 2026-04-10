import * as React from "react";
import { PageHeader } from "../common/PageHeader";
import styles from "./PerformanceTrends.module.scss";

export const PerformanceTrends: React.FC = () => {
  return (
    <div className={styles.container}>
      <PageHeader
        title="Performance Trends"
        subtitle="Track BID performance over time"
      />
      <div className={styles.placeholder}>
        Performance trends charts will render here with Recharts integration.
      </div>
    </div>
  );
};

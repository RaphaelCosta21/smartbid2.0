import * as React from "react";
import { PageHeader } from "../common/PageHeader";
import styles from "./BottleneckAnalysis.module.scss";

export const BottleneckAnalysis: React.FC = () => {
  return (
    <div className={styles.container}>
      <PageHeader
        title="Bottleneck Analysis"
        subtitle="Identify delays and bottlenecks in the BID process"
      />
      <div className={styles.placeholder}>
        Bottleneck analysis visualizations will render here.
      </div>
    </div>
  );
};

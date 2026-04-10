import * as React from "react";
import { PageHeader } from "../common/PageHeader";
import styles from "./TeamAnalytics.module.scss";

export const TeamAnalytics: React.FC = () => {
  return (
    <div className={styles.container}>
      <PageHeader
        title="Team Analytics"
        subtitle="Team performance and workload distribution"
      />
      <div className={styles.placeholder}>
        Team analytics visualizations will render here.
      </div>
    </div>
  );
};

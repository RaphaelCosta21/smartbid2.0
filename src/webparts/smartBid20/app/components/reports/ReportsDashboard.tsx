import * as React from "react";
import { PageHeader } from "../common/PageHeader";
import styles from "./ReportsDashboard.module.scss";

export const ReportsDashboard: React.FC = () => {
  const reports = [
    {
      id: "period",
      title: "Period Performance",
      description: "BID performance by date range",
      icon: "📊",
    },
    {
      id: "details",
      title: "BID Details Report",
      description: "Detailed report for a specific BID",
      icon: "📋",
    },
    {
      id: "operational",
      title: "Operational Summary",
      description: "Operational overview and metrics",
      icon: "📈",
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader title="Reports" subtitle="Generate and export reports" />
      <div className={styles.grid}>
        {reports.map((r) => (
          <div key={r.id} className={styles.card}>
            <span className={styles.cardIcon}>{r.icon}</span>
            <h4 className={styles.cardTitle}>{r.title}</h4>
            <p className={styles.cardDesc}>{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

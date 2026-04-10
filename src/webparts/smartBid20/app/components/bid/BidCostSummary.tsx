import * as React from "react";
import { ICostSummary } from "../../models";
import styles from "./BidCostSummary.module.scss";

interface BidCostSummaryProps {
  costSummary: ICostSummary;
  className?: string;
}

export const BidCostSummary: React.FC<BidCostSummaryProps> = ({
  costSummary,
  className,
}) => {
  const rows = [
    {
      label: "Assets Cost (USD)",
      value: `$ ${costSummary.assetsCostUSD.toLocaleString()}`,
    },
    {
      label: "Assets Cost (BRL)",
      value: `R$ ${costSummary.assetsCostBRL.toLocaleString()}`,
    },
    {
      label: "Engineering Hours (BRL)",
      value: `R$ ${costSummary.engineeringHoursCostBRL.toLocaleString()}`,
    },
    {
      label: "Onshore Hours (BRL)",
      value: `R$ ${costSummary.onshoreHoursCostBRL.toLocaleString()}`,
    },
    {
      label: "Offshore Hours (BRL)",
      value: `R$ ${costSummary.offshoreHoursCostBRL.toLocaleString()}`,
    },
    {
      label: "Total Hours (BRL)",
      value: `R$ ${costSummary.totalHoursCostBRL.toLocaleString()}`,
      isBold: true,
    },
    {
      label: "Total Hours (USD)",
      value: `$ ${costSummary.totalHoursCostUSD.toLocaleString()}`,
    },
  ];

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      <div className={styles.body}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={`${styles.row} ${row.isBold ? styles.rowBold : ""}`}
          >
            <span className={styles.rowLabel}>{row.label}</span>
            <span>{row.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.totalBar}>
        <div>
          <div className={styles.totalLabel}>Total Cost (USD)</div>
          <div className={styles.totalValue}>
            $ {costSummary.totalCostUSD.toLocaleString()}
          </div>
        </div>
        <div className={styles.totalRight}>
          <div className={styles.totalLabel}>Total Cost (BRL)</div>
          <div className={styles.totalValue}>
            R$ {costSummary.totalCostBRL.toLocaleString()}
          </div>
        </div>
      </div>
      {costSummary.notes && (
        <div className={styles.notes}>{costSummary.notes}</div>
      )}
    </div>
  );
};

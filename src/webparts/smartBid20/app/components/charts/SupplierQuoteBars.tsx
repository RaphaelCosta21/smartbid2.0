/**
 * SupplierQuoteBars — horizontal price comparison, one bar per quoting supplier.
 * Cheapest first, `Lowest` badge on the cheapest, lead time next to the amount.
 */
import * as React from "react";
import { ISupplierQuoteBar } from "../../utils/quotationLinks";
import { formatCurrency } from "../../utils/formatters";
import styles from "./SupplierQuoteBars.module.scss";

export interface SupplierQuoteBarsProps {
  bars: ISupplierQuoteBar[];
  currency: "USD" | "BRL";
  /** Small caption rendered above the bars */
  title?: string;
}

export const SupplierQuoteBars: React.FC<SupplierQuoteBarsProps> = ({
  bars,
  currency,
  title,
}) => {
  if (bars.length === 0) return null;
  const max = bars.reduce((m, b) => Math.max(m, b.value), 0) || 1;

  return (
    <div className={styles.root}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.list} role="list">
        {bars.map((bar) => {
          const pct = Math.max(4, Math.min(100, (bar.value / max) * 100));
          const fillClass = bar.isLowest
            ? `${styles.fill} ${styles.fillLowest}`
            : styles.fill;
          return (
            <div
              key={bar.id}
              className={styles.row}
              role="listitem"
              title={`${bar.supplier} — ${bar.isRental ? "rental (day rate × days)" : "acquisition"}${bar.isSelected ? " · in use" : ""}`}
            >
              <div className={styles.label}>
                {bar.isLowest && <span className={styles.lowest}>Lowest</span>}
                <span
                  className={
                    bar.isSelected
                      ? `${styles.supplier} ${styles.supplierSelected}`
                      : styles.supplier
                  }
                >
                  {bar.supplier}
                </span>
              </div>
              <div className={styles.track}>
                <div className={fillClass} style={{ width: `${pct}%` }} />
              </div>
              <div className={styles.value}>
                {formatCurrency(bar.value, currency)}
                {bar.leadTimeDays > 0 && (
                  <span className={styles.lead}> · {bar.leadTimeDays}d</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

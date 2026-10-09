/**
 * ComparisonSummary — the decision headline (total variance against the baseline) and the
 * counts of what changed.
 */
import * as React from "react";
import { COMPARATOR_CONFIG } from "../../config/comparator.config";
import {
  IComparisonResult,
  isDecrease,
  isIncrease,
} from "../../utils/bidComparator";
import { formatCurrency, formatSignedPercent } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import styles from "./ComparisonSummary.module.scss";

export interface ComparisonSummaryProps {
  result: IComparisonResult;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
}

/** More than +10% over the baseline is a warning sign, a saving beyond 5% is good news */
function varianceToken(variance: number | null): string {
  if (variance === null) return "var(--text-muted)";
  if (variance > 10) return "var(--danger)";
  if (variance < -COMPARATOR_CONFIG.significantChangePct)
    return "var(--success)";
  return "var(--warning)";
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({
  result,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);
  const color = varianceToken(result.variancePct);
  const increases = result.matched.filter(isIncrease).length;
  const decreases = result.matched.filter(isDecrease).length;
  const multiple = result.histBids.length > 1;

  return (
    <div className={styles.root}>
      <GlassCard accentColor={color}>
        <div className={styles.vs}>
          {result.newBid} vs {result.histBids.join(", ")}
        </div>
        <div className={styles.headline}>
          <div>
            <div className={styles.variance} style={{ color }}>
              {result.variancePct === null
                ? "—"
                : formatSignedPercent(result.variancePct)}
            </div>
            <div className={styles.caption}>Total cost variance</div>
          </div>
          <div>
            <div className={styles.totals}>
              New total: <strong>{fmt(result.totalNewUSD)}</strong> ·{" "}
              {multiple ? "Historical average" : "Historical"}:{" "}
              <strong>{fmt(result.totalHistUSD)}</strong>
            </div>
            <div className={styles.caption}>
              {result.matched.length} matched · {result.newItems.length} new
              scope · {result.missing.length} removed
            </div>
          </div>
        </div>
      </GlassCard>

      <div className={styles.kpis}>
        <KPICard
          label="Matched items"
          value={result.matched.length}
          accentColor="var(--primary-accent)"
        />
        <KPICard
          label="Price increases"
          value={increases}
          subtitle={`> +${COMPARATOR_CONFIG.significantChangePct}% per unit`}
          accentColor="var(--danger)"
        />
        <KPICard
          label="Price decreases"
          value={decreases}
          subtitle={`< -${COMPARATOR_CONFIG.significantChangePct}% per unit`}
          accentColor="var(--success)"
        />
        <KPICard
          label="New scope items"
          value={result.newItems.length}
          accentColor="var(--info)"
        />
        <KPICard
          label="Removed items"
          value={result.missing.length}
          accentColor="var(--warning)"
        />
      </div>
    </div>
  );
};

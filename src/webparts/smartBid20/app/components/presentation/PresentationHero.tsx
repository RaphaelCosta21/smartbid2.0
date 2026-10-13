/**
 * PresentationHero — executive summary of the selected BID: total, CAPEX / OPEX and readiness.
 */
import * as React from "react";
import { IPresentationStats } from "../../utils/bidPresentation";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import styles from "./PresentationHero.module.scss";

export interface PresentationHeroProps {
  bidNumber: string;
  title: string;
  stats: IPresentationStats;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
}

export const PresentationHero: React.FC<PresentationHeroProps> = ({
  bidNumber,
  title,
  stats,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);
  const split = stats.capexUSD + stats.opexUSD;
  const capexPct = split ? Math.round((stats.capexUSD / split) * 100) : 0;
  const readyClass =
    stats.readiness >= 80
      ? styles.good
      : stats.readiness >= 50
        ? styles.warn
        : styles.bad;

  return (
    <div className={styles.root}>
      <GlassCard accentColor="var(--gradient-accent)">
        <p className={styles.eyebrow}>Executive Summary · BID {bidNumber}</p>
        <h2 className={styles.title}>{title || "Proposal"}</h2>
        <div className={styles.stats}>
          <div>
            <div className={styles.label}>Total Value</div>
            <div className={`${styles.value} ${styles.big}`}>
              {fmt(stats.totalUSD)}
            </div>
            {stats.uncategorizedUSD > 0 && (
              <div className={styles.sub}>
                incl. {fmt(stats.uncategorizedUSD)} uncategorized
              </div>
            )}
          </div>
          <div>
            <div className={styles.label}>CAPEX</div>
            <div className={styles.value}>{fmt(stats.capexUSD)}</div>
          </div>
          <div>
            <div className={styles.label}>OPEX</div>
            <div className={styles.value}>{fmt(stats.opexUSD)}</div>
          </div>
          <div>
            <div className={styles.label}>BID Readiness</div>
            <div className={`${styles.value} ${readyClass}`}>
              {stats.readiness}%
            </div>
            <div className={styles.sub}>
              {stats.withoutPn} without PN · {stats.withoutCost} without cost
            </div>
          </div>
        </div>
      </GlassCard>

      <div className={styles.kpis}>
        <KPICard
          variant="glass"
          label="Items in scope"
          value={formatNumber(stats.itemCount)}
          accentColor="var(--primary-accent)"
        />
        <KPICard
          variant="glass"
          label="Priced items"
          value={formatNumber(stats.pricedCount)}
          accentColor="var(--primary-accent)"
        />
        <KPICard
          variant="glass"
          label="Split CAPEX / OPEX"
          value={`${capexPct}% / ${split ? 100 - capexPct : 0}%`}
          accentColor="var(--secondary-accent)"
        />
      </div>
    </div>
  );
};

/**
 * PresentationHero — what the BID is (identity + opportunity facts) and what it is worth
 * (full BID total, the same figure as the Cost Summary, and its CAPEX / OPEX split).
 */
import * as React from "react";
import { AlertTriangle, CalendarClock, Clock3, ListChecks } from "lucide-react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import {
  formatCurrency,
  formatDate,
  formatDaysLeft,
  formatNumber,
} from "../../utils/formatters";
import { getDueFreezeDate } from "../../utils/bidHelpers";
import { getCurrentRevisionLetter } from "../bid/RevisionsTab";
import { AnimatedNumber } from "../common/AnimatedNumber";
import { BidDivisionTag } from "../common/BidDivisionTag";
import { GlassCard } from "../common/GlassCard";
import { StatusBadge } from "../common/StatusBadge";
import { RingGauge } from "../charts/RingGauge";
import styles from "./PresentationHero.module.scss";

export interface PresentationHeroProps {
  model: IPresentationModel;
}

export const PresentationHero: React.FC<PresentationHeroProps> = ({ model }) => {
  const { bid, view, display, colors, money, facts, effort } = model;
  const theme = colors.theme;
  const capex = view.capex.usd;
  const opex = view.opex.usd;
  const uncategorized = view.uncategorized.usd;
  const split = capex + opex + uncategorized;
  const capexPct = split > 0 ? (capex / split) * 100 : 0;
  const ptax = view.fx.brlRate;
  const due = formatDaysLeft(bid.dueDate, getDueFreezeDate(bid));
  const scopeCount = (bid.scopeItems || []).filter((s) => !s.isSection).length;
  const missingRates = view.summary.missingRateCurrencies || [];
  const projectName =
    (bid.opportunityInfo && bid.opportunityInfo.projectName) || "Proposal";

  const otherCurrency =
    ptax > 0
      ? display.currency === "USD"
        ? `≈ ${formatCurrency(model.totalUSD * ptax, "BRL")}`
        : `≈ ${formatCurrency(model.totalUSD, "USD")}`
      : "";

  return (
    <GlassCard variant="liquid" className={styles.hero}>
      <div className={styles.layout}>
        <div className={styles.identity}>
          <div className={styles.eyebrowRow}>
            <span className={styles.bidNumber}>BID {bid.bidNumber}</span>
            <span className={styles.rev}>
              Rev. {getCurrentRevisionLetter(bid)}
            </span>
            <BidDivisionTag bid={bid} variant="compact" />
            <StatusBadge status={bid.currentStatus} />
          </div>
          <h2 className={styles.title} title={projectName}>
            {projectName}
          </h2>
          {facts.length > 0 && (
            <div className={styles.facts}>
              {facts.map((f) => (
                <div key={f.key} className={styles.fact}>
                  <span className={styles.factLabel}>{f.label}</span>
                  <span className={styles.factValue} title={f.value}>
                    {f.value}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className={styles.meta}>
            <span className={due.isOverdue ? styles.metaDanger : undefined}>
              <CalendarClock size={14} />
              Due {formatDate(bid.dueDate)} · {due.text}
            </span>
            <span>
              <ListChecks size={14} />
              {formatNumber(scopeCount)} scope items
            </span>
            {effort.totalHours > 0 && (
              <span>
                <Clock3 size={14} />
                {formatNumber(Math.round(effort.totalHours))} labor hours
              </span>
            )}
          </div>
        </div>

        <div className={styles.value}>
          <span className={styles.valueLabel}>Total BID value</span>
          <AnimatedNumber
            className={styles.total}
            value={model.totalUSD * display.rate}
            format={(v) => formatCurrency(v, display.currency)}
          />
          {otherCurrency && (
            <span className={styles.other}>
              {otherCurrency} · PTAX {ptax.toFixed(4)}
            </span>
          )}
          {missingRates.length > 0 && (
            <span className={styles.warning}>
              <AlertTriangle size={12} />
              {missingRates.join(", ")} items left out (no exchange rate)
            </span>
          )}

          {split > 0 && (
            <div className={styles.split}>
              <RingGauge
                variant="semi"
                size={128}
                thickness={14}
                trackColor={theme.grid}
                segments={[
                  { key: "capex", value: capex, color: theme.capex, label: "CAPEX" },
                  { key: "opex", value: opex, color: theme.opex, label: "OPEX" },
                  {
                    key: "uncat",
                    value: uncategorized,
                    color: theme.textMuted,
                    label: "Uncategorized",
                  },
                ]}
              >
                <span className={styles.gaugeValue}>
                  {capexPct.toFixed(0)}%
                </span>
                <span className={styles.gaugeLabel}>CAPEX</span>
              </RingGauge>
              <div className={styles.legend}>
                <div className={styles.legendRow}>
                  <i style={{ background: "var(--fin-capex)" }} />
                  <span className={styles.legendName}>CAPEX</span>
                  <span className={styles.legendValue}>{money(capex)}</span>
                </div>
                <div className={styles.legendRow}>
                  <i style={{ background: "var(--fin-opex)" }} />
                  <span className={styles.legendName}>OPEX</span>
                  <span className={styles.legendValue}>{money(opex)}</span>
                </div>
                {uncategorized > 0 && (
                  <div className={styles.legendRow}>
                    <i style={{ background: "var(--text-muted)" }} />
                    <span className={styles.legendName}>Uncategorized</span>
                    <span className={styles.legendValue}>
                      {money(uncategorized)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

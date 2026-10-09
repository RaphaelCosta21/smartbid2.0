/**
 * ComparisonExecutive — the few things worth a decision: the biggest increases and savings,
 * items supplied differently, and what scope was added or dropped.
 */
import * as React from "react";
import { COMPARATOR_CONFIG } from "../../config/comparator.config";
import {
  buildInsights,
  IComparisonResult,
  IMatchedLine,
  priceImpactUSD,
} from "../../utils/bidComparator";
import {
  formatCurrency,
  formatSignedCurrency,
  formatSignedPercent,
} from "../../utils/formatters";
import { EmptyState } from "../common/EmptyState";
import styles from "./ComparisonExecutive.module.scss";

export interface ComparisonExecutiveProps {
  result: IComparisonResult;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
}

const TITLE_MAX = 64;
const MODEL_ROWS = 10;

const Row: React.FC<{ token: string; children: React.ReactNode }> = ({
  token,
  children,
}) => (
  <div className={styles.row} style={{ borderLeftColor: token }}>
    {children}
  </div>
);

const Section: React.FC<{
  token: string;
  title: string;
  children: React.ReactNode;
}> = ({ token, title, children }) => (
  <div className={styles.section}>
    <p className={styles.sectionTitle} style={{ color: token }}>
      {title}
    </p>
    {children}
  </div>
);

export const ComparisonExecutive: React.FC<ComparisonExecutiveProps> = ({
  result,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);
  const insights = React.useMemo(() => buildInsights(result), [result]);
  const top = COMPARATOR_CONFIG.insightRows;

  const changeRow = (m: IMatchedLine, token: string): React.ReactNode => (
    <Row key={m.key} token={token}>
      <span className={styles.name}>{m.description.slice(0, TITLE_MAX)}</span>{" "}
      <span className={styles.figure} style={{ color: token }}>
        {formatSignedPercent(m.deltaPct)}
      </span>{" "}
      <span className={styles.muted}>
        ({fmt(m.unitHistUSD)} → {fmt(m.unitNewUSD)} per unit
        {m.qtyNew > 1
          ? ` · ${formatSignedCurrency(priceImpactUSD(m) * rate, currency)} over ${m.qtyNew} units`
          : ""}
        )
      </span>
    </Row>
  );

  const nothing =
    insights.increased.length === 0 &&
    insights.decreased.length === 0 &&
    insights.modelChanges.length === 0 &&
    result.newItems.length === 0 &&
    result.missing.length === 0;
  if (nothing) {
    return (
      <EmptyState
        title="No notable changes"
        description={`Matched items are priced within ±${COMPARATOR_CONFIG.significantChangePct}% and the scope is identical.`}
      />
    );
  }

  return (
    <div className={styles.root}>
      {insights.increased.length > 0 && (
        <Section
          token="var(--danger)"
          title="Biggest cost increases vs. the earlier BID(s)"
        >
          {insights.increased
            .slice(0, top)
            .map((m) => changeRow(m, "var(--danger)"))}
        </Section>
      )}

      {insights.decreased.length > 0 && (
        <Section
          token="var(--success)"
          title="Biggest savings vs. the earlier BID(s)"
        >
          {insights.decreased
            .slice(0, top)
            .map((m) => changeRow(m, "var(--success)"))}
        </Section>
      )}

      {insights.modelChanges.length > 0 && (
        <Section
          token="var(--warning)"
          title="Supply mode changes (commercial strategy shifted)"
        >
          {insights.modelChanges.slice(0, MODEL_ROWS).map((m) => (
            <Row key={m.key} token="var(--warning)">
              <span className={styles.name}>
                {m.description.slice(0, TITLE_MAX)}
              </span>{" "}
              — was <strong>{m.acquisitionHist}</strong>, now{" "}
              <strong>{m.acquisitionNew}</strong>
            </Row>
          ))}
          {insights.modelChanges.length > MODEL_ROWS && (
            <p className={styles.more}>
              +{insights.modelChanges.length - MODEL_ROWS} more in Price Changes
            </p>
          )}
        </Section>
      )}

      {result.newItems.length > 0 && (
        <Section
          token="var(--info)"
          title={`New scope items (not in the earlier BID) — ${fmt(insights.newItemsUSD)} total`}
        >
          {result.newItems.slice(0, COMPARATOR_CONFIG.newScopeRows).map((n) => (
            <Row key={n.key} token="var(--info)">
              <span className={styles.name}>
                {n.description.slice(0, TITLE_MAX)}
              </span>{" "}
              <span className={styles.figure}>{fmt(n.totalUSD)}</span>
            </Row>
          ))}
        </Section>
      )}

      {result.missing.length > 0 && (
        <Section
          token="var(--warning)"
          title={`In the earlier BID but not in this one — ${fmt(insights.missingUSD)} potential gap`}
        >
          {result.missing.slice(0, top).map((m) => (
            <Row key={m.key} token="var(--warning)">
              <span className={styles.name}>
                {m.description.slice(0, TITLE_MAX)}
              </span>{" "}
              <span className={styles.figure}>{fmt(m.totalUSD)}</span>{" "}
              <span className={styles.muted}>(historical)</span>
            </Row>
          ))}
        </Section>
      )}
    </div>
  );
};

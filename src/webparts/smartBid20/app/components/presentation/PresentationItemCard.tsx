/**
 * PresentationItemCard — one top-cost item of the BID Presentation: its value and share,
 * what makes it up, how the quoting suppliers compare, and how it was priced before.
 */
import * as React from "react";
import { IQuotationItem } from "../../models";
import {
  acquisitionToken,
  getItemHistory,
  IHistoryIndex,
  IPresentationItem,
  median,
} from "../../utils/bidPresentation";
import {
  buildSupplierQuoteBars,
  getEffectiveLinks,
  resolveLinks,
} from "../../utils/quotationLinks";
import { formatCurrency } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { ProgressBar } from "../common/ProgressBar";
import { SupplierQuoteBars } from "../charts/SupplierQuoteBars";
import styles from "./PresentationItemCard.module.scss";

export interface PresentationItemCardProps {
  rank: number;
  item: IPresentationItem;
  /** Share of the BID total, 0–100 */
  shareOfTotal: number;
  maxTotalUSD: number;
  bidNumber: string;
  historyIndex: IHistoryIndex;
  quotationIndex: Map<string, IQuotationItem>;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
  highlighted?: boolean;
}

const MAX_PRIOR_BIDS = 6;

export const PresentationItemCard: React.FC<PresentationItemCardProps> = ({
  rank,
  item,
  shareOfTotal,
  maxTotalUSD,
  bidNumber,
  historyIndex,
  quotationIndex,
  displayCurrency,
  highlighted,
}) => {
  const [showHistory, setShowHistory] = React.useState(false);
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);

  const history = React.useMemo(
    () => getItemHistory(historyIndex, item, bidNumber),
    [historyIndex, item, bidNumber],
  );
  const historicalMedian = React.useMemo(
    () => median(history.records.map((r) => r.totalUSD).filter((v) => v > 0)),
    [history],
  );
  const deltaPct =
    historicalMedian && historicalMedian > 0
      ? ((item.totalUSD - historicalMedian) / historicalMedian) * 100
      : null;

  const priorBids = React.useMemo(() => {
    const seen: Record<string, boolean> = {};
    return history.records
      .filter((r) => {
        if (seen[r.bidNumber]) return false;
        seen[r.bidNumber] = true;
        return true;
      })
      .slice(0, MAX_PRIOR_BIDS);
  }, [history]);

  const bars = React.useMemo(() => {
    const links = getEffectiveLinks(
      item.asset,
      item.partNumber,
      quotationIndex,
    );
    const qty =
      (item.scopeItem.qtyOperational || 0) + (item.scopeItem.qtySpare || 0) ||
      1;
    return buildSupplierQuoteBars(
      resolveLinks(links, quotationIndex),
      qty,
      item.asset.rentalDays || 0,
      rate,
    );
  }, [item, quotationIndex, rate]);

  const extrasUSD = item.feesUSD + item.subItemsUSD + item.pcfUSD;
  // The equipment has no price of its own; the value comes from services or sub-items
  const extrasOnly = item.ownUSD <= 0 && extrasUSD > 0;
  const dominant = history.acquisition[0];
  const historyMax = Math.max(
    item.totalUSD,
    ...history.records.map((r) => r.totalUSD),
    1,
  );

  const parts: { label: string; value: number; token: string }[] = [
    { label: "Services & fees", value: item.feesUSD, token: "var(--warning)" },
    {
      label: "Sub-items",
      value: item.subItemsUSD,
      token: "var(--secondary-accent)",
    },
    { label: "PCF", value: item.pcfUSD, token: "var(--tertiary-accent)" },
  ].filter((p) => p.value > 0);

  const deltaClass =
    deltaPct === null
      ? styles.deltaNone
      : deltaPct > 0.5
        ? styles.deltaWorse
        : deltaPct < -0.5
          ? styles.deltaBetter
          : styles.deltaNone;

  return (
    <GlassCard className={highlighted ? styles.highlighted : undefined}>
      <div className={styles.body}>
        <div className={styles.head}>
          <div className={styles.headMain}>
            <div className={styles.eyebrow}>
              #{rank} · {item.category} ·{" "}
              {item.hasPn ? `PN ${item.partNumber}` : "PN TBD"}
            </div>
            <h4 className={styles.title}>
              {item.description || "(no description)"}
            </h4>
            <div
              className={styles.mode}
              style={{ color: acquisitionToken(item.acquisition) }}
            >
              {item.acquisition}
            </div>
          </div>
          <div className={styles.headValue}>
            <div className={styles.total}>{fmt(item.totalUSD)}</div>
            <div className={styles.caption}>
              {extrasOnly
                ? "services / sub-items cost"
                : extrasUSD > 0
                  ? "equipment + extras"
                  : "item cost"}
            </div>
            <div className={styles.caption}>
              {shareOfTotal.toFixed(1)}% of total
            </div>
          </div>
        </div>

        {extrasOnly && (
          <div className={styles.warning}>
            This value is for <strong>services or sub-items</strong>, not the
            equipment - the equipment itself is listed as{" "}
            <strong>{item.acquisition}</strong>.
          </div>
        )}

        <ProgressBar
          value={item.totalUSD}
          max={maxTotalUSD}
          color={extrasOnly ? "var(--text-muted)" : "var(--primary-accent)"}
        />

        {extrasUSD > 0 && (
          <div>
            {!extrasOnly && (
              <div className={styles.partsLine}>
                Equipment {fmt(item.ownUSD)} · Extras {fmt(extrasUSD)}
              </div>
            )}
            <div className={styles.chips}>
              {parts.map((p) => (
                <span
                  key={p.label}
                  className={styles.chip}
                  style={{ borderColor: p.token }}
                >
                  {p.label} {fmt(p.value)}
                </span>
              ))}
            </div>
          </div>
        )}

        {bars.length >= 2 && (
          <div className={styles.quotes}>
            <SupplierQuoteBars
              bars={bars}
              currency={currency}
              title="Supplier quotes"
            />
          </div>
        )}
        {bars.length === 1 && (
          <div className={styles.quoteLine}>
            Quoted by <strong>{bars[0].supplier}</strong> ·{" "}
            {formatCurrency(bars[0].value, currency)}
            {bars[0].leadTimeDays > 0 ? ` · ${bars[0].leadTimeDays}d` : ""}
          </div>
        )}

        <div className={styles.historyRow}>
          <span className={`${styles.delta} ${deltaClass}`}>
            {deltaPct === null
              ? "no history"
              : `${deltaPct > 0.5 ? "▲" : deltaPct < -0.5 ? "▼" : "≈"} ${
                  deltaPct > 0 ? "+" : ""
                }${deltaPct.toFixed(1)}% vs. history`}
          </span>
          {historicalMedian !== null && (
            <span className={styles.caption}>
              historical median {fmt(historicalMedian)} ·{" "}
              {history.records.length} bid(s)
            </span>
          )}
          {history.records.length > 0 && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => setShowHistory((v) => !v)}
            >
              {showHistory ? "Close" : "Full history"}
            </button>
          )}
        </div>

        {showHistory && history.records.length > 0 && (
          <div className={styles.history}>
            <div className={styles.eyebrow}>History by BID</div>
            <div className={styles.historyList}>
              <div className={styles.historyItem}>
                <div className={styles.historyName}>THIS BID</div>
                <ProgressBar
                  value={item.totalUSD}
                  max={historyMax}
                  color="var(--primary-accent)"
                />
                <div className={styles.historyValue}>{fmt(item.totalUSD)}</div>
              </div>
              {history.records.map((r, i) => (
                <div key={`${r.bidNumber}-${i}`} className={styles.historyItem}>
                  <div className={styles.historyName} title={r.project}>
                    {r.bidNumber}
                    <span
                      className={styles.historyMode}
                      style={{ color: acquisitionToken(r.acquisition) }}
                    >
                      {r.acquisition}
                    </span>
                  </div>
                  <ProgressBar
                    value={r.totalUSD}
                    max={historyMax}
                    color="var(--text-muted)"
                  />
                  <div className={styles.historyValue}>{fmt(r.totalUSD)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(item.asset.notes || dominant) && (
          <div className={styles.why}>
            {item.asset.notes && (
              <p className={styles.rationale}>
                <span className={styles.eyebrow}>Rationale · </span>
                {item.asset.notes}
              </p>
            )}
            {dominant && history.acquisition.length > 0 && (
              <p className={styles.caption}>
                Historically offered as{" "}
                <strong style={{ color: acquisitionToken(dominant.label) }}>
                  {dominant.label}
                </strong>{" "}
                in {dominant.pct.toFixed(0)}% of cases
                {history.acquisition.length > 1
                  ? ` (${history.acquisition.length} different modes recorded)`
                  : ""}
                .
              </p>
            )}
          </div>
        )}

        {priorBids.length > 0 && (
          <div className={styles.prior}>
            <div className={styles.eyebrow}>Previously used in</div>
            <div className={styles.chips}>
              {priorBids.map((b) => (
                <span
                  key={b.bidNumber}
                  className={styles.priorChip}
                  title={b.project}
                >
                  {b.bidNumber}
                  {b.project ? ` · ${b.project.slice(0, 24)}` : ""}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

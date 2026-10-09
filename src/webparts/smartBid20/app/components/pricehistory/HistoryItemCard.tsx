/**
 * HistoryItemCard — one item of the Price History: what it costs, how it compares with the
 * other BIDs that offered it, and, once opened, the acquisition mix and the full cost of each BID.
 */
import * as React from "react";
import {
  acquisitionToken,
  IHistoryRecord,
  IItemHistory,
} from "../../utils/bidPresentation";
import {
  computeHistoryStats,
  DIVERGENCE_THRESHOLD_PCT,
  divergencePct,
} from "../../utils/priceHistory";
import {
  formatCurrency,
  formatSignedCurrency,
  formatSignedPercent,
} from "../../utils/formatters";
import styles from "./HistoryItemCard.module.scss";

/** The item as priced in the BID being inspected */
export interface IHistoryCurrent {
  label: string;
  totalUSD: number;
  ownUSD: number;
  extrasUSD: number;
}

export interface HistoryItemCardProps {
  title: string;
  /** Small outlined tag before the title (e.g. REQUIREMENT, In House) */
  tag?: { label: string; token: string };
  /** Empty when the item has no part number */
  partNumber: string;
  acquisition: string;
  /** What the item is matched by: part number, requirement or description */
  matchLabel: string;
  referenceUSD: number;
  /** Descriptions folded into a requirement group */
  aliases?: string[];
  /** Present when inspecting one BID: enables the comparison with the historical average */
  current?: IHistoryCurrent;
  /** Badge text while no history is loaded (item search) */
  summary?: string;
  /** Null until it is needed */
  history: IItemHistory | null;
  expanded: boolean;
  onToggle: () => void;
}

const usd = (v: number): string => formatCurrency(v, "USD");
const NO_RECORDS: IHistoryRecord[] = [];
const EXTRAS_TOKEN = "var(--secondary-accent)";
const PROJECT_MAX = 22;

function divergenceToken(pct: number): string {
  if (pct > DIVERGENCE_THRESHOLD_PCT) return "var(--danger)";
  if (pct < -DIVERGENCE_THRESHOLD_PCT) return "var(--success)";
  return "var(--text-muted)";
}

const Stat: React.FC<{ label: string; value: string; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div className={styles.stat}>
    <div className={styles.statLabel}>{label}</div>
    <div className={styles.statValue}>{value}</div>
    {hint && <div className={styles.statHint}>{hint}</div>}
  </div>
);

const CostBar: React.FC<{
  name: string;
  description?: string;
  acquisition: string;
  equipmentUSD: number;
  extrasUSD: number;
  maxUSD: number;
  current?: boolean;
}> = ({
  name,
  description,
  acquisition,
  equipmentUSD,
  extrasUSD,
  maxUSD,
  current,
}) => {
  const token = acquisitionToken(acquisition);
  const pct = (v: number): number => (maxUSD > 0 ? (v / maxUSD) * 100 : 0);
  const empty = equipmentUSD <= 0 && extrasUSD <= 0;
  return (
    <div className={styles.barRow}>
      <div className={styles.barName}>
        <div
          className={current ? styles.barCurrent : styles.barTitle}
          title={name}
        >
          {name}
        </div>
        {description && (
          <div className={styles.barDesc} title={description}>
            {description}
          </div>
        )}
        <div className={styles.barMode} style={{ color: token }}>
          {acquisition || "(unspecified)"}
        </div>
      </div>
      <div className={styles.track}>
        <div
          className={styles.segment}
          style={{ width: `${pct(equipmentUSD)}%`, background: token }}
          title={`${acquisition}: ${usd(equipmentUSD)}`}
        />
        <div
          className={styles.segment}
          style={{ width: `${pct(extrasUSD)}%`, background: EXTRAS_TOKEN }}
          title={`Extras: ${usd(extrasUSD)}`}
        />
        {empty && (
          <div className={styles.marker} style={{ background: token }} />
        )}
      </div>
      <div className={styles.barValue}>{usd(equipmentUSD + extrasUSD)}</div>
    </div>
  );
};

export const HistoryItemCard: React.FC<HistoryItemCardProps> = ({
  title,
  tag,
  partNumber,
  acquisition,
  matchLabel,
  referenceUSD,
  aliases,
  current,
  summary,
  history,
  expanded,
  onToggle,
}) => {
  const records = history ? history.records : NO_RECORDS;
  const stats = React.useMemo(() => computeHistoryStats(records), [records]);
  const divergence = current
    ? divergencePct(current.totalUSD, stats.avgFullUSD)
    : null;
  const mixTotal = history
    ? history.acquisition.reduce((s, a) => s + a.count, 0)
    : 0;
  const maxUSD = Math.max(
    current ? current.totalUSD : 0,
    ...records.map((r) => r.totalUSD),
    1,
  );
  const noCost = referenceUSD <= 0;

  let badge: React.ReactNode;
  if (current && history) {
    if (records.length === 0) {
      badge = <span className={styles.muted}>no history</span>;
    } else if (divergence !== null) {
      badge = (
        <span style={{ color: divergenceToken(divergence) }}>
          {divergence > DIVERGENCE_THRESHOLD_PCT
            ? "▲"
            : divergence < -DIVERGENCE_THRESHOLD_PCT
              ? "▼"
              : "≈"}{" "}
          {formatSignedPercent(divergence, 0)} vs avg · {records.length} bid(s)
        </span>
      );
    } else {
      badge = <span className={styles.good}>{records.length} bid(s)</span>;
    }
  } else {
    badge = <span className={styles.good}>{summary}</span>;
  }

  const accent = noCost
    ? "var(--success)"
    : expanded
      ? "var(--primary-accent)"
      : "var(--border)";

  return (
    <div className={styles.card} style={{ borderLeftColor: accent }}>
      <div className={styles.head}>
        <div className={styles.headMain}>
          <div className={styles.title} title={title}>
            {tag && (
              <span
                className={styles.tag}
                style={{ color: tag.token, borderColor: tag.token }}
              >
                {tag.label}
              </span>
            )}
            {title || "(no description)"}
          </div>
          <div className={styles.meta}>
            PN: {partNumber || "—"} ·{" "}
            <span style={{ color: acquisitionToken(acquisition) }}>
              {acquisition}
            </span>{" "}
            · {noCost ? "no cost" : usd(referenceUSD)} · match: {matchLabel}
          </div>
          {aliases && aliases.length > 1 && (
            <div className={styles.meta}>
              {aliases.length} descriptions grouped:{" "}
              {aliases.slice(0, 4).join(" · ")}
              {aliases.length > 4 ? ` +${aliases.length - 4}` : ""}
            </div>
          )}
        </div>
        <div className={styles.badge}>{badge}</div>
      </div>

      <button type="button" className={styles.linkBtn} onClick={onToggle}>
        {expanded ? "▲ Close" : "▼ Full history"}
      </button>

      {expanded && history && (
        <div className={styles.body}>
          {history.acquisition.length > 0 && (
            <div className={styles.block}>
              <div className={styles.blockTitle}>
                Acquisition mix — how this item was offered ({mixTotal} BID
                record{mixTotal === 1 ? "" : "s"})
              </div>
              <div className={styles.mix}>
                {history.acquisition.map((a) => (
                  <div
                    key={a.label}
                    className={styles.mixSegment}
                    style={{
                      width: `${a.pct}%`,
                      background: acquisitionToken(a.label),
                    }}
                    title={`${a.label}: ${a.count} of ${mixTotal} (${a.pct.toFixed(0)}%)`}
                  />
                ))}
              </div>
              <div className={styles.legend}>
                {history.acquisition.map((a) => (
                  <span key={a.label}>
                    <i style={{ background: acquisitionToken(a.label) }} />
                    {a.label} · {a.pct.toFixed(0)}% · {a.count}×
                  </span>
                ))}
              </div>
            </div>
          )}

          {records.length === 0 ? (
            <p className={styles.muted}>
              No other BID offered this item
              {partNumber ? ` (PN ${partNumber})` : ""}.
            </p>
          ) : (
            <>
              <div className={styles.blockTitle}>Full cost comparison</div>
              <div className={styles.stats}>
                {current && (
                  <Stat label="This BID (full)" value={usd(current.totalUSD)} />
                )}
                <Stat
                  label="Avg historical (full)"
                  value={stats.avgFullUSD ? usd(stats.avgFullUSD) : "—"}
                />
                {current ? (
                  <Stat
                    label="Divergence"
                    value={
                      divergence !== null
                        ? formatSignedPercent(divergence)
                        : "—"
                    }
                    hint={
                      divergence !== null
                        ? formatSignedCurrency(
                            current.totalUSD - stats.avgFullUSD,
                            "USD",
                          )
                        : undefined
                    }
                  />
                ) : (
                  <Stat label="BIDs with history" value={`${records.length}`} />
                )}
                <Stat
                  label="Avg equipment only"
                  value={
                    stats.avgEquipmentUSD ? usd(stats.avgEquipmentUSD) : "—"
                  }
                />
                <Stat label="Avg extras" value={usd(stats.avgExtrasUSD)} />
              </div>

              {current && divergence !== null && (
                <div
                  className={styles.note}
                  style={{ borderLeftColor: divergenceToken(divergence) }}
                >
                  <strong>{usd(current.totalUSD)}</strong> (this BID) vs{" "}
                  <strong>{usd(stats.avgFullUSD)}</strong> (average) →{" "}
                  <strong style={{ color: divergenceToken(divergence) }}>
                    {formatSignedPercent(divergence)}{" "}
                    {divergence > 0 ? "above" : "below"} average
                  </strong>
                </div>
              )}

              <div className={styles.blockTitle}>
                History by BID — bar color is the acquisition type; the blue
                segment is extras (services, sub-items, PCF)
              </div>
              <div className={styles.bars}>
                {current && (
                  <CostBar
                    name={current.label}
                    acquisition={acquisition}
                    description={title}
                    equipmentUSD={current.ownUSD}
                    extrasUSD={current.extrasUSD}
                    maxUSD={maxUSD}
                    current
                  />
                )}
                {records.map((r, i) => (
                  <CostBar
                    key={`${r.bidNumber}-${i}`}
                    name={`${r.bidNumber}${
                      r.project ? ` — ${r.project.slice(0, PROJECT_MAX)}` : ""
                    }`}
                    description={r.description}
                    acquisition={r.acquisition}
                    equipmentUSD={r.ownUSD}
                    extrasUSD={r.extrasUSD}
                    maxUSD={maxUSD}
                  />
                ))}
              </div>

              {current && noCost && stats.avgFullUSD > 0 && (
                <div className={`${styles.note} ${styles.noteGood}`}>
                  This item has <strong>no equipment cost</strong> here (
                  {acquisition}), but in other BIDs its full cost averaged{" "}
                  <strong>{usd(stats.avgFullUSD)}</strong>.{" "}
                  {current.extrasUSD > 0
                    ? `Extras charged here: ${usd(current.extrasUSD)}.`
                    : "No extras charged."}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

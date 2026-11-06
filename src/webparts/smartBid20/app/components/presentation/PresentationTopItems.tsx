/**
 * PresentationTopItems — the items that weigh most, each with a bullet micro-chart
 * (price vs. the historical median of the same item) and a divider where 80% of the
 * asset value is reached. A row opens the item drawer.
 */
import * as React from "react";
import { ArrowRight, X } from "lucide-react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { acquisitionToken } from "../../utils/bidPresentation";
import { formatSignedPercent } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { BulletBar } from "../charts/BulletBar";
import tile from "./PresentationTile.module.scss";
import styles from "./PresentationTopItems.module.scss";

export interface PresentationTopItemsProps {
  model: IPresentationModel;
  category: string | null;
  onClearCategory: () => void;
  onOpenItem: (key: string, list: string[]) => void;
  onViewAll: () => void;
}

const MAX_ROWS = 25;
/** Within ±5% of the historical median counts as "in line" */
const IN_LINE_PCT = 5;

export const PresentationTopItems: React.FC<PresentationTopItemsProps> = ({
  model,
  category,
  onClearCategory,
  onOpenItem,
  onViewAll,
}) => {
  const { ranked, insights, colors, money, totalUSD, rankOf } = model;
  const scoped = React.useMemo(
    () => (category ? ranked.filter((i) => i.category === category) : ranked),
    [ranked, category],
  );
  const keys = React.useMemo(() => scoped.map((i) => i.key), [scoped]);
  const scopedTotal = scoped.reduce((s, i) => s + i.totalUSD, 0);
  const max = scoped.length > 0 ? scoped[0].totalUSD : 1;

  // Index of the row where the running total first reaches 80%
  const cutIndex = React.useMemo(() => {
    let cum = 0;
    for (let i = 0; i < scoped.length; i++) {
      cum += scoped[i].totalUSD;
      if (scopedTotal > 0 && cum / scopedTotal >= 0.8) return i;
    }
    return -1;
  }, [scoped, scopedTotal]);

  const rows = scoped.slice(0, MAX_ROWS);

  return (
    <GlassCard
      title="Top items"
      className={`${tile.tile} ${tile.tileTop}`}
      actions={
        scoped.length > 0 ? (
          <button type="button" className={tile.linkBtn} onClick={onViewAll}>
            View all {scoped.length}
            <ArrowRight size={12} />
          </button>
        ) : undefined
      }
    >
      <div className={tile.body}>
        <div className={styles.filterRow}>
          {category ? (
            <span className={tile.chip}>
              {category}
              <button
                type="button"
                onClick={onClearCategory}
                aria-label="Show all resource types"
              >
                <X size={12} />
              </button>
            </span>
          ) : (
            <span className={styles.hint}>Most expensive first</span>
          )}
          <span className={styles.legend}>
            <i className={styles.legendMarker} /> historical median
          </span>
        </div>

        {rows.length === 0 ? (
          <p className={tile.empty}>No priced items in this selection.</p>
        ) : (
          <ol className={`${tile.scroll} ${styles.list}`}>
            {rows.map((item, idx) => {
              const insight = insights.get(item.key);
              const delta = insight ? insight.deltaPct : null;
              const deltaClass =
                delta === null
                  ? styles.deltaNone
                  : delta > IN_LINE_PCT
                    ? styles.deltaUp
                    : delta < -IN_LINE_PCT
                      ? styles.deltaDown
                      : styles.deltaFlat;
              return (
                <React.Fragment key={item.key}>
                  <li>
                    <button
                      type="button"
                      className={styles.row}
                      onClick={() => onOpenItem(item.key, keys)}
                    >
                      <span className={styles.rank}>{rankOf.get(item.key)}</span>
                      <span className={styles.main}>
                        <span className={styles.name} title={item.description}>
                          {item.description || item.partNumber || "(no description)"}
                        </span>
                        <span className={styles.sub}>
                          <span
                            className={styles.dot}
                            style={{ background: colors.category(item.category) }}
                          />
                          {item.category}
                          <span className={styles.sep}>·</span>
                          <span style={{ color: acquisitionToken(item.acquisition) }}>
                            {item.acquisition}
                          </span>
                        </span>
                      </span>
                      <span className={styles.amount}>
                        <span className={styles.value}>{money(item.totalUSD)}</span>
                        <span className={styles.share}>
                          {totalUSD > 0
                            ? `${((item.totalUSD / totalUSD) * 100).toFixed(1)}% of BID`
                            : ""}
                        </span>
                      </span>
                      <span className={styles.bullet}>
                        <BulletBar
                          value={item.totalUSD}
                          max={Math.max(max, (insight && insight.medianUSD) || 0)}
                          reference={insight ? insight.medianUSD : null}
                          color={colors.category(item.category)}
                          title={
                            insight && insight.medianUSD
                              ? `Median in other BIDs: ${money(insight.medianUSD)}`
                              : "No price history"
                          }
                        />
                        <span className={`${styles.delta} ${deltaClass}`}>
                          {delta === null
                            ? "No history"
                            : Math.abs(delta) <= IN_LINE_PCT
                              ? "≈ in line"
                              : `${delta > 0 ? "▲" : "▼"} ${formatSignedPercent(delta, 0)}`}
                        </span>
                      </span>
                    </button>
                  </li>
                  {idx === cutIndex && idx < rows.length - 1 && (
                    <li className={styles.cut} aria-label="80% of the value">
                      <span>
                        {idx + 1} {idx === 0 ? "item makes" : "items make"} 80% of{" "}
                        {category ? category : "the asset value"}
                      </span>
                    </li>
                  )}
                </React.Fragment>
              );
            })}
            {scoped.length > rows.length && (
              <li className={styles.more}>
                <button type="button" className={tile.linkBtn} onClick={onViewAll}>
                  + {scoped.length - rows.length} more items
                </button>
              </li>
            )}
          </ol>
        )}
      </div>
    </GlassCard>
  );
};

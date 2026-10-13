/**
 * PresentationParetoSection — the items that weigh most on the BID, filterable by category
 * and minimum value. Clicking a bar jumps to that item's card.
 */
import * as React from "react";
import {
  buildParetoRows,
  IPresentationItem,
} from "../../utils/bidPresentation";
import { formatCurrency } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { ParetoChart } from "../charts/ParetoChart";
import styles from "./PresentationParetoSection.module.scss";

export interface PresentationParetoSectionProps {
  /** Ranked items of the selected category */
  items: IPresentationItem[];
  /** Every category present in the BID */
  categories: string[];
  selectedCategory: string;
  onCategory: (category: string) => void;
  /** Minimum item value in the display currency */
  minValue: number;
  onMinValue: (value: number) => void;
  selectedKey: string | null;
  onSelectItem: (key: string) => void;
  displayCurrency: { currency: "USD" | "BRL"; rate: number };
}

export const PresentationParetoSection: React.FC<
  PresentationParetoSectionProps
> = ({
  items,
  categories,
  selectedCategory,
  onCategory,
  minValue,
  onMinValue,
  selectedKey,
  onSelectItem,
  displayCurrency,
}) => {
  const { currency, rate } = displayCurrency;
  const rows = React.useMemo(
    () => buildParetoRows(items, minValue, rate),
    [items, minValue, rate],
  );
  const n80 = rows.filter((r) => r.pct <= 80).length;
  const total = rows.reduce((s, r) => s + r.value, 0);
  const top = rows.slice(0, n80).reduce((s, r) => s + r.value, 0);

  return (
    <GlassCard
      title="Pareto"
      subtitle="Prioritize the items that weigh most on the bid. Filter by category and the cards below follow the same selection."
    >
      <div className={styles.filters}>
        <div className={styles.chips}>
          {["All"].concat(categories).map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.chip} ${selectedCategory === c ? styles.chipActive : ""}`}
              onClick={() => onCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className={styles.minField}>
          Minimum value ({currency})
          <input
            type="number"
            min={0}
            step={100}
            value={minValue}
            onChange={(e) =>
              onMinValue(Math.max(0, parseFloat(e.target.value) || 0))
            }
          />
        </label>
      </div>

      {rows.length === 0 ? (
        <p className={styles.empty}>No items with cost in this selection.</p>
      ) : (
        <>
          <ParetoChart
            data={rows}
            currency={currency}
            selectedKey={selectedKey}
            onSelect={onSelectItem}
          />
          {n80 > 0 && (
            <p className={styles.note}>
              <strong>{n80} item(s)</strong> account for 80% of the cost in this
              selection ({formatCurrency(top, currency)} of{" "}
              {formatCurrency(total, currency)}).
            </p>
          )}
        </>
      )}
    </GlassCard>
  );
};

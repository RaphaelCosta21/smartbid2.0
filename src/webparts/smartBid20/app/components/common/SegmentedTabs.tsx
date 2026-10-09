/**
 * SegmentedTabs — one tab strip for the analysis pages. "tabs" is the underlined main
 * navigation; "chips" is the compact pill row used for sub-views and quick filters.
 */
import * as React from "react";
import styles from "./SegmentedTabs.module.scss";

export interface SegmentedTabItem<K extends string> {
  key: K;
  label: string;
  /** Small number shown next to the label */
  count?: number;
}

export interface SegmentedTabsProps<K extends string> {
  tabs: SegmentedTabItem<K>[];
  value: K;
  onChange: (key: K) => void;
  variant?: "tabs" | "chips";
  ariaLabel?: string;
}

export function SegmentedTabs<K extends string>({
  tabs,
  value,
  onChange,
  variant = "tabs",
  ariaLabel,
}: SegmentedTabsProps<K>): React.ReactElement {
  const isChips = variant === "chips";
  return (
    <div
      className={isChips ? styles.chipRow : styles.tabRow}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((t) => {
        const active = t.key === value;
        const base = isChips ? styles.chip : styles.tab;
        const on = isChips ? styles.chipActive : styles.tabActive;
        return (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={active}
            className={`${base} ${active ? on : ""}`}
            onClick={() => onChange(t.key)}
          >
            {t.label}
            {t.count !== undefined && (
              <span className={styles.count}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

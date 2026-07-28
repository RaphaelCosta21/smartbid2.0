import * as React from "react";
import styles from "./AnalyticsFilterBar.module.scss";
import { SegmentedControl, SegmentOption } from "./SegmentedControl";
import { MultiSelectDropdown, MultiSelectOption } from "./MultiSelectDropdown";
import { AnalyticsFilters, DatePreset } from "../../hooks/useAnalyticsFilters";

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilters;
  onPatch: (p: Partial<AnalyticsFilters>) => void;
  onPreset: (preset: DatePreset) => void;
  onReset: () => void;
  hasActive: boolean;
  divisions: MultiSelectOption[];
  serviceLines?: MultiSelectOption[];
  bidTypes?: MultiSelectOption[];
  /** Right-aligned actions (export, view toggles). */
  rightSlot?: React.ReactNode;
}

const PRESETS: SegmentOption<DatePreset>[] = [
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "180d", label: "180d" },
  { value: "ytd", label: "YTD" },
  { value: "12m", label: "12m" },
  { value: "all", label: "Tudo" },
];

const DivisionIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ServiceIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2l2.4 7.4H22l-6 4.5 2.3 7.1-6.3-4.6L5.7 21l2.3-7.1-6-4.5h7.6z" />
  </svg>
);

const BidTypeIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  filters,
  onPatch,
  onPreset,
  onReset,
  hasActive,
  divisions,
  serviceLines,
  bidTypes,
  rightSlot,
}) => {
  const divLabel = (v: string): string =>
    divisions.find((d) => d.value === v)?.label || v;
  const slLabel = (v: string): string =>
    (serviceLines || []).find((d) => d.value === v)?.label || v;
  const btLabel = (v: string): string =>
    (bidTypes || []).find((d) => d.value === v)?.label || v;

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.from || filters.to) {
    chips.push({
      key: "date",
      label: `${filters.from || "…"} → ${filters.to || "…"}`,
      onRemove: () => onPreset("all"),
    });
  }
  filters.divisions.forEach((v) =>
    chips.push({
      key: `div-${v}`,
      label: divLabel(v),
      onRemove: () =>
        onPatch({ divisions: filters.divisions.filter((x) => x !== v) }),
    }),
  );
  filters.serviceLines.forEach((v) =>
    chips.push({
      key: `sl-${v}`,
      label: slLabel(v),
      onRemove: () =>
        onPatch({ serviceLines: filters.serviceLines.filter((x) => x !== v) }),
    }),
  );
  filters.bidTypes.forEach((v) =>
    chips.push({
      key: `bt-${v}`,
      label: btLabel(v),
      onRemove: () =>
        onPatch({ bidTypes: filters.bidTypes.filter((x) => x !== v) }),
    }),
  );
  if (filters.search) {
    chips.push({
      key: "search",
      label: `"${filters.search}"`,
      onRemove: () => onPatch({ search: "" }),
    });
  }

  return (
    <div className={styles.bar}>
      <div className={styles.row}>
        <SegmentedControl<DatePreset>
          value={filters.preset === "custom" ? "all" : filters.preset}
          segments={PRESETS}
          onChange={onPreset}
          size="sm"
          ariaLabel="Período"
        />

        <div className={styles.dates}>
          <input
            type="date"
            className={styles.dateInput}
            value={filters.from}
            max={filters.to || undefined}
            onChange={(e) =>
              onPatch({ preset: "custom", from: e.target.value })
            }
            aria-label="De"
          />
          <span className={styles.dateSep}>–</span>
          <input
            type="date"
            className={styles.dateInput}
            value={filters.to}
            min={filters.from || undefined}
            onChange={(e) => onPatch({ preset: "custom", to: e.target.value })}
            aria-label="Até"
          />
        </div>

        <MultiSelectDropdown
          label="Divisão"
          icon={DivisionIcon}
          options={divisions}
          selected={filters.divisions}
          onChange={(v) => onPatch({ divisions: v })}
        />

        {serviceLines && serviceLines.length > 0 && (
          <MultiSelectDropdown
            label="Service Line"
            icon={ServiceIcon}
            options={serviceLines}
            selected={filters.serviceLines}
            onChange={(v) => onPatch({ serviceLines: v })}
          />
        )}

        {bidTypes && bidTypes.length > 0 && (
          <MultiSelectDropdown
            label="Tipo"
            icon={BidTypeIcon}
            options={bidTypes}
            selected={filters.bidTypes}
            onChange={(v) => onPatch({ bidTypes: v })}
          />
        )}

        <div className={styles.search}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar BID, cliente, projeto…"
            value={filters.search}
            onChange={(e) => onPatch({ search: e.target.value })}
          />
        </div>

        {rightSlot && <div className={styles.right}>{rightSlot}</div>}
      </div>

      {chips.length > 0 && (
        <div className={styles.chipsRow}>
          {chips.map((c) => (
            <button
              type="button"
              className={styles.chip}
              key={c.key}
              onClick={c.onRemove}
              title="Remover filtro"
            >
              <span>{c.label}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ))}
          {hasActive && (
            <button type="button" className={styles.clearAll} onClick={onReset}>
              Limpar tudo
            </button>
          )}
        </div>
      )}
    </div>
  );
};

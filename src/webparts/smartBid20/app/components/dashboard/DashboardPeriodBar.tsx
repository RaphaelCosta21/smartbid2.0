/**
 * DashboardPeriodBar — period (date field + range) and follow-up result filters
 * for the analytics section of the Engineering Dashboard.
 */
import * as React from "react";
import { X } from "lucide-react";
import { DatePreset } from "../../hooks/useAnalyticsFilters";
import {
  DashboardDateField,
  DashboardPeriodFilters,
} from "../../hooks/useDashboardFilters";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../insights/MultiSelectDropdown";
import styles from "./DashboardPeriodBar.module.scss";

interface DashboardPeriodBarProps {
  period: DashboardPeriodFilters;
  onPatch: (p: Partial<DashboardPeriodFilters>) => void;
  onPreset: (preset: DatePreset) => void;
  onReset: () => void;
  hasPeriod: boolean;
  /** Result options with counts. */
  resultOptions: MultiSelectOption[];
  missingDateCount: number;
}

export const DATE_FIELD_LABEL: Record<DashboardDateField, string> = {
  createdDate: "Created",
  dueDate: "Due Date",
  operationStartDate: "Operation Start",
};

const DATE_FIELDS: SegmentOption<DashboardDateField>[] = [
  { value: "createdDate", label: "Created", title: "BID request date" },
  { value: "dueDate", label: "Due", title: "Engineering due date" },
  {
    value: "operationStartDate",
    label: "Op. Start",
    title: "Operation Start Date (optional on the request)",
  },
];

const PRESETS: SegmentOption<DatePreset>[] = [
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "180d", label: "180d" },
  { value: "ytd", label: "YTD" },
  { value: "12m", label: "12m" },
  { value: "all", label: "All" },
];

export const DashboardPeriodBar: React.FC<DashboardPeriodBarProps> = ({
  period,
  onPatch,
  onPreset,
  onReset,
  hasPeriod,
  resultOptions,
  missingDateCount,
}) => (
  <div className={styles.bar}>
    <div className={styles.group}>
      <span className={styles.groupLabel}>Date</span>
      <SegmentedControl<DashboardDateField>
        value={period.dateField}
        segments={DATE_FIELDS}
        onChange={(v) => onPatch({ dateField: v })}
        size="sm"
        ariaLabel="Date field"
      />
    </div>

    <SegmentedControl<DatePreset>
      value={period.preset === "custom" ? "all" : period.preset}
      segments={PRESETS}
      onChange={onPreset}
      size="sm"
      ariaLabel="Period"
    />

    <div className={styles.dates}>
      <input
        type="date"
        className={styles.dateInput}
        value={period.from}
        max={period.to || undefined}
        onChange={(e) => onPatch({ preset: "custom", from: e.target.value })}
        aria-label="From"
      />
      <span className={styles.dateSep}>-</span>
      <input
        type="date"
        className={styles.dateInput}
        value={period.to}
        min={period.from || undefined}
        onChange={(e) => onPatch({ preset: "custom", to: e.target.value })}
        aria-label="To"
      />
    </div>

    <MultiSelectDropdown
      label="Follow-up Result"
      options={resultOptions}
      selected={period.results}
      onChange={(v) => onPatch({ results: v })}
    />

    {hasPeriod && (
      <button type="button" className={styles.clearBtn} onClick={onReset}>
        <X size={14} /> Reset period
      </button>
    )}

    {missingDateCount > 0 && (
      <span className={styles.note}>
        {missingDateCount} BID{missingDateCount === 1 ? "" : "s"} without{" "}
        {DATE_FIELD_LABEL[period.dateField]} excluded
      </span>
    )}
  </div>
);

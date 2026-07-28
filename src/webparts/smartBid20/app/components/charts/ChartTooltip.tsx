import * as React from "react";
import styles from "./ChartTooltip.module.scss";

export interface ChartTooltipEntry {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: { [key: string]: unknown };
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: ChartTooltipEntry[];
  label?: string | number;
  /** Format the header label. */
  labelFormatter?: (label: string | number | undefined) => React.ReactNode;
  /** Format each row value. */
  valueFormatter?: (
    value: number | string | undefined,
    entry: ChartTooltipEntry,
  ) => React.ReactNode;
  /** Hide the header label row. */
  hideLabel?: boolean;
}

/**
 * ChartTooltip — glass, theme-aware custom tooltip for Recharts.
 * Pass as `content={<ChartTooltip ... />}` on a <Tooltip />.
 */
export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
  hideLabel,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={styles.tooltip} role="tooltip">
      {!hideLabel && label !== undefined && label !== "" && (
        <div className={styles.label}>
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <div className={styles.rows}>
        {payload.map((entry, i) => (
          <div className={styles.row} key={`${entry.dataKey}-${i}`}>
            <span
              className={styles.dot}
              style={{ background: entry.color || "var(--text-muted)" }}
            />
            {entry.name && <span className={styles.name}>{entry.name}</span>}
            <span className={styles.value}>
              {valueFormatter
                ? valueFormatter(entry.value, entry)
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

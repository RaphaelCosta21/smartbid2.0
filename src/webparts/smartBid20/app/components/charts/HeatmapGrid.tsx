import * as React from "react";
import styles from "./HeatmapGrid.module.scss";

export interface HeatmapColumn {
  key: string;
  label: string;
}

interface HeatmapGridProps {
  rows: string[];
  columns: HeatmapColumn[];
  /** Returns the value + sample count for a row/column intersection. */
  getCell: (row: string, colKey: string) => { value: number; count: number };
  maxValue: number;
  /** Rendered at the start of each row (e.g. a DivisionBadge). */
  renderRowLabel?: (row: string) => React.ReactNode;
  valueSuffix?: string;
  /** Low/high heat colors (value scales between them). */
  lowColor?: string;
  highColor?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function heatColor(t: number, low: string, high: string): string {
  const a = hexToRgb(low);
  const b = hexToRgb(high);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  const alpha = 0.16 + 0.62 * t;
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`;
}

/**
 * HeatmapGrid — CSS grid heatmap (e.g. Division × Phase average duration).
 */
export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  rows,
  columns,
  getCell,
  maxValue,
  renderRowLabel,
  valueSuffix = "",
  lowColor = "#10b981",
  highColor = "#ef4444",
}) => {
  const template = `minmax(120px, 1.2fr) repeat(${columns.length}, minmax(64px, 1fr))`;

  return (
    <div className={styles.scroll}>
      <div className={styles.grid} style={{ gridTemplateColumns: template }}>
        <div className={`${styles.cell} ${styles.corner}`} />
        {columns.map((c) => (
          <div className={`${styles.cell} ${styles.colHead}`} key={c.key}>
            {c.label}
          </div>
        ))}

        {rows.map((row) => (
          <React.Fragment key={row}>
            <div className={`${styles.cell} ${styles.rowHead}`}>
              {renderRowLabel ? renderRowLabel(row) : row}
            </div>
            {columns.map((c) => {
              const { value, count } = getCell(row, c.key);
              const t = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
              const empty = count === 0;
              return (
                <div
                  className={`${styles.cell} ${styles.dataCell} ${empty ? styles.empty : ""}`}
                  key={c.key}
                  style={
                    empty
                      ? undefined
                      : { background: heatColor(t, lowColor, highColor) }
                  }
                  title={
                    empty
                      ? "Sem dados"
                      : `${row} · ${c.label}: ${value}${valueSuffix} (${count})`
                  }
                >
                  {empty ? "—" : `${value}${valueSuffix}`}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

/**
 * DotStripPlot — values on one axis: one dot per observation, the highlighted one larger,
 * plus a dashed median line. Good for "where does this price sit among past BIDs".
 */
import * as React from "react";
import styles from "./DotStripPlot.module.scss";

export interface DotStripPoint {
  key: string;
  label: string;
  value: number;
  highlight?: boolean;
}

export interface DotStripPlotProps {
  points: DotStripPoint[];
  median?: number | null;
  format: (value: number) => string;
  /** Highlighted dot color (token or hex) */
  highlightColor?: string;
  highlightLabel?: string;
}

const MIN_GAP_PCT = 2.5;

export const DotStripPlot: React.FC<DotStripPlotProps> = ({
  points,
  median,
  format,
  highlightColor = "var(--primary-accent)",
  highlightLabel = "This BID",
}) => {
  const values = points.map((p) => p.value);
  if (median !== null && median !== undefined) values.push(median);
  if (values.length === 0) return null;
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo;
  const pos = (v: number): number =>
    span > 0 ? 6 + ((v - lo) / span) * 88 : 50;

  // Nudge dots that would overlap up and down so each stays visible
  const sorted = points.slice().sort((a, b) => a.value - b.value);
  const offsets: Record<string, number> = {};
  let lastLeft = -100;
  let lane = 0;
  sorted.forEach((p) => {
    const left = pos(p.value);
    lane = left - lastLeft < MIN_GAP_PCT ? (lane + 1) % 3 : 0;
    offsets[p.key] = lane === 0 ? 0 : lane === 1 ? -7 : 7;
    lastLeft = left;
  });
  const highlighted = points.find((p) => p.highlight);

  return (
    <div className={styles.root}>
      <div className={styles.plot}>
        <span className={styles.axis} />
        {median !== null && median !== undefined && (
          <span className={styles.median} style={{ left: `${pos(median)}%` }}>
            <span className={styles.medianLabel}>median {format(median)}</span>
          </span>
        )}
        {sorted.map((p) => (
          <span
            key={p.key}
            className={`${styles.dot} ${p.highlight ? styles.dotHighlight : ""}`}
            style={{
              left: `${pos(p.value)}%`,
              marginTop: offsets[p.key],
              ...(p.highlight ? { background: highlightColor } : {}),
            }}
            title={`${p.label} · ${format(p.value)}`}
          />
        ))}
        {highlighted && (
          <span
            className={styles.highlightLabel}
            style={{ left: `${pos(highlighted.value)}%`, color: highlightColor }}
          >
            {highlightLabel}
          </span>
        )}
      </div>
      <div className={styles.scale}>
        <span>{format(lo)}</span>
        <span>{format(hi)}</span>
      </div>
    </div>
  );
};

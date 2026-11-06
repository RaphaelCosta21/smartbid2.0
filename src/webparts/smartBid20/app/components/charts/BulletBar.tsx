/**
 * BulletBar — inline micro-chart: a value bar against a reference marker
 * (e.g. this BID's price vs. the historical median).
 */
import * as React from "react";
import styles from "./BulletBar.module.scss";

export interface BulletBarProps {
  value: number;
  /** Scale end (usually the largest value in the list) */
  max: number;
  reference?: number | null;
  /** Bar color (token or hex) */
  color?: string;
  height?: number;
  /** Accessible description */
  title?: string;
}

const pct = (v: number, max: number): number =>
  max > 0 ? Math.max(0, Math.min(100, (v / max) * 100)) : 0;

export const BulletBar: React.FC<BulletBarProps> = ({
  value,
  max,
  reference,
  color = "var(--primary-accent)",
  height = 6,
  title,
}) => (
  <div
    className={styles.track}
    style={{ height }}
    role="img"
    aria-label={title}
    title={title}
  >
    <span
      className={styles.fill}
      style={{ width: `${Math.max(2, pct(value, max))}%`, background: color }}
    />
    {reference !== null && reference !== undefined && reference > 0 && (
      <span
        className={styles.marker}
        style={{ left: `${pct(reference, max)}%`, height: height + 8 }}
      />
    )}
  </div>
);

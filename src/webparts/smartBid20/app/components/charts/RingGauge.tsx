/**
 * RingGauge — compact SVG ring: a split ("semi": half ring, e.g. CAPEX vs OPEX) or a
 * progress ("full": share of max, e.g. answered clarifications). Center content via children.
 */
import * as React from "react";
import styles from "./RingGauge.module.scss";

export interface RingGaugeSegment {
  key: string;
  value: number;
  /** Resolved color (hex) */
  color: string;
  label?: string;
}

export interface RingGaugeProps {
  segments: RingGaugeSegment[];
  /** Ring capacity; defaults to the sum of the segments */
  max?: number;
  variant?: "semi" | "full";
  size?: number;
  thickness?: number;
  /** Unfilled track (hex) */
  trackColor: string;
  children?: React.ReactNode;
}

const GAP_DEG = 2.5;

function point(cx: number, cy: number, r: number, deg: number): string {
  const rad = (deg * Math.PI) / 180;
  return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
}

/** Clockwise arc (SVG y-down: -90° is the top) */
function arc(cx: number, cy: number, r: number, from: number, to: number): string {
  const end = Math.min(to, from + 359.99);
  const large = end - from > 180 ? 1 : 0;
  return `M ${point(cx, cy, r, from)} A ${r} ${r} 0 ${large} 1 ${point(cx, cy, r, end)}`;
}

export const RingGauge: React.FC<RingGaugeProps> = ({
  segments,
  max,
  variant = "full",
  size = 120,
  thickness = 12,
  trackColor,
  children,
}) => {
  const semi = variant === "semi";
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const start = semi ? 180 : -90;
  const sweep = semi ? 180 : 360;
  const height = semi ? size / 2 + thickness / 2 + 2 : size;

  const visible = segments.filter((s) => s.value > 0);
  const capacity = Math.max(
    max !== undefined ? max : 0,
    visible.reduce((s, v) => s + v.value, 0),
    1e-9,
  );
  const gap = visible.length > 1 ? GAP_DEG : 0;
  // Round caps only for a single progress arc; adjacent split segments would overlap
  const cap = visible.length > 1 ? "butt" : "round";

  let cursor = start;
  const arcs = visible.map((s) => {
    const deg = (s.value / capacity) * sweep;
    const from = cursor + gap / 2;
    const to = cursor + deg - gap / 2;
    cursor += deg;
    return { ...s, from, to: Math.max(from + 0.5, to) };
  });

  return (
    <div
      className={`${styles.root} ${semi ? styles.semi : styles.full}`}
      style={{ width: size, height }}
    >
      <svg width={size} height={height} className={styles.svg}>
        <path
          d={arc(cx, cy, r, start, start + sweep)}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap={cap}
        />
        {arcs.map((a) => (
          <path
            key={a.key}
            d={arc(cx, cy, r, a.from, a.to)}
            fill="none"
            stroke={a.color}
            strokeWidth={thickness}
            strokeLinecap={cap}
          >
            {a.label && <title>{a.label}</title>}
          </path>
        ))}
      </svg>
      {children && <div className={styles.center}>{children}</div>}
    </div>
  );
};

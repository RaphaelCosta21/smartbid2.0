/**
 * WaterfallChart — how a total is built: floating bars per step, dashed connectors at the
 * running total, and a final total bar. Click (or Enter) on a step selects it.
 * Colors should be resolved values (hex) so the chart also renders in PDF captures.
 */
import * as React from "react";
import { useElementSize } from "../../hooks/useElementSize";
import { ChartTooltip } from "./ChartTooltip";
import styles from "./WaterfallChart.module.scss";

export interface WaterfallStep {
  key: string;
  label: string;
  value: number;
  color: string;
}

export interface WaterfallChartProps {
  steps: WaterfallStep[];
  total: { label: string; value: number; color: string; colorTo?: string };
  /** Short label above each bar (e.g. compact currency) */
  formatLabel: (value: number) => string;
  /** Full value in the tooltip */
  formatValue: (value: number) => string;
  height?: number;
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  /** Muted line color (hex) */
  mutedColor: string;
  gridColor: string;
  /** Value labels above the bars (hex, kept as attributes for PDF capture) */
  labelColor: string;
  textColor: string;
}

const TOP = 30;
const BOTTOM = 8;
const TOTAL_KEY = "__total";
let gradientSeq = 0;

export const WaterfallChart: React.FC<WaterfallChartProps> = ({
  steps,
  total,
  formatLabel,
  formatValue,
  height = 240,
  selectedKey,
  onSelect,
  mutedColor,
  gridColor,
  labelColor,
  textColor,
}) => {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const [hover, setHover] = React.useState<number | null>(null);
  const gradientId = React.useMemo(() => `wf-total-${++gradientSeq}`, []);

  const bars = React.useMemo(() => {
    let cum = 0;
    const out = steps.map((s) => {
      const start = cum;
      cum += s.value;
      return { ...s, start, end: cum, isTotal: false };
    });
    out.push({
      key: TOTAL_KEY,
      label: total.label,
      value: total.value,
      color: total.color,
      start: 0,
      end: total.value,
      isTotal: true,
    });
    return out;
  }, [steps, total]);

  const width = size.width;
  const plotH = height - TOP - BOTTOM;
  const maxV = Math.max(
    1,
    ...bars.map((b) => Math.max(b.start, b.end)),
  );
  const y = (v: number): number => TOP + plotH * (1 - Math.max(0, v) / maxV);
  const band = bars.length > 0 ? width / bars.length : 0;
  const barW = Math.min(band * 0.58, 76);
  const xOf = (i: number): number => i * band + (band - barW) / 2;

  const activate = (key: string): void => {
    if (onSelect && key !== TOTAL_KEY) onSelect(key);
  };

  const hovered = hover !== null ? bars[hover] : null;

  return (
    <div className={styles.root}>
      <div ref={ref} className={styles.plot} style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} className={styles.svg}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={total.color} />
                <stop offset="100%" stopColor={total.colorTo || total.color} />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((f) => (
              <line
                key={f}
                x1={0}
                x2={width}
                y1={y(maxV * f)}
                y2={y(maxV * f)}
                stroke={gridColor}
                strokeDasharray="2 4"
              />
            ))}
            <line
              x1={0}
              x2={width}
              y1={y(0)}
              y2={y(0)}
              stroke={mutedColor}
              strokeOpacity={0.5}
            />
            {bars.map((b, i) => {
              const top = y(Math.max(b.start, b.end));
              const h = Math.max(2, Math.abs(y(b.start) - y(b.end)));
              const x = xOf(i);
              const next = bars[i + 1];
              const dim =
                (hover !== null && hover !== i) ||
                (!!selectedKey && selectedKey !== b.key && hover === null);
              const clickable = !!onSelect && !b.isTotal;
              return (
                <g
                  key={b.key}
                  className={clickable ? styles.step : styles.stepStatic}
                  role={clickable ? "button" : undefined}
                  tabIndex={clickable ? 0 : undefined}
                  aria-label={`${b.label}: ${formatValue(b.value)}`}
                  onClick={() => activate(b.key)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activate(b.key);
                    }
                  }}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                >
                  <rect
                    x={i * band}
                    y={0}
                    width={band}
                    height={height}
                    fill="transparent"
                  />
                  {next && !next.isTotal && (
                    <line
                      x1={x + barW}
                      x2={xOf(i + 1)}
                      y1={y(b.end)}
                      y2={y(b.end)}
                      stroke={mutedColor}
                      strokeDasharray="3 3"
                      strokeOpacity={0.7}
                    />
                  )}
                  <rect
                    x={x}
                    y={top}
                    width={barW}
                    height={h}
                    rx={6}
                    fill={b.isTotal ? `url(#${gradientId})` : b.color}
                    opacity={dim ? 0.4 : 1}
                    className={styles.bar}
                  />
                  {selectedKey === b.key && (
                    <rect
                      x={x - 3}
                      y={top - 3}
                      width={barW + 6}
                      height={h + 6}
                      rx={8}
                      fill="none"
                      stroke={b.color}
                      strokeWidth={1.5}
                    />
                  )}
                  <text
                    x={x + barW / 2}
                    y={top - 8}
                    textAnchor="middle"
                    className={styles.value}
                    fill={b.isTotal ? textColor : labelColor}
                    fontSize={b.isTotal ? 12.5 : 11.5}
                    fontWeight={b.isTotal ? 700 : 600}
                    opacity={dim ? 0.5 : 1}
                  >
                    {b.isTotal
                      ? formatLabel(b.value)
                      : `${b.value < 0 ? "−" : "+"}${formatLabel(Math.abs(b.value))}`}
                  </text>
                </g>
              );
            })}
          </svg>
        )}
        {hovered && width > 0 && (
          <div
            className={styles.tooltip}
            style={{
              left: Math.min(
                Math.max(hover! * band + band / 2, 80),
                width - 80,
              ),
              top: Math.max(4, y(Math.max(hovered.start, hovered.end)) - 64),
            }}
          >
            <ChartTooltip
              active
              label={hovered.label}
              payload={[
                {
                  name: hovered.isTotal ? "Total" : "Adds",
                  value: hovered.value,
                  color: hovered.color,
                },
                ...(hovered.isTotal
                  ? []
                  : [
                      {
                        name: "Running total",
                        value: hovered.end,
                        color: mutedColor,
                      },
                    ]),
              ]}
              valueFormatter={(v) => formatValue(Number(v))}
            />
          </div>
        )}
      </div>
      <div
        className={styles.labels}
        style={{ gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))` }}
      >
        {bars.map((b) => (
          <div
            key={b.key}
            className={`${styles.label} ${b.isTotal ? styles.labelTotal : ""}`}
          >
            <span className={styles.labelName} title={b.label}>
              {b.label}
            </span>
            <span className={styles.labelPct}>
              {b.isTotal || total.value <= 0
                ? "100%"
                : `${((b.value / total.value) * 100).toFixed(0)}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

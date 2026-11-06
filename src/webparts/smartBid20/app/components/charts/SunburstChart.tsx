/**
 * SunburstChart — two-level part-to-whole: groups on the inner ring, their children on
 * the outer ring (same hue, fading by rank). Click a segment to select it.
 */
import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import styles from "./SunburstChart.module.scss";

export interface SunburstChild {
  key: string;
  label: string;
  value: number;
}

export interface SunburstGroup {
  key: string;
  label: string;
  value: number;
  /** Resolved color (hex) */
  color: string;
  children: SunburstChild[];
}

export interface SunburstChartProps {
  groups: SunburstGroup[];
  formatValue: (value: number) => string;
  centerValue: string;
  centerLabel: string;
  height?: number;
  /** Segment separator — the card background (hex) */
  borderColor: string;
  /** Outline of the selected segment (hex) */
  highlightColor: string;
  /** "<group>" or "<group>::<child>" */
  selectedKey?: string | null;
  onSelect?: (groupKey: string, childKey: string | null) => void;
}

interface IOuterSlice {
  key: string;
  label: string;
  value: number;
  color: string;
  opacity: number;
  groupKey: string;
  childKey: string;
}

export const SunburstChart: React.FC<SunburstChartProps> = ({
  groups,
  formatValue,
  centerValue,
  centerLabel,
  height = 220,
  borderColor,
  highlightColor,
  selectedKey,
  onSelect,
}) => {
  const outer = React.useMemo(() => {
    const slices: IOuterSlice[] = [];
    groups.forEach((g) => {
      const n = g.children.length;
      g.children.forEach((c, i) => {
        slices.push({
          key: `${g.key}::${c.key}`,
          label: `${g.label} · ${c.label}`,
          value: c.value,
          color: g.color,
          opacity: Math.max(0.35, 0.92 - (n > 1 ? (i * 0.55) / (n - 1) : 0)),
          groupKey: g.key,
          childKey: c.key,
        });
      });
    });
    return slices;
  }, [groups]);

  const tooltip = (
    <Tooltip
      content={
        <ChartTooltip
          hideLabel
          valueFormatter={(v) => formatValue(Number(v))}
        />
      }
    />
  );

  return (
    <div className={styles.root} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {tooltip}
          <Pie
            data={groups}
            dataKey="value"
            nameKey="label"
            innerRadius="40%"
            outerRadius="62%"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
            onClick={(_: unknown, index: number) => {
              const g = groups[index];
              if (g && onSelect) onSelect(g.key, null);
            }}
          >
            {groups.map((g) => (
              <Cell
                key={g.key}
                fill={g.color}
                stroke={selectedKey === g.key ? highlightColor : borderColor}
                strokeWidth={selectedKey === g.key ? 3 : 2}
                cursor={onSelect ? "pointer" : undefined}
              />
            ))}
          </Pie>
          <Pie
            data={outer}
            dataKey="value"
            nameKey="label"
            innerRadius="66%"
            outerRadius="94%"
            startAngle={90}
            endAngle={-270}
            isAnimationActive={false}
            onClick={(_: unknown, index: number) => {
              const s = outer[index];
              if (s && onSelect) onSelect(s.groupKey, s.childKey);
            }}
          >
            {outer.map((s) => (
              <Cell
                key={s.key}
                fill={s.color}
                fillOpacity={s.opacity}
                stroke={selectedKey === s.key ? highlightColor : borderColor}
                strokeWidth={2}
                cursor={onSelect ? "pointer" : undefined}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className={styles.center} aria-hidden>
        <span className={styles.centerValue}>{centerValue}</span>
        <span className={styles.centerLabel}>{centerLabel}</span>
      </div>
    </div>
  );
};

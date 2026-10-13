/**
 * ParetoChart — cost bars with a cumulative-% line and the 80% reference, like the
 * Reports pages. Clicking a bar selects that item.
 */
import * as React from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "../../hooks/useChartTheme";
import { IParetoRow } from "../../utils/bidPresentation";
import { formatCurrency, formatCurrencyCompact } from "../../utils/formatters";
import { ChartTooltip } from "./ChartTooltip";
import styles from "./ParetoChart.module.scss";

export interface ParetoChartProps {
  data: IParetoRow[];
  currency: "USD" | "BRL";
  selectedKey?: string | null;
  onSelect?: (key: string) => void;
  height?: number;
}

const COLUMN_WIDTH = 44;

export const ParetoChart: React.FC<ParetoChartProps> = ({
  data,
  currency,
  selectedKey,
  onSelect,
  height = 340,
}) => {
  const theme = useChartTheme();
  if (data.length === 0) return null;

  const byRank: Record<number, IParetoRow> = {};
  data.forEach((d) => {
    byRank[d.rank] = d;
  });
  const tick = { fill: theme.tick, fontSize: 12 };

  return (
    <div className={styles.scroll}>
      <div style={{ minWidth: data.length * COLUMN_WIDTH }}>
        <ResponsiveContainer width="100%" height={height}>
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, bottom: 4, left: 8 }}
          >
            <CartesianGrid vertical={false} stroke={theme.grid} />
            <XAxis
              dataKey="rank"
              tickFormatter={(v: number) => `#${v}`}
              tick={tick}
              interval={0}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="cost"
              tickFormatter={(v: number) => formatCurrencyCompact(v, currency)}
              tick={tick}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <YAxis
              yAxisId="pct"
              orientation="right"
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(v: number) => `${v}%`}
              tick={tick}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip
              cursor={{ fill: theme.referenceFill }}
              content={
                <ChartTooltip
                  labelFormatter={(l) => {
                    const d = byRank[Number(l)];
                    return d ? `#${d.rank} · ${d.label}` : l;
                  }}
                  valueFormatter={(value, entry) =>
                    entry.dataKey === "pct"
                      ? `${Number(value).toFixed(1)}%`
                      : formatCurrency(Number(value), currency)
                  }
                />
              }
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: theme.textSecondary }}
            />
            <ReferenceLine
              yAxisId="pct"
              y={80}
              stroke={theme.danger}
              strokeDasharray="4 4"
              label={{
                value: "80%",
                position: "insideTopLeft",
                fill: theme.danger,
                fontSize: 11,
              }}
            />
            <Bar
              yAxisId="cost"
              dataKey="value"
              name="Cost"
              fill={theme.accent}
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              cursor={onSelect ? "pointer" : undefined}
              onClick={(_: unknown, i: number) => {
                const d = data[i];
                if (onSelect && d) onSelect(d.key);
              }}
            >
              {data.map((d) => (
                <Cell
                  key={d.key}
                  fill={d.pct <= 80 ? theme.accent : theme.textMuted}
                  stroke={
                    selectedKey && d.key === selectedKey
                      ? theme.textPrimary
                      : undefined
                  }
                  strokeWidth={selectedKey && d.key === selectedKey ? 2 : 0}
                />
              ))}
            </Bar>
            <Line
              yAxisId="pct"
              type="monotone"
              dataKey="pct"
              name="Cumulative %"
              stroke={theme.danger}
              strokeWidth={2}
              dot={{ r: 3, fill: theme.danger, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

import * as React from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  /** Draw a soft gradient area under the line. */
  filled?: boolean;
}

/**
 * Sparkline — tiny, axis-less trend line for KPI cards.
 */
export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = "#00c9a7",
  height = 40,
  filled = true,
}) => {
  const gradientId = React.useMemo(
    () => `spark-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  const chartData = React.useMemo(
    () => data.map((v, i) => ({ i, v: Number.isFinite(v) ? v : 0 })),
    [data],
  );

  if (!data || data.length < 2) {
    return <div style={{ height }} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 3, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={color}
              stopOpacity={filled ? 0.32 : 0}
            />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

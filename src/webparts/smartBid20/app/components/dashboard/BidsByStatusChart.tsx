import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "../common/GlassCard";
import { ChartTooltip } from "../charts/ChartTooltip";
import { useChartTheme } from "../../hooks/useChartTheme";

interface BidsByStatusChartProps {
  data: { status: string; count: number; color: string }[];
  className?: string;
}

export const BidsByStatusChart: React.FC<BidsByStatusChartProps> = ({
  data,
  className,
}) => {
  const chart = useChartTheme();
  const axisTick = { fill: chart.tick, fontSize: 12 };
  const height = Math.max(200, data.length * 38);

  return (
    <GlassCard
      title="BIDs by Status"
      subtitle="Active BIDs by current status"
      accentColor={chart.accent}
      className={className}
    >
      {data.length === 0 ? (
        <div style={{ padding: 24, color: "var(--text-muted)", fontSize: 13 }}>
          No active BIDs.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 44, bottom: 4, left: 8 }}
          >
            <CartesianGrid horizontal={false} stroke={chart.grid} />
            <XAxis
              type="number"
              allowDecimals={false}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="status"
              width={140}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: chart.referenceFill }}
              content={<ChartTooltip />}
            />
            <Bar dataKey="count" name="BIDs" radius={[0, 6, 6, 0]} barSize={18}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                fill={chart.textSecondary}
                fontSize={11}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
};

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "../common/GlassCard";
import { ChartTooltip } from "../charts/ChartTooltip";
import { useChartTheme } from "../../hooks/useChartTheme";

export interface UrgencyChartRow {
  priority: string;
  onTrack: number;
  overdue: number;
  total: number;
}

interface BidsByUrgencyChartProps {
  data: UrgencyChartRow[];
  /** e.g. "Urgent 0-4 bd · Normal 5-14 bd · Low 15+ bd" */
  rulesLabel: string;
  className?: string;
}

export const BidsByUrgencyChart: React.FC<BidsByUrgencyChartProps> = ({
  data,
  rulesLabel,
  className,
}) => {
  const chart = useChartTheme();
  const axisTick = { fill: chart.tick, fontSize: 12 };
  const hasData = data.some((d) => d.total > 0);

  return (
    <GlassCard
      title="Open BIDs by Urgency"
      subtitle={`Lead time at request: ${rulesLabel}`}
      accentColor={chart.danger}
      className={className}
    >
      {!hasData ? (
        <div style={{ padding: 24, color: "var(--text-muted)", fontSize: 13 }}>
          No active BIDs.
        </div>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={Math.max(200, data.length * 56)}
        >
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
              dataKey="priority"
              width={90}
              tick={axisTick}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: chart.referenceFill }}
              content={<ChartTooltip />}
            />
            <Legend
              wrapperStyle={{ fontSize: 12, color: chart.textSecondary }}
            />
            <Bar
              dataKey="onTrack"
              name="On track"
              stackId="urgency"
              fill={chart.accentSecondary}
              barSize={20}
            />
            <Bar
              dataKey="overdue"
              name="Overdue"
              stackId="urgency"
              fill={chart.danger}
              radius={[0, 6, 6, 0]}
              barSize={20}
            >
              <LabelList
                dataKey="total"
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

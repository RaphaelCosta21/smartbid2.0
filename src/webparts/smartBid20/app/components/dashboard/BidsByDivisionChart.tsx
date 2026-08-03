import * as React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "../common/GlassCard";
import { ChartTooltip } from "../charts/ChartTooltip";
import { useChartTheme } from "../../hooks/useChartTheme";

interface BidsByDivisionChartProps {
  data: { division: string; count: number; color: string }[];
  className?: string;
}

export const BidsByDivisionChart: React.FC<BidsByDivisionChartProps> = ({
  data,
  className,
}) => {
  const chart = useChartTheme();
  const slices = data.filter((d) => d.count > 0);
  const total = slices.reduce((sum, d) => sum + d.count, 0);

  return (
    <GlassCard
      title="BIDs by Division"
      subtitle="Active BIDs by division"
      accentColor={chart.accentTertiary}
      className={className}
    >
      {total === 0 ? (
        <div style={{ padding: 24, color: "var(--text-muted)", fontSize: 13 }}>
          No active BIDs.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Tooltip content={<ChartTooltip hideLabel />} />
            <Pie
              data={slices}
              dataKey="count"
              nameKey="division"
              innerRadius={66}
              outerRadius={98}
              paddingAngle={2}
              strokeWidth={0}
            >
              {slices.map((d) => (
                <Cell key={d.division} fill={d.color} />
              ))}
              <Label
                content={(props: {
                  viewBox?: { cx?: number; cy?: number };
                }) => {
                  const vb = props.viewBox || { cx: 0, cy: 0 };
                  return (
                    <g>
                      <text
                        x={vb.cx}
                        y={(vb.cy || 0) - 4}
                        textAnchor="middle"
                        fill={chart.textPrimary}
                        style={{ fontSize: 26, fontWeight: 800 }}
                      >
                        {total}
                      </text>
                      <text
                        x={vb.cx}
                        y={(vb.cy || 0) + 16}
                        textAnchor="middle"
                        fill={chart.textMuted}
                        style={{ fontSize: 11 }}
                      >
                        Total
                      </text>
                    </g>
                  );
                }}
              />
            </Pie>
            <Legend
              wrapperStyle={{ fontSize: 12, color: chart.textSecondary }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </GlassCard>
  );
};

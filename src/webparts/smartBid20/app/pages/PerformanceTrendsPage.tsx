import * as React from "react";
import {
  ComposedChart,
  AreaChart,
  LineChart,
  BarChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Brush,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { Sparkline } from "../components/charts/Sparkline";
import { AIInsightsPanel } from "../components/insights/AIInsightsPanel";
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import {
  SegmentedControl,
  SegmentOption,
} from "../components/insights/SegmentedControl";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { useConfigStore } from "../stores/useConfigStore";
import { DEFAULT_KPI_TARGETS } from "../config/kpi.config";
import {
  Granularity,
  volumeTrend,
  completionTimeTrend,
  winRateTrend,
  otdTrend,
  periodDelta,
  Delta,
} from "../utils/analyticsHelpers";
import { formatPercentage } from "../utils/formatters";
import styles from "./PerformanceTrendsPage.module.scss";

const GRAN_SEGMENTS: SegmentOption<Granularity>[] = [
  { value: "week", label: "Semana" },
  { value: "month", label: "Mês" },
  { value: "quarter", label: "Trim." },
];

const MS_DAY = 86400000;

function lastDelta(arr: number[]): Delta {
  if (arr.length < 2) return { value: 0, direction: "neutral", percent: 0 };
  return periodDelta(arr[arr.length - 1], arr[arr.length - 2]);
}

export const PerformanceTrendsPage: React.FC = () => {
  const { bids } = useBids();
  const chart = useChartTheme();
  const config = useConfigStore((s) => s.config);
  const { filters, patch, setPreset, reset, applyFilters, hasActive } =
    useAnalyticsFilters();

  const [gran, setGran] = React.useState<Granularity>("month");
  const [otdMode, setOtdMode] = React.useState<"count" | "percent">("count");

  const divisions = React.useMemo(
    () =>
      (config?.divisions || [])
        .filter((d) => d.isActive !== false)
        .map((d) => ({ value: d.value, label: d.label, color: d.color })),
    [config],
  );
  const serviceLines = React.useMemo(
    () =>
      (config?.serviceLines || [])
        .filter((s) => s.isActive !== false)
        .map((s) => ({ value: s.value, label: s.label })),
    [config],
  );

  const filtered = React.useMemo(
    () => applyFilters(bids, "createdDate"),
    [bids, applyFilters],
  );

  const vol = React.useMemo(
    () => volumeTrend(filtered, gran),
    [filtered, gran],
  );
  const comp = React.useMemo(
    () => completionTimeTrend(filtered, gran),
    [filtered, gran],
  );
  const win = React.useMemo(
    () => winRateTrend(filtered, gran),
    [filtered, gran],
  );
  const otd = React.useMemo(() => otdTrend(filtered, gran), [filtered, gran]);

  const createdSpark = vol.map((p) => p.created);
  const compSpark = comp.map((p) => p.avgDays);
  const winSpark = win.map((p) => p.winRate);
  const otdSpark = otd.map((p) => p.otdRate);

  const stats = React.useMemo(() => {
    const completed = filtered.filter((b) => b.completedDate && b.createdDate);
    const avgCompletion = completed.length
      ? Math.round(
          completed.reduce(
            (s, b) =>
              s +
              (new Date(b.completedDate as string).getTime() -
                new Date(b.createdDate).getTime()) /
                MS_DAY,
            0,
          ) / completed.length,
        )
      : 0;
    const decided = filtered.filter(
      (b) => b.bidResult?.outcome === "Won" || b.bidResult?.outcome === "Loss",
    );
    const won = decided.filter((b) => b.bidResult?.outcome === "Won").length;
    const winRate = decided.length
      ? Math.round((won / decided.length) * 100)
      : 0;
    const otdBase = completed.filter((b) => b.desiredDueDate || b.dueDate);
    const onTime = otdBase.filter(
      (b) =>
        new Date(b.completedDate as string).getTime() <=
        new Date(b.desiredDueDate || b.dueDate).getTime() + MS_DAY,
    ).length;
    const otdRate = otdBase.length
      ? Math.round((onTime / otdBase.length) * 100)
      : 0;
    return { total: filtered.length, avgCompletion, winRate, otdRate };
  }, [filtered]);

  const volDelta = lastDelta(vol.map((p) => p.created));
  const winDelta = lastDelta(win.map((p) => p.winRate));
  const otdDelta = lastDelta(otd.map((p) => p.otdRate));

  const axisTick = { fill: chart.tick, fontSize: 12 };
  const legendStyle = { fontSize: 12, color: chart.textSecondary };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Performance Trends"
        subtitle="Tendências de volume, conclusão, win rate e entregas no prazo"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
          </svg>
        }
      />

      <AnalyticsFilterBar
        filters={filters}
        onPatch={patch}
        onPreset={setPreset}
        onReset={reset}
        hasActive={hasActive}
        divisions={divisions}
        serviceLines={serviceLines}
        rightSlot={
          <SegmentedControl<Granularity>
            value={gran}
            segments={GRAN_SEGMENTS}
            onChange={setGran}
            size="sm"
            ariaLabel="Granularidade"
          />
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          variant="glass"
          title="Nenhum BID no filtro atual"
          description="Ajuste o período ou os filtros para visualizar as tendências."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              label="Total de BIDs"
              value={stats.total}
              variant="glass"
              accentColor={chart.accentSecondary}
              trend={{
                value: String(Math.abs(volDelta.value)),
                direction: volDelta.direction,
              }}
              subtitle="criados no período"
              sparkline={
                <Sparkline
                  data={createdSpark}
                  color={chart.accentSecondary}
                  height={34}
                />
              }
            />
            <KPICard
              label="Tempo Médio de Conclusão"
              value={`${stats.avgCompletion}d`}
              variant="glass"
              accentColor={chart.accentTertiary}
              subtitle={`meta ${DEFAULT_KPI_TARGETS.targetAvgCompletionDays}d`}
              sparkline={
                <Sparkline
                  data={compSpark}
                  color={chart.accentTertiary}
                  height={34}
                />
              }
            />
            <KPICard
              label="Win Rate"
              value={formatPercentage(stats.winRate)}
              variant="glass"
              accentColor={chart.success}
              trend={{
                value: `${Math.abs(winDelta.value)}`,
                direction: winDelta.direction,
              }}
              subtitle={`meta ${DEFAULT_KPI_TARGETS.targetWinRate}%`}
              sparkline={
                <Sparkline data={winSpark} color={chart.success} height={34} />
              }
            />
            <KPICard
              label="On-Time Delivery"
              value={formatPercentage(stats.otdRate)}
              variant="glass"
              accentColor={chart.info}
              trend={{
                value: `${Math.abs(otdDelta.value)}`,
                direction: otdDelta.direction,
              }}
              subtitle={`meta ${DEFAULT_KPI_TARGETS.targetOnTimeDelivery}%`}
              sparkline={
                <Sparkline data={otdSpark} color={chart.info} height={34} />
              }
            />
          </div>

          <GlassCard
            title="Volume de BIDs"
            subtitle="Criados vs. concluídos ao longo do tempo"
            accentColor={chart.accentSecondary}
            className={styles.spanAll}
          >
            <ResponsiveContainer width="100%" height={320}>
              <ComposedChart
                data={vol}
                margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
              >
                <defs>
                  <linearGradient id="volArea" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={chart.accentSecondary}
                      stopOpacity={0.32}
                    />
                    <stop
                      offset="100%"
                      stopColor={chart.accentSecondary}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={chart.grid} />
                <XAxis
                  dataKey="period"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={legendStyle} />
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Criados"
                  stroke={chart.accentSecondary}
                  strokeWidth={2}
                  fill="url(#volArea)"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Concluídos"
                  stroke={chart.accent}
                  strokeWidth={2}
                  dot={false}
                />
                <Brush
                  dataKey="period"
                  height={22}
                  travellerWidth={8}
                  stroke={chart.accentSecondary}
                  fill="transparent"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </GlassCard>

          <div className={styles.chartsGrid}>
            <GlassCard
              title="Tempo Médio de Conclusão"
              subtitle="Dias da criação à conclusão"
              accentColor={chart.accentTertiary}
            >
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={comp}
                  margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
                >
                  <CartesianGrid vertical={false} stroke={chart.grid} />
                  <XAxis
                    dataKey="period"
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={
                      <ChartTooltip valueFormatter={(v) => `${v} dias`} />
                    }
                  />
                  <ReferenceLine
                    y={DEFAULT_KPI_TARGETS.targetAvgCompletionDays}
                    stroke={chart.warning}
                    strokeDasharray="5 4"
                    label={{
                      value: `Meta ${DEFAULT_KPI_TARGETS.targetAvgCompletionDays}d`,
                      position: "insideTopRight",
                      fill: chart.textMuted,
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDays"
                    name="Dias médios"
                    stroke={chart.accentTertiary}
                    strokeWidth={2.5}
                    dot={{ r: 3, strokeWidth: 0, fill: chart.accentTertiary }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard
              title="Win Rate"
              subtitle="Percentual de BIDs ganhos entre os decididos"
              accentColor={chart.success}
            >
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart
                  data={win}
                  margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
                >
                  <defs>
                    <linearGradient id="winArea" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={chart.success}
                        stopOpacity={0.34}
                      />
                      <stop
                        offset="100%"
                        stopColor={chart.success}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={chart.grid} />
                  <XAxis
                    dataKey="period"
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    content={<ChartTooltip valueFormatter={(v) => `${v}%`} />}
                  />
                  <ReferenceLine
                    y={DEFAULT_KPI_TARGETS.targetWinRate}
                    stroke={chart.warning}
                    strokeDasharray="5 4"
                    label={{
                      value: `Meta ${DEFAULT_KPI_TARGETS.targetWinRate}%`,
                      position: "insideTopRight",
                      fill: chart.textMuted,
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="winRate"
                    name="Win rate"
                    stroke={chart.success}
                    strokeWidth={2.5}
                    fill="url(#winArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <GlassCard
            title="Entregas no Prazo (OTD)"
            subtitle="No prazo vs. atrasadas, por período de conclusão"
            accentColor={chart.info}
            className={styles.spanAll}
            actions={
              <SegmentedControl<"count" | "percent">
                value={otdMode}
                segments={[
                  { value: "count", label: "Qtd" },
                  { value: "percent", label: "%" },
                ]}
                onChange={setOtdMode}
                size="sm"
                ariaLabel="Modo OTD"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={otd}
                stackOffset={otdMode === "percent" ? "expand" : "none"}
                margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
              >
                <CartesianGrid vertical={false} stroke={chart.grid} />
                <XAxis
                  dataKey="period"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickFormatter={
                    otdMode === "percent"
                      ? (v) => `${Math.round(v * 100)}%`
                      : undefined
                  }
                />
                <Tooltip
                  cursor={{ fill: chart.referenceFill }}
                  content={<ChartTooltip />}
                />
                <Legend wrapperStyle={legendStyle} />
                <Bar
                  dataKey="onTime"
                  name="No prazo"
                  stackId="otd"
                  fill={chart.success}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
                <Bar
                  dataKey="late"
                  name="Atrasadas"
                  stackId="otd"
                  fill={chart.danger}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={44}
                />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <AIInsightsPanel
            className={styles.spanAll}
            description="Quando os recursos de IA estiverem disponíveis, esta seção fará previsão de tendências e antecipará desvios de volume, prazo e win rate."
            features={[
              "Forecast de volume de BIDs",
              "Previsão de prazo de conclusão",
              "Projeção de win rate",
              "Alertas de desvio",
            ]}
          />
        </>
      )}
    </div>
  );
};

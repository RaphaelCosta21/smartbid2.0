import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { Sparkline } from "../components/charts/Sparkline";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useKPIs } from "../hooks/useKPIs";
import { useStatusColors } from "../hooks/useStatusColors";
import { useConfigStore } from "../stores/useConfigStore";
import { ROUTES } from "../config/routes.config";
import { formatPercentage, formatCurrencyCompact } from "../utils/formatters";
import {
  volumeTrend,
  completionTimeTrend,
  divisionLoad,
  periodDelta,
  lastTwoSum,
} from "../utils/analyticsHelpers";
import styles from "./AnalyticsPage.module.scss";

interface PreviewDef {
  key: string;
  route: string;
  title: string;
  description: string;
  color: string;
  series: number[];
  icon: React.ReactNode;
}

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const kpis = useKPIs();
  const chart = useChartTheme();
  const { getDivisionColor } = useStatusColors();
  const config = useConfigStore((s) => s.config);

  const divisionLabel = React.useCallback(
    (value: string): string => {
      const d = (config?.divisions || []).find((x) => x.value === value);
      return d?.label || value;
    },
    [config],
  );

  const monthlyVolume = React.useMemo(() => volumeTrend(bids, "month"), [bids]);
  const completionSeries = React.useMemo(
    () => completionTimeTrend(bids, "month").map((p) => p.avgDays),
    [bids],
  );
  const divLoad = React.useMemo(() => divisionLoad(bids), [bids]);

  const createdSeries = monthlyVolume.map((p) => p.created);
  const completedSeries = monthlyVolume.map((p) => p.completed);

  const volumeDelta = React.useMemo(() => {
    const [recent, prior] = lastTwoSum(createdSeries, 1);
    return periodDelta(recent, prior);
  }, [createdSeries]);

  const previews: PreviewDef[] = [
    {
      key: "performance",
      route: ROUTES.performanceTrends,
      title: "Performance Trends",
      description:
        "Volume, tempo médio de conclusão, win rate e entregas no prazo ao longo do tempo.",
      color: chart.accentSecondary,
      series: createdSeries,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M17 7h4v4" />
        </svg>
      ),
    },
    {
      key: "bottleneck",
      route: ROUTES.bottleneckAnalysis,
      title: "Bottleneck Analysis",
      description:
        "Tempo por fase e status, BIDs mais demorados e carga por divisão.",
      color: chart.warning,
      series: completionSeries,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 2h4M12 2v6M6 8h12l-2 6a4 4 0 01-8 0L6 8z" />
          <path d="M8 22h8" />
        </svg>
      ),
    },
    {
      key: "team",
      route: ROUTES.teamAnalytics,
      title: "Team Analytics",
      description:
        "Desempenho e carga da equipe: BIDs por owner, entrega média e balanceamento.",
      color: chart.accent,
      series: completedSeries,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];

  const chartHeight = Math.max(180, divLoad.length * 46);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Analytics"
        subtitle="Visão geral de desempenho, gargalos e equipe"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        }
      />

      {bids.length === 0 ? (
        <EmptyState
          variant="glass"
          title="Sem BIDs para analisar"
          description="Assim que houver BIDs registrados, os indicadores e gráficos aparecerão aqui."
        />
      ) : (
        <>
          <div className={styles.heroGrid}>
            <KPICard
              label="Total de BIDs"
              value={kpis.totalBids}
              variant="glass"
              accentColor={chart.accentSecondary}
              trend={{
                value: `${Math.abs(volumeDelta.value)}`,
                direction: volumeDelta.direction,
              }}
              subtitle="no período carregado"
              sparkline={
                <Sparkline
                  data={createdSeries}
                  color={chart.accentSecondary}
                  height={34}
                />
              }
            />
            <KPICard
              label="Em Andamento"
              value={kpis.activeBids}
              variant="glass"
              accentColor={chart.accent}
              subtitle="BIDs ativos"
            />
            <KPICard
              label="Win Rate"
              value={formatPercentage(kpis.winRate)}
              variant="glass"
              accentColor={chart.success}
              subtitle="won / decididos"
            />
            <KPICard
              label="Ciclo Médio"
              value={`${Math.round(kpis.avgCycleTimeDays)}d`}
              variant="glass"
              accentColor={chart.accentTertiary}
              subtitle="criação → conclusão"
              sparkline={
                <Sparkline
                  data={completionSeries}
                  color={chart.accentTertiary}
                  height={34}
                />
              }
            />
            <KPICard
              label="Taxa de Atraso"
              value={formatPercentage(kpis.overdueRate)}
              variant="glass"
              accentColor={chart.danger}
              subtitle="dos BIDs ativos"
            />
            <KPICard
              label="Pipeline"
              value={formatCurrencyCompact(kpis.totalPipelineValueUSD)}
              variant="glass"
              accentColor={chart.info}
              subtitle="valor estimado ativo"
            />
          </div>

          <div className={styles.previewGrid}>
            {previews.map((p) => (
              <div
                key={p.key}
                className={styles.previewCard}
                role="button"
                tabIndex={0}
                onClick={() => navigate(p.route)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(p.route);
                }}
              >
                <div
                  className={styles.previewSheen}
                  style={{ background: p.color }}
                />
                <div className={styles.previewHead}>
                  <span
                    className={styles.previewIcon}
                    style={{ background: `${p.color}1f`, color: p.color }}
                  >
                    {p.icon}
                  </span>
                  <span className={styles.previewArrow}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
                <div className={styles.previewTitle}>{p.title}</div>
                <div className={styles.previewDesc}>{p.description}</div>
                <div className={styles.previewSpark}>
                  <Sparkline data={p.series} color={p.color} height={44} />
                </div>
              </div>
            ))}
          </div>

          <GlassCard
            title="Carga por Divisão"
            titleIcon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            }
          >
            {divLoad.length === 0 ? (
              <EmptyState title="Nenhum BID ativo" />
            ) : (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart
                  data={divLoad}
                  layout="vertical"
                  margin={{ left: 8, right: 28, top: 4, bottom: 4 }}
                >
                  <CartesianGrid horizontal={false} stroke={chart.grid} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: chart.tick, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="division"
                    tick={{ fill: chart.tick, fontSize: 12 }}
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={divisionLabel}
                  />
                  <Tooltip
                    cursor={{ fill: chart.referenceFill }}
                    content={
                      <ChartTooltip
                        labelFormatter={(l) => divisionLabel(String(l))}
                      />
                    }
                  />
                  <Bar
                    dataKey="active"
                    name="Ativos"
                    radius={[0, 6, 6, 0]}
                    barSize={22}
                  >
                    {divLoad.map((d) => (
                      <Cell
                        key={d.division}
                        fill={getDivisionColor(d.division)}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>
        </>
      )}
    </div>
  );
};

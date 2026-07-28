import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { PersonaCard } from "../components/common/PersonaCard";
import { ProgressBar } from "../components/common/ProgressBar";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import {
  SegmentedControl,
  SegmentOption,
} from "../components/insights/SegmentedControl";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { useTeamMembers } from "../hooks/useTeamMembers";
import { useConfigStore } from "../stores/useConfigStore";
import { TeamMemberStats, teamWorkload } from "../utils/analyticsHelpers";
import styles from "./TeamAnalyticsPage.module.scss";

type Metric = "workload" | "throughput" | "cycle" | "winrate";
type ViewMode = "chart" | "leaderboard";
type BidRoleFilter = "all" | "contributor" | "analyst";

const ROLE_SEGMENTS: SegmentOption<BidRoleFilter>[] = [
  { value: "all", label: "Todos" },
  { value: "contributor", label: "Contributor" },
  { value: "analyst", label: "Analyst" },
];

const METRIC_SEGMENTS: SegmentOption<Metric>[] = [
  { value: "workload", label: "Carga" },
  { value: "throughput", label: "Entregues" },
  { value: "cycle", label: "Ciclo" },
  { value: "winrate", label: "Win Rate" },
];

const VIEW_SEGMENTS: SegmentOption<ViewMode>[] = [
  { value: "chart", label: "Gráficos" },
  { value: "leaderboard", label: "Ranking" },
];

export const TeamAnalyticsPage: React.FC = () => {
  const { bids } = useBids();
  const chart = useChartTheme();
  const config = useConfigStore((s) => s.config);
  const { members, loading } = useTeamMembers();
  const { filters, patch, setPreset, reset, applyFilters, hasActive } =
    useAnalyticsFilters();

  const [bidRoleFilter, setBidRoleFilter] =
    React.useState<BidRoleFilter>("all");
  const [metric, setMetric] = React.useState<Metric>("workload");
  const [view, setView] = React.useState<ViewMode>("chart");

  const divisions = React.useMemo(
    () =>
      (config?.divisions || [])
        .filter((d) => d.isActive !== false)
        .map((d) => ({ value: d.value, label: d.label, color: d.color })),
    [config],
  );

  const terminalStatuses = React.useMemo(() => {
    const fromCfg = (
      (config as unknown as { terminalStatuses?: { value: string }[] })
        ?.terminalStatuses || []
    )
      .map((t) => t.value)
      .filter(Boolean);
    return fromCfg.length ? fromCfg : undefined;
  }, [config]);

  const filtered = React.useMemo(
    () => applyFilters(bids, "createdDate"),
    [bids, applyFilters],
  );

  // Roster limited to the Engineering team (Contributor + Analyst bid roles)
  const roster = React.useMemo(() => {
    const eng = members.filter(
      (m) =>
        m.sector === "engineering" &&
        (m.bidRole === "contributor" || m.bidRole === "analyst"),
    );
    return bidRoleFilter === "all"
      ? eng
      : eng.filter((m) => m.bidRole === bidRoleFilter);
  }, [members, bidRoleFilter]);

  const workload = React.useMemo(
    () => teamWorkload(filtered, roster, "all", terminalStatuses),
    [filtered, roster, terminalStatuses],
  );

  const metricValue = React.useCallback(
    (s: TeamMemberStats): number => {
      if (metric === "throughput") return s.completed;
      if (metric === "cycle") return s.avgCycleDays;
      if (metric === "winrate") return s.winRate;
      return s.active;
    },
    [metric],
  );

  const metricColor =
    metric === "throughput"
      ? chart.accent
      : metric === "cycle"
        ? chart.accentTertiary
        : metric === "winrate"
          ? chart.success
          : chart.accentSecondary;
  const metricSuffix =
    metric === "cycle" ? "d" : metric === "winrate" ? "%" : "";
  const metricLabel =
    METRIC_SEGMENTS.find((m) => m.value === metric)?.label || "";

  const barData = React.useMemo(
    () =>
      workload
        .map((s) => ({ name: s.member.name, value: metricValue(s) }))
        .sort((a, b) => b.value - a.value),
    [workload, metricValue],
  );

  const avgActive = workload.length
    ? workload.reduce((s, w) => s + w.active, 0) / workload.length
    : 0;
  const balanceData = React.useMemo(
    () =>
      workload
        .map((w) => ({
          name: w.member.name,
          balance: Math.round((w.active - avgActive) * 10) / 10,
        }))
        .sort((a, b) => b.balance - a.balance),
    [workload, avgActive],
  );

  const scatterData = React.useMemo(
    () =>
      workload.map((w) => ({
        x: w.active,
        y: w.completed,
        z: Math.max(w.avgCycleDays, 1),
        name: w.member.name,
      })),
    [workload],
  );

  const stats = React.useMemo(() => {
    const teamSize = workload.length;
    const totalActive = workload.reduce((s, w) => s + w.active, 0);
    const avgPerPerson = teamSize
      ? Math.round((totalActive / teamSize) * 10) / 10
      : 0;
    const mostLoaded = workload.slice().sort((a, b) => b.active - a.active)[0];
    return { teamSize, totalActive, avgPerPerson, mostLoaded };
  }, [workload]);

  const maxActive = workload.reduce((m, w) => (w.active > m ? w.active : m), 1);
  const axisTick = { fill: chart.tick, fontSize: 12 };
  const barHeight = Math.max(220, barData.length * 40);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Team Analytics"
        subtitle="Engenharia (Contributor + Analyst): carga, entrega e balanceamento"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
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
        rightSlot={
          <div className={styles.controlsRow}>
            <SegmentedControl<BidRoleFilter>
              value={bidRoleFilter}
              segments={ROLE_SEGMENTS}
              onChange={setBidRoleFilter}
              size="sm"
              ariaLabel="Papel"
            />
            <SegmentedControl<ViewMode>
              value={view}
              segments={VIEW_SEGMENTS}
              onChange={setView}
              size="sm"
              ariaLabel="Visualização"
            />
          </div>
        }
      />

      {loading ? (
        <SkeletonLoader />
      ) : workload.length === 0 ? (
        <EmptyState
          variant="glass"
          title="Sem dados da equipe"
          description="Nenhum membro possui BIDs no filtro atual. Ajuste o período, o papel ou os filtros."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              label="Tamanho da Equipe"
              value={stats.teamSize}
              variant="glass"
              accentColor={chart.accentSecondary}
              subtitle="com BIDs no período"
            />
            <KPICard
              label="BIDs Ativos"
              value={stats.totalActive}
              variant="glass"
              accentColor={chart.accent}
              subtitle="em andamento"
            />
            <KPICard
              label="Média por Pessoa"
              value={stats.avgPerPerson}
              variant="glass"
              accentColor={chart.info}
              subtitle="BIDs ativos / pessoa"
            />
            <KPICard
              label="Mais Carregado"
              value={stats.mostLoaded ? stats.mostLoaded.active : 0}
              variant="glass"
              accentColor={chart.warning}
              subtitle={stats.mostLoaded ? stats.mostLoaded.member.name : "—"}
            />
          </div>

          {view === "chart" ? (
            <>
              <GlassCard
                title="Ranking da Equipe"
                subtitle={`Por ${metricLabel.toLowerCase()}`}
                accentColor={metricColor}
                className={styles.spanAll}
                actions={
                  <SegmentedControl<Metric>
                    value={metric}
                    segments={METRIC_SEGMENTS}
                    onChange={setMetric}
                    size="sm"
                    ariaLabel="Métrica"
                  />
                }
              >
                <ResponsiveContainer width="100%" height={barHeight}>
                  <BarChart
                    data={barData}
                    layout="vertical"
                    margin={{ top: 8, right: 44, bottom: 4, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} stroke={chart.grid} />
                    <XAxis
                      type="number"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${v}${metricSuffix}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={150}
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: chart.referenceFill }}
                      content={
                        <ChartTooltip
                          valueFormatter={(v) => `${v}${metricSuffix}`}
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      name={metricLabel}
                      fill={metricColor}
                      radius={[0, 6, 6, 0]}
                      barSize={20}
                    >
                      <LabelList
                        dataKey="value"
                        position="right"
                        formatter={(v: number) => `${v}${metricSuffix}`}
                        fill={chart.textSecondary}
                        fontSize={11}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>

              <div className={styles.chartsGrid}>
                <GlassCard
                  title="Balanceamento de Carga"
                  subtitle="BIDs ativos acima/abaixo da média da equipe"
                  accentColor={chart.warning}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={balanceData}
                      layout="vertical"
                      margin={{ top: 8, right: 20, bottom: 4, left: 8 }}
                    >
                      <CartesianGrid horizontal={false} stroke={chart.grid} />
                      <XAxis
                        type="number"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        width={140}
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: chart.referenceFill }}
                        content={
                          <ChartTooltip
                            valueFormatter={(v) =>
                              `${Number(v) > 0 ? "+" : ""}${v}`
                            }
                          />
                        }
                      />
                      <ReferenceLine x={0} stroke={chart.axis} />
                      <Bar
                        dataKey="balance"
                        name="Desvio"
                        radius={[0, 4, 4, 0]}
                        barSize={18}
                      >
                        {balanceData.map((d, i) => (
                          <Cell
                            key={i}
                            fill={d.balance > 0 ? chart.warning : chart.success}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </GlassCard>

                <GlassCard
                  title="Throughput × Carga"
                  subtitle="Entregues (Y) vs. ativos (X) — bolha = ciclo médio"
                  accentColor={chart.accent}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart
                      margin={{ top: 8, right: 16, bottom: 8, left: -8 }}
                    >
                      <CartesianGrid stroke={chart.grid} />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Ativos"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Entregues"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <ZAxis
                        type="number"
                        dataKey="z"
                        range={[60, 420]}
                        name="Ciclo médio"
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        content={
                          <ChartTooltip
                            labelFormatter={() => "Membro"}
                            valueFormatter={(v, entry) => `${entry.name}: ${v}`}
                          />
                        }
                      />
                      <Scatter
                        data={scatterData}
                        fill={chart.accent}
                        fillOpacity={0.7}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </GlassCard>
              </div>
            </>
          ) : (
            <div className={styles.leaderGrid}>
              {barData.map((_, idx) => {
                const s = workload
                  .slice()
                  .sort((a, b) => metricValue(b) - metricValue(a))[idx];
                if (!s) return null;
                return (
                  <div className={styles.leaderCard} key={s.member.id}>
                    <span
                      className={styles.leaderRank}
                      style={{
                        background:
                          idx < 3 ? metricColor : "var(--card-bg-elevated)",
                        color: idx < 3 ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      {idx + 1}
                    </span>
                    <PersonaCard
                      name={s.member.name}
                      email={s.member.email}
                      role={s.member.bidRole || s.member.jobTitle}
                      photoUrl={s.member.photoUrl}
                      size="large"
                    />
                    <div className={styles.leaderStats}>
                      <div className={styles.leaderStat}>
                        <span className={styles.leaderStatValue}>
                          {s.active}
                        </span>
                        <span className={styles.leaderStatLabel}>Ativos</span>
                      </div>
                      <div className={styles.leaderStat}>
                        <span className={styles.leaderStatValue}>
                          {s.completed}
                        </span>
                        <span className={styles.leaderStatLabel}>
                          Entregues
                        </span>
                      </div>
                      <div className={styles.leaderStat}>
                        <span className={styles.leaderStatValue}>
                          {s.avgCycleDays}d
                        </span>
                        <span className={styles.leaderStatLabel}>Ciclo</span>
                      </div>
                      <div className={styles.leaderStat}>
                        <span className={styles.leaderStatValue}>
                          {s.winRate}%
                        </span>
                        <span className={styles.leaderStatLabel}>Win</span>
                      </div>
                    </div>
                    <div className={styles.leaderBar}>
                      <ProgressBar
                        value={s.active}
                        max={maxActive}
                        color={metricColor}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

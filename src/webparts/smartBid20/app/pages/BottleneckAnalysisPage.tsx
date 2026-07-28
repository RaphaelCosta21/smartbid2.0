import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  LabelList,
  Cell,
  FunnelChart,
  Funnel,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { PhaseBadge } from "../components/common/PhaseBadge";
import { ProgressBar } from "../components/common/ProgressBar";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { HeatmapGrid } from "../components/charts/HeatmapGrid";
import { AIInsightsPanel } from "../components/insights/AIInsightsPanel";
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import {
  SegmentedControl,
  SegmentOption,
} from "../components/insights/SegmentedControl";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { useStatusColors } from "../hooks/useStatusColors";
import { useConfigStore } from "../stores/useConfigStore";
import {
  DurationStat,
  durationByPhase,
  durationByStatus,
  divisionPhaseMatrix,
  phaseFunnel,
  slowestBids,
  divisionLoad,
  isBidActive,
} from "../utils/analyticsHelpers";
import {
  avgApprovalDaysBySector,
  computeApprovalCycleTime,
} from "../utils/approvalHelpers";
import styles from "./BottleneckAnalysisPage.module.scss";

type Scope = "all" | "active" | "completed";
type Dimension = "phase" | "status";

const SCOPE_SEGMENTS: SegmentOption<Scope>[] = [
  { value: "all", label: "Todos" },
  { value: "active", label: "Ativos" },
  { value: "completed", label: "Concluídos" },
];

const DIM_SEGMENTS: SegmentOption<Dimension>[] = [
  { value: "phase", label: "Fase" },
  { value: "status", label: "Status" },
];

const STAT_SEGMENTS: SegmentOption<DurationStat>[] = [
  { value: "avg", label: "Média" },
  { value: "median", label: "Mediana" },
  { value: "max", label: "Máx" },
];

const MS_DAY = 86400000;

export const BottleneckAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const chart = useChartTheme();
  const config = useConfigStore((s) => s.config);
  const { getPhaseColor, getStatusColor } = useStatusColors();
  const { filters, patch, setPreset, reset, applyFilters, hasActive } =
    useAnalyticsFilters();

  const [scope, setScope] = React.useState<Scope>("all");
  const [dimension, setDimension] = React.useState<Dimension>("phase");
  const [stat, setStat] = React.useState<DurationStat>("avg");
  const [threshold, setThreshold] = React.useState(15);

  const divisions = React.useMemo(
    () =>
      (config?.divisions || [])
        .filter((d) => d.isActive !== false)
        .map((d) => ({ value: d.value, label: d.label, color: d.color })),
    [config],
  );
  const divisionLabel = React.useCallback(
    (value: string): string =>
      divisions.find((d) => d.value === value)?.label || value,
    [divisions],
  );
  const bidTypeOptions = React.useMemo(() => {
    const bt = (
      config as unknown as {
        bidTypes?: { value: string; label?: string }[];
      }
    )?.bidTypes;
    return bt && bt.length > 0
      ? bt.map((x) => ({ value: x.value, label: x.label || x.value }))
      : ["Firm", "Budgetary", "RFI", "Extension", "Amendment"].map((v) => ({
          value: v,
          label: v,
        }));
  }, [config]);

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

  const scoped = React.useMemo(() => {
    if (scope === "all") return filtered;
    return filtered.filter((b) => {
      const active = isBidActive(b, terminalStatuses);
      return scope === "active" ? active : !active;
    });
  }, [filtered, scope, terminalStatuses]);

  const phaseDur = React.useMemo(
    () => durationByPhase(scoped, stat),
    [scoped, stat],
  );
  const statusDur = React.useMemo(
    () => durationByStatus(scoped, stat),
    [scoped, stat],
  );
  const matrix = React.useMemo(
    () => divisionPhaseMatrix(scoped, stat),
    [scoped, stat],
  );
  const funnel = React.useMemo(() => phaseFunnel(scoped), [scoped]);
  const slow = React.useMemo(
    () => slowestBids(scoped, 8, scope, terminalStatuses),
    [scoped, scope, terminalStatuses],
  );
  const load = React.useMemo(
    () => divisionLoad(filtered, terminalStatuses),
    [filtered, terminalStatuses],
  );
  const sectorApproval = React.useMemo(
    () => avgApprovalDaysBySector(filtered),
    [filtered],
  );

  const dimData = React.useMemo(() => {
    if (dimension === "phase") {
      return phaseDur.map((r) => ({
        name: r.phase,
        days: r.days,
        count: r.count,
        color: getPhaseColor(r.phase),
      }));
    }
    return statusDur.map((r) => ({
      name: r.status,
      days: r.days,
      count: r.count,
      color: getStatusColor(r.status),
    }));
  }, [dimension, phaseDur, statusDur, getPhaseColor, getStatusColor]);

  const avgDays = dimData.length
    ? Math.round(
        (dimData.reduce((s, d) => s + d.days, 0) / dimData.length) * 10,
      ) / 10
    : 0;
  const bottleneckCount = dimData.filter((d) => d.days > threshold).length;
  const maxThreshold = Math.max(
    30,
    Math.ceil(dimData.reduce((m, d) => (d.days > m ? d.days : m), 0)),
  );

  const stats = React.useMemo(() => {
    const completed = filtered.filter((b) => b.completedDate && b.createdDate);
    const avgCycle = completed.length
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
    const slowestPhase = phaseDur.slice().sort((a, b) => b.days - a.days)[0];
    const approvals = filtered
      .map((b) => {
        const computed = computeApprovalCycleTime(b);
        return computed != null ? computed : b.kpis?.approvalCycleTime;
      })
      .filter((v): v is number => v != null && v >= 0);
    const avgApproval = approvals.length
      ? Math.round(
          (approvals.reduce((s, v) => s + v, 0) / approvals.length) * 10,
        ) / 10
      : null;
    const blocked = filtered.filter((b) => {
      if (!isBidActive(b, terminalStatuses)) return false;
      if (b.currentStatus === "On Hold") return true;
      const due = b.desiredDueDate || b.dueDate;
      return due ? new Date(due).getTime() < Date.now() : false;
    }).length;
    return { avgCycle, slowestPhase, avgApproval, blocked };
  }, [filtered, phaseDur, terminalStatuses]);

  const axisTick = { fill: chart.tick, fontSize: 12 };
  const legendStyle = { fontSize: 12, color: chart.textSecondary };
  const dimHeight = Math.max(220, dimData.length * 42);
  const funnelData = funnel.map((f) => ({
    name: f.phase,
    value: f.count,
    phase: f.phase,
  }));

  return (
    <div className={styles.page}>
      <PageHeader
        title="Bottleneck Analysis"
        subtitle="Tempo por fase e status, BIDs mais demorados e carga por divisão"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M10 2h4M12 2v6M6 8h12l-2 6a4 4 0 01-8 0L6 8z" />
            <path d="M8 22h8" />
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
        bidTypes={bidTypeOptions}
        rightSlot={
          <SegmentedControl<Scope>
            value={scope}
            segments={SCOPE_SEGMENTS}
            onChange={setScope}
            size="sm"
            ariaLabel="Escopo"
          />
        }
      />

      {scoped.length === 0 ? (
        <EmptyState
          variant="glass"
          title="Nenhum BID no filtro atual"
          description="Ajuste o período, o escopo ou os filtros para investigar os gargalos."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              label="Ciclo Médio Total"
              value={`${stats.avgCycle}d`}
              variant="glass"
              accentColor={chart.accentTertiary}
              subtitle="criação → conclusão"
            />
            <KPICard
              label="Fase Mais Lenta"
              value={stats.slowestPhase ? `${stats.slowestPhase.days}d` : "—"}
              variant="glass"
              accentColor={chart.danger}
              subtitle={
                stats.slowestPhase ? stats.slowestPhase.phase : "sem dados"
              }
            />
            <KPICard
              label="Ciclo de Aprovação"
              value={stats.avgApproval != null ? `${stats.avgApproval}d` : "—"}
              variant="glass"
              accentColor={chart.warning}
              subtitle="média por BID"
            />
            <KPICard
              label="Bloqueados / Atrasados"
              value={stats.blocked}
              variant="glass"
              accentColor={chart.info}
              subtitle="BIDs ativos"
            />
          </div>

          <GlassCard
            title={
              dimension === "phase" ? "Tempo por Fase" : "Tempo por Status"
            }
            subtitle={`Duração ${
              stat === "avg"
                ? "média"
                : stat === "median"
                  ? "mediana"
                  : "máxima"
            } (dias) — gargalos acima de ${threshold}d destacados`}
            accentColor={chart.danger}
            className={styles.spanAll}
            actions={
              <div className={styles.controlsRow}>
                <SegmentedControl<Dimension>
                  value={dimension}
                  segments={DIM_SEGMENTS}
                  onChange={setDimension}
                  size="sm"
                  ariaLabel="Dimensão"
                />
                <SegmentedControl<DurationStat>
                  value={stat}
                  segments={STAT_SEGMENTS}
                  onChange={setStat}
                  size="sm"
                  ariaLabel="Estatística"
                />
              </div>
            }
          >
            <div className={styles.thresholdRow}>
              <span className={styles.thresholdLabel}>
                Limite de gargalo: <strong>{threshold}d</strong>
              </span>
              <input
                className={styles.slider}
                type="range"
                min={1}
                max={maxThreshold}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                aria-label="Limite de gargalo em dias"
              />
              <span
                className={styles.bottleneckTag}
                style={{
                  color: bottleneckCount ? chart.danger : chart.textMuted,
                  borderColor: bottleneckCount ? chart.danger : "transparent",
                }}
              >
                {bottleneckCount} gargalo(s)
              </span>
            </div>
            <ResponsiveContainer width="100%" height={dimHeight}>
              <BarChart
                data={dimData}
                layout="vertical"
                margin={{ top: 8, right: 40, bottom: 4, left: 8 }}
              >
                <CartesianGrid horizontal={false} stroke={chart.grid} />
                <XAxis
                  type="number"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}d`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={dimension === "phase" ? 130 : 150}
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: chart.referenceFill }}
                  content={<ChartTooltip valueFormatter={(v) => `${v} dias`} />}
                />
                <ReferenceLine
                  x={avgDays}
                  stroke={chart.warning}
                  strokeDasharray="5 4"
                  label={{
                    value: `média ${avgDays}d`,
                    position: "top",
                    fill: chart.textMuted,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="days" radius={[0, 6, 6, 0]} barSize={20}>
                  <LabelList
                    dataKey="days"
                    position="right"
                    formatter={(v: number) => `${v}d`}
                    fill={chart.textSecondary}
                    fontSize={11}
                  />
                  {dimData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.color}
                      stroke={d.days > threshold ? chart.danger : "transparent"}
                      strokeWidth={d.days > threshold ? 2 : 0}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard
            title="Tempo Médio de Aprovação por Setor"
            subtitle="Dias médios por setor — apenas rodadas de aprovação concluídas"
            accentColor={chart.warning}
            className={styles.spanAll}
          >
            {sectorApproval.length === 0 ? (
              <EmptyState
                title="Sem aprovações concluídas"
                description="Assim que houver rodadas de aprovação fechadas, os tempos médios por setor aparecerão aqui."
              />
            ) : (
              <ResponsiveContainer
                width="100%"
                height={Math.max(220, sectorApproval.length * 46)}
              >
                <BarChart
                  data={sectorApproval}
                  layout="vertical"
                  margin={{ top: 8, right: 60, bottom: 4, left: 8 }}
                >
                  <CartesianGrid horizontal={false} stroke={chart.grid} />
                  <XAxis
                    type="number"
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}d`}
                  />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={150}
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: chart.referenceFill }}
                    content={
                      <ChartTooltip valueFormatter={(v) => `${v} dias`} />
                    }
                  />
                  <Bar
                    dataKey="avgDays"
                    name="Dias médios"
                    radius={[0, 6, 6, 0]}
                    barSize={22}
                  >
                    <LabelList
                      dataKey="avgDays"
                      position="right"
                      formatter={(v: number) => `${v}d`}
                      fill={chart.textSecondary}
                      fontSize={11}
                    />
                    {sectorApproval.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <div className={styles.chartsGrid}>
            <GlassCard
              title="Mapa de Calor — Divisão × Fase"
              subtitle="Dias médios por fase em cada divisão"
              accentColor={chart.warning}
            >
              {matrix.phases.length === 0 ? (
                <EmptyState title="Sem histórico de fases" />
              ) : (
                <HeatmapGrid
                  rows={matrix.divisions}
                  columns={matrix.phases.map((p) => ({ key: p, label: p }))}
                  getCell={(row, col) => {
                    const c = matrix.cells[row][col];
                    return { value: c.days, count: c.count };
                  }}
                  maxValue={matrix.maxDays}
                  valueSuffix="d"
                  renderRowLabel={(r) => <DivisionBadge division={r} />}
                />
              )}
            </GlassCard>

            <GlassCard
              title="Funil de Fases"
              subtitle="Quantos BIDs alcançaram cada fase"
              accentColor={chart.accent}
            >
              <ResponsiveContainer width="100%" height={280}>
                <FunnelChart>
                  <Tooltip content={<ChartTooltip hideLabel />} />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList
                      position="right"
                      dataKey="name"
                      fill={chart.textSecondary}
                      fontSize={12}
                      stroke="none"
                    />
                    <LabelList
                      position="center"
                      dataKey="value"
                      fill="#ffffff"
                      fontSize={13}
                      stroke="none"
                    />
                    {funnelData.map((f, i) => (
                      <Cell key={i} fill={getPhaseColor(f.phase)} />
                    ))}
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <GlassCard
            title="BIDs Mais Demorados"
            subtitle="Maior tempo decorrido — clique para abrir o detalhe"
            accentColor={chart.danger}
            className={styles.spanAll}
          >
            <div className={styles.slowList}>
              {slow.map((row, i) => (
                <div
                  key={row.bid.bidNumber}
                  className={styles.slowRow}
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    navigate(`/bid/${encodeURIComponent(row.bid.bidNumber)}`)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      navigate(`/bid/${encodeURIComponent(row.bid.bidNumber)}`);
                  }}
                >
                  <span className={styles.slowRank}>{i + 1}</span>
                  <div className={styles.slowMain}>
                    <div className={styles.slowTop}>
                      <span className={styles.slowBid}>
                        {row.bid.bidNumber}
                      </span>
                      <DivisionBadge division={row.bid.division} />
                      <PhaseBadge phase={row.bid.currentPhase} />
                      {row.active && (
                        <span className={styles.activeDot} title="Ativo" />
                      )}
                    </div>
                    <div className={styles.slowClient}>
                      {row.bid.opportunityInfo?.client || "—"}
                      {row.bid.opportunityInfo?.projectName
                        ? ` · ${row.bid.opportunityInfo.projectName}`
                        : ""}
                    </div>
                    <ProgressBar
                      value={row.days}
                      max={slow[0].days || 1}
                      color={getPhaseColor(row.bid.currentPhase)}
                    />
                  </div>
                  <span className={styles.slowDays}>{row.days}d</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard
            title="Carga por Divisão"
            subtitle="BIDs ativos (WIP) e atrasados por divisão"
            accentColor={chart.accentSecondary}
            className={styles.spanAll}
          >
            {load.length === 0 ? (
              <EmptyState title="Nenhum BID ativo" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={load}
                  margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
                >
                  <CartesianGrid vertical={false} stroke={chart.grid} />
                  <XAxis
                    dataKey="division"
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={divisionLabel}
                  />
                  <YAxis
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: chart.referenceFill }}
                    content={
                      <ChartTooltip
                        labelFormatter={(l) => divisionLabel(String(l))}
                      />
                    }
                  />
                  <Legend wrapperStyle={legendStyle} />
                  <Bar
                    dataKey="active"
                    name="Ativos"
                    fill={chart.accentSecondary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    dataKey="overdue"
                    name="Atrasados"
                    fill={chart.danger}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <AIInsightsPanel
            className={styles.spanAll}
            description="Quando os recursos de IA estiverem disponíveis, esta seção identificará a causa-raiz dos gargalos e sugerirá ações corretivas."
            features={[
              "Detecção de causa-raiz",
              "Ações recomendadas",
              "Ranking de impacto",
              "Alertas preventivos",
            ]}
          />
        </>
      )}
    </div>
  );
};

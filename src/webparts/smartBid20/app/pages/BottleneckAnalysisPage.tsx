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
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const DIM_SEGMENTS: SegmentOption<Dimension>[] = [
  { value: "phase", label: "Fase" },
  { value: "status", label: "Status" },
];

const STAT_SEGMENTS: SegmentOption<DurationStat>[] = [
  { value: "avg", label: "Average" },
  { value: "median", label: "Median" },
  { value: "max", label: "Max" },
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
        subtitle="Time by phase and status, longest-running BIDs, and workload by division"
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
            ariaLabel="Scope"
          />
        }
      />

      {scoped.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No BIDs Match Current Filters"
          description="Adjust the period, scope, or filters to investigate bottlenecks."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              label="Average Total Cycle"
              value={`${stats.avgCycle}d`}
              variant="glass"
              accentColor={chart.accentTertiary}
              subtitle="creation → completion"
            />
            <KPICard
              label="Slowest Phase"
              value={stats.slowestPhase ? `${stats.slowestPhase.days}d` : "—"}
              variant="glass"
              accentColor={chart.danger}
              subtitle={
                stats.slowestPhase ? stats.slowestPhase.phase : "no data"
              }
            />
            <KPICard
              label="Approval Cycle"
              value={stats.avgApproval != null ? `${stats.avgApproval}d` : "—"}
              variant="glass"
              accentColor={chart.warning}
              subtitle="average per BID"
            />
            <KPICard
              label="Blocked / Overdue"
              value={stats.blocked}
              variant="glass"
              accentColor={chart.info}
              subtitle="active BIDs"
            />
          </div>

          <GlassCard
            title={
              dimension === "phase" ? "Time by Phase" : "Time by Status"
            }
            subtitle={`Duration ${
              stat === "avg"
                ? "average"
                : stat === "median"
                  ? "median"
                  : "maximum"
            } (days) — bottlenecks above ${threshold}d highlighted`}
            accentColor={chart.danger}
            className={styles.spanAll}
            actions={
              <div className={styles.controlsRow}>
                <SegmentedControl<Dimension>
                  value={dimension}
                  segments={DIM_SEGMENTS}
                  onChange={setDimension}
                  size="sm"
                  ariaLabel="Dimension"
                />
                <SegmentedControl<DurationStat>
                  value={stat}
                  segments={STAT_SEGMENTS}
                  onChange={setStat}
                  size="sm"
                  ariaLabel="Statistic"
                />
              </div>
            }
          >
            <div className={styles.thresholdRow}>
              <span className={styles.thresholdLabel}>
                Bottleneck threshold: <strong>{threshold}d</strong>
              </span>
              <input
                className={styles.slider}
                type="range"
                min={1}
                max={maxThreshold}
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                aria-label="Bottleneck threshold in days"
              />
              <span
                className={styles.bottleneckTag}
                style={{
                  color: bottleneckCount ? chart.danger : chart.textMuted,
                  borderColor: bottleneckCount ? chart.danger : "transparent",
                }}
              >
                {bottleneckCount} bottleneck(s)
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
                    value: `average ${avgDays}d`,
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
            title="Average Approval Time by Department"
            subtitle="Average days by department — completed approval rounds only"
            accentColor={chart.warning}
            className={styles.spanAll}
          >
            {sectorApproval.length === 0 ? (
              <EmptyState
                title="No Completed Approvals"
                description="Average department approval times will appear here once approval rounds are closed."
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
                    name="Average Days"
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
              title="Heatmap — Division × Phase"
              subtitle="Average days by phase for each division"
              accentColor={chart.warning}
            >
              {matrix.phases.length === 0 ? (
                <EmptyState title="No Phase History" />
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
              title="Phase Funnel"
              subtitle="Number of BIDs reaching each phase"
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
            title="Longest-Running BIDs"
            subtitle="Longest elapsed time — click to open details"
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
                        <span className={styles.activeDot} title="Active" />
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
            title="Workload by Division"
            subtitle="Active BIDs (WIP) and overdue BIDs by division"
            accentColor={chart.accentSecondary}
            className={styles.spanAll}
          >
            {load.length === 0 ? (
              <EmptyState title="No Active BIDs" />
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
                    name="Active"
                    fill={chart.accentSecondary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    dataKey="overdue"
                    name="Overdue"
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
            description="When AI resources are available, this section will identify bottleneck root causes and suggest corrective actions."
            features={[
              "Root Cause Detection",
              "Recommended Actions",
              "Ranking de impacto",
              "Alertas preventivos",
            ]}
          />
        </>
      )}
    </div>
  );
};

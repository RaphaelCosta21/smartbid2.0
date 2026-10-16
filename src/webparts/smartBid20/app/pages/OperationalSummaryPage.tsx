import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { Sparkline } from "../components/charts/Sparkline";
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import { ApprovalDueImpactSection } from "../components/reports/ApprovalDueImpactSection";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useConfigStore } from "../stores/useConfigStore";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { useStatusColors } from "../hooks/useStatusColors";
import { useKpiTargets } from "../hooks/useKpiTargets";
import { PHASE_ORDER, volumeTrend } from "../utils/analyticsHelpers";
import {
  avgApprovalHoursBySector,
  summarizeApprovalDueImpact,
} from "../utils/approvalHelpers";
import { formatElapsedHours, isPastDue } from "../utils/formatters";
import { getDueFreezeDate } from "../utils/bidHelpers";
import {
  buildCycleBreakdown,
  computeCycleByPriority,
  computeFirstPassApproval,
  computeOtif,
  cycleTargetTone,
  formatTarget,
  targetTone,
} from "../utils/kpiHelpers";
import { OTIF_REVISION_WINDOW_MONTHS } from "../config/kpi.config";
import styles from "./OperationalSummaryPage.module.scss";

const hideZero = (v: number): string | number => (v > 0 ? v : "");

export const OperationalSummaryPage: React.FC = () => {
  const { bids } = useBids();
  const config = useConfigStore((s) => s.config);
  const chart = useChartTheme();
  const { getPhaseColor, getPriorityColor } = useStatusColors();
  const { targets } = useKpiTargets();
  const {
    filters,
    patch,
    setPreset,
    reset,
    applyFilters,
    getFacetCounts,
    hasActive,
  } = useAnalyticsFilters();

  const terminalStatuses = React.useMemo(() => {
    const t = (
      (config as unknown as { terminalStatuses?: { value: string }[] })
        ?.terminalStatuses || []
    )
      .map((x) => x.value)
      .filter(Boolean);
    return t.length
      ? t
      : ["Completed", "Canceled", "No Bid", "Client Canceled"];
  }, [config]);

  const divisions = React.useMemo(
    () =>
      (config?.divisions || [])
        .filter((d) => d.isActive !== false)
        .map((d) => ({
          value: d.value,
          label: d.label || d.value,
          color: d.color || "#94a3b8",
        })),
    [config],
  );
  const serviceLines = React.useMemo(
    () =>
      (config?.serviceLines || [])
        .filter((s) => s.isActive !== false)
        .map((s) => ({ value: s.value, label: s.label || s.value })),
    [config],
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

  const filtered = React.useMemo(
    () => applyFilters(bids, "createdDate"),
    [bids, applyFilters],
  );

  const facetCounts = React.useMemo(
    () => getFacetCounts(bids, "createdDate"),
    [bids, getFacetCounts],
  );

  const isTerminal = React.useCallback(
    (status: string) => terminalStatuses.indexOf(status) >= 0,
    [terminalStatuses],
  );

  const stats = React.useMemo(() => {
    const active = filtered.filter((b) => !isTerminal(b.currentStatus));
    const pending = filtered.filter((b) => b.approvalStatus === "pending");
    const overdue = active.filter((b) =>
      isPastDue(b.desiredDueDate || b.dueDate, getDueFreezeDate(b)),
    );
    const completed = filtered.filter(
      (b) =>
        b.currentStatus === "Completed" && b.completedDate && b.createdDate,
    );
    return {
      active: active.length,
      pending: pending.length,
      overdue: overdue.length,
      overdueRate: active.length
        ? Math.round((overdue.length / active.length) * 100)
        : null,
      completed: completed.length,
    };
  }, [filtered, isTerminal]);

  const cycle = React.useMemo(
    () => computeCycleByPriority(filtered, targets),
    [filtered, targets],
  );
  const firstPass = React.useMemo(
    () => computeFirstPassApproval(filtered),
    [filtered],
  );
  const otif = React.useMemo(() => computeOtif(filtered), [filtered]);
  const approvalDue = React.useMemo(
    () => summarizeApprovalDueImpact(filtered).counts,
    [filtered],
  );

  const divWorkloads = React.useMemo(() => {
    return divisions
      .map((d) => {
        const db = filtered.filter((b) => b.division === d.value);
        const active = db.filter((b) => !isTerminal(b.currentStatus)).length;
        const pending = db.filter((b) => b.approvalStatus === "pending").length;
        const overdue = db.filter(
          (b) =>
            !isTerminal(b.currentStatus) &&
            isPastDue(b.desiredDueDate || b.dueDate, getDueFreezeDate(b)),
        ).length;
        return { division: d.label, active, pending, overdue };
      })
      .filter((d) => d.active + d.pending + d.overdue > 0);
  }, [filtered, divisions, isTerminal]);

  const phaseData = React.useMemo(() => {
    const active = filtered.filter((b) => !isTerminal(b.currentStatus));
    const counts: { [p: string]: number } = {};
    active.forEach((b) => {
      counts[b.currentPhase] = (counts[b.currentPhase] || 0) + 1;
    });
    return PHASE_ORDER.map((p) => ({
      phase: p,
      count: counts[p] || 0,
      color: getPhaseColor(p),
    })).filter((r) => r.count > 0);
  }, [filtered, isTerminal, getPhaseColor]);

  const throughput = React.useMemo(
    () =>
      volumeTrend(filtered, "month").map((p) => ({
        period: p.period,
        completed: p.completed,
      })),
    [filtered],
  );

  const sectorData = React.useMemo(
    () => avgApprovalHoursBySector(filtered),
    [filtered],
  );

  const completedPerMonth = throughput.length
    ? Math.round((stats.completed / throughput.length) * 10) / 10
    : 0;

  const axisTick = { fill: chart.tick, fontSize: 12 };
  const legendStyle = { fontSize: 12, color: chart.textSecondary };
  const insideLabel = {
    position: "inside" as const,
    fill: "#ffffff",
    fontSize: 11,
    fontWeight: 700,
    formatter: hideZero,
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Operational Summary"
        subtitle="Operational overview and BID throughput"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
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
        bidTypes={bidTypeOptions}
        facetCounts={facetCounts}
        showSearch={false}
      />

      {filtered.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No BIDs Match Current Filters"
          description="Adjust the period or filters."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              variant="glass"
              label="Active BIDs"
              value={stats.active}
              accentColor={chart.accent}
              subtitle="in progress"
            />
            <KPICard
              variant="glass"
              label="Pending Approvals"
              value={stats.pending}
              accentColor={chart.warning}
              subtitle="awaiting action"
            />
            <KPICard
              variant="glass"
              label="Overdue"
              value={stats.overdue}
              accentColor={chart.danger}
              subtitle={
                stats.overdueRate === null
                  ? "no active BIDs"
                  : `${stats.overdueRate}% of active BIDs past due`
              }
              target={{
                label: `Overdue target ≤ ${targets.targetOverdueRate}%`,
                tone: targetTone(
                  stats.overdueRate,
                  targets.targetOverdueRate,
                  false,
                ),
              }}
              breakdown={[
                {
                  label: "Late due to approval",
                  value: String(approvalDue.lateDueToApproval),
                  color: chart.danger,
                },
                {
                  label: "Late before approval",
                  value: String(approvalDue.lateBeforeApproval),
                  color: chart.warning,
                },
              ]}
            />
            <KPICard
              variant="glass"
              label="Completed"
              value={stats.completed}
              accentColor={chart.success}
              subtitle={`in selected period, avg ${completedPerMonth}/month`}
              sparkline={
                <Sparkline
                  data={throughput.map((p) => p.completed)}
                  color={chart.success}
                  height={34}
                />
              }
            />
            <KPICard
              variant="glass"
              label="Average Cycle"
              value={
                cycle.overall.avg === null ? "-" : `${cycle.overall.avg} bd`
              }
              accentColor={chart.accentTertiary}
              subtitle="business days, creation to first delivery"
              target={{
                label: `${cycle.onTarget} of ${cycle.measured} urgencies on target`,
                tone: cycleTargetTone(cycle),
              }}
              breakdown={buildCycleBreakdown(cycle, getPriorityColor)}
            />
            <KPICard
              variant="glass"
              label="First-Pass Approval"
              value={firstPass.rate === null ? "-" : `${firstPass.rate}%`}
              accentColor={chart.accentSecondary}
              subtitle={
                firstPass.total
                  ? `${firstPass.hits} of ${firstPass.total} approved with no rejection or override`
                  : "no closed approval round"
              }
              target={{
                label: formatTarget(targets.targetFirstPassApproval, "%", true),
                tone: targetTone(
                  firstPass.rate,
                  targets.targetFirstPassApproval,
                  true,
                ),
              }}
            />
            <KPICard
              variant="glass"
              label="OTIF"
              value={otif.rate === null ? "-" : `${otif.rate}%`}
              accentColor={chart.info}
              subtitle={
                otif.total
                  ? `${otif.hits} of ${otif.total} delivered BIDs${
                      otif.provisional
                        ? `, ${otif.provisional} still in the ${OTIF_REVISION_WINDOW_MONTHS}-month revision window`
                        : ""
                    }`
                  : "no delivered BIDs"
              }
              target={{
                label: formatTarget(targets.targetOTIF, "%", true),
                tone: targetTone(otif.rate, targets.targetOTIF, true),
              }}
            />
          </div>

          <div className={styles.chartsGrid2}>
            <div>
              <GlassCard
                title="Division Workloads"
                subtitle="Active BIDs, pending approvals, and overdue BIDs by division"
                accentColor={chart.accentSecondary}
              >
                {divWorkloads.length === 0 ? (
                  <EmptyState title="No Active BIDs" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={divWorkloads}
                      margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
                    >
                      <CartesianGrid vertical={false} stroke={chart.grid} />
                      <XAxis
                        dataKey="division"
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
                        cursor={{ fill: chart.referenceFill }}
                        content={<ChartTooltip />}
                      />
                      <Legend wrapperStyle={legendStyle} />
                      <Bar
                        dataKey="active"
                        name="Active"
                        fill={chart.accentSecondary}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      >
                        <LabelList dataKey="active" {...insideLabel} />
                      </Bar>
                      <Bar
                        dataKey="pending"
                        name="Approvals"
                        fill={chart.warning}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      >
                        <LabelList dataKey="pending" {...insideLabel} />
                      </Bar>
                      <Bar
                        dataKey="overdue"
                        name="Overdue"
                        fill={chart.danger}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      >
                        <LabelList dataKey="overdue" {...insideLabel} />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </div>

            <div>
              <GlassCard
                title="Active BIDs by Phase"
                subtitle="Distribution of active BIDs by phase"
                accentColor={chart.accentTertiary}
              >
                {phaseData.length === 0 ? (
                  <EmptyState title="No Active BIDs" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={phaseData}
                      layout="vertical"
                      margin={{ top: 8, right: 40, bottom: 4, left: 8 }}
                    >
                      <CartesianGrid horizontal={false} stroke={chart.grid} />
                      <XAxis
                        type="number"
                        tick={axisTick}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="phase"
                        width={130}
                        tick={{ fill: chart.tick, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: chart.referenceFill }}
                        content={<ChartTooltip />}
                      />
                      <Bar
                        dataKey="count"
                        name="Active"
                        radius={[0, 6, 6, 0]}
                        maxBarSize={22}
                      >
                        <LabelList
                          dataKey="count"
                          position="right"
                          fill={chart.textSecondary}
                          fontSize={11}
                        />
                        {phaseData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </div>
          </div>

          <div className={styles.spanAll}>
            <GlassCard
              title="Throughput"
              subtitle="Completed BIDs per month"
              accentColor={chart.success}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={throughput}
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
                    cursor={{ fill: chart.referenceFill }}
                    content={<ChartTooltip />}
                  />
                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill={chart.success}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={44}
                  >
                    <LabelList
                      dataKey="completed"
                      position="top"
                      fill={chart.textSecondary}
                      fontSize={11}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <div className={styles.spanAll}>
            <GlassCard
              title="Average Approval Time by Department"
              subtitle="Time from approval start to each department's last sign-off (final approved round of completed BIDs)"
              accentColor={chart.warning}
            >
              {sectorData.length === 0 ? (
                <EmptyState
                  title="No Completed Approvals"
                  description="Average department approval times will appear here once BIDs are approved and completed."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(220, sectorData.length * 44)}
                >
                  <BarChart
                    data={sectorData}
                    layout="vertical"
                    margin={{ top: 8, right: 64, bottom: 4, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} stroke={chart.grid} />
                    <XAxis
                      type="number"
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => formatElapsedHours(v)}
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={150}
                      tick={{ fill: chart.tick, fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: chart.referenceFill }}
                      content={
                        <ChartTooltip
                          valueFormatter={(v, entry) =>
                            `${formatElapsedHours(Number(v))} (${
                              entry.payload?.count
                            } BIDs)`
                          }
                        />
                      }
                    />
                    <Bar
                      dataKey="avgHours"
                      name="Average Time"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={24}
                    >
                      <LabelList
                        dataKey="avgHours"
                        position="right"
                        formatter={(v: number) => formatElapsedHours(v)}
                        fill={chart.textSecondary}
                        fontSize={11}
                      />
                      {sectorData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </GlassCard>
          </div>

          <ApprovalDueImpactSection bids={filtered} />
        </>
      )}
    </div>
  );
};

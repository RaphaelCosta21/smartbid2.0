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
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import { ExportBar } from "../components/reports/ExportBar";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useConfigStore } from "../stores/useConfigStore";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { useStatusColors } from "../hooks/useStatusColors";
import { PHASE_ORDER, volumeTrend } from "../utils/analyticsHelpers";
import { avgApprovalDaysBySector } from "../utils/approvalHelpers";
import { bidsToCSV, downloadCSV } from "../utils/exportHelpers";
import { isPastDue } from "../utils/formatters";
import { getDueFreezeDate } from "../utils/bidHelpers";
import { captureElementToPng, buildReportPdf } from "../utils/pdfExport";
import { ExportService } from "../services/ExportService";
import styles from "./OperationalSummaryPage.module.scss";

const CHART_SECTIONS: { key: string; title: string }[] = [
  { key: "workload", title: "Division Workloads" },
  { key: "phase", title: "Active BIDs by Phase" },
  { key: "throughput", title: "Throughput (Completed / Month)" },
  { key: "sector", title: "Avg Approval Time by Sector" },
];

export const OperationalSummaryPage: React.FC = () => {
  const { bids } = useBids();
  const config = useConfigStore((s) => s.config);
  const chart = useChartTheme();
  const { getPhaseColor } = useStatusColors();
  const {
    filters,
    patch,
    setPreset,
    reset,
    applyFilters,
    getFacetCounts,
    hasActive,
  } = useAnalyticsFilters();
  const [busy, setBusy] = React.useState(false);

  const chartEls = React.useRef<{ [k: string]: HTMLDivElement | null }>({});
  const setRef =
    (k: string) =>
    (el: HTMLDivElement | null): void => {
      chartEls.current[k] = el;
    };

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
    const avgCycle = completed.length
      ? Math.round(
          completed.reduce(
            (s, b) =>
              s +
              (new Date(b.completedDate as string).getTime() -
                new Date(b.createdDate).getTime()) /
                86400000,
            0,
          ) / completed.length,
        )
      : 0;
    return {
      active: active.length,
      pending: pending.length,
      overdue: overdue.length,
      completed: completed.length,
      avgCycle,
    };
  }, [filtered, isTerminal]);

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
    () => avgApprovalDaysBySector(filtered),
    [filtered],
  );

  const axisTick = { fill: chart.tick, fontSize: 12 };
  const legendStyle = { fontSize: 12, color: chart.textSecondary };

  const handleExcel = (): void => {
    ExportService.exportToExcel(filtered, {
      format: "xlsx",
      includeEquipment: false,
      includeHours: false,
      includeCostSummary: true,
      includeApprovalHistory: false,
      includeComments: false,
      includeActivityLog: false,
      title: "Operational-Summary",
    }).catch((e) => console.error(e));
  };
  const handleCsv = (): void => {
    downloadCSV(bidsToCSV(filtered), "Operational-Summary.csv");
  };
  const handlePdf = async (): Promise<void> => {
    setBusy(true);
    try {
      const bg = chart.mode === "dark" ? "#0f1b2d" : "#f8fafc";
      const charts: { title: string; dataUrl: string }[] = [];
      for (const sec of CHART_SECTIONS) {
        const el = chartEls.current[sec.key];
        if (el)
          charts.push({
            title: sec.title,
            dataUrl: await captureElementToPng(el, bg),
          });
      }
      await buildReportPdf({
        title: "Operational Summary",
        subtitle: `${filtered.length} BIDs`,
        kpis: [
          { label: "Active", value: String(stats.active) },
          { label: "Pending Approvals", value: String(stats.pending) },
          { label: "Overdue", value: String(stats.overdue) },
          { label: "Completed", value: String(stats.completed) },
          { label: "Average Cycle", value: `${stats.avgCycle}d` },
        ],
        charts,
        fileName: "Operational-Summary.pdf",
        orientation: "l",
      });
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setBusy(false);
    }
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
        rightSlot={
          <ExportBar
            onExcel={handleExcel}
            onCsv={handleCsv}
            onPdf={handlePdf}
            busy={busy}
          />
        }
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
              subtitle="overdue active BIDs"
            />
            <KPICard
              variant="glass"
              label="Completed"
              value={stats.completed}
              accentColor={chart.success}
              subtitle="in selected period"
            />
            <KPICard
              variant="glass"
              label="Average Cycle"
              value={`${stats.avgCycle}d`}
              accentColor={chart.accentTertiary}
              subtitle="creation → completion"
            />
            <KPICard
              variant="glass"
              label="Throughput"
              value={stats.completed}
              accentColor={chart.info}
              subtitle="completed in selected period"
            />
          </div>

          <div className={styles.chartsGrid2}>
            <div ref={setRef("workload")}>
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
                      />
                      <Bar
                        dataKey="pending"
                        name="Approvals"
                        fill={chart.warning}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      />
                      <Bar
                        dataKey="overdue"
                        name="Overdue"
                        fill={chart.danger}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </div>

            <div ref={setRef("phase")}>
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

          <div ref={setRef("throughput")} className={styles.spanAll}>
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

          <div ref={setRef("sector")} className={styles.spanAll}>
            <GlassCard
              title="Average Approval Time by Department"
              subtitle="Average days by department (completed approvals only)"
              accentColor={chart.warning}
            >
              {sectorData.length === 0 ? (
                  <EmptyState
                    title="No Completed Approvals"
                    description="Average department approval times will appear here once approval rounds are closed."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(220, sectorData.length * 44)}
                >
                  <BarChart
                    data={sectorData}
                    layout="vertical"
                    margin={{ top: 8, right: 44, bottom: 4, left: 8 }}
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
                      tick={{ fill: chart.tick, fontSize: 12 }}
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
                      maxBarSize={24}
                    >
                      <LabelList
                        dataKey="avgDays"
                        position="right"
                        formatter={(v: number) => `${v}d`}
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
        </>
      )}
    </div>
  );
};

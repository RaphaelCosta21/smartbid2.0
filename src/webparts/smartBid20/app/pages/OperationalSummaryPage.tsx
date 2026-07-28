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
  const { filters, patch, setPreset, reset, applyFilters, hasActive } =
    useAnalyticsFilters();
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

  const isTerminal = React.useCallback(
    (status: string) => terminalStatuses.indexOf(status) >= 0,
    [terminalStatuses],
  );

  const stats = React.useMemo(() => {
    const now = Date.now();
    const active = filtered.filter((b) => !isTerminal(b.currentStatus));
    const pending = filtered.filter((b) => b.approvalStatus === "pending");
    const overdue = active.filter((b) => {
      const due = b.desiredDueDate || b.dueDate;
      return due ? new Date(due).getTime() < now : false;
    });
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
    const now = Date.now();
    return divisions
      .map((d) => {
        const db = filtered.filter((b) => b.division === d.value);
        const active = db.filter((b) => !isTerminal(b.currentStatus)).length;
        const pending = db.filter((b) => b.approvalStatus === "pending").length;
        const overdue = db.filter((b) => {
          if (isTerminal(b.currentStatus)) return false;
          const due = b.desiredDueDate || b.dueDate;
          return due ? new Date(due).getTime() < now : false;
        }).length;
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
          { label: "Ativos", value: String(stats.active) },
          { label: "Aprovações Pendentes", value: String(stats.pending) },
          { label: "Atrasados", value: String(stats.overdue) },
          { label: "Concluídos", value: String(stats.completed) },
          { label: "Ciclo Médio", value: `${stats.avgCycle}d` },
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
        subtitle="Resumo operacional e throughput de BIDs"
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
          title="Nenhum BID no filtro atual"
          description="Ajuste o período ou os filtros."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              variant="glass"
              label="BIDs Ativos"
              value={stats.active}
              accentColor={chart.accent}
              subtitle="em andamento"
            />
            <KPICard
              variant="glass"
              label="Aprovações Pendentes"
              value={stats.pending}
              accentColor={chart.warning}
              subtitle="aguardando"
            />
            <KPICard
              variant="glass"
              label="Atrasados"
              value={stats.overdue}
              accentColor={chart.danger}
              subtitle="ativos vencidos"
            />
            <KPICard
              variant="glass"
              label="Concluídos"
              value={stats.completed}
              accentColor={chart.success}
              subtitle="no período"
            />
            <KPICard
              variant="glass"
              label="Ciclo Médio"
              value={`${stats.avgCycle}d`}
              accentColor={chart.accentTertiary}
              subtitle="criação → conclusão"
            />
            <KPICard
              variant="glass"
              label="Throughput"
              value={stats.completed}
              accentColor={chart.info}
              subtitle="entregues no período"
            />
          </div>

          <div className={styles.chartsGrid2}>
            <div ref={setRef("workload")}>
              <GlassCard
                title="Division Workloads"
                subtitle="Ativos, aprovações pendentes e atrasados por divisão"
                accentColor={chart.accentSecondary}
              >
                {divWorkloads.length === 0 ? (
                  <EmptyState title="Sem BIDs ativos" />
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
                        name="Ativos"
                        fill={chart.accentSecondary}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      />
                      <Bar
                        dataKey="pending"
                        name="Aprovações"
                        fill={chart.warning}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={30}
                      />
                      <Bar
                        dataKey="overdue"
                        name="Atrasados"
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
                subtitle="Distribuição dos BIDs ativos por fase"
                accentColor={chart.accentTertiary}
              >
                {phaseData.length === 0 ? (
                  <EmptyState title="Sem BIDs ativos" />
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
                        name="Ativos"
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
              subtitle="BIDs concluídos por mês"
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
                    name="Concluídos"
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
              title="Tempo Médio de Aprovação por Setor"
              subtitle="Dias médios por setor (apenas aprovações concluídas)"
              accentColor={chart.warning}
            >
              {sectorData.length === 0 ? (
                <EmptyState
                  title="Sem aprovações concluídas"
                  description="Assim que houver rodadas de aprovação fechadas, os tempos por setor aparecerão aqui."
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
                      name="Dias médios"
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

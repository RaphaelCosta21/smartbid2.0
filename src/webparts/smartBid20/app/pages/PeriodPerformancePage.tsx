import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Label,
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
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { DataTable } from "../components/common/DataTable";
import { Sparkline } from "../components/charts/Sparkline";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import {
  SegmentedControl,
  SegmentOption,
} from "../components/insights/SegmentedControl";
import { ExportBar } from "../components/reports/ExportBar";
import { useChartTheme, categoricalColor } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useConfigStore } from "../stores/useConfigStore";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { formatDate } from "../utils/formatters";
import { bidsToCSV, downloadCSV } from "../utils/exportHelpers";
import { captureElementToPng, buildReportPdf } from "../utils/pdfExport";
import { ExportService } from "../services/ExportService";
import {
  StatusOption,
  statusCounts,
  divisionCounts,
  serviceLineCounts,
  monthlyStatusStacked,
  statusByClient,
  winRateByClient,
  byCommercialRequester,
  clientPerformanceByDivision,
  bidTableRows,
  BidTableRow,
  ClientPerfRow,
} from "../utils/reportHelpers";
import styles from "./PeriodPerformancePage.module.scss";

const CHART_SECTIONS: { key: string; title: string }[] = [
  { key: "status", title: "Status Distribution" },
  { key: "division", title: "BIDs by Division" },
  { key: "monthly", title: "Monthly BID Status Distribution" },
  { key: "byClient", title: "Status Distribution by Client" },
  { key: "winClient", title: "Won Rate by Client" },
  { key: "requester", title: "BIDs by Commercial Requester" },
  { key: "businessLine", title: "BIDs by Business Line" },
];

export const PeriodPerformancePage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const config = useConfigStore((s) => s.config);
  const chart = useChartTheme();
  const year = new Date().getFullYear();

  const { filters, patch, setPreset, reset, applyFilters, hasActive } =
    useAnalyticsFilters({
      preset: "custom",
      from: `${year}-01-01`,
      to: `${year}-12-31`,
    });

  const [sortClient, setSortClient] = React.useState<"total" | "az">("total");
  const [winOrder, setWinOrder] = React.useState<"desc" | "asc" | "az">("desc");
  const [tableStatus, setTableStatus] = React.useState<string>("all");
  const [busy, setBusy] = React.useState(false);

  const chartEls = React.useRef<{ [k: string]: HTMLDivElement | null }>({});
  const setRef =
    (k: string) =>
    (el: HTMLDivElement | null): void => {
      chartEls.current[k] = el;
    };

  /* ---- config-driven options ---- */
  const terminalStatuses = React.useMemo(() => {
    const t = (
      (config as unknown as { terminalStatuses?: { value: string }[] })
        ?.terminalStatuses || []
    )
      .map((x) => x.value)
      .filter(Boolean);
    return t.length
      ? t
      : [
          "Completed",
          "Canceled",
          "No Bid",
          "Returned to Commercial",
          "Client Canceled",
        ];
  }, [config]);

  const resultOptions = React.useMemo<StatusOption[]>(() => {
    const o = (config?.bidResultOptions || []).filter(
      (x) => x.isActive !== false,
    );
    if (o.length > 0) {
      return o.map((x) => ({
        value: x.value,
        label: x.label || x.value,
        color: x.color || "#94a3b8",
      }));
    }
    return [
      { value: "Won", label: "Won", color: "#10B981" },
      { value: "Loss", label: "Lost", color: "#EF4444" },
      { value: "Client Canceled", label: "Canceled", color: "#f59e0b" },
      { value: "No Bid", label: "No-Bid", color: "#94a3b8" },
      { value: "Pending", label: "Pending", color: "#F59E0B" },
      { value: "Renegotiation", label: "Renegotiation", color: "#8B5CF6" },
    ];
  }, [config]);

  const statusOptions = React.useMemo<StatusOption[]>(
    () => [
      ...resultOptions,
      { value: "Open", label: "Still Open", color: chart.accentSecondary },
    ],
    [resultOptions, chart.accentSecondary],
  );
  const statusValues = React.useMemo(
    () => statusOptions.map((s) => s.value),
    [statusOptions],
  );
  const statusColor = React.useCallback(
    (v: string) => statusOptions.find((s) => s.value === v)?.color || "#94a3b8",
    [statusOptions],
  );

  const divisions = React.useMemo<StatusOption[]>(() => {
    const d = (config?.divisions || []).filter((x) => x.isActive !== false);
    if (d.length > 0) {
      return d.map((x) => ({
        value: x.value,
        label: x.label || x.value,
        color: x.color || "#94a3b8",
      }));
    }
    return [
      { value: "OPG", label: "OPG", color: "#3b82f6" },
      { value: "SSR-Survey", label: "SSR-Survey", color: "#10b981" },
      { value: "SSR-ROV", label: "SSR-ROV", color: "#f59e0b" },
      { value: "SSR-Integrated", label: "SSR-Integrated", color: "#8b5cf6" },
    ];
  }, [config]);

  const serviceLines = React.useMemo<StatusOption[]>(
    () =>
      (config?.serviceLines || [])
        .filter((x) => x.isActive !== false)
        .map((x, i) => ({
          value: x.value,
          label: x.label || x.value,
          color: x.color || categoricalColor(i),
        })),
    [config],
  );

  const bidTypeOptions = React.useMemo(() => {
    const bt = (
      config as unknown as {
        bidTypes?: { value: string; label?: string }[];
      }
    )?.bidTypes;
    if (bt && bt.length > 0) {
      return bt.map((x) => ({ value: x.value, label: x.label || x.value }));
    }
    return ["Firm", "Budgetary", "RFI", "Extension", "Amendment"].map((v) => ({
      value: v,
      label: v,
    }));
  }, [config]);

  const filtered = React.useMemo(
    () => applyFilters(bids, "createdDate"),
    [bids, applyFilters],
  );

  /* ---- aggregations ---- */
  const sCountsAll = React.useMemo(
    () => statusCounts(filtered, statusOptions, terminalStatuses),
    [filtered, statusOptions, terminalStatuses],
  );
  const divCounts = React.useMemo(
    () => divisionCounts(filtered, divisions),
    [filtered, divisions],
  );
  const slCounts = React.useMemo(
    () => serviceLineCounts(filtered, serviceLines),
    [filtered, serviceLines],
  );
  const monthly = React.useMemo(
    () => monthlyStatusStacked(filtered, statusValues, terminalStatuses),
    [filtered, statusValues, terminalStatuses],
  );
  const byClient = React.useMemo(() => {
    const r = statusByClient(filtered, 10, statusValues, terminalStatuses);
    return sortClient === "az"
      ? r.slice().sort((a, b) => a.client.localeCompare(b.client))
      : r;
  }, [filtered, statusValues, terminalStatuses, sortClient]);
  const winByClient = React.useMemo(
    () => winRateByClient(filtered, 10, winOrder),
    [filtered, winOrder],
  );
  const requesters = React.useMemo(
    () => byCommercialRequester(filtered),
    [filtered],
  );
  const perfByDivision = React.useMemo(
    () =>
      divisions
        .map((d) => ({
          division: d,
          perf: clientPerformanceByDivision(filtered, d.value),
        }))
        .filter((x) => x.perf.summary.total > 0),
    [filtered, divisions],
  );
  const allTableRows = React.useMemo(
    () => bidTableRows(filtered, terminalStatuses),
    [filtered, terminalStatuses],
  );
  const tableRows = React.useMemo(
    () =>
      tableStatus === "all"
        ? allTableRows
        : allTableRows.filter((r) => r.status === tableStatus),
    [allTableRows, tableStatus],
  );

  const total = filtered.length;
  const won = filtered.filter((b) => b.bidResult?.outcome === "Won").length;
  const lost = filtered.filter((b) => b.bidResult?.outcome === "Loss").length;
  const winRate = won + lost > 0 ? Math.round((won / (won + lost)) * 100) : 0;
  const totalSeries = monthly.map((m) => m.total as number);

  const axisTick = { fill: chart.tick, fontSize: 12 };
  const legendStyle = { fontSize: 12, color: chart.textSecondary };

  /* ---- export ---- */
  const handleExcel = (): void => {
    ExportService.exportToExcel(filtered, {
      format: "xlsx",
      includeEquipment: false,
      includeHours: false,
      includeCostSummary: true,
      includeApprovalHistory: false,
      includeComments: false,
      includeActivityLog: false,
      title: `Period-Performance-${year}`,
    }).catch((e) => console.error(e));
  };

  const handleCsv = (): void => {
    downloadCSV(bidsToCSV(filtered), `Period-Performance-${year}.csv`);
  };

  const handlePdf = async (): Promise<void> => {
    setBusy(true);
    try {
      const bg = chart.mode === "dark" ? "#0f1b2d" : "#f8fafc";
      const charts: { title: string; dataUrl: string }[] = [];
      for (const sec of CHART_SECTIONS) {
        const el = chartEls.current[sec.key];
        if (el) {
          const dataUrl = await captureElementToPng(el, bg);
          charts.push({ title: sec.title, dataUrl });
        }
      }
      const kpis = [
        { label: "Total de BIDs", value: String(total) },
        ...sCountsAll.map((s) => ({ label: s.label, value: String(s.count) })),
        { label: "Win Rate", value: `${winRate}%` },
      ];
      const head = [
        "BID",
        "Title",
        "Client",
        "Status",
        "Division",
        "Business Line",
        "Created",
        "Assigned To",
      ];
      const body = tableRows.map((r) => [
        r.bidNumber,
        r.title,
        r.client,
        r.status,
        r.division,
        r.businessLine,
        r.created ? formatDate(r.created) : "",
        r.assignedTo,
      ]);
      await buildReportPdf({
        title: `Period Performance ${year}`,
        subtitle: `${total} BIDs`,
        kpis,
        charts,
        tables: [{ title: "BID Details", head, body }],
        fileName: `Period-Performance-${year}.pdf`,
        orientation: "l",
      });
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setBusy(false);
    }
  };

  /* ---- render helpers ---- */
  const Donut: React.FC<{
    data: { label: string; count: number; color: string }[];
  }> = ({ data }) => {
    const shown = data.filter((d) => d.count > 0);
    const sum = shown.reduce((s, d) => s + d.count, 0);
    if (shown.length === 0) return <EmptyState title="Sem dados" />;
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Tooltip content={<ChartTooltip hideLabel />} />
          <Pie
            data={shown}
            dataKey="count"
            nameKey="label"
            innerRadius={66}
            outerRadius={98}
            paddingAngle={2}
            strokeWidth={0}
          >
            {shown.map((d, i) => (
              <Cell key={i} fill={d.color} />
            ))}
            <Label
              content={(props: { viewBox?: { cx?: number; cy?: number } }) => {
                const vb = props.viewBox || { cx: 0, cy: 0 };
                return (
                  <g>
                    <text
                      x={vb.cx}
                      y={(vb.cy || 0) - 4}
                      textAnchor="middle"
                      fill={chart.textPrimary}
                      style={{ fontSize: 24, fontWeight: 800 }}
                    >
                      {sum}
                    </text>
                    <text
                      x={vb.cx}
                      y={(vb.cy || 0) + 16}
                      textAnchor="middle"
                      fill={chart.textMuted}
                      style={{ fontSize: 11 }}
                    >
                      Total BIDs
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
          <Legend wrapperStyle={legendStyle} />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderPerfSection = (
    title: string,
    rows: ClientPerfRow[],
    waste: boolean,
  ): React.ReactNode => (
    <div className={styles.perfSection}>
      <div className={styles.perfSectionTitle}>{title}</div>
      <div className={styles.perfList}>
        {rows.length === 0 ? (
          <div className={styles.perfEmpty}>—</div>
        ) : (
          rows.map((r) => (
            <div className={styles.perfRow} key={r.client}>
              <span className={styles.perfRowName}>{r.client}</span>
              <span className={styles.perfRowMeta}>
                {waste ? (
                  <>
                    {r.total} BIDs ·{" "}
                    <span style={{ color: chart.danger }}>0 Wins</span>
                  </>
                ) : (
                  <>
                    {r.total} BIDs · {r.won} Won ·{" "}
                    <span
                      style={{
                        color:
                          r.winRate >= 50
                            ? chart.success
                            : r.winRate > 0
                              ? chart.warning
                              : chart.danger,
                      }}
                    >
                      {r.winRate}%
                    </span>
                  </>
                )}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const tableStatusSegments: SegmentOption<string>[] = [
    { value: "all", label: "Todos" },
    ...statusOptions.map((s) => ({ value: s.value, label: s.label })),
  ];

  const columns = [
    {
      key: "title",
      header: "Title",
      render: (r: BidTableRow) => (
        <span className={styles.cellStrong}>{r.title}</span>
      ),
    },
    { key: "requester", header: "Requester" },
    { key: "crm", header: "CRM" },
    { key: "client", header: "Client" },
    {
      key: "status",
      header: "Status",
      render: (r: BidTableRow) => (
        <span
          className={styles.statusBadge}
          style={{
            color: statusColor(r.status),
            background: `${statusColor(r.status)}1f`,
            borderColor: `${statusColor(r.status)}40`,
          }}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "justificative",
      header: "Justificative",
      render: (r: BidTableRow) => (
        <span className={styles.cellMuted}>{r.justificative || "—"}</span>
      ),
    },
    { key: "division", header: "Division" },
    { key: "businessLine", header: "Business Line" },
    {
      key: "created",
      header: "Created",
      sortable: true,
      render: (r: BidTableRow) => (
        <span className={styles.cellMuted}>
          {r.created ? formatDate(r.created) : "—"}
        </span>
      ),
    },
    { key: "assignedTo", header: "Assigned To" },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title={`BID Analytics — ${year}`}
        subtitle="Panorama consolidado de desempenho por período"
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

      {total === 0 ? (
        <EmptyState
          variant="glass"
          title="Nenhum BID no filtro atual"
          description="Ajuste o período ou os filtros para ver o panorama."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              variant="glass"
              label="Total de BIDs"
              value={total}
              accentColor={chart.accentSecondary}
              subtitle="no período"
              sparkline={
                <Sparkline
                  data={totalSeries}
                  color={chart.accentSecondary}
                  height={32}
                />
              }
            />
            {sCountsAll.map((s) => (
              <KPICard
                key={s.value}
                variant="glass"
                label={s.label}
                value={s.count}
                accentColor={s.color}
              />
            ))}
            <KPICard
              variant="glass"
              label="Win Rate"
              value={`${winRate}%`}
              accentColor={chart.success}
              subtitle="won / decididos"
            />
          </div>

          <div className={styles.chartsGrid2}>
            <div ref={setRef("status")}>
              <GlassCard
                title="Status Distribution"
                subtitle="Distribuição por resultado"
                accentColor={chart.accentSecondary}
              >
                <Donut data={sCountsAll} />
              </GlassCard>
            </div>
            <div ref={setRef("division")}>
              <GlassCard
                title="BIDs by Division"
                subtitle="Distribuição por divisão"
                accentColor={chart.accent}
              >
                <Donut data={divCounts} />
              </GlassCard>
            </div>
          </div>

          <div ref={setRef("monthly")} className={styles.spanAll}>
            <GlassCard
              title="Monthly BID Status Distribution"
              subtitle="Volume mensal por status"
              accentColor={chart.accentTertiary}
            >
              <ResponsiveContainer width="100%" height={340}>
                <BarChart
                  data={monthly}
                  margin={{ top: 20, right: 16, bottom: 4, left: -8 }}
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
                  <Legend wrapperStyle={legendStyle} />
                  {statusOptions.map((s, i) => (
                    <Bar
                      key={s.value}
                      dataKey={s.value}
                      name={s.label}
                      stackId="s"
                      fill={s.color}
                      maxBarSize={54}
                    >
                      {i === statusOptions.length - 1 && (
                        <LabelList
                          dataKey="total"
                          position="top"
                          fill={chart.textSecondary}
                          fontSize={11}
                        />
                      )}
                    </Bar>
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          <div className={styles.chartsGrid2}>
            <div ref={setRef("byClient")}>
              <GlassCard
                title="Status Distribution by Client (Top 10)"
                accentColor={chart.info}
                actions={
                  <SegmentedControl<"total" | "az">
                    value={sortClient}
                    segments={[
                      { value: "total", label: "Total" },
                      { value: "az", label: "A-Z" },
                    ]}
                    onChange={setSortClient}
                    size="sm"
                  />
                }
              >
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(260, byClient.length * 34)}
                >
                  <BarChart
                    data={byClient}
                    layout="vertical"
                    margin={{ top: 8, right: 16, bottom: 4, left: 8 }}
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
                      dataKey="client"
                      width={120}
                      tick={{ fill: chart.tick, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: chart.referenceFill }}
                      content={<ChartTooltip />}
                    />
                    <Legend wrapperStyle={legendStyle} />
                    {statusOptions.map((s) => (
                      <Bar
                        key={s.value}
                        dataKey={s.value}
                        name={s.label}
                        stackId="c"
                        fill={s.color}
                        maxBarSize={22}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            <div ref={setRef("winClient")}>
              <GlassCard
                title="Won Rate by Client (Top 10)"
                accentColor={chart.success}
                actions={
                  <SegmentedControl<"desc" | "asc" | "az">
                    value={winOrder}
                    segments={[
                      { value: "desc", label: "Desc" },
                      { value: "asc", label: "Asc" },
                      { value: "az", label: "A-Z" },
                    ]}
                    onChange={setWinOrder}
                    size="sm"
                  />
                }
              >
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(260, winByClient.length * 34)}
                >
                  <BarChart
                    data={winByClient}
                    layout="vertical"
                    margin={{ top: 8, right: 52, bottom: 4, left: 8 }}
                  >
                    <CartesianGrid horizontal={false} stroke={chart.grid} />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tickFormatter={(v) => `${v}%`}
                      tick={axisTick}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="client"
                      width={120}
                      tick={{ fill: chart.tick, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: chart.referenceFill }}
                      content={<ChartTooltip valueFormatter={(v) => `${v}%`} />}
                    />
                    <Bar
                      dataKey="winRate"
                      name="Win rate"
                      fill={chart.success}
                      radius={[0, 6, 6, 0]}
                      maxBarSize={22}
                    >
                      <LabelList
                        dataKey="winRate"
                        position="right"
                        formatter={(v: number) => `${v}%`}
                        fill={chart.textSecondary}
                        fontSize={11}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>
          </div>

          <div className={styles.chartsGrid2}>
            <div ref={setRef("requester")}>
              <GlassCard
                title="BIDs by Commercial Requester"
                subtitle="Total vs. ganhos por solicitante"
                accentColor={chart.accentSecondary}
              >
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(240, requesters.length * 46)}
                >
                  <BarChart
                    data={requesters}
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
                      dataKey="name"
                      width={120}
                      tick={{ fill: chart.tick, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: chart.referenceFill }}
                      content={<ChartTooltip />}
                    />
                    <Legend wrapperStyle={legendStyle} />
                    <Bar
                      dataKey="total"
                      name="Total BIDs"
                      fill={chart.accentSecondary}
                      radius={[0, 5, 5, 0]}
                      maxBarSize={14}
                    >
                      <LabelList
                        dataKey="total"
                        position="right"
                        fill={chart.textSecondary}
                        fontSize={11}
                      />
                    </Bar>
                    <Bar
                      dataKey="won"
                      name="Won BIDs"
                      fill={chart.success}
                      radius={[0, 5, 5, 0]}
                      maxBarSize={14}
                    >
                      <LabelList
                        dataKey="won"
                        position="right"
                        fill={chart.textSecondary}
                        fontSize={11}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </div>

            <div ref={setRef("businessLine")}>
              <GlassCard
                title="BIDs by Business Line"
                subtitle="Distribuição por service line"
                accentColor={chart.accentTertiary}
              >
                <Donut data={slCounts} />
              </GlassCard>
            </div>
          </div>

          <GlassCard
            title="BID Details Table"
            accentColor={chart.info}
            className={styles.spanAll}
            noBodyPadding
            actions={
              <SegmentedControl<string>
                value={tableStatus}
                segments={tableStatusSegments}
                onChange={setTableStatus}
                size="sm"
              />
            }
          >
            <div className={styles.tableWrap}>
              <DataTable<BidTableRow>
                data={tableRows}
                columns={columns}
                onRowClick={(r) =>
                  navigate(`/bid/${encodeURIComponent(r.bidNumber)}`)
                }
                emptyMessage="Nenhum BID"
              />
            </div>
          </GlassCard>

          <GlassCard
            title="Client Performance Analysis by Division"
            subtitle="High Effort / Top Performers / Time Wasters"
            accentColor={chart.accent}
            className={styles.spanAll}
          >
            <div className={styles.clientPerfGrid}>
              {perfByDivision.map(({ division, perf }) => (
                <div className={styles.perfCard} key={division.value}>
                  <div className={styles.perfHeader}>
                    <span
                      className={styles.perfDot}
                      style={{ background: division.color }}
                    />
                    <span className={styles.perfDivLabel}>
                      {division.label}
                    </span>
                  </div>
                  <div className={styles.perfSummary}>
                    <div className={styles.perfSummaryCell}>
                      <span className={styles.perfSummaryValue}>
                        {perf.summary.total}
                      </span>
                      <span className={styles.perfSummaryLabel}>Total</span>
                    </div>
                    <div className={styles.perfSummaryCell}>
                      <span
                        className={styles.perfSummaryValue}
                        style={{ color: chart.success }}
                      >
                        {perf.summary.won}
                      </span>
                      <span className={styles.perfSummaryLabel}>Won</span>
                    </div>
                    <div className={styles.perfSummaryCell}>
                      <span
                        className={styles.perfSummaryValue}
                        style={{ color: chart.danger }}
                      >
                        {perf.summary.lostCanceled}
                      </span>
                      <span className={styles.perfSummaryLabel}>
                        Lost/Canc.
                      </span>
                    </div>
                  </div>
                  {renderPerfSection(
                    "⚠ High Effort, Low Return",
                    perf.highEffortLowReturn,
                    false,
                  )}
                  {renderPerfSection(
                    "🏆 Top Performers",
                    perf.topPerformers,
                    false,
                  )}
                  {renderPerfSection("⏳ Time Wasters", perf.timeWasters, true)}
                </div>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  );
};

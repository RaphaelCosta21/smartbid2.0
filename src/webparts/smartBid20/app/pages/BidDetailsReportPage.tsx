import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
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
import { Timeline } from "../components/common/Timeline";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { ExportBar } from "../components/reports/ExportBar";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import {
  computeBidSectorDurations,
  computeApprovalCycleTime,
} from "../utils/approvalHelpers";
import { getSectorColor } from "../config/sectors.config";
import {
  formatCurrency,
  formatCurrencyCompact,
  formatNumber,
  formatDateTime,
} from "../utils/formatters";
import { captureElementToPng, buildReportPdf } from "../utils/pdfExport";
import { ExportService } from "../services/ExportService";
import { bidsToCSV, downloadCSV } from "../utils/exportHelpers";
import { IBid, IScopeItem, ICostSummary } from "../models";
import { ROUTES } from "../config/routes.config";
import styles from "./BidDetailsReportPage.module.scss";

const CHART_SECTIONS: { key: string; title: string }[] = [
  { key: "cost", title: "Cost Composition" },
  { key: "hours", title: "Hours by Category" },
  { key: "sector", title: "Approval Time by Sector" },
];

export const BidDetailsReportPage: React.FC = () => {
  const { bids } = useBids();
  const navigate = useNavigate();
  const chart = useChartTheme();
  const [busy, setBusy] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<string>("");

  const chartEls = React.useRef<{ [k: string]: HTMLDivElement | null }>({});
  const setRef =
    (k: string) =>
    (el: HTMLDivElement | null): void => {
      chartEls.current[k] = el;
    };

  const sortedBids = React.useMemo(
    () =>
      bids
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdDate || 0).getTime() -
            new Date(a.createdDate || 0).getTime(),
        ),
    [bids],
  );

  const filteredOptions = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedBids;
    return sortedBids.filter((b) => {
      const client = b.opportunityInfo?.client || "";
      const project = b.opportunityInfo?.projectName || "";
      return (
        b.bidNumber.toLowerCase().indexOf(q) >= 0 ||
        client.toLowerCase().indexOf(q) >= 0 ||
        project.toLowerCase().indexOf(q) >= 0
      );
    });
  }, [sortedBids, search]);

  // Default selection = most recent bid.
  React.useEffect(() => {
    if (!selected && sortedBids.length > 0) {
      setSelected(sortedBids[0].bidNumber);
    }
  }, [sortedBids, selected]);

  const bid: IBid | undefined = React.useMemo(
    () => bids.find((b) => b.bidNumber === selected),
    [bids, selected],
  );

  const cs = (bid?.costSummary || {}) as ICostSummary;
  const hs = bid?.hoursSummary;
  const currency = cs.currency || "USD";

  const costData = React.useMemo(() => {
    if (!bid) return [];
    const rows = [
      { name: "Assets", value: cs.assetsCostUSD || 0 },
      { name: "Hours", value: cs.totalHoursCostUSD || 0 },
      { name: "Logistics", value: cs.logisticsCostUSD || 0 },
      { name: "Certifications", value: cs.certificationsCostUSD || 0 },
      { name: "RTS", value: cs.rtsCostUSD || 0 },
      { name: "Mobilization", value: cs.mobilizationCostUSD || 0 },
      { name: "Consumables", value: cs.consumablesCostUSD || 0 },
    ];
    return rows.filter((r) => r.value > 0);
  }, [bid, cs]);

  const hoursData = React.useMemo(() => {
    if (!hs) return [];
    return [
      { name: "Engineering", hours: hs.engineeringHours?.totalHours || 0 },
      { name: "Onshore", hours: hs.onshoreHours?.totalHours || 0 },
      { name: "Offshore", hours: hs.offshoreHours?.totalHours || 0 },
    ].filter((r) => r.hours > 0);
  }, [hs]);

  const sectorData = React.useMemo(() => {
    if (!bid) return [];
    return computeBidSectorDurations(bid).map((d) => ({
      label: d.sectorLabel,
      days: Math.round((d.durationHours / 24) * 10) / 10,
      approvers: d.approverCount,
      color: getSectorColor(d.sector),
    }));
  }, [bid]);

  const equipmentRows = React.useMemo(
    () => (bid?.scopeItems || []).filter((s) => !s.isSection),
    [bid],
  );

  const timelineItems = React.useMemo(() => {
    if (!bid) return [];
    return (bid.activityLog || [])
      .slice()
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, 25)
      .map((e) => ({
        id: e.id,
        title: e.description || e.type,
        description: e.actorName ? `por ${e.actorName}` : undefined,
        timestamp: formatDateTime(e.timestamp),
        color: chart.accent,
      }));
  }, [bid, chart.accent]);

  const cycleTime = bid ? computeApprovalCycleTime(bid) : null;

  const axisTick = { fill: chart.tick, fontSize: 12 };

  const equipmentColumns = [
    {
      key: "lineNumber",
      header: "#",
      width: 48,
      render: (r: IScopeItem) => (
        <span className={styles.cellMuted}>{r.lineNumber}</span>
      ),
    },
    {
      key: "description",
      header: "Descrição",
      render: (r: IScopeItem) => (
        <span className={styles.cellStrong}>{r.description || "—"}</span>
      ),
    },
    {
      key: "resourceType",
      header: "Tipo",
      render: (r: IScopeItem) => (
        <span className={styles.cellMuted}>
          {[r.resourceType, r.resourceSubType].filter(Boolean).join(" · ") ||
            "—"}
        </span>
      ),
    },
    {
      key: "qtyOperational",
      header: "Qtd Op.",
      width: 80,
      render: (r: IScopeItem) => r.qtyOperational ?? 0,
    },
    {
      key: "qtySpare",
      header: "Qtd Spare",
      width: 90,
      render: (r: IScopeItem) => r.qtySpare ?? 0,
    },
  ];

  const handleExcel = (): void => {
    if (!bid) return;
    ExportService.exportToExcel([bid], {
      format: "xlsx",
      includeEquipment: true,
      includeHours: true,
      includeCostSummary: true,
      includeApprovalHistory: true,
      includeComments: false,
      includeActivityLog: true,
      title: `BID-${bid.bidNumber}`,
    }).catch((e) => console.error(e));
  };
  const handleCsv = (): void => {
    if (!bid) return;
    downloadCSV(bidsToCSV([bid]), `BID-${bid.bidNumber}.csv`);
  };
  const handlePdf = async (): Promise<void> => {
    if (!bid) return;
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
        title: `BID ${bid.bidNumber}`,
        subtitle: `${bid.opportunityInfo?.client || ""} — ${
          bid.opportunityInfo?.projectName || ""
        }`,
        kpis: [
          {
            label: "Custo Total",
            value: formatCurrencyCompact(cs.totalCostUSD || 0, currency),
          },
          {
            label: "Horas Totais",
            value: formatNumber(hs?.grandTotalHours || 0),
          },
          { label: "Itens de Escopo", value: String(equipmentRows.length) },
          {
            label: "Ciclo Aprovação",
            value: cycleTime != null ? `${cycleTime}d` : "—",
          },
          { label: "Status", value: bid.currentStatus },
        ],
        charts,
        tables:
          sectorData.length > 0
            ? [
                {
                  head: ["Setor", "Dias", "Aprovadores"],
                  body: sectorData.map((s) => [
                    s.label,
                    `${s.days}d`,
                    String(s.approvers),
                  ]),
                },
              ]
            : undefined,
        fileName: `BID-${bid.bidNumber}.pdf`,
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
        title="BID Details"
        subtitle="Relatório detalhado de um BID específico"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        }
      />

      <div className={styles.pickerBar}>
        <div className={styles.pickerSearch}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por número, cliente ou projeto…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={styles.pickerSelect}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {filteredOptions.length === 0 && (
            <option value="">Sem resultados</option>
          )}
          {filteredOptions.map((b) => (
            <option key={b.bidNumber} value={b.bidNumber}>
              {b.bidNumber} — {b.opportunityInfo?.client || "?"} —{" "}
              {b.opportunityInfo?.projectName || "?"}
            </option>
          ))}
        </select>
        <ExportBar
          onExcel={handleExcel}
          onCsv={handleCsv}
          onPdf={handlePdf}
          busy={busy}
        />
      </div>

      {!bid ? (
        <EmptyState
          variant="glass"
          title="Selecione um BID"
          description="Escolha um BID acima para ver o relatório detalhado."
        />
      ) : (
        <>
          <div className={styles.kpiRow}>
            <KPICard
              variant="glass"
              label="Custo Total"
              value={formatCurrencyCompact(cs.totalCostUSD || 0, currency)}
              accentColor={chart.accent}
              subtitle={formatCurrency(cs.totalCostUSD || 0, currency)}
            />
            <KPICard
              variant="glass"
              label="Horas Totais"
              value={formatNumber(hs?.grandTotalHours || 0)}
              accentColor={chart.accentTertiary}
              subtitle="eng + onshore + offshore"
            />
            <KPICard
              variant="glass"
              label="Itens de Escopo"
              value={equipmentRows.length}
              accentColor={chart.accentSecondary}
              subtitle="equipamentos/serviços"
            />
            <KPICard
              variant="glass"
              label="Ciclo de Aprovação"
              value={cycleTime != null ? `${cycleTime}d` : "—"}
              accentColor={chart.warning}
              subtitle="request → conclusão"
            />
            <KPICard
              variant="glass"
              label="Status"
              value={bid.currentStatus}
              accentColor={chart.info}
              subtitle={bid.currentPhase}
            />
          </div>

          <div className={styles.chartsGrid2}>
            <div ref={setRef("cost")}>
              <GlassCard
                title="Cost Composition"
                subtitle={`Distribuição de custo (${currency})`}
                accentColor={chart.accent}
              >
                {costData.length === 0 ? (
                  <EmptyState title="Sem dados de custo" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={costData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={62}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {costData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={
                              chart.categorical[i % chart.categorical.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={
                          <ChartTooltip
                            valueFormatter={(v) =>
                              formatCurrency(Number(v), currency)
                            }
                          />
                        }
                      />
                      <Legend
                        wrapperStyle={{
                          fontSize: 12,
                          color: chart.textSecondary,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </div>

            <div ref={setRef("hours")}>
              <GlassCard
                title="Hours by Category"
                subtitle="Distribuição de horas planejadas"
                accentColor={chart.accentTertiary}
              >
                {hoursData.length === 0 ? (
                  <EmptyState title="Sem dados de horas" />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={hoursData}
                      margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
                    >
                      <CartesianGrid vertical={false} stroke={chart.grid} />
                      <XAxis
                        dataKey="name"
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
                        content={
                          <ChartTooltip valueFormatter={(v) => `${v} h`} />
                        }
                      />
                      <Bar
                        dataKey="hours"
                        name="Horas"
                        fill={chart.accentTertiary}
                        radius={[4, 4, 0, 0]}
                        maxBarSize={70}
                      >
                        <LabelList
                          dataKey="hours"
                          position="top"
                          fill={chart.textSecondary}
                          fontSize={11}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </GlassCard>
            </div>
          </div>

          <div ref={setRef("sector")} className={styles.spanAll}>
            <GlassCard
              title="Tempo de Aprovação por Setor"
              subtitle="Dias por setor neste BID (rodadas concluídas)"
              accentColor={chart.warning}
            >
              {sectorData.length === 0 ? (
                <EmptyState
                  title="Sem aprovações concluídas"
                  description="Os tempos por setor aparecem quando as rodadas de aprovação forem fechadas."
                />
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={Math.max(200, sectorData.length * 46)}
                >
                  <BarChart
                    data={sectorData}
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
                      dataKey="days"
                      name="Dias"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={26}
                    >
                      <LabelList
                        dataKey="days"
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

          <div className={styles.chartsGrid2}>
            <GlassCard
              title="Itens de Escopo"
              subtitle={`${equipmentRows.length} equipamentos/serviços`}
              accentColor={chart.accentSecondary}
              noBodyPadding
            >
              <div className={styles.tableWrap}>
                <DataTable
                  data={equipmentRows}
                  columns={equipmentColumns}
                  emptyMessage="Sem itens de escopo"
                />
              </div>
            </GlassCard>

            <GlassCard
              title="Histórico de Atividades"
              subtitle="Últimas 25 atividades"
              accentColor={chart.info}
            >
              {timelineItems.length === 0 ? (
                <EmptyState title="Sem atividades registradas" />
              ) : (
                <div className={styles.timelineWrap}>
                  <Timeline items={timelineItems} />
                </div>
              )}
            </GlassCard>
          </div>

          <div className={styles.footerActions}>
            <button
              type="button"
              className={styles.openBtn}
              onClick={() =>
                navigate(ROUTES.bidDetail.replace(":id", bid.bidNumber))
              }
            >
              Abrir BID completo →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { DataTable } from "../components/common/DataTable";
import { useBids } from "../hooks/useBids";
import { useConfigStore } from "../stores/useConfigStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useBidStore } from "../stores/useBidStore";
import { BidService } from "../services/BidService";
import { GlassCard } from "../components/common/GlassCard";
import { KPICard } from "../components/common/KPICard";
import { ChartTooltip } from "../components/charts/ChartTooltip";
import { Sparkline } from "../components/charts/Sparkline";
import { AnalyticsFilterBar } from "../components/insights/AnalyticsFilterBar";
import { useChartTheme } from "../hooks/useChartTheme";
import { useAnalyticsFilters } from "../hooks/useAnalyticsFilters";
import { winRateTrend } from "../utils/analyticsHelpers";
import { formatDate } from "../utils/formatters";
import { IBid, IBidResult } from "../models";
import {
  ComposedChart,
  PieChart,
  Pie,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Label,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import styles from "./FollowUpPage.module.scss";

/* ─────────────────────────────── Component ─────────────────────────────── */

export const FollowUpPage: React.FC = () => {
  const { bids } = useBids();
  const config = useConfigStore((s) => s.config);
  const setBids = useBidStore((s) => s.setBids);
  const currentUser = useAuthStore((s) => s.currentUser);
  const navigate = useNavigate();
  const chart = useChartTheme();

  // Access control: only Commercial and Engineering teams can edit
  const canEdit = React.useMemo(() => {
    if (currentUser.isSuperAdmin) return true;
    const team = (
      currentUser.teamCategory ||
      currentUser.role ||
      ""
    ).toLowerCase();
    return team === "commercial" || team === "engineering";
  }, [currentUser]);

  // Top-level filters (division / service line / date / search) via shared bar
  const { filters, patch, setPreset, reset, applyFilters, hasActive } =
    useAnalyticsFilters();

  // Table-level filters
  const [outcomeFilter, setOutcomeFilter] = React.useState<string>("all");
  const [sortOrder, setSortOrder] = React.useState<
    "newest" | "oldest" | "created-newest" | "created-oldest"
  >("newest");
  const [drawerBid, setDrawerBid] = React.useState<IBid | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Drawer form state
  const [formOutcome, setFormOutcome] = React.useState<string | null>(null);
  const [formLossReason, setFormLossReason] = React.useState<string>("");
  const [formCompetitor, setFormCompetitor] = React.useState<string>("");
  const [formNotes, setFormNotes] = React.useState<string>("");
  const [formFollowUpDate, setFormFollowUpDate] = React.useState<string>("");

  /* ────────────────────── Config-driven options ────────────────────── */

  const bidResultOptions = React.useMemo(() => {
    if (config?.bidResultOptions && config.bidResultOptions.length > 0) {
      return config.bidResultOptions
        .filter((o) => o.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [
      { id: "br-1", value: "Won", label: "Won", color: "#10B981" },
      { id: "br-2", value: "Loss", label: "Loss", color: "#EF4444" },
      {
        id: "br-3",
        value: "Client Canceled",
        label: "Client Canceled",
        color: "#64748b",
      },
      { id: "br-4", value: "No Bid", label: "No Bid", color: "#94a3b8" },
      { id: "br-5", value: "Pending", label: "Pending", color: "#F59E0B" },
      {
        id: "br-6",
        value: "Renegotiation",
        label: "Renegotiation",
        color: "#8B5CF6",
      },
    ] as any[];
  }, [config]);

  const lossReasons = React.useMemo(() => {
    if (config?.lossReasons && config.lossReasons.length > 0) {
      return config.lossReasons
        .filter((o) => o.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [
      {
        id: "lr-1",
        value: "Price higher than competitor",
        label: "Price higher than competitor",
      },
      {
        id: "lr-2",
        value: "Technical non-compliance",
        label: "Technical non-compliance",
      },
      { id: "lr-3", value: "Late submission", label: "Late submission" },
      {
        id: "lr-4",
        value: "Client scope change",
        label: "Client scope change",
      },
      {
        id: "lr-5",
        value: "Client budget constraint",
        label: "Client budget constraint",
      },
      {
        id: "lr-6",
        value: "Competitor relationship",
        label: "Competitor relationship",
      },
    ] as any[];
  }, [config]);

  const divisions = React.useMemo(() => {
    if (config?.divisions && config.divisions.length > 0) {
      return config.divisions
        .filter((d) => d.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [
      { value: "OPG", label: "OPG", color: "#3b82f6" },
      { value: "SSR-Survey", label: "SSR-Survey", color: "#10b981" },
      { value: "SSR-ROV", label: "SSR-ROV", color: "#f59e0b" },
      { value: "SSR-Integrated", label: "SSR-Integrated", color: "#8b5cf6" },
    ] as any[];
  }, [config]);

  const serviceLines = React.useMemo(() => {
    if (config?.serviceLines && config.serviceLines.length > 0) {
      return config.serviceLines
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    }
    return [] as any[];
  }, [config]);

  const outcomeColors = React.useMemo(() => {
    const map: Record<string, string> = {};
    bidResultOptions.forEach((o: any) => {
      map[o.value] = o.color || "#94A3B8";
    });
    map["Pending"] = "#F59E0B";
    return map;
  }, [bidResultOptions]);

  /* ────────────────────── Completed BIDs data ────────────────────── */

  const completedBids = React.useMemo(() => {
    return bids.filter((b) => b.currentStatus === "Completed");
  }, [bids]);

  // Division / Service Line / date range / search via the shared filter bar
  const kpiFilteredBids = React.useMemo(
    () => applyFilters(completedBids, "createdDate"),
    [completedBids, applyFilters],
  );

  const filtered = React.useMemo(() => {
    let result = kpiFilteredBids;

    if (outcomeFilter !== "all") {
      if (outcomeFilter === "Pending") {
        result = result.filter(
          (b) => !b.bidResult?.outcome || b.bidResult.outcome === "Pending",
        );
      } else {
        result = result.filter((b) => b.bidResult?.outcome === outcomeFilter);
      }
    }

    return result.sort((a, b) => {
      if (sortOrder === "created-newest" || sortOrder === "created-oldest") {
        const dateA = a.createdDate || "";
        const dateB = b.createdDate || "";
        return sortOrder === "created-newest"
          ? dateB.localeCompare(dateA)
          : dateA.localeCompare(dateB);
      }
      const dateA = a.completedDate || a.lastModified || "";
      const dateB = b.completedDate || b.lastModified || "";
      return sortOrder === "newest"
        ? dateB.localeCompare(dateA)
        : dateA.localeCompare(dateB);
    });
  }, [kpiFilteredBids, outcomeFilter, sortOrder]);

  /* ────────────────────── KPI Calculations ────────────────────── */

  const kpis = React.useMemo(() => {
    const total = kpiFilteredBids.length;
    const won = kpiFilteredBids.filter(
      (b) => b.bidResult?.outcome === "Won",
    ).length;
    const lost = kpiFilteredBids.filter(
      (b) => b.bidResult?.outcome === "Loss",
    ).length;
    const pending = kpiFilteredBids.filter(
      (b) => !b.bidResult?.outcome || b.bidResult.outcome === "Pending",
    ).length;
    const decided = won + lost;
    const winRate = decided > 0 ? Math.round((won / decided) * 100) : 0;

    // Average days from completion to outcome
    const withOutcome = kpiFilteredBids.filter(
      (b) =>
        b.bidResult?.outcome &&
        b.bidResult.outcome !== "Pending" &&
        b.bidResult.outcomeDate &&
        b.completedDate,
    );
    let avgDaysToResult = 0;
    if (withOutcome.length > 0) {
      const totalDays = withOutcome.reduce((sum, b) => {
        const comp = new Date(b.completedDate!).getTime();
        const out = new Date(b.bidResult!.outcomeDate!).getTime();
        return sum + Math.max(0, Math.round((out - comp) / 86400000));
      }, 0);
      avgDaysToResult = Math.round(totalDays / withOutcome.length);
    }

    return { total, won, lost, pending, winRate, avgDaysToResult };
  }, [kpiFilteredBids]);

  /* ────────────────────── Chart Data ────────────────────── */

  const outcomeDistribution = React.useMemo(() => {
    const counts: Record<string, number> = {};
    kpiFilteredBids.forEach((b) => {
      const outcome = b.bidResult?.outcome || "Pending";
      counts[outcome] = (counts[outcome] || 0) + 1;
    });
    return bidResultOptions.map((o: any) => ({
      label: o.label || o.value,
      value: o.value,
      count: counts[o.value] || 0,
      color: o.color || "#94A3B8",
    }));
  }, [kpiFilteredBids, bidResultOptions]);

  const divisionWinRates = React.useMemo(() => {
    return divisions.map((div: any) => {
      const divBids = kpiFilteredBids.filter((b) => b.division === div.value);
      const won = divBids.filter((b) => b.bidResult?.outcome === "Won").length;
      const lost = divBids.filter(
        (b) => b.bidResult?.outcome === "Loss",
      ).length;
      const decided = won + lost;
      return {
        division: div.label || div.value,
        winRate: decided > 0 ? Math.round((won / decided) * 100) : 0,
        total: divBids.length,
        won,
        color: div.color || "#94A3B8",
      };
    });
  }, [kpiFilteredBids, divisions]);

  const lossReasonDistribution = React.useMemo(() => {
    const counts: Record<string, number> = {};
    kpiFilteredBids.forEach((b) => {
      if (b.bidResult?.outcome === "Loss" && b.bidResult.lostReason) {
        counts[b.bidResult.lostReason] =
          (counts[b.bidResult.lostReason] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([reason, count]) => ({ reason, count }));
  }, [kpiFilteredBids]);

  const winTrend = React.useMemo(
    () => winRateTrend(kpiFilteredBids, "month"),
    [kpiFilteredBids],
  );
  const winRateSpark = winTrend.map((p) => p.winRate);

  /* ────────────────────── Drawer Logic ────────────────────── */

  const openDrawer = (bid: IBid): void => {
    if (!canEdit) return;
    setDrawerBid(bid);
    setFormOutcome(bid.bidResult?.outcome || null);
    setFormLossReason(bid.bidResult?.lostReason || "");
    setFormCompetitor(bid.bidResult?.competitorName || "");
    setFormNotes(bid.bidResult?.feedbackNotes || "");
    setFormFollowUpDate(bid.bidResult?.followUpDate || "");
    setSaveSuccess(false);
  };

  const closeDrawer = (): void => {
    setDrawerBid(null);
    setSaveSuccess(false);
  };

  const handleSave = async (): Promise<void> => {
    if (!drawerBid || !formOutcome) return;
    // Loss reason is required when outcome is "Loss"
    if (formOutcome === "Loss" && !formLossReason) return;
    setSaving(true);
    try {
      const updatedResult: IBidResult = {
        outcome: formOutcome as any,
        outcomeDate: new Date().toISOString(),
        contractValue: null,
        contractCurrency: null,
        lostReason: formOutcome === "Loss" ? formLossReason : null,
        competitorName: formOutcome === "Loss" ? formCompetitor : null,
        feedbackNotes: formNotes || null,
        followUpDate: formFollowUpDate || null,
        lastUpdatedBy: null,
        lastUpdatedDate: new Date().toISOString(),
      };

      await BidService.patchByBidNumber(drawerBid.bidNumber, {
        bidResult: updatedResult,
      } as Partial<IBid>);

      // Optimistic local update
      const updatedBids = bids.map((b) =>
        b.bidNumber === drawerBid.bidNumber
          ? { ...b, bidResult: updatedResult }
          : b,
      );
      setBids(updatedBids);

      setSaveSuccess(true);
      setTimeout(() => {
        closeDrawer();
      }, 800);
    } catch (err) {
      console.error("Failed to save bid result:", err);
    } finally {
      setSaving(false);
    }
  };

  /* ────────────────────── Helpers ────────────────────── */

  const isNeedsAttention = (bid: IBid): boolean => {
    if (bid.bidResult?.outcome && bid.bidResult.outcome !== "Pending")
      return false;
    const completed = bid.completedDate ? new Date(bid.completedDate) : null;
    if (!completed) return false;
    const daysSinceCompletion = Math.round(
      (Date.now() - completed.getTime()) / 86400000,
    );
    return daysSinceCompletion > 7;
  };

  /* ────────────────────── Table Columns ────────────────────── */

  const columns = [
    {
      key: "bidNumber",
      header: "BID",
      render: (bid: IBid) => (
        <span className={styles.bidNumberBold}>{bid.bidNumber}</span>
      ),
    },
    {
      key: "client",
      header: "Client",
      render: (bid: IBid) => (
        <span className={styles.clientText}>
          {bid.opportunityInfo?.client || "—"}
        </span>
      ),
    },
    {
      key: "projectName",
      header: "Project",
      render: (bid: IBid) => (
        <span className={styles.clientText}>
          {bid.opportunityInfo?.projectName || "—"}
        </span>
      ),
    },
    {
      key: "crmNumber",
      header: "CRM",
      render: (bid: IBid) => (
        <span className={styles.serviceLineText}>{bid.crmNumber || "—"}</span>
      ),
    },
    {
      key: "division",
      header: "Division",
      render: (bid: IBid) => <DivisionBadge division={bid.division} />,
    },
    {
      key: "serviceLine",
      header: "Service Line",
      render: (bid: IBid) => (
        <span className={styles.serviceLineText}>{bid.serviceLine || "—"}</span>
      ),
    },
    {
      key: "createdDate",
      header: "Created",
      sortable: true,
      render: (bid: IBid) => (
        <span className={styles.dateText}>
          {bid.createdDate ? formatDate(bid.createdDate) : "—"}
        </span>
      ),
    },
    {
      key: "completedDate",
      header: "Completed",
      sortable: true,
      render: (bid: IBid) => (
        <span className={styles.dateText}>
          {bid.completedDate ? formatDate(bid.completedDate) : "—"}
        </span>
      ),
    },
    {
      key: "outcome",
      header: "Outcome",
      render: (bid: IBid) => {
        const outcome = bid.bidResult?.outcome || "Pending";
        const color = outcomeColors[outcome] || "#94A3B8";
        const isPending =
          !bid.bidResult?.outcome || bid.bidResult.outcome === "Pending";
        return (
          <div>
            <span
              className={`${styles.outcomeTag} ${isPending ? styles.pendingPulse : ""}`}
              style={{
                color,
                borderColor: `${color}30`,
                background: `${color}15`,
              }}
            >
              {outcome}
            </span>
            {isPending && isNeedsAttention(bid) && (
              <span className={styles.needsAttention}>⚠ Needs attention</span>
            )}
          </div>
        );
      },
    },
    {
      key: "lossReason",
      header: "Loss Reason",
      render: (bid: IBid) =>
        bid.bidResult?.lostReason ? (
          <span className={styles.lossReasonText}>
            {bid.bidResult.lostReason}
          </span>
        ) : (
          <span className={styles.dateText}>—</span>
        ),
    },
    {
      key: "followUpDate",
      header: "Follow-up Date",
      render: (bid: IBid) => (
        <span className={styles.dateText}>
          {bid.bidResult?.outcomeDate
            ? formatDate(bid.bidResult.outcomeDate)
            : "—"}
        </span>
      ),
    },
  ];

  /* ────────────────────── Render ────────────────────── */

  const chartTotal = outcomeDistribution.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <PageHeader
        title="Follow Up"
        subtitle="Track outcomes of completed BIDs and analyze win/loss performance"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </svg>
        }
      />

      {/* Access Info Banner */}
      <div className={styles.accessBanner}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          {canEdit
            ? "Only the Commercial and Engineering teams can edit follow-up results."
            : "You have read-only access. Only the Commercial and Engineering teams can edit follow-up results."}
        </span>
      </div>

      {/* Top-level filters */}
      <AnalyticsFilterBar
        filters={filters}
        onPatch={patch}
        onPreset={setPreset}
        onReset={reset}
        hasActive={hasActive}
        divisions={divisions.map((d: any) => ({
          value: d.value,
          label: d.label || d.value,
          color: d.color,
        }))}
        serviceLines={serviceLines.map((s: any) => ({
          value: s.value,
          label: s.label || s.value,
        }))}
      />

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPICard
          variant="glass"
          label="Completed BIDs"
          value={kpis.total}
          accentColor={chart.accentSecondary}
          subtitle="Total terminal"
        />
        <KPICard
          variant="glass"
          label="Won"
          value={kpis.won}
          accentColor={chart.success}
          subtitle={`${kpis.winRate}% win rate`}
        />
        <KPICard
          variant="glass"
          label="Loss"
          value={kpis.lost}
          accentColor={chart.danger}
          subtitle={
            kpis.lost > 0 ? `${lossReasonDistribution.length} reasons` : ""
          }
        />
        <KPICard
          variant="glass"
          label="Pending"
          value={kpis.pending}
          accentColor={chart.warning}
          subtitle="Awaiting outcome"
        />
        <KPICard
          variant="glass"
          label="Win Rate"
          value={`${kpis.winRate}%`}
          accentColor={chart.accentTertiary}
          subtitle={`Avg ${kpis.avgDaysToResult}d to result`}
          sparkline={
            <Sparkline
              data={winRateSpark}
              color={chart.accentTertiary}
              height={34}
            />
          }
        />
      </div>

      {/* Win / Loss over time */}
      <GlassCard
        title="Win / Loss Over Time"
        subtitle="Outcomes per month and win-rate trend"
        accentColor={chart.success}
      >
        {winTrend.length === 0 ? (
          <div className={styles.chartEmpty}>
            No decided outcomes in the selected period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={winTrend}
              margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
            >
              <CartesianGrid vertical={false} stroke={chart.grid} />
              <XAxis
                dataKey="period"
                tick={{ fill: chart.tick, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: chart.tick, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: chart.tick, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: chart.referenceFill }}
                content={
                  <ChartTooltip
                    valueFormatter={(v, e) =>
                      e.dataKey === "winRate" ? `${v}%` : v
                    }
                  />
                }
              />
              <Legend
                wrapperStyle={{ fontSize: 12, color: chart.textSecondary }}
              />
              <Bar
                yAxisId="left"
                dataKey="won"
                name="Won"
                fill={chart.success}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                yAxisId="left"
                dataKey="lost"
                name="Loss"
                fill={chart.danger}
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="winRate"
                name="Win rate"
                stroke={chart.accentTertiary}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0, fill: chart.accentTertiary }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </GlassCard>

      {/* Charts */}
      <div className={styles.chartsRow}>
        <GlassCard
          title="Outcome Distribution"
          subtitle="Resultados dos BIDs concluídos"
          accentColor={chart.accentSecondary}
        >
          {chartTotal === 0 ? (
            <div className={styles.chartEmpty}>Sem resultados no período.</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Tooltip content={<ChartTooltip hideLabel />} />
                <Pie
                  data={outcomeDistribution.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={66}
                  outerRadius={98}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {outcomeDistribution
                    .filter((d) => d.count > 0)
                    .map((d) => (
                      <Cell key={d.value} fill={d.color} />
                    ))}
                  <Label
                    content={(props: any) => {
                      const vb = props.viewBox || { cx: 0, cy: 0 };
                      return (
                        <g>
                          <text
                            x={vb.cx}
                            y={vb.cy - 4}
                            textAnchor="middle"
                            fill={chart.textPrimary}
                            style={{ fontSize: 26, fontWeight: 800 }}
                          >
                            {chartTotal}
                          </text>
                          <text
                            x={vb.cx}
                            y={vb.cy + 16}
                            textAnchor="middle"
                            fill={chart.textMuted}
                            style={{ fontSize: 11 }}
                          >
                            Total
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
                <Legend
                  wrapperStyle={{ fontSize: 12, color: chart.textSecondary }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <GlassCard
          title="Win Rate by Division"
          subtitle="Percentual de vitórias por divisão"
          accentColor={chart.success}
        >
          <ResponsiveContainer
            width="100%"
            height={Math.max(220, divisionWinRates.length * 48)}
          >
            <BarChart
              data={divisionWinRates}
              layout="vertical"
              margin={{ top: 8, right: 44, bottom: 4, left: 8 }}
            >
              <CartesianGrid horizontal={false} stroke={chart.grid} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: chart.tick, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="division"
                width={110}
                tick={{ fill: chart.tick, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: chart.referenceFill }}
                content={<ChartTooltip valueFormatter={(v) => `${v}%`} />}
              />
              <Bar dataKey="winRate" radius={[0, 6, 6, 0]} barSize={20}>
                <LabelList
                  dataKey="winRate"
                  position="right"
                  formatter={(v: number) => `${v}%`}
                  fill={chart.textSecondary}
                  fontSize={11}
                />
                {divisionWinRates.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {lossReasonDistribution.length > 0 && (
        <GlassCard
          title="Top Loss Reasons"
          subtitle="Motivos mais frequentes de perda"
          accentColor={chart.danger}
        >
          <ResponsiveContainer
            width="100%"
            height={Math.max(200, lossReasonDistribution.length * 44)}
          >
            <BarChart
              data={lossReasonDistribution}
              layout="vertical"
              margin={{ top: 8, right: 36, bottom: 4, left: 8 }}
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
                dataKey="reason"
                width={210}
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
                name="BIDs"
                fill={chart.danger}
                radius={[0, 6, 6, 0]}
                barSize={18}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill={chart.textSecondary}
                  fontSize={11}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      )}

      {/* Outcome Tabs */}
      <div className={styles.tabBar}>
        {[
          { key: "all", label: "All", count: completedBids.length },
          { key: "Pending", label: "Pending", count: kpis.pending },
          { key: "Won", label: "Won", count: kpis.won },
          { key: "Loss", label: "Loss", count: kpis.lost },
          ...bidResultOptions
            .filter(
              (o: any) =>
                o.value !== "Won" &&
                o.value !== "Loss" &&
                o.value !== "Pending",
            )
            .map((o: any) => ({
              key: o.value,
              label: o.label || o.value,
              count: completedBids.filter(
                (b) => b.bidResult?.outcome === o.value,
              ).length,
            })),
        ].map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${outcomeFilter === tab.key ? styles.tabBtnActive : ""}`}
            onClick={() => setOutcomeFilter(tab.key)}
          >
            {tab.label}
            <span className={styles.tabCount}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableSection}>
        <div className={styles.tableHeader}>
          <span className={styles.tableTitle}>Follow Up Results</span>
          <div className={styles.tableControls}>
            <select
              className={styles.sortSelect}
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(
                  e.target.value as
                    | "newest"
                    | "oldest"
                    | "created-newest"
                    | "created-oldest",
                )
              }
            >
              <option value="newest">Completed: Most Recent</option>
              <option value="oldest">Completed: Oldest First</option>
              <option value="created-newest">Created: Most Recent</option>
              <option value="created-oldest">Created: Oldest First</option>
            </select>
            <span className={styles.tableCount}>
              {filtered.length} of {kpiFilteredBids.length} BIDs
            </span>
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div className={styles.emptyTitle}>No BIDs found</div>
            <div className={styles.emptySubtitle}>
              No completed BIDs match the current filters.
            </div>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filtered}
            onRowClick={canEdit ? openDrawer : undefined}
          />
        )}
      </div>

      {/* Drawer Overlay */}
      <div
        className={`${styles.drawerOverlay} ${drawerBid ? styles.drawerOverlayOpen : ""}`}
        onClick={closeDrawer}
      />

      {/* Side Drawer */}
      <div className={`${styles.drawer} ${drawerBid ? styles.drawerOpen : ""}`}>
        {drawerBid && (
          <>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div className={styles.drawerHeaderInfo}>
                <span
                  className={styles.drawerBidNumber}
                  onClick={() => {
                    closeDrawer();
                    navigate(`/bid/${drawerBid.bidNumber}`);
                  }}
                  style={{ cursor: "pointer" }}
                  title="Open BID details"
                >
                  {drawerBid.bidNumber} ↗
                </span>
                <span className={styles.drawerClient}>
                  {drawerBid.opportunityInfo?.client || "—"}
                </span>
                <span className={styles.drawerProject}>
                  {drawerBid.opportunityInfo?.projectName || "—"}
                </span>
                <div className={styles.drawerMeta}>
                  <span>{drawerBid.division}</span>
                  <span>{drawerBid.serviceLine || "—"}</span>
                  {drawerBid.completedDate && (
                    <span>Completed {formatDate(drawerBid.completedDate)}</span>
                  )}
                </div>
              </div>
              <button className={styles.drawerClose} onClick={closeDrawer}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Drawer Body */}
            <div className={styles.drawerBody}>
              {/* Outcome Selection */}
              <div className={styles.drawerSection}>
                <span className={styles.drawerSectionTitle}>BID Result</span>
                <div className={styles.outcomeGrid}>
                  {bidResultOptions.map((opt: any) => (
                    <button
                      key={opt.value}
                      className={`${styles.outcomeBtn} ${formOutcome === opt.value ? styles.outcomeBtnActive : ""}`}
                      style={
                        formOutcome === opt.value
                          ? { borderColor: opt.color, color: opt.color }
                          : undefined
                      }
                      onClick={() => setFormOutcome(opt.value)}
                    >
                      <div
                        className={styles.outcomeBtnDot}
                        style={{ background: opt.color }}
                      />
                      <span className={styles.outcomeBtnLabel}>
                        {opt.label || opt.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Loss Fields */}
              {formOutcome === "Loss" && (
                <div className={styles.drawerSection}>
                  <span className={styles.drawerSectionTitle}>
                    Loss Analysis
                  </span>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Loss Reason *</label>
                    <select
                      className={`${styles.fieldInput} ${formOutcome === "Loss" && !formLossReason ? styles.fieldRequired : ""}`}
                      value={formLossReason}
                      onChange={(e) => setFormLossReason(e.target.value)}
                    >
                      <option value="">Select reason (required)...</option>
                      {lossReasons.map((r: any) => (
                        <option
                          key={r.id || r.value}
                          value={r.value || r.label}
                        >
                          {r.label || r.value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.fieldLabel}>Competitor</label>
                    <input
                      type="text"
                      className={styles.fieldInput}
                      placeholder="Who won the bid?"
                      value={formCompetitor}
                      onChange={(e) => setFormCompetitor(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Notes & Follow-up */}
              <div className={styles.drawerSection}>
                <span className={styles.drawerSectionTitle}>
                  Follow-up Notes
                </span>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Notes / Comments</label>
                  <textarea
                    className={styles.fieldTextarea}
                    placeholder="Any additional context or comments..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.fieldLabel}>Follow-up Date</label>
                  <input
                    type="date"
                    className={styles.fieldInput}
                    value={formFollowUpDate}
                    onChange={(e) => setFormFollowUpDate(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className={styles.drawerFooter}>
              <button className={styles.cancelBtn} onClick={closeDrawer}>
                Cancel
              </button>
              <button
                className={`${styles.saveBtn} ${saveSuccess ? styles.saveSuccess : ""}`}
                onClick={handleSave}
                disabled={
                  saving ||
                  !formOutcome ||
                  (formOutcome === "Loss" && !formLossReason)
                }
              >
                {saving
                  ? "Saving..."
                  : saveSuccess
                    ? "✓ Saved!"
                    : "Save Result"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

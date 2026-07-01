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
import { formatDate } from "../utils/formatters";
import { IBid, IBidResult } from "../models";
import styles from "./FollowUpPage.module.scss";

/* ─────────────────────────────── Component ─────────────────────────────── */

export const FollowUpPage: React.FC = () => {
  const { bids } = useBids();
  const config = useConfigStore((s) => s.config);
  const setBids = useBidStore((s) => s.setBids);
  const currentUser = useAuthStore((s) => s.currentUser);
  const navigate = useNavigate();

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

  // Local state — top-level filters (apply to KPIs + charts + table)
  const [kpiDivisionFilter, setKpiDivisionFilter] =
    React.useState<string>("all");
  const [kpiServiceLineFilter, setKpiServiceLineFilter] =
    React.useState<string>("all");
  const [dateFrom, setDateFrom] = React.useState<string>("");
  const [dateTo, setDateTo] = React.useState<string>("");

  // Table-level filters
  const [outcomeFilter, setOutcomeFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
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

  // Filtered by KPI-level Division/Service Line + date range (applies to KPIs + charts)
  const kpiFilteredBids = React.useMemo(() => {
    let result = completedBids;
    if (kpiDivisionFilter !== "all") {
      result = result.filter((b) => b.division === kpiDivisionFilter);
    }
    if (kpiServiceLineFilter !== "all") {
      result = result.filter((b) => b.serviceLine === kpiServiceLineFilter);
    }
    if (dateFrom) {
      result = result.filter((b) => (b.createdDate || "") >= dateFrom);
    }
    if (dateTo) {
      result = result.filter(
        (b) => (b.createdDate || "").slice(0, 10) <= dateTo,
      );
    }
    return result;
  }, [
    completedBids,
    kpiDivisionFilter,
    kpiServiceLineFilter,
    dateFrom,
    dateTo,
  ]);

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
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.bidNumber.toLowerCase().indexOf(q) >= 0 ||
          (b.opportunityInfo?.client || "").toLowerCase().indexOf(q) >= 0 ||
          (b.opportunityInfo?.projectName || "").toLowerCase().indexOf(q) >=
            0 ||
          (b.crmNumber || "").toLowerCase().indexOf(q) >= 0,
      );
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
  }, [kpiFilteredBids, outcomeFilter, searchQuery, sortOrder]);

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
  const maxWinRate = Math.max(...divisionWinRates.map((d) => d.winRate), 1);

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

      {/* KPI Filter Row */}
      <div className={styles.kpiFilterRow}>
        <select
          className={styles.filterSelect}
          value={kpiDivisionFilter}
          onChange={(e) => {
            setKpiDivisionFilter(e.target.value);
            setKpiServiceLineFilter("all");
          }}
        >
          <option value="all">All Divisions</option>
          {divisions.map((d: any) => (
            <option key={d.value} value={d.value}>
              {d.label || d.value}
            </option>
          ))}
        </select>
        <select
          className={styles.filterSelect}
          value={kpiServiceLineFilter}
          onChange={(e) => setKpiServiceLineFilter(e.target.value)}
        >
          <option value="all">All Service Lines</option>
          {serviceLines.map((s: any) => (
            <option key={s.value} value={s.value}>
              {s.label || s.value}
            </option>
          ))}
        </select>
        <div className={styles.dateRangeGroup}>
          <span className={styles.dateRangeLabel}>Created Date:</span>
          <input
            type="date"
            className={styles.dateInput}
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="From"
          />
          <span className={styles.dateRangeSeparator}>—</span>
          <input
            type="date"
            className={styles.dateInput}
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="To"
          />
          {(dateFrom || dateTo) && (
            <button
              className={styles.dateRangeClear}
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              title="Clear date filter"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        {[
          {
            label: "Completed BIDs",
            value: kpis.total,
            color: "#3B82F6",
            sub: "Total terminal",
          },
          {
            label: "Won",
            value: kpis.won,
            color: "#10B981",
            sub: `${kpis.winRate}% win rate`,
          },
          {
            label: "Loss",
            value: kpis.lost,
            color: "#EF4444",
            sub:
              kpis.lost > 0 ? `${lossReasonDistribution.length} reasons` : "",
          },
          {
            label: "Pending",
            value: kpis.pending,
            color: "#F59E0B",
            sub: "Awaiting outcome",
          },
          {
            label: "Win Rate",
            value: `${kpis.winRate}%`,
            color: "#8B5CF6",
            sub: `Avg ${kpis.avgDaysToResult}d to result`,
          },
        ].map((kpi) => (
          <div key={kpi.label} className={styles.kpiCard}>
            <div
              className={styles.kpiAccent}
              style={{ background: kpi.color }}
            />
            <div className={styles.kpiLabel}>{kpi.label}</div>
            <div className={styles.kpiValue} style={{ color: kpi.color }}>
              {kpi.value}
            </div>
            {kpi.sub && <div className={styles.kpiSubtext}>{kpi.sub}</div>}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className={styles.chartsRow}>
        {/* Donut Chart - Outcome Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
            Outcome Distribution
          </div>
          <div className={styles.chartLayout}>
            <div className={styles.donutWrapper}>
              <svg viewBox="0 0 36 36" className={styles.donutSvg}>
                {
                  outcomeDistribution.reduce(
                    (acc, item) => {
                      if (item.count === 0) return acc;
                      const percent = (item.count / chartTotal) * 100;
                      acc.elements.push(
                        <circle
                          key={item.value}
                          r="15.9155"
                          cx="18"
                          cy="18"
                          fill="none"
                          stroke={item.color}
                          strokeWidth="3.5"
                          strokeDasharray={`${percent} ${100 - percent}`}
                          strokeDashoffset={`-${acc.offset}`}
                        />,
                      );
                      acc.offset += percent;
                      return acc;
                    },
                    { elements: [] as React.ReactNode[], offset: 0 },
                  ).elements
                }
              </svg>
              <div className={styles.donutCenter}>
                <span className={styles.donutTotal}>{chartTotal}</span>
                <span className={styles.donutLabel}>Total</span>
              </div>
            </div>
            <div className={styles.legend}>
              {outcomeDistribution
                .filter((d) => d.count > 0)
                .map((item) => (
                  <div key={item.value} className={styles.legendItem}>
                    <div
                      className={styles.legendDot}
                      style={{ background: item.color }}
                    />
                    <span>{item.label}</span>
                    <span className={styles.legendCount}>{item.count}</span>
                    <span className={styles.legendPercent}>
                      {Math.round((item.count / chartTotal) * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Bar Chart - Win Rate by Division */}
        <div className={styles.chartCard}>
          <div className={styles.chartTitle}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Win Rate by Division
          </div>
          <div className={styles.barChartList}>
            {divisionWinRates.map((item) => (
              <div key={item.division} className={styles.barItem}>
                <div className={styles.barLabel}>
                  <span>{item.division}</span>
                  <span className={styles.barLabelValue}>{item.winRate}%</span>
                </div>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      width: `${maxWinRate > 0 ? (item.winRate / maxWinRate) * 100 : 0}%`,
                      background: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Loss Reason Pareto (mini) */}
          {lossReasonDistribution.length > 0 && (
            <>
              <div className={styles.chartTitle} style={{ marginTop: 24 }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Top Loss Reasons
              </div>
              <div className={styles.barChartList}>
                {lossReasonDistribution.map((item) => {
                  const maxCount = lossReasonDistribution[0]?.count || 1;
                  return (
                    <div key={item.reason} className={styles.barItem}>
                      <div className={styles.barLabel}>
                        <span>{item.reason}</span>
                        <span className={styles.barLabelValue}>
                          {item.count}
                        </span>
                      </div>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${(item.count / maxCount) * 100}%`,
                            background: "#EF4444",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <div className={styles.searchWrapperFull}>
          <span className={styles.searchIcon}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by BID number, client, project, or CRM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

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

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Activity, BarChart3, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useErnStore } from "../stores/useErnStore";
import { DashboardView, useUIStore } from "../stores/useUIStore";
import { useKPIs } from "../hooks/useKPIs";
import { useKpiTargets } from "../hooks/useKpiTargets";
import { useDashboardSync } from "../hooks/useDashboardSync";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { useLiveOverview } from "../hooks/useLiveOverview";
import { useSlidingIndicator } from "../hooks/useSlidingIndicator";
import { useResultStatus } from "../hooks/useResultStatus";
import { resolveSemanticColor } from "../hooks/useColorTheme";
import { PageHeader } from "../components/common/PageHeader";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { DashboardKPIRow } from "../components/dashboard/DashboardKPIRow";
import { DashboardActivity } from "../components/dashboard/DashboardActivity";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { BidsByStatusChart } from "../components/dashboard/BidsByStatusChart";
import { BidsByDivisionChart } from "../components/dashboard/BidsByDivisionChart";
import {
  BidsByUrgencyChart,
  UrgencyChartRow,
} from "../components/dashboard/BidsByUrgencyChart";
import { ApprovalsPending } from "../components/dashboard/ApprovalsPending";
import { ErnDashboardSection } from "../components/dashboard/ErnDashboardSection";
import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { DashboardPeriodBar } from "../components/dashboard/DashboardPeriodBar";
import { EngHoursOutlook } from "../components/dashboard/EngHoursOutlook";
import { DashboardBidTable } from "../components/dashboard/DashboardBidTable";
import { DashboardService } from "../services/DashboardService";
import { BID_PRIORITIES } from "../config/kpi.config";
import { IErn } from "../models";
import {
  isActiveBid,
  isOverdueBid,
  getEngineeringHours,
} from "../utils/bidHelpers";
import { buildErnLinkRows } from "../utils/ernHelpers";
import {
  computeCycleByPriority,
  computeOnTimeDelivery,
  getPriorityRangeLabels,
} from "../utils/kpiHelpers";
import { withCounts } from "../utils/facetHelpers";
import { buildWinRateIndex } from "../utils/winProbability";
import styles from "./DashboardPage.module.scss";

const VIEW_OPTIONS: {
  value: DashboardView;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "live", label: "Live Overview", icon: <Activity size={14} /> },
  {
    value: "engineering",
    label: "Engineering Dashboard",
    icon: <BarChart3 size={14} />,
  },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const erns = useErnStore((s) => s.erns);
  const config = useConfigStore((s) => s.config);
  const view = useUIStore((s) => s.dashboardView);
  const setView = useUIStore((s) => s.setDashboardView);
  const viewIndicator = useSlidingIndicator(view);
  const { lastSyncedAt, syncing, refreshNow } = useDashboardSync();
  const { getResult, options: resultOptions } = useResultStatus();
  const filters = useDashboardFilters(bids, getResult);
  const { scopeBids, analyticsBids } = filters;
  const live = useLiveOverview(scopeBids);
  const kpis = useKPIs(analyticsBids);
  const { targets, priorityRules } = useKpiTargets();

  const openBid = React.useCallback(
    (bidNumber: string) => navigate(`/bid/${bidNumber}`),
    [navigate],
  );

  // History base for win chances: every decided BID, not just the filtered ones
  const winIndex = React.useMemo(() => buildWinRateIndex(bids), [bids]);

  // Scope filters only exist on the Live view
  const headerActive = React.useMemo(
    () => (view === "live" ? scopeBids : bids).filter((b) => isActiveBid(b)),
    [view, scopeBids, bids],
  );
  const activeBids = React.useMemo(
    () => analyticsBids.filter((b) => isActiveBid(b)),
    [analyticsBids],
  );

  // Unique ERNs linked to the BIDs of the period (same base as the ERN charts)
  const ernStats = React.useMemo(() => {
    const liveByTitle: Record<string, IErn> = {};
    erns.forEach((e) => {
      liveByTitle[e.title] = e;
    });
    const rows = buildErnLinkRows(analyticsBids, liveByTitle);
    return {
      linked: rows.length,
      closed: rows.filter((r) => r.closed).length,
    };
  }, [analyticsBids, erns]);

  // Engineering hours delivered on already-closed BIDs
  const engHoursClosed = React.useMemo(
    () =>
      analyticsBids
        .filter((b) => !isActiveBid(b))
        .reduce((sum, b) => sum + getEngineeringHours(b), 0),
    [analyticsBids],
  );

  const onTime = React.useMemo(
    () => computeOnTimeDelivery(analyticsBids),
    [analyticsBids],
  );

  const cycle = React.useMemo(
    () => computeCycleByPriority(analyticsBids, targets),
    [analyticsBids, targets],
  );

  const urgencyRulesLabel = React.useMemo(() => {
    const ranges = getPriorityRangeLabels(priorityRules);
    return BID_PRIORITIES.map((p) => `${p} ${ranges[p]} bd`).join(" · ");
  }, [priorityRules]);

  const urgencyChartData = React.useMemo((): UrgencyChartRow[] => {
    const rows: UrgencyChartRow[] = BID_PRIORITIES.map((p) => ({
      priority: p,
      onTrack: 0,
      overdue: 0,
      total: 0,
    }));
    const unclassified: UrgencyChartRow = {
      priority: "Unclassified",
      onTrack: 0,
      overdue: 0,
      total: 0,
    };
    activeBids.forEach((b) => {
      const row =
        rows[BID_PRIORITIES.indexOf(b.priority)] || unclassified;
      row.total++;
      if (isOverdueBid(b)) row.overdue++;
      else row.onTrack++;
    });
    return unclassified.total > 0 ? rows.concat(unclassified) : rows;
  }, [activeBids]);

  // Status chart data — from config subStatuses
  const statusChartData = React.useMemo(() => {
    const statuses = (config?.subStatuses || [])
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return statuses
      .map((status) => ({
        status: status.label,
        count: activeBids.filter((b) => b.currentStatus === status.value)
          .length,
        color: resolveSemanticColor(
          "statuses",
          status.value,
          status.color || "#94A3B8",
        ),
      }))
      .filter((d) => d.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [config, activeBids]);

  // Division chart data — from config divisions
  const divisionChartData = React.useMemo(() => {
    const workloads =
      DashboardService.calculateDivisionWorkloads(analyticsBids);
    const divs = (config?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return divs.map((div) => ({
      division: div.value,
      count: workloads.find((w) => w.division === div.value)?.activeBids || 0,
      color: div.color || "#94a3b8",
    }));
  }, [config, analyticsBids]);

  const resultFilterOptions = React.useMemo(
    () =>
      withCounts(
        resultOptions.map((o) => ({
          value: o.value,
          label: o.label,
          color: o.color,
        })),
        filters.resultCounts,
      ),
    [resultOptions, filters.resultCounts],
  );

  const divisionCount = new Set(headerActive.map((b) => b.division)).size;

  return (
    <div className={styles.dashboard}>
      {bids.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 24,
          }}
        >
          <SkeletonLoader height={80} borderRadius={12} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 16,
            }}
          >
            <SkeletonLoader height={100} borderRadius={12} />
            <SkeletonLoader height={100} borderRadius={12} />
            <SkeletonLoader height={100} borderRadius={12} />
            <SkeletonLoader height={100} borderRadius={12} />
          </div>
          <SkeletonLoader height={200} borderRadius={12} />
          <SkeletonLoader height={200} borderRadius={12} />
        </div>
      ) : (
        <>
          {/* Page Header */}
          <PageHeader
            title="Engineering Dashboard"
            subtitle={`${headerActive.length} active BIDs across ${divisionCount} divisions`}
            actions={
              <div className={styles.headerActions}>
                <div
                  ref={viewIndicator.containerRef}
                  className={styles.viewToggle}
                  role="tablist"
                  aria-label="Dashboard view"
                >
                  {viewIndicator.style && (
                    <span
                      aria-hidden="true"
                      className={`${styles.viewIndicator} ${viewIndicator.animated ? styles.viewIndicatorAnimated : ""}`}
                      style={viewIndicator.style}
                    />
                  )}
                  {VIEW_OPTIONS.map((opt) => {
                    const active = view === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        className={`${styles.viewBtn} ${active ? styles.viewBtnActive : ""}`}
                        onClick={() => setView(opt.value)}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <span className={styles.syncInfo}>
                  {syncing
                    ? "Syncing..."
                    : lastSyncedAt
                      ? `Updated ${format(lastSyncedAt, "HH:mm")} · auto every 60s`
                      : "Auto refresh every 60s"}
                </span>
                <button
                  type="button"
                  className={styles.headerBtn}
                  onClick={refreshNow}
                  disabled={syncing}
                  title="Reload BIDs and ERN status from SharePoint"
                >
                  <RefreshCw
                    size={15}
                    className={syncing ? styles.spin : undefined}
                  />{" "}
                  Refresh
                </button>
              </div>
            }
            icon={
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                <path d="M12 11h4" />
                <path d="M12 16h4" />
                <path d="M8 11h.01" />
                <path d="M8 16h.01" />
              </svg>
            }
          />

          {/* Live overview: current state, scope filters only */}
          {view === "live" && (
            <section
              key="live"
              className={`${styles.section} ${styles.viewPane}`}
            >
              <DashboardFilterBar
                bids={bids}
                scope={filters.scope}
                onPatch={filters.patchScope}
                onReset={filters.resetScope}
                hasScope={filters.hasScope}
                facetCounts={filters.scopeFacetCounts}
                shownCount={scopeBids.length}
              />

              <div className={styles.liveIntro}>
                <span className={styles.livePill}>
                  <span className={styles.liveDot} />
                  Live
                </span>
                <p className={styles.sectionSubtitle}>
                  What needs attention now. Refreshed every 60s.
                </p>
              </div>

              <ErnDashboardSection
                view="status"
                live={live}
                onBidClick={openBid}
              />

              <div className={styles.liveGrid}>
                <UpcomingDeadlines
                  rows={live.deadlines}
                  maxItems={20}
                  onBidClick={openBid}
                />
                <ApprovalsPending rows={live.approvals} onView={openBid} />
                <DashboardActivity bids={scopeBids} onBidClick={openBid} />
              </div>
            </section>
          )}

          {/* Performance & demand: period + follow-up result */}
          {view === "engineering" && (
            <section
              key="engineering"
              className={`${styles.section} ${styles.viewPane}`}
            >
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>
                  Performance & Engineering Demand
                </h3>
                <p className={styles.sectionSubtitle}>
                  {analyticsBids.length} BID
                  {analyticsBids.length === 1 ? "" : "s"} in the selected
                  period
                </p>
              </div>

              <DashboardPeriodBar
                period={filters.period}
                onPatch={filters.patchPeriod}
                onPreset={filters.setPreset}
                onReset={filters.resetPeriod}
                hasPeriod={filters.hasPeriod}
                resultOptions={resultFilterOptions}
                missingDateCount={filters.missingDateCount}
              />

              <DashboardKPIRow
                activeBids={kpis.activeBids}
                overdueBids={kpis.overdueBids}
                overdueRate={Math.round(kpis.overdueRate)}
                engHoursClosed={engHoursClosed}
                ernsClosed={ernStats.closed}
                ernsLinked={ernStats.linked}
                onTime={onTime}
                cycle={cycle}
                winRate={Math.round(kpis.winRate)}
                wonCount={kpis.wonBids}
                lostCount={kpis.lostBids}
                pipelineValueUSD={kpis.totalPipelineValueUSD}
              />

              <div className={styles.chartsRow}>
                <BidsByStatusChart data={statusChartData} />
                <BidsByDivisionChart data={divisionChartData} />
                <BidsByUrgencyChart
                  data={urgencyChartData}
                  rulesLabel={urgencyRulesLabel}
                />
              </div>

              <ErnDashboardSection view="breakdown" bids={analyticsBids} />

              <div className={styles.subsectionHeader}>
                <h4 className={styles.subsectionTitle}>
                  Engineering Hours Outlook
                </h4>
                <p className={styles.sectionSubtitle}>
                  Engineering effort estimated in BIDs: confirmed (Won) and
                  what may come if the pipeline is won.
                </p>
              </div>
              <EngHoursOutlook
                bids={analyticsBids}
                winIndex={winIndex}
                onBidClick={openBid}
              />

              <DashboardBidTable bids={analyticsBids} onBidClick={openBid} />
            </section>
          )}
        </>
      )}
    </div>
  );
};

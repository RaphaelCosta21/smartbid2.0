import * as React from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useKPIs } from "../hooks/useKPIs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useDashboardSync } from "../hooks/useDashboardSync";
import { useDashboardFilters } from "../hooks/useDashboardFilters";
import { useResultStatus } from "../hooks/useResultStatus";
import { resolveSemanticColor } from "../hooks/useColorTheme";
import { PageHeader } from "../components/common/PageHeader";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { DashboardKPIRow } from "../components/dashboard/DashboardKPIRow";
import { DashboardActivity } from "../components/dashboard/DashboardActivity";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { BidsByStatusChart } from "../components/dashboard/BidsByStatusChart";
import { BidsByDivisionChart } from "../components/dashboard/BidsByDivisionChart";
import { ApprovalsPending } from "../components/dashboard/ApprovalsPending";
import { ErnDashboardSection } from "../components/dashboard/ErnDashboardSection";
import { DashboardFilterBar } from "../components/dashboard/DashboardFilterBar";
import { DashboardPeriodBar } from "../components/dashboard/DashboardPeriodBar";
import { EngHoursOutlook } from "../components/dashboard/EngHoursOutlook";
import { DashboardBidTable } from "../components/dashboard/DashboardBidTable";
import { DashboardService } from "../services/DashboardService";
import { isPastDue, parseDate } from "../utils/formatters";
import { isActiveBid, getEngineeringHours } from "../utils/bidHelpers";
import { withCounts } from "../utils/facetHelpers";
import { buildWinRateIndex } from "../utils/winProbability";
import styles from "./DashboardPage.module.scss";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const config = useConfigStore((s) => s.config);
  const currentUser = useCurrentUser();
  const { lastSyncedAt, syncing, refreshNow } = useDashboardSync();
  const { getResult, options: resultOptions } = useResultStatus();
  const filters = useDashboardFilters(bids, getResult);
  const { scopeBids, analyticsBids } = filters;
  const kpis = useKPIs(analyticsBids);

  const openBid = React.useCallback(
    (bidNumber: string) => navigate(`/bid/${bidNumber}`),
    [navigate],
  );

  // History base for win chances: every decided BID, not just the filtered ones
  const winIndex = React.useMemo(() => buildWinRateIndex(bids), [bids]);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  const liveActive = React.useMemo(
    () => scopeBids.filter((b) => isActiveBid(b)),
    [scopeBids],
  );
  const activeBids = React.useMemo(
    () => analyticsBids.filter((b) => isActiveBid(b)),
    [analyticsBids],
  );

  // Engineering hours delivered on already-closed BIDs
  const engHoursClosed = React.useMemo(
    () =>
      analyticsBids
        .filter((b) => !isActiveBid(b))
        .reduce((sum, b) => sum + getEngineeringHours(b), 0),
    [analyticsBids],
  );

  // On-time delivery — computed from real completion vs. due dates
  const onTimePercent = React.useMemo(() => {
    const delivered = analyticsBids.filter(
      (b) =>
        (b.currentStatus === "Completed" ||
          b.currentStatus === "Returned to Commercial") &&
        !!b.dueDate,
    );
    const onTime = delivered.filter((b) => {
      const end = parseDate(b.completedDate || b.lastModified);
      return end ? !isPastDue(b.dueDate, end) : false;
    }).length;
    return delivered.length > 0
      ? Math.round((onTime / delivered.length) * 100)
      : 100;
  }, [analyticsBids]);

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

  const divisionCount = new Set(liveActive.map((b) => b.division)).size;

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
          <SkeletonLoader height={40} borderRadius={12} />
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
          {/* Greeting */}
          <div className={styles.greeting}>
            <h2>
              {greeting}, {currentUser.displayName.split(" ")[0]}
            </h2>
            <p>
              Engineering overview · Last updated:{" "}
              {format(lastSyncedAt || now, "MMM d, yyyy HH:mm")}
            </p>
          </div>

          {/* Page Header */}
          <PageHeader
            title="Engineering Dashboard"
            subtitle={`${liveActive.length} active BIDs across ${divisionCount} divisions`}
            actions={
              <div className={styles.headerActions}>
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

          {/* Scope filters: apply to the whole page */}
          <DashboardFilterBar
            bids={bids}
            scope={filters.scope}
            onPatch={filters.patchScope}
            onReset={filters.resetScope}
            hasScope={filters.hasScope}
            facetCounts={filters.scopeFacetCounts}
            shownCount={scopeBids.length}
          />

          {/* Live overview: current state, ignores the period filter */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                Live overview
                <span className={styles.livePill}>
                  <span className={styles.liveDot} />
                  Live
                </span>
              </h3>
              <p className={styles.sectionSubtitle}>
                What needs attention now. Not affected by the period filter.
              </p>
            </div>

            <ErnDashboardSection bids={scopeBids} view="status" />

            <div className={styles.liveGrid}>
              <UpcomingDeadlines
                bids={liveActive}
                maxItems={20}
                onBidClick={(bid) => openBid(bid.bidNumber)}
              />
              <ApprovalsPending bids={scopeBids} onView={openBid} />
              <DashboardActivity bids={scopeBids} onBidClick={openBid} />
            </div>
          </section>

          {/* Performance & demand: scope + period + follow-up result */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>
                Performance & Engineering Demand
              </h3>
              <p className={styles.sectionSubtitle}>
                {analyticsBids.length} BID
                {analyticsBids.length === 1 ? "" : "s"} in the selected period
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
              engHoursClosed={engHoursClosed}
              onTimePercent={onTimePercent}
              avgCycleDays={Math.round(kpis.avgCycleTimeDays)}
              winRate={Math.round(kpis.winRate)}
              wonCount={kpis.wonBids}
              lostCount={kpis.lostBids}
              pipelineValueUSD={kpis.totalPipelineValueUSD}
            />

            <div className={styles.chartsRow}>
              <BidsByStatusChart data={statusChartData} />
              <BidsByDivisionChart data={divisionChartData} />
            </div>

            <ErnDashboardSection bids={analyticsBids} view="breakdown" />

            <div className={styles.subsectionHeader}>
              <h4 className={styles.subsectionTitle}>
                Engineering Hours Outlook
              </h4>
              <p className={styles.sectionSubtitle}>
                Engineering effort estimated in BIDs: confirmed (Won) and what
                may come if the pipeline is won.
              </p>
            </div>
            <EngHoursOutlook
              bids={analyticsBids}
              winIndex={winIndex}
              onBidClick={openBid}
            />

            <DashboardBidTable bids={analyticsBids} onBidClick={openBid} />
          </section>
        </>
      )}
    </div>
  );
};

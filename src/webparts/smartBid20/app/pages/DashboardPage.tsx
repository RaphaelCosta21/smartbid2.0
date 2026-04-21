import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useBidStore } from "../stores/useBidStore";
import { useNotificationStore } from "../stores/useNotificationStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useKPIs } from "../hooks/useKPIs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { DashboardKPIRow } from "../components/dashboard/DashboardKPIRow";
import { RecentActivity } from "../components/dashboard/RecentActivity";
import { UpcomingDeadlines } from "../components/dashboard/UpcomingDeadlines";
import { BidsByStatusChart } from "../components/dashboard/BidsByStatusChart";
import { BidsByDivisionChart } from "../components/dashboard/BidsByDivisionChart";
import { ApprovalsPending } from "../components/dashboard/ApprovalsPending";
import { DashboardService } from "../services/DashboardService";
import { differenceInDays, format } from "date-fns";
import { isActiveBid } from "../utils/bidHelpers";
import { useStatusColors } from "../hooks/useStatusColors";
import { getPhaseDef } from "../config/status.config";
import styles from "./DashboardPage.module.scss";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const config = useConfigStore((s) => s.config);
  const currentUser = useCurrentUser();
  const notifications = useNotificationStore((s) => s.notifications);
  const kpis = useKPIs();
  const { getPhaseColor, getStatusColor, getPriorityColor, getDivisionColor } =
    useStatusColors();

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  // KPI Calculations
  const activeBids = bids.filter((b) => isActiveBid(b));
  const completedBids = bids.filter(
    (b) =>
      b.currentStatus === "Completed" ||
      b.currentStatus === "Returned to Commercial",
  );
  const totalEngHours = activeBids.reduce(
    (sum, b) => sum + (b.hoursSummary?.grandTotalHours || 0),
    0,
  );
  const onTimeCount = completedBids.filter((b) => !b.kpis.isOverdue).length;
  const onTimePercent =
    completedBids.length > 0
      ? Math.round((onTimeCount / completedBids.length) * 100)
      : 100;

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
        color: status.color || "#94A3B8",
      }))
      .filter((d) => d.count > 0);
  }, [config, activeBids]);

  // Division chart data — from config divisions
  const divisionWorkloads = DashboardService.calculateDivisionWorkloads(bids);
  const divisionChartData = React.useMemo(() => {
    const divs = (config?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return divs.map((div) => ({
      division: div.value,
      count:
        divisionWorkloads.find((w) => w.division === div.value)?.activeBids ||
        0,
      color: div.color || "#94a3b8",
    }));
  }, [config, divisionWorkloads]);

  // Pending approvals
  const pendingApprovals = activeBids
    .filter((b) => b.approvalStatus === "pending")
    .map((b) => ({
      bidNumber: b.bidNumber,
      requester: b.creator?.name || "—",
      days: Math.abs(differenceInDays(new Date(b.lastModified), now)),
    }));

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
              BID Tracker Overview · Last updated:{" "}
              {format(now, "MMM d, yyyy HH:mm")}
            </p>
          </div>

          {/* Page Header */}
          <PageHeader
            title="BID Tracker · Overview"
            subtitle={`${activeBids.length} active BIDs across ${new Set(activeBids.map((b) => b.division)).size} divisions`}
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

          {/* KPI Cards — using sub-component */}
          <DashboardKPIRow
            activeBids={kpis.activeBids}
            overdueBids={kpis.overdueBids}
            totalHours={totalEngHours}
            onTimePercent={onTimePercent}
            winRate={Math.round(kpis.winRate)}
            wonCount={kpis.wonBids}
            lostCount={kpis.lostBids}
            pipelineValueUSD={kpis.totalPipelineValueUSD}
          />

          {/* Charts Row */}
          <div className={styles.chartsRow}>
            <BidsByStatusChart data={statusChartData} />
            <BidsByDivisionChart data={divisionChartData} />
          </div>

          {/* Activity + Deadlines + Approvals Row */}
          <div className={styles.activityRow}>
            <RecentActivity notifications={notifications} maxItems={8} />
            <UpcomingDeadlines
              bids={activeBids}
              maxItems={5}
              onBidClick={(bid) => navigate(`/bid/${bid.bidNumber}`)}
            />
          </div>

          {/* Approvals Pending */}
          {pendingApprovals.length > 0 && (
            <ApprovalsPending
              approvals={pendingApprovals}
              onView={(bidNumber) => navigate(`/bid/${bidNumber}`)}
            />
          )}

          {/* BID Tracker Table */}
          <div className={styles.tableSection}>
            <div className={styles.tableHeader}>
              <h3>BID Tracker</h3>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className={styles.bidTable}>
                <thead>
                  <tr>
                    <th>BID #</th>
                    <th>CRM #</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Division</th>
                    <th>Creator</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Phase</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => {
                    const daysLeft = bid.dueDate
                      ? differenceInDays(new Date(bid.dueDate), now)
                      : 0;
                    const phaseDef = getPhaseDef(bid.currentPhase);
                    return (
                      <tr
                        key={bid.bidNumber}
                        className={styles.clickableRow}
                        onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                      >
                        <td className={styles.mono}>{bid.bidNumber}</td>
                        <td className={styles.mono}>{bid.crmNumber || "—"}</td>
                        <td>{bid.opportunityInfo?.client || ""}</td>
                        <td
                          style={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {bid.opportunityInfo?.projectName || ""}
                        </td>
                        <td>
                          <StatusBadge
                            status={bid.division}
                            color={getDivisionColor(bid.division)}
                          />
                        </td>
                        <td>{bid.creator?.name || "—"}</td>
                        <td
                          className={daysLeft < 0 ? styles.overdue : undefined}
                        >
                          {bid.dueDate
                            ? format(new Date(bid.dueDate), "MMM d")
                            : "—"}
                        </td>
                        <td>
                          <StatusBadge
                            status={bid.priority}
                            color={getPriorityColor(bid.priority)}
                          />
                        </td>
                        <td>
                          {phaseDef ? (
                            <StatusBadge
                              status={phaseDef.label}
                              color={getPhaseColor(bid.currentPhase)}
                            />
                          ) : null}
                        </td>
                        <td>
                          <StatusBadge
                            status={bid.currentStatus}
                            color={getStatusColor(bid.currentStatus)}
                          />
                        </td>
                        <td>
                          <div
                            style={{
                              width: 80,
                              height: 6,
                              background: "var(--border-subtle)",
                              borderRadius: 3,
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${bid.kpis?.phaseCompletionPercentage || 0}%`,
                                background: "var(--primary-accent)",
                                borderRadius: 3,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

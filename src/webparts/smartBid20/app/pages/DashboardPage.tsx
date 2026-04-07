import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useBidStore } from "../stores/useBidStore";
import { useNotificationStore } from "../stores/useNotificationStore";
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
import { BID_STATUSES } from "../config/status.config";
import { DashboardService } from "../services/DashboardService";
import { differenceInDays, format } from "date-fns";
import { isActiveBid } from "../utils/bidHelpers";
import { DIVISION_COLORS } from "../utils/constants";
import styles from "./DashboardPage.module.scss";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const currentUser = useCurrentUser();
  const notifications = useNotificationStore((s) => s.notifications);
  const kpis = useKPIs();

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

  // Status chart data
  const statusChartData = BID_STATUSES.filter((s) => !s.isTerminal)
    .map((status) => ({
      status: status.label,
      count: activeBids.filter((b) => b.currentStatus === status.value).length,
      color: status.color,
    }))
    .filter((d) => d.count > 0);

  // Division chart data
  const divisionWorkloads = DashboardService.calculateDivisionWorkloads(bids);
  const divisions = ["OPG", "SSR-ROV", "SSR-Survey", "SSR-Integrated"] as const;
  const divisionChartData = divisions.map((div) => ({
    division: div,
    count: divisionWorkloads.find((w) => w.division === div)?.activeBids || 0,
    color: (DIVISION_COLORS as Record<string, string>)[div] || "#64748b",
  }));

  // Pending approvals
  const pendingApprovals = activeBids
    .filter((b) => b.approvalStatus === "pending")
    .map((b) => ({
      bidNumber: b.bidNumber,
      requester: b.owner.name,
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
                    <th>Client</th>
                    <th>Project</th>
                    <th>Division</th>
                    <th>Owner</th>
                    <th>Hours</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((bid) => {
                    const daysLeft = differenceInDays(
                      new Date(bid.dueDate),
                      now,
                    );
                    return (
                      <tr
                        key={bid.bidNumber}
                        className={styles.clickableRow}
                        onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                      >
                        <td className={styles.mono}>{bid.bidNumber}</td>
                        <td>{bid.opportunityInfo.client}</td>
                        <td
                          style={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {bid.opportunityInfo.projectName}
                        </td>
                        <td>
                          <StatusBadge
                            status={bid.division}
                            color={
                              bid.division === "OPG"
                                ? "#3b82f6"
                                : bid.division === "SSR-ROV"
                                  ? "#f59e0b"
                                  : bid.division === "SSR-Survey"
                                    ? "#10b981"
                                    : "#8b5cf6"
                            }
                          />
                        </td>
                        <td>{bid.owner.name}</td>
                        <td>
                          {(
                            bid.hoursSummary?.grandTotalHours || 0
                          ).toLocaleString()}
                        </td>
                        <td
                          className={daysLeft < 0 ? styles.overdue : undefined}
                        >
                          {format(new Date(bid.dueDate), "MMM d, yyyy")}
                        </td>
                        <td>
                          <span
                            className={`${styles.priorityBadge} ${(styles as Record<string, string>)[bid.priority.toLowerCase()]}`}
                          >
                            {bid.priority}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={bid.currentStatus} />
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

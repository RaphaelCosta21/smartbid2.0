import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useBidStore } from "../stores/useBidStore";
import { useAuthStore } from "../stores/useAuthStore";
import { PageHeader } from "../components/common/PageHeader";
import { KPICard } from "../components/common/KPICard";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { BID_PHASES } from "../config/status.config";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import styles from "./DashboardPage.module.scss";

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const currentUser = useAuthStore((s) => s.currentUser);

  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good Morning"
      : now.getHours() < 18
        ? "Good Afternoon"
        : "Good Evening";

  // KPI Calculations
  const activeBids = bids.filter(
    (b) =>
      !["Completed", "Returned to Commercial", "Canceled", "No Bid"].includes(
        b.currentStatus,
      ),
  );
  const completedBids = bids.filter(
    (b) =>
      b.currentStatus === "Completed" ||
      b.currentStatus === "Returned to Commercial",
  );
  const overdueBids = activeBids.filter((b) => b.kpis.isOverdue);
  const totalEngHours = activeBids.reduce(
    (sum, b) => sum + (b.hoursSummary?.grandTotalHours || 0),
    0,
  );
  const onTimeCount = completedBids.filter((b) => !b.kpis.isOverdue).length;
  const onTimePercent =
    completedBids.length > 0
      ? Math.round((onTimeCount / completedBids.length) * 100)
      : 100;
  const wonBids = bids.filter((b) => b.bidResult?.outcome === "Won");
  const lostBids = bids.filter((b) => b.bidResult?.outcome === "Lost");
  const decidedBids = wonBids.length + lostBids.length;
  const winRate =
    decidedBids > 0 ? Math.round((wonBids.length / decidedBids) * 100) : 0;
  const pipelineValueUSD = activeBids.reduce(
    (sum, b) => sum + (b.costSummary?.totalCostUSD || 0),
    0,
  );

  // Pipeline by phase
  const pipelineByPhase = BID_PHASES.map((phase) => ({
    ...phase,
    count: activeBids.filter((b) => b.currentPhase === phase.value).length,
  }));

  // Recent activity (mock from bids)
  const recentActivity = bids
    .map((b) => ({
      bidNumber: b.bidNumber,
      client: b.opportunityInfo.client,
      status: b.currentStatus,
      date: b.lastModified,
      color: "#00c9a7",
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  // Upcoming deadlines
  const upcomingDeadlines = activeBids
    .map((b) => {
      const daysLeft = differenceInDays(new Date(b.dueDate), now);
      return { ...b, daysLeft };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 5);

  const getCountdownClass = (days: number): string => {
    if (days < 0) return styles.urgent;
    if (days <= 3) return styles.warning;
    return styles.ok;
  };

  return (
    <div className={styles.dashboard}>
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

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <KPICard
          label="Active BIDs"
          value={activeBids.length}
          accentColor="#00c9a7"
          trend={{ value: "+2 this week", direction: "up" }}
          subtitle={`${overdueBids.length} overdue`}
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="8" y="2" width="8" height="4" rx="1" />
              <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            </svg>
          }
        />
        <KPICard
          label="Eng. Hours (Active)"
          value={totalEngHours.toLocaleString()}
          accentColor="#3b82f6"
          trend={{ value: "+12%", direction: "up" }}
          subtitle="Total hours across active BIDs"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          }
        />
        <KPICard
          label="On-Time Delivery"
          value={`${onTimePercent}%`}
          accentColor={
            onTimePercent >= 90
              ? "#10b981"
              : onTimePercent >= 70
                ? "#f59e0b"
                : "#ef4444"
          }
          progress={{ value: onTimePercent, max: 100 }}
          subtitle="Target: 90%"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          }
        />
        <KPICard
          label="BIDs at Risk"
          value={overdueBids.length}
          accentColor="#ef4444"
          subtitle="Overdue or due within 2 days"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
        <KPICard
          label="Win Rate"
          value={`${winRate}%`}
          accentColor="#8b5cf6"
          trend={{
            value: `${wonBids.length}W / ${lostBids.length}L`,
            direction: "neutral",
          }}
          progress={{ value: winRate, max: 100 }}
          subtitle="Target: 40%"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          }
        />
        <KPICard
          label="Pipeline Value"
          value={`$${(pipelineValueUSD / 1000).toFixed(0)}K`}
          accentColor="#06b6d4"
          subtitle="Active BIDs total cost (USD)"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="2" x2="12" y2="22" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
      </div>

      {/* Pipeline + Charts Row */}
      <div className={styles.chartsRow}>
        <GlassCard title="Pipeline by Phase">
          {pipelineByPhase.map((phase) => (
            <div key={phase.id} className={styles.pipelineRow}>
              <span className={styles.pipelineLabel}>{phase.label}</span>
              <div className={styles.pipelineBar}>
                <div
                  className={styles.pipelineBarFill}
                  style={{
                    width: `${Math.max((phase.count / Math.max(activeBids.length, 1)) * 100, 8)}%`,
                    background: phase.color,
                  }}
                >
                  {phase.count}
                </div>
              </div>
            </div>
          ))}
        </GlassCard>

        <GlassCard title="Hours by Division">
          {["OPG", "SSR-ROV", "SSR-Survey", "SSR-Integrated"].map((div) => {
            const divBids = activeBids.filter((b) => b.division === div);
            const hours = divBids.reduce(
              (s, b) => s + (b.hoursSummary?.grandTotalHours || 0),
              0,
            );
            const colors: Record<string, string> = {
              OPG: "#3b82f6",
              "SSR-ROV": "#f59e0b",
              "SSR-Survey": "#10b981",
              "SSR-Integrated": "#8b5cf6",
            };
            return (
              <div key={div} className={styles.pipelineRow}>
                <span className={styles.pipelineLabel}>
                  {div} ({divBids.length})
                </span>
                <div className={styles.pipelineBar}>
                  <div
                    className={styles.pipelineBarFill}
                    style={{
                      width: `${Math.max((hours / Math.max(totalEngHours, 1)) * 100, 8)}%`,
                      background: colors[div] || "#64748b",
                    }}
                  >
                    {hours.toLocaleString()}h
                  </div>
                </div>
              </div>
            );
          })}
        </GlassCard>
      </div>

      {/* Activity + Deadlines Row */}
      <div className={styles.activityRow}>
        <GlassCard title="Recent Activity">
          <ul className={styles.activityList}>
            {recentActivity.map((item, i) => (
              <li key={i} className={styles.activityItem}>
                <span
                  className={styles.activityDot}
                  style={{ background: item.color }}
                />
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    <strong>{item.bidNumber}</strong> — {item.client} →{" "}
                    {item.status}
                  </p>
                  <span className={styles.activityTime}>
                    {formatDistanceToNow(new Date(item.date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard title="Upcoming Deadlines">
          {upcomingDeadlines.map((bid) => (
            <div
              key={bid.bidNumber}
              className={styles.deadlineItem}
              onClick={() => navigate(`/bid/${bid.bidNumber}`)}
            >
              <div className={styles.deadlineInfo}>
                <p className={styles.deadlineBid}>{bid.bidNumber}</p>
                <span className={styles.deadlineClient}>
                  {bid.opportunityInfo.client} —{" "}
                  {bid.opportunityInfo.projectName}
                </span>
              </div>
              <span
                className={`${styles.deadlineCountdown} ${getCountdownClass(bid.daysLeft)}`}
              >
                {bid.daysLeft < 0
                  ? `${Math.abs(bid.daysLeft)}d overdue`
                  : bid.daysLeft === 0
                    ? "Due today"
                    : `${bid.daysLeft}d left`}
              </span>
            </div>
          ))}
        </GlassCard>
      </div>

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
                const daysLeft = differenceInDays(new Date(bid.dueDate), now);
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
                    <td className={daysLeft < 0 ? styles.overdue : undefined}>
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
    </div>
  );
};

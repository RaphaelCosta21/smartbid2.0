import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { useBids } from "../hooks/useBids";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { isActiveBid, isOverdueBid } from "../utils/bidHelpers";
import { DIVISION_COLORS } from "../utils/constants";
import { differenceInDays } from "date-fns";
import styles from "./MyDashboardPage.module.scss";

export const MyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const currentUser = useCurrentUser();
  const userEmail = currentUser?.email || "rcosta@oceaneering.com";

  const myBids = React.useMemo(
    () =>
      bids.filter(
        (b) => b.owner.email === userEmail || b.bidder.email === userEmail,
      ),
    [bids, userEmail],
  );
  const myActive = myBids.filter(isActiveBid);
  const myOverdue = myActive.filter(isOverdueBid);
  const now = new Date();

  return (
    <div className={styles.page}>
      <PageHeader
        title="My Dashboard"
        subtitle={`${myActive.length} active BIDs assigned to you`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        }
      />

      {/* KPI Row */}
      <div className={styles.kpiGrid}>
        {[
          { label: "My Active BIDs", value: myActive.length, color: "#3b82f6" },
          { label: "Overdue", value: myOverdue.length, color: "#ef4444" },
          { label: "Total Assigned", value: myBids.length, color: "#8b5cf6" },
        ].map((kpi) => (
          <GlassCard key={kpi.label}>
            <div className={styles.kpiInner}>
              <div className={styles.kpiValue} style={{ color: kpi.color }}>
                {kpi.value}
              </div>
              <div className={styles.kpiLabel}>{kpi.label}</div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* My Active BIDs */}
      <GlassCard title="My Active BIDs">
        {myActive.length === 0 ? (
          <div className={styles.emptyState}>
            No BIDs are currently assigned to you.
          </div>
        ) : (
          <div className={styles.bidList}>
            {myActive.map((bid) => {
              const daysLeft = differenceInDays(new Date(bid.dueDate), now);
              return (
                <div
                  key={bid.bidNumber}
                  onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                  className={styles.bidRow}
                  style={{
                    borderLeft: `3px solid ${DIVISION_COLORS[bid.division] || "#94a3b8"}`,
                  }}
                >
                  <span className={styles.bidRowNumber}>{bid.bidNumber}</span>
                  <span className={styles.bidRowInfo}>
                    {bid.opportunityInfo.client} —{" "}
                    {bid.opportunityInfo.projectName}
                  </span>
                  <StatusBadge status={bid.currentStatus} />
                  <span
                    className={`${styles.bidRowDays} ${daysLeft < 0 ? styles.daysOverdue : daysLeft <= 3 ? styles.daysWarning : styles.daysOk}`}
                  >
                    {daysLeft < 0
                      ? `${Math.abs(daysLeft)}d overdue`
                      : `${daysLeft}d left`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConfidentialLock } from "../components/bid/ConfidentialLock";
import { useBids } from "../hooks/useBids";
import { useOpenBid } from "../hooks/useOpenBid";
import { useCurrentUser } from "../hooks/useCurrentUser";
import {
  getDueFreezeDate,
  isActiveBid,
  isOverdueBid,
} from "../utils/bidHelpers";
import { DIVISION_COLORS } from "../utils/constants";
import { formatDaysLeft } from "../utils/formatters";
import styles from "./MyDashboardPage.module.scss";

export const MyDashboardPage: React.FC = () => {
  const { openBid } = useOpenBid();
  const { bids } = useBids();
  const currentUser = useCurrentUser();
  const userEmail = currentUser?.email || "rcosta@oceaneering.com";

  const myBids = React.useMemo(
    () =>
      bids.filter(
        (b) =>
          b.creator?.email === userEmail ||
          (b.engineerResponsible || []).some((e) => e.email === userEmail),
      ),
    [bids, userEmail],
  );
  const myActive = myBids.filter(isActiveBid);
  const myOverdue = myActive.filter(isOverdueBid);

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
              const due = formatDaysLeft(bid.dueDate, getDueFreezeDate(bid));
              return (
                <div
                  key={bid.bidNumber}
                  onClick={() => openBid(bid.bidNumber)}
                  className={styles.bidRow}
                  style={{
                    borderLeft: `3px solid ${DIVISION_COLORS[bid.division] || "#94a3b8"}`,
                  }}
                >
                  <span className={styles.bidRowNumber}>
                    {bid.bidNumber}
                    <ConfidentialLock bid={bid} />
                  </span>
                  <span className={styles.bidRowInfo}>
                    {bid.opportunityInfo.client} -{" "}
                    {bid.opportunityInfo.projectName}
                  </span>
                  <StatusBadge status={bid.currentStatus} />
                  <span
                    className={`${styles.bidRowDays} ${due.isOverdue ? styles.daysOverdue : due.days !== null && due.days <= 3 ? styles.daysWarning : styles.daysOk}`}
                  >
                    {due.text}
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

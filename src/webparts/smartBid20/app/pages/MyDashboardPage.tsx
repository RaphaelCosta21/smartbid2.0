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
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {[
          { label: "My Active BIDs", value: myActive.length, color: "#3b82f6" },
          { label: "Overdue", value: myOverdue.length, color: "#ef4444" },
          { label: "Total Assigned", value: myBids.length, color: "#8b5cf6" },
        ].map((kpi) => (
          <GlassCard key={kpi.label}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: kpi.color }}>
                {kpi.value}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 4,
                }}
              >
                {kpi.label}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* My Active BIDs */}
      <GlassCard title="My Active BIDs">
        {myActive.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: 32,
              color: "var(--text-muted)",
            }}
          >
            No BIDs are currently assigned to you.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {myActive.map((bid) => {
              const daysLeft = differenceInDays(new Date(bid.dueDate), now);
              return (
                <div
                  key={bid.bidNumber}
                  onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "12px 16px",
                    background: "var(--card-bg-elevated)",
                    borderRadius: 10,
                    cursor: "pointer",
                    borderLeft: `3px solid ${DIVISION_COLORS[bid.division] || "#94a3b8"}`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: "var(--secondary-accent)",
                      width: 110,
                    }}
                  >
                    {bid.bidNumber}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "var(--text-primary)",
                    }}
                  >
                    {bid.opportunityInfo.client} —{" "}
                    {bid.opportunityInfo.projectName}
                  </span>
                  <StatusBadge status={bid.currentStatus} />
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color:
                        daysLeft < 0
                          ? "#ef4444"
                          : daysLeft <= 3
                            ? "#f59e0b"
                            : "var(--text-muted)",
                    }}
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

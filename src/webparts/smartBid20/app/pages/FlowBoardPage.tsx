import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useBids } from "../hooks/useBids";
import { isActiveBid } from "../utils/bidHelpers";
import { DIVISION_COLORS } from "../utils/constants";
import { BID_STATUSES } from "../config/status.config";
import { differenceInDays } from "date-fns";

const FLOW_COLUMNS = BID_STATUSES.filter((s) => !s.isTerminal).slice(0, 8);

export const FlowBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const activeBids = React.useMemo(() => bids.filter(isActiveBid), [bids]);
  const now = new Date();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="FlowBoard"
        subtitle={`${activeBids.length} active BIDs across ${FLOW_COLUMNS.length} stages`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
        }
      />

      {/* Kanban Board */}
      <div
        style={{
          display: "flex",
          gap: 12,
          overflowX: "auto",
          paddingBottom: 16,
        }}
      >
        {FLOW_COLUMNS.map((col) => {
          const colBids = activeBids.filter(
            (b) => b.currentStatus === col.value,
          );
          return (
            <div
              key={col.id}
              style={{
                minWidth: 240,
                flex: "0 0 240px",
                background: "var(--card-bg)",
                borderRadius: 14,
                padding: 12,
                border: "1px solid var(--border-subtle)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingBottom: 8,
                  borderBottom: `2px solid ${col.color}`,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: col.color,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    flex: 1,
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: `${col.color}20`,
                    color: col.color,
                  }}
                >
                  {colBids.length}
                </span>
              </div>

              {/* Cards */}
              {colBids.map((bid) => {
                const daysLeft = differenceInDays(new Date(bid.dueDate), now);
                return (
                  <div
                    key={bid.bidNumber}
                    onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                    style={{
                      background: "var(--card-bg-elevated)",
                      borderRadius: 10,
                      padding: 12,
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      borderLeft: `3px solid ${DIVISION_COLORS[bid.division] || "#94a3b8"}`,
                      transition: "all 200ms",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 11,
                          color: "var(--secondary-accent)",
                        }}
                      >
                        {bid.bidNumber}
                      </span>
                      <StatusBadge status={bid.priority} />
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: 2,
                      }}
                    >
                      {bid.opportunityInfo.client}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--text-secondary)",
                        marginBottom: 6,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {bid.opportunityInfo.projectName}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ fontSize: 10, color: "var(--text-muted)" }}
                      >
                        {bid.owner.name.split(" ")[0]}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
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
                          ? `${Math.abs(daysLeft)}d late`
                          : `${daysLeft}d`}
                      </span>
                    </div>
                  </div>
                );
              })}

              {colBids.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: 16,
                    color: "var(--text-muted)",
                    fontSize: 11,
                  }}
                >
                  No BIDs
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

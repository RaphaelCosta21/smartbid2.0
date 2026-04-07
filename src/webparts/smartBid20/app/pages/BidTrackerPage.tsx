import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useBidStore, ViewMode } from "../stores/useBidStore";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { differenceInDays, format } from "date-fns";
import styles from "./DashboardPage.module.scss";

export const BidTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const viewMode = useBidStore((s) => s.viewMode);
  const setViewMode = useBidStore((s) => s.setViewMode);
  const now = new Date();

  const activeBids = bids.filter(
    (b) =>
      !["Completed", "Returned to Commercial", "Canceled", "No Bid"].includes(
        b.currentStatus,
      ),
  );

  const divisionGroups = ["OPG", "SSR-ROV", "SSR-Survey", "SSR-Integrated"].map(
    (div) => ({
      division: div,
      bids: activeBids.filter((b) => b.division === div),
      color:
        div === "OPG"
          ? "#3b82f6"
          : div === "SSR-ROV"
            ? "#f59e0b"
            : div === "SSR-Survey"
              ? "#10b981"
              : "#8b5cf6",
    }),
  );

  return (
    <div className={styles.dashboard}>
      <PageHeader
        title="BID Tracker"
        subtitle={`${activeBids.length} active BIDs across all divisions`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        }
        actions={
          <div className={styles.viewToggle}>
            {(["kanban", "list", "table"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                className={viewMode === mode ? styles.active : ""}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        }
      />

      {viewMode === "table" && (
        <div className={styles.tableSection}>
          <div style={{ overflowX: "auto" }}>
            <table className={styles.bidTable}>
              <thead>
                <tr>
                  <th>BID #</th>
                  <th>Client</th>
                  <th>Project</th>
                  <th>Division</th>
                  <th>Owner</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <tbody>
                {activeBids.map((bid) => {
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
                          maxWidth: 180,
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
                      <td className={daysLeft < 0 ? styles.overdue : ""}>
                        {format(new Date(bid.dueDate), "MMM d")}
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
                              width: `${bid.kpis.phaseCompletionPercentage}%`,
                              height: "100%",
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
      )}

      {viewMode === "kanban" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${divisionGroups.length}, 1fr)`,
            gap: 16,
          }}
        >
          {divisionGroups.map((group) => (
            <div
              key={group.division}
              style={{
                background: "var(--card-bg)",
                borderRadius: 16,
                padding: 16,
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: group.color,
                  }}
                />
                <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>
                  {group.division}
                </strong>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginLeft: "auto",
                  }}
                >
                  ({group.bids.length})
                </span>
              </div>
              {group.bids.map((bid) => (
                <div
                  key={bid.bidNumber}
                  onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                  style={{
                    background: "var(--card-bg-elevated)",
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 10,
                    border: "1px solid var(--border-subtle)",
                    cursor: "pointer",
                    transition: "all 250ms",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 12,
                        color: "var(--secondary-accent)",
                      }}
                    >
                      {bid.bidNumber}
                    </span>
                    <span
                      className={`${styles.priorityBadge} ${(styles as Record<string, string>)[bid.priority.toLowerCase()]}`}
                    >
                      {bid.priority}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    {bid.opportunityInfo.client}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      marginBottom: 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bid.opportunityInfo.projectName}
                  </div>
                  <StatusBadge status={bid.currentStatus} />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeBids.map((bid) => (
            <div
              key={bid.bidNumber}
              onClick={() => navigate(`/bid/${bid.bidNumber}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 20px",
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "all 250ms",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "var(--secondary-accent)",
                  width: 120,
                }}
              >
                {bid.bidNumber}
              </span>
              <span style={{ width: 100 }}>{bid.opportunityInfo.client}</span>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {bid.opportunityInfo.projectName}
              </span>
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
              <span style={{ width: 80 }}>{bid.owner.name.split(" ")[0]}</span>
              <StatusBadge status={bid.currentStatus} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

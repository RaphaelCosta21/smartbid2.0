import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { mockApprovals } from "../data/mockApprovals";
import { useApprovals } from "../hooks/useApprovals";
import { useAccessLevel } from "../hooks/useAccessLevel";
import { format } from "date-fns";

type ApprovalTab = "pending" | "approved" | "rejected" | "all";

export const ApprovalsPage: React.FC = () => {
  const [tab, setTab] = React.useState<ApprovalTab>("pending");
  const approvalSummary = useApprovals();
  const { canEdit } = useAccessLevel();
  const canManageApprovals = canEdit("approvals");

  const filtered = React.useMemo(() => {
    if (tab === "all") return mockApprovals;
    return mockApprovals.filter((a) => a.status === tab);
  }, [tab]);

  const statusColor = (s: string): string =>
    s === "approved"
      ? "#10b981"
      : s === "rejected"
        ? "#ef4444"
        : s === "pending"
          ? "#f59e0b"
          : "#94a3b8";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <PageHeader
        title="Approvals"
        subtitle={`${approvalSummary.totalPending} pending approvals across ${approvalSummary.pending.length} BIDs`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        }
      />

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: 8 }}>
        {(["pending", "approved", "rejected", "all"] as ApprovalTab[]).map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px",
                borderRadius: 8,
                border: "1px solid var(--border-subtle)",
                background:
                  tab === t ? "var(--primary-accent)" : "var(--card-bg)",
                color: tab === t ? "#fff" : "var(--text-primary)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {t} (
              {
                mockApprovals.filter((a) =>
                  t === "all" ? true : a.status === t,
                ).length
              }
              )
            </button>
          ),
        )}
      </div>

      {/* Approval Cards */}
      {filtered.length === 0 ? (
        <GlassCard>
          <div
            style={{
              textAlign: "center",
              padding: 32,
              color: "var(--text-muted)",
            }}
          >
            No approvals in this category.
          </div>
        </GlassCard>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((approval) => (
            <GlassCard key={approval.bidNumber}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 14,
                      color: "var(--secondary-accent)",
                      marginRight: 12,
                    }}
                  >
                    {approval.bidNumber}
                  </span>
                  <StatusBadge status={approval.type.replace("-", " ")} />
                </div>
                <StatusBadge
                  status={approval.status}
                  color={statusColor(approval.status)}
                />
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginBottom: 16,
                }}
              >
                Requested by <strong>{approval.requestedBy.name}</strong> (
                {approval.requestedBy.role}) on{" "}
                {format(new Date(approval.requestedDate), "MMM d, yyyy HH:mm")}
              </div>

              {/* Approval Chain */}
              {approval.chains.map((chain) => (
                <div key={chain.chainId} style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      marginBottom: 12,
                    }}
                  >
                    {chain.chainName} <StatusBadge status={chain.division} />
                  </div>
                  <div
                    style={{ display: "flex", gap: 0, alignItems: "center" }}
                  >
                    {chain.steps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: 120,
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 700,
                              background:
                                step.decision === "approved"
                                  ? "#10b98130"
                                  : step.decision === "rejected"
                                    ? "#ef444430"
                                    : "var(--card-bg-elevated)",
                              border: `2px solid ${step.decision === "approved" ? "#10b981" : step.decision === "rejected" ? "#ef4444" : "var(--border-subtle)"}`,
                              color:
                                step.decision === "approved"
                                  ? "#10b981"
                                  : step.decision === "rejected"
                                    ? "#ef4444"
                                    : "var(--text-muted)",
                            }}
                          >
                            {step.decision === "approved"
                              ? "✓"
                              : step.decision === "rejected"
                                ? "✕"
                                : idx + 1}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--text-primary)",
                              marginTop: 6,
                              textAlign: "center",
                            }}
                          >
                            {step.approver.name.split(" ")[0]}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--text-muted)",
                              textAlign: "center",
                            }}
                          >
                            {step.role}
                          </div>
                          {step.comments && (
                            <div
                              style={{
                                fontSize: 10,
                                color: "var(--text-secondary)",
                                marginTop: 4,
                                maxWidth: 120,
                                textAlign: "center",
                              }}
                            >
                              &quot;{step.comments.substring(0, 40)}…&quot;
                            </div>
                          )}
                        </div>
                        {idx < chain.steps.length - 1 && (
                          <div
                            style={{
                              flex: 1,
                              height: 2,
                              minWidth: 20,
                              background:
                                chain.steps[idx].decision === "approved"
                                  ? "#10b981"
                                  : "var(--border-subtle)",
                              marginBottom: 40,
                            }}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}

              {canManageApprovals && approval.status === "pending" && (
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 16,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    style={{
                      padding: "8px 20px",
                      borderRadius: 8,
                      border: "none",
                      background: "#10b981",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Approve
                  </button>
                  <button
                    style={{
                      padding: "8px 20px",
                      borderRadius: 8,
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Reject
                  </button>
                  <button
                    style={{
                      padding: "8px 20px",
                      borderRadius: 8,
                      border: "1px solid var(--border-subtle)",
                      background: "transparent",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Request Revision
                  </button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

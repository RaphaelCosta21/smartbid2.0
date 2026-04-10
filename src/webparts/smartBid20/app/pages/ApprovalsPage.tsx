import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { mockApprovals } from "../data/mockApprovals";
import { useApprovals } from "../hooks/useApprovals";
import { useAccessLevel } from "../hooks/useAccessLevel";
import { format } from "date-fns";
import styles from "./ApprovalsPage.module.scss";

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
    <div className={styles.page}>
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
      <div className={styles.tabBar}>
        {(["pending", "approved", "rejected", "all"] as ApprovalTab[]).map(
          (t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`${styles.tabBtn} ${tab === t ? styles.tabBtnActive : ""}`}
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
          <div className={styles.emptyState}>
            No approvals in this category.
          </div>
        </GlassCard>
      ) : (
        <div className={styles.approvalCards}>
          {filtered.map((approval) => (
            <GlassCard key={approval.bidNumber}>
              <div className={styles.approvalHeader}>
                <div>
                  <span className={styles.bidNumber}>{approval.bidNumber}</span>
                  <StatusBadge status={approval.type.replace("-", " ")} />
                </div>
                <StatusBadge
                  status={approval.status}
                  color={statusColor(approval.status)}
                />
              </div>

              <div className={styles.requestInfo}>
                Requested by <strong>{approval.requestedBy.name}</strong> (
                {approval.requestedBy.role}) on{" "}
                {format(new Date(approval.requestedDate), "MMM d, yyyy HH:mm")}
              </div>

              {/* Approval Chain */}
              {approval.chains.map((chain) => (
                <div key={chain.chainId} className={styles.chainContainer}>
                  <div className={styles.chainName}>
                    {chain.chainName} <StatusBadge status={chain.division} />
                  </div>
                  <div className={styles.stepsRow}>
                    {chain.steps.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <div className={styles.stepNode}>
                          <div
                            className={`${styles.stepCircle} ${step.decision === "approved" ? styles.stepApproved : step.decision === "rejected" ? styles.stepRejected : styles.stepPending}`}
                          >
                            {step.decision === "approved"
                              ? "✓"
                              : step.decision === "rejected"
                                ? "✕"
                                : idx + 1}
                          </div>
                          <div className={styles.stepName}>
                            {step.approver.name.split(" ")[0]}
                          </div>
                          <div className={styles.stepRole}>{step.role}</div>
                          {step.comments && (
                            <div className={styles.stepComment}>
                              &quot;{step.comments.substring(0, 40)}…&quot;
                            </div>
                          )}
                        </div>
                        {idx < chain.steps.length - 1 && (
                          <div
                            className={`${styles.stepConnector} ${chain.steps[idx].decision === "approved" ? styles.stepConnectorApproved : styles.stepConnectorDefault}`}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}

              {canManageApprovals && approval.status === "pending" && (
                <div className={styles.actionButtons}>
                  <button className={styles.btnApprove}>Approve</button>
                  <button className={styles.btnReject}>Reject</button>
                  <button className={styles.btnOutline}>
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

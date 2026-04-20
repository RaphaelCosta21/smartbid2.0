import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { useApprovals } from "../hooks/useApprovals";
import { useAccessLevel } from "../hooks/useAccessLevel";
import { useStatusColors } from "../hooks/useStatusColors";
import { formatDateTime } from "../utils/formatters";
import { IBid } from "../models";
import styles from "./ApprovalsPage.module.scss";

type ApprovalTab = "pending" | "approved" | "rejected" | "all";

export const ApprovalsPage: React.FC = () => {
  const [tab, setTab] = React.useState<ApprovalTab>("pending");
  const approvalSummary = useApprovals();
  const { canEdit } = useAccessLevel();
  const { getStatusColor } = useStatusColors();
  const canManageApprovals = canEdit("approvals");

  const allBids = [
    ...approvalSummary.pending,
    ...approvalSummary.approved,
    ...approvalSummary.rejected,
  ];

  const filtered = React.useMemo(() => {
    if (tab === "all") return allBids;
    return tab === "pending"
      ? approvalSummary.pending
      : tab === "approved"
        ? approvalSummary.approved
        : approvalSummary.rejected;
  }, [tab, allBids, approvalSummary]);

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
              {t === "all"
                ? allBids.length
                : t === "pending"
                  ? approvalSummary.pending.length
                  : t === "approved"
                    ? approvalSummary.approved.length
                    : approvalSummary.rejected.length}
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
          {filtered.map((bid: IBid) => (
            <GlassCard key={bid.bidNumber}>
              <div className={styles.approvalHeader}>
                <div>
                  <span className={styles.bidNumber}>{bid.bidNumber}</span>
                  <StatusBadge status={bid.currentStatus} />
                </div>
                <StatusBadge
                  status={bid.approvalStatus || "pending"}
                  color={getStatusColor(bid.approvalStatus || "pending")}
                />
              </div>

              <div className={styles.requestInfo}>
                Requested by <strong>{bid.creator?.name || "—"}</strong> (
                {bid.creator?.role || ""}) on {formatDateTime(bid.createdDate)}
              </div>

              {/* Approval Chain */}
              {(bid.approvals || []).map((approval, aIdx) => (
                <div key={aIdx} className={styles.chainContainer}>
                  <div className={styles.chainName}>
                    {approval.stakeholderRole}{" "}
                    <StatusBadge status={bid.division} />
                  </div>
                  <div className={styles.stepsRow}>
                    <div className={styles.stepNode}>
                      <div
                        className={`${styles.stepCircle} ${approval.decision === "approved" ? styles.stepApproved : approval.decision === "rejected" ? styles.stepRejected : styles.stepPending}`}
                      >
                        {approval.decision === "approved"
                          ? "✓"
                          : approval.decision === "rejected"
                            ? "✕"
                            : "1"}
                      </div>
                      <div className={styles.stepName}>
                        {approval.stakeholder?.name?.split(" ")[0] || "—"}
                      </div>
                      <div className={styles.stepRole}>
                        {approval.stakeholder?.role || ""}
                      </div>
                      {approval.comments && (
                        <div className={styles.stepComment}>
                          &quot;{approval.comments.substring(0, 40)}…&quot;
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {canManageApprovals && bid.approvalStatus === "pending" && (
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

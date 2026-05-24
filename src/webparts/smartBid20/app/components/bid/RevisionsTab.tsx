import * as React from "react";
import {
  IBid,
  IBidRevision,
  IPhaseHistoryEntry,
  IStatusHistoryEntry,
  BidPhase,
} from "../../models";
import { GlassCard } from "../common/GlassCard";
import { formatDateTime } from "../../utils/formatters";
import { calcDurationHours } from "../../utils/durationHelpers";
import { isTerminalStatus } from "../../utils/statusHelpers";
import styles from "./RevisionsTab.module.scss";

/* ─── Helpers ─── */

/** Get the revision letter from index: 0→B, 1→C, 2→D, etc. (A is always the initial) */
export function getRevisionLetter(index: number): string {
  return String.fromCharCode(66 + index); // 66 = 'B'
}

/** Check if the current user can start a revision */
export function canStartRevision(bid: IBid, userEmail: string): boolean {
  // Only Engineer Responsible or Analyst can start a revision
  const isEngineer = (bid.engineerResponsible || []).some(
    (p) => p.email.toLowerCase() === userEmail.toLowerCase(),
  );
  const isAnalyst = (bid.analyst || []).some(
    (p) => p.email.toLowerCase() === userEmail.toLowerCase(),
  );
  return isEngineer || isAnalyst;
}

/** Check if a BID has an active (open) revision */
export function hasActiveRevision(bid: IBid): boolean {
  return (bid.revisions || []).some((r) => r.status === "open");
}

/** Get the current active revision (if any) */
export function getActiveRevision(bid: IBid): IBidRevision | null {
  return (bid.revisions || []).find((r) => r.status === "open") || null;
}

/** Get the current revision letter for the BID (A = initial, B = first rework, etc.) */
export function getCurrentRevisionLetter(bid: IBid): string {
  const revisions = bid.revisions || [];
  if (revisions.length === 0) return "A";
  // The latest revision letter (B, C, D, ...)
  return revisions[revisions.length - 1].revisionLetter;
}

/* ─── Props ─── */

interface RevisionsTabProps {
  bid: IBid;
  canEdit: boolean;
  currentUser: { displayName: string; email: string };
  onSave: (patch: Partial<IBid>) => void;
}

export const RevisionsTab: React.FC<RevisionsTabProps> = ({
  bid,
  canEdit,
  currentUser,
  onSave,
}) => {
  const [showConfirm, setShowConfirm] = React.useState<
    "start" | "close" | null
  >(null);
  const [reason, setReason] = React.useState("");

  const revisions = bid.revisions || [];
  const activeRevision = getActiveRevision(bid);
  const currentLetter = getCurrentRevisionLetter(bid);
  const isBidTerminal = isTerminalStatus(bid.currentStatus);
  const userCanStart = canStartRevision(bid, currentUser.email);

  // Can start a new revision: BID must be terminal + no active revision + user has permission
  const canStartNew =
    canEdit && isBidTerminal && !activeRevision && userCanStart;

  // Can close the active revision
  const canClose = canEdit && !!activeRevision && userCanStart;

  const handleStartRevision = (): void => {
    const now = new Date().toISOString();
    const newRevisionIndex = revisions.length;
    const newLetter = getRevisionLetter(newRevisionIndex);

    const newRevision: IBidRevision = {
      revisionLetter: newLetter,
      revision: newRevisionIndex,
      openedBy: { name: currentUser.displayName, email: currentUser.email },
      openedDate: now,
      closedBy: null,
      closedDate: null,
      reason: reason || "Revision requested",
      returnToPhase: bid.currentPhase,
      status: "open",
      changes: [],
      phaseChanges: [],
      statusChanges: [],
    };

    // Move BID to Rework phase
    const phaseHistory = bid.phaseHistory || [];
    const updatedPhaseHistory: IPhaseHistoryEntry[] = phaseHistory.map(
      (entry, idx) => {
        if (idx === phaseHistory.length - 1 && !entry.end) {
          return {
            ...entry,
            end: now,
            durationHours: calcDurationHours(entry.start, now),
          };
        }
        return entry;
      },
    );
    const newPhaseEntry: IPhaseHistoryEntry = {
      id: updatedPhaseHistory.length + 1,
      phase: "Rework" as BidPhase,
      start: now,
      end: null,
      durationHours: null,
      actor: currentUser.displayName,
    };

    // Update status history
    const statusHistory = bid.statusHistory || [];
    const updatedStatusHistory: IStatusHistoryEntry[] = statusHistory.map(
      (entry, idx) => {
        if (idx === statusHistory.length - 1 && !entry.end) {
          return {
            ...entry,
            end: now,
            durationHours: calcDurationHours(entry.start, now),
          };
        }
        return entry;
      },
    );
    const newStatusEntry: IStatusHistoryEntry = {
      id: updatedStatusHistory.length + 1,
      status: "Rework",
      phase: "Rework" as BidPhase,
      start: now,
      end: null,
      durationHours: null,
      actor: currentUser.displayName,
    };

    // Activity log
    const logEntry = {
      id: `log-${Date.now()}-revision`,
      type: "REVISION_STARTED",
      timestamp: now,
      actor: currentUser.email,
      actorName: currentUser.displayName,
      description: `Revision ${newLetter} started. Reason: ${reason || "Revision requested"}`,
      metadata: {
        revisionLetter: newLetter,
        reason: reason || "Revision requested",
      },
    };

    onSave({
      revisions: [...revisions, newRevision],
      currentPhase: "Rework" as BidPhase,
      currentStatus: "Rework",
      phaseHistory: [...updatedPhaseHistory, newPhaseEntry],
      statusHistory: [...updatedStatusHistory, newStatusEntry],
      completedDate: null, // Clear completed date since BID is reopened
      activityLog: [...(bid.activityLog || []), logEntry],
    });

    setShowConfirm(null);
    setReason("");
  };

  const handleCloseRevision = (): void => {
    if (!activeRevision) return;
    const now = new Date().toISOString();

    const updatedRevisions = revisions.map((r) =>
      r.status === "open"
        ? {
            ...r,
            status: "closed" as const,
            closedDate: now,
            closedBy: {
              name: currentUser.displayName,
              email: currentUser.email,
            },
          }
        : r,
    );

    // Move back to Close Out and set terminal status
    const phaseHistory = bid.phaseHistory || [];
    const updatedPhaseHistory: IPhaseHistoryEntry[] = phaseHistory.map(
      (entry, idx) => {
        if (idx === phaseHistory.length - 1 && !entry.end) {
          return {
            ...entry,
            end: now,
            durationHours: calcDurationHours(entry.start, now),
          };
        }
        return entry;
      },
    );
    const closeOutEntry: IPhaseHistoryEntry = {
      id: updatedPhaseHistory.length + 1,
      phase: "Close Out" as BidPhase,
      start: now,
      end: now,
      durationHours: 0,
      actor: currentUser.displayName,
    };

    const statusHistory = bid.statusHistory || [];
    const updatedStatusHistory: IStatusHistoryEntry[] = statusHistory.map(
      (entry, idx) => {
        if (idx === statusHistory.length - 1 && !entry.end) {
          return {
            ...entry,
            end: now,
            durationHours: calcDurationHours(entry.start, now),
          };
        }
        return entry;
      },
    );
    const completedEntry: IStatusHistoryEntry = {
      id: updatedStatusHistory.length + 1,
      status: "Completed",
      phase: "Close Out" as BidPhase,
      start: now,
      end: null,
      durationHours: null,
      actor: currentUser.displayName,
    };

    const logEntry = {
      id: `log-${Date.now()}-rev-close`,
      type: "REVISION_CLOSED",
      timestamp: now,
      actor: currentUser.email,
      actorName: currentUser.displayName,
      description: `Revision ${activeRevision.revisionLetter} closed`,
      metadata: { revisionLetter: activeRevision.revisionLetter },
    };

    onSave({
      revisions: updatedRevisions,
      currentPhase: "Close Out" as BidPhase,
      currentStatus: "Completed",
      phaseHistory: [...updatedPhaseHistory, closeOutEntry],
      statusHistory: [...updatedStatusHistory, completedEntry],
      completedDate: now,
      activityLog: [...(bid.activityLog || []), logEntry],
    });

    setShowConfirm(null);
  };

  return (
    <div className={styles.revisionsContainer}>
      {/* Header */}
      <div className={styles.revisionHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span className={styles.revisionTitle}>Revision Control</span>
          <span className={styles.currentRevisionBadge}>
            Rev. {currentLetter}
          </span>
          {activeRevision && (
            <span className={`${styles.revisionStatus} ${styles.statusOpen}`}>
              ● OPEN
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {canClose && (
            <button
              className={styles.closeRevisionBtn}
              onClick={() => setShowConfirm("close")}
            >
              ✓ Close Revision {activeRevision!.revisionLetter}
            </button>
          )}
          {canStartNew && (
            <button
              className={styles.startRevisionBtn}
              onClick={() => setShowConfirm("start")}
            >
              + Start New Revision
            </button>
          )}
        </div>
      </div>

      {/* Revision Cards */}
      {revisions.length === 0 ? (
        <GlassCard>
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <div className={styles.emptyText}>
              This BID is on Revision A (initial)
            </div>
            <div className={styles.emptySubtext}>
              No rework revisions have been created yet. A new revision can be
              started after the BID reaches a terminal status (Completed,
              Canceled, No Bid).
            </div>
          </div>
        </GlassCard>
      ) : (
        [...revisions].reverse().map((rev) => (
          <GlassCard key={rev.revisionLetter}>
            <div className={styles.revisionCardHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className={styles.revisionLetter}>
                  Revision {rev.revisionLetter}
                </span>
                <span
                  className={`${styles.revisionStatus} ${
                    rev.status === "open"
                      ? styles.statusOpen
                      : styles.statusClosed
                  }`}
                >
                  {rev.status === "open" ? "● OPEN" : "✓ CLOSED"}
                </span>
              </div>
              {rev.changes.length > 0 && (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--text-secondary)",
                  }}
                >
                  {rev.changes.length} change
                  {rev.changes.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Meta info */}
            <div className={styles.revisionMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Opened By</span>
                <span className={styles.metaValue}>{rev.openedBy.name}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Opened Date</span>
                <span className={styles.metaValue}>
                  {formatDateTime(rev.openedDate)}
                </span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Reason</span>
                <span className={styles.metaValue}>{rev.reason}</span>
              </div>
              {rev.closedDate && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Closed Date</span>
                  <span className={styles.metaValue}>
                    {formatDateTime(rev.closedDate)}
                  </span>
                </div>
              )}
              {rev.closedBy && (
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Closed By</span>
                  <span className={styles.metaValue}>{rev.closedBy.name}</span>
                </div>
              )}
            </div>

            {/* Changes */}
            <div className={styles.changesSection}>
              <div className={styles.changesSectionTitle}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
                Changes Tracked
              </div>
              {rev.changes.length === 0 ? (
                <div className={styles.noChanges}>
                  {rev.status === "open"
                    ? "No changes recorded yet in this revision."
                    : "No changes were recorded in this revision."}
                </div>
              ) : (
                <div className={styles.changesList}>
                  {rev.changes.map((change) => (
                    <div key={change.id} className={styles.changeItem}>
                      <div
                        className={`${styles.changeIcon} ${
                          change.changeType === "added"
                            ? styles.changeAdded
                            : change.changeType === "removed"
                              ? styles.changeRemoved
                              : styles.changeModified
                        }`}
                      >
                        {change.changeType === "added"
                          ? "+"
                          : change.changeType === "removed"
                            ? "−"
                            : "~"}
                      </div>
                      <div className={styles.changeContent}>
                        <div className={styles.changeDescription}>
                          <span className={styles.changeSection}>
                            {change.section}
                          </span>
                          {change.description}
                        </div>
                        <div className={styles.changeMeta}>
                          {change.changedBy.name} ·{" "}
                          {formatDateTime(change.changedAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </GlassCard>
        ))
      )}

      {/* Confirmation Modals */}
      {showConfirm === "start" && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmTitle}>
              Start Revision {getRevisionLetter(revisions.length)}?
            </div>
            <div className={styles.confirmText}>
              Starting a new revision will:
              <br />• Move the BID to <strong>Rework</strong> phase
              <br />
              • Unlock all editing pages (Scope, Hours, Assets, etc.)
              <br />
              • Track all changes made during this revision
              <br />
              <br />
              This action cannot be undone.
            </div>
            <textarea
              className={styles.reasonInput}
              placeholder="Reason for revision (optional)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => {
                  setShowConfirm(null);
                  setReason("");
                }}
              >
                Cancel
              </button>
              <button
                className={styles.confirmProceed}
                onClick={handleStartRevision}
              >
                Start Revision
              </button>
            </div>
          </div>
        </div>
      )}
      {showConfirm === "close" && (
        <div className={styles.confirmModal}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmTitle}>
              Close Revision {activeRevision?.revisionLetter}?
            </div>
            <div className={styles.confirmText}>
              Closing this revision will:
              <br />• Move the BID back to <strong>Completed</strong> status
              <br />
              • Lock all editing pages again
              <br />
              • Record the revision completion date
              <br />
              <br />
              All tracked changes will be preserved.
            </div>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => setShowConfirm(null)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmProceed}
                onClick={handleCloseRevision}
              >
                Close Revision
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import * as React from "react";
import { IBid, IQuickNote } from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { getPhaseDef } from "../../config/status.config";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useStatusColors } from "../../hooks/useStatusColors";
import { differenceInDays, format } from "date-fns";
import styles from "./BidCard.module.scss";

interface BidCardProps {
  bid: IBid;
  onClick: (bid: IBid) => void;
  dimmed?: boolean;
  onNotesChange?: (bidNumber: string, notes: IQuickNote[]) => void;
}

export const BidCard: React.FC<BidCardProps> = ({
  bid,
  onClick,
  dimmed,
  onNotesChange,
}) => {
  const currentUser = useCurrentUser();
  const { getPhaseColor, getStatusColor, getPriorityColor } = useStatusColors();
  const now = new Date();
  const daysLeft = differenceInDays(new Date(bid.dueDate), now);
  const dueClass =
    daysLeft < 0 ? styles.overdue : daysLeft <= 3 ? styles.warning : styles.ok;
  const phaseDef = getPhaseDef(bid.currentPhase);
  const phaseColor = getPhaseColor(bid.currentPhase);
  const statusColor = getStatusColor(bid.currentStatus);
  const priorityColor = getPriorityColor(bid.priority);

  const [notesOpen, setNotesOpen] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");
  const notes: IQuickNote[] = bid.quickNotes || [];

  const engineers = (bid.engineerResponsible || [])
    .map((e) => e.name)
    .filter(Boolean);
  const analysts = (bid.analyst || []).map((a) => a.name).filter(Boolean);

  const handleAddNote = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (!noteText.trim()) return;
    const newNote: IQuickNote = {
      id: `note-${Date.now()}`,
      text: noteText.trim(),
      author: { name: currentUser.displayName, email: currentUser.email },
      createdAt: new Date().toISOString(),
    };
    const updated = [...notes, newNote];
    setNoteText("");
    if (onNotesChange) onNotesChange(bid.bidNumber, updated);
  };

  const toggleNotes = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setNotesOpen((prev) => !prev);
  };

  return (
    <div
      className={`${styles.bidCard} ${dimmed ? styles.dimmed : ""}`}
      onClick={() => onClick(bid)}
    >
      <div className={styles.cardHeader}>
        <span className={styles.bidNumber}>
          {bid.bidNumber}
          {bid.crmNumber ? ` · ${bid.crmNumber}` : ""}
        </span>
        <StatusBadge status={bid.priority} color={priorityColor} />
      </div>

      <div className={styles.clientName}>
        {bid.opportunityInfo?.client || ""}
      </div>
      <div className={styles.projectName}>
        {bid.opportunityInfo?.projectName || ""}
      </div>

      <div className={styles.cardMeta}>
        <span>
          {bid.division}
          {bid.serviceLine ? ` · ${bid.serviceLine}` : ""}
        </span>
        <span>Creator: {bid.creator?.name || "—"}</span>
        <span>
          {engineers.length > 1 ? "Engineers" : "Engineer"}:{" "}
          {engineers.length > 0 ? engineers.join(", ") : "—"}
        </span>
        {analysts.length > 0 && (
          <span>
            {analysts.length > 1 ? "Analysts" : "Analyst"}:{" "}
            {analysts.join(", ")}
          </span>
        )}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${bid.kpis?.phaseCompletionPercentage || 0}%` }}
        />
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.badgeRow}>
          {phaseDef && (
            <span
              className={styles.phaseBadge}
              style={{ background: phaseColor }}
            >
              {phaseDef.label}
            </span>
          )}
          <StatusBadge status={bid.currentStatus} color={statusColor} />
        </div>
        <span className={`${styles.dueDate} ${dueClass}`}>
          {daysLeft < 0
            ? `${Math.abs(daysLeft)}d overdue`
            : daysLeft === 0
              ? "Due today"
              : `${daysLeft}d left`}
        </span>
      </div>

      {/* Notes indicator + expandable section */}
      <div className={styles.notesSection}>
        <button
          className={styles.notesToggle}
          onClick={toggleNotes}
          title={notesOpen ? "Collapse notes" : "Expand notes"}
        >
          <span className={styles.notesIcon}>📝</span>
          <span>Notes</span>
          {notes.length > 0 && (
            <span className={styles.notesBadge}>{notes.length}</span>
          )}
          <span className={styles.notesChevron}>{notesOpen ? "▲" : "▼"}</span>
        </button>
        {notesOpen && (
          <div
            className={styles.notesBody}
            onClick={(e) => e.stopPropagation()}
          >
            {notes.length === 0 && (
              <div className={styles.notesEmpty}>No notes yet</div>
            )}
            {notes.map((n) => (
              <div key={n.id} className={styles.noteItem}>
                <div className={styles.noteText}>{n.text}</div>
                <div className={styles.noteMeta}>
                  {n.author.name} ·{" "}
                  {format(new Date(n.createdAt), "dd/MM/yyyy HH:mm")}
                </div>
              </div>
            ))}
            <div className={styles.noteInputRow}>
              <input
                className={styles.noteInput}
                value={noteText}
                onChange={(e) => setNoteText(e.currentTarget.value)}
                placeholder="Add a note…"
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleAddNote(e as unknown as React.MouseEvent);
                }}
              />
              <button
                className={styles.noteAddBtn}
                onClick={handleAddNote}
                disabled={!noteText.trim()}
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

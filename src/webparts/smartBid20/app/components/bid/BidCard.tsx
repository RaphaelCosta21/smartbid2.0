import * as React from "react";
import { CalendarClock, ChevronDown, StickyNote } from "lucide-react";
import { IBid, IQuickNote } from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { ConfidentialLock } from "./ConfidentialLock";
import { getPhaseDef } from "../../config/status.config";
import { getPhaseProgressByIndex } from "../../utils/phaseHelpers";
import { getErnLinks } from "../../utils/ernHelpers";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useStatusColors } from "../../hooks/useStatusColors";
import { formatDate, formatDaysLeft } from "../../utils/formatters";
import { getDueFreezeDate } from "../../utils/bidHelpers";
import { format } from "date-fns";
import styles from "./BidCard.module.scss";

interface BidCardProps {
  bid: IBid;
  onClick: (bid: IBid) => void;
  dimmed?: boolean;
  /** Hide the division badge when the container already conveys it (Kanban column). */
  hideDivision?: boolean;
  onNotesChange?: (bidNumber: string, notes: IQuickNote[]) => void;
}

export const BidCard: React.FC<BidCardProps> = ({
  bid,
  onClick,
  dimmed,
  hideDivision,
  onNotesChange,
}) => {
  const currentUser = useCurrentUser();
  const {
    getPhaseColor,
    getStatusColor,
    getPriorityColor,
    getDivisionColor,
    getServiceLineColor,
  } = useStatusColors();
  const due = formatDaysLeft(bid.dueDate, getDueFreezeDate(bid));
  const dueClass = due.isOverdue
    ? styles.overdue
    : due.days !== null && due.days <= 3
      ? styles.warning
      : styles.ok;
  const phaseDef = getPhaseDef(bid.currentPhase);
  const phaseColor = getPhaseColor(bid.currentPhase);
  const statusColor = getStatusColor(bid.currentStatus);
  const priorityColor = getPriorityColor(bid.priority);
  const progress = getPhaseProgressByIndex(bid);

  const [notesOpen, setNotesOpen] = React.useState(false);
  const [noteText, setNoteText] = React.useState("");
  const notes: IQuickNote[] = bid.quickNotes || [];

  const engineers = (bid.engineerResponsible || [])
    .map((e) => e.name)
    .filter(Boolean);
  const analysts = (bid.analyst || []).map((a) => a.name).filter(Boolean);
  const ernLinks = getErnLinks(bid);

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
          <ConfidentialLock bid={bid} />
        </span>
        {bid.crmNumber && (
          <span className={styles.crmNumber}>CRM {bid.crmNumber}</span>
        )}
        <span className={styles.priority}>
          <StatusBadge status={bid.priority} color={priorityColor} />
        </span>
      </div>

      <div>
        <div className={styles.clientName}>
          {bid.opportunityInfo?.client || ""}
        </div>
        <div className={styles.projectName}>
          {bid.opportunityInfo?.projectName || ""}
        </div>
      </div>

      <div className={styles.badgeRow}>
        {!hideDivision && bid.division && (
          <StatusBadge
            status={bid.division}
            color={getDivisionColor(bid.division)}
          />
        )}
        {bid.serviceLine && (
          <StatusBadge
            status={bid.serviceLine}
            color={getServiceLineColor(bid.serviceLine)}
          />
        )}
        {phaseDef && <StatusBadge status={phaseDef.label} color={phaseColor} />}
        <StatusBadge status={bid.currentStatus} color={statusColor} />
      </div>

      <div className={styles.cardMeta}>
        <span className={styles.metaLabel}>Creator</span>
        <span className={styles.metaValue}>{bid.creator?.name || "-"}</span>
        <span className={styles.metaLabel}>
          {engineers.length > 1 ? "Engineers" : "Engineer"}
        </span>
        <span className={styles.metaValue}>
          {engineers.length > 0 ? engineers.join(", ") : "-"}
        </span>
        {analysts.length > 0 && (
          <>
            <span className={styles.metaLabel}>
              {analysts.length > 1 ? "Analysts" : "Analyst"}
            </span>
            <span className={styles.metaValue}>{analysts.join(", ")}</span>
          </>
        )}
        <span className={styles.metaLabel}>ERN</span>
        <span className={styles.metaValue}>
          {ernLinks.length === 0
            ? "TBD"
            : ernLinks
                .map((l) =>
                  l.division ? `${l.ernNumber} (${l.division})` : l.ernNumber,
                )
                .join(", ")}
        </span>
      </div>

      <div className={styles.progressRow}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className={styles.progressPct}>{progress}%</span>
      </div>

      <div className={styles.cardFooter}>
        <span
          className={`${styles.dueChip} ${dueClass}`}
          title={
            due.days !== null
              ? formatDate(bid.dueDate, "dd/MM/yyyy")
              : undefined
          }
        >
          <CalendarClock size={12} />
          {due.text}
        </span>
        <button
          type="button"
          className={styles.notesToggle}
          onClick={toggleNotes}
          title={notesOpen ? "Collapse notes" : "Expand notes"}
          aria-expanded={notesOpen}
        >
          <StickyNote size={13} />
          <span>Notes</span>
          {notes.length > 0 && (
            <span className={styles.notesBadge}>{notes.length}</span>
          )}
          <ChevronDown
            size={12}
            className={`${styles.notesChevron} ${notesOpen ? styles.notesChevronOpen : ""}`}
          />
        </button>
      </div>

      {notesOpen && (
        <div className={styles.notesBody} onClick={(e) => e.stopPropagation()}>
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
  );
};

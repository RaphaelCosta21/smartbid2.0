import * as React from "react";
import {
  CircleCheck,
  Clock,
  ExternalLink,
  History,
  Info,
  MessageSquare,
  Pencil,
  Pin,
  PinOff,
  RotateCcw,
  Trash2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import { BidNoteCategory, IBidNote, IPersonRef } from "../../models";
import {
  NOTE_CATEGORIES,
  TAB_NOTE_TABS,
  getNoteCategoryDef,
} from "../../config/noteCategories.config";
import {
  INotePermissionContext,
  canDeleteNote,
  canEditNoteContent,
  canManageNote,
  editNote,
  setNotePinned,
  setNoteResolved,
} from "../../utils/bidNotes";
import { formatDateTime } from "../../utils/formatters";
import { UserAvatar } from "../common/UserAvatar";
import { ConfirmDialog } from "../common/ConfirmDialog";
import styles from "./NoteCard.module.scss";

const CATEGORY_ICONS: Record<BidNoteCategory, LucideIcon> = {
  comment: MessageSquare,
  pending: Clock,
  attention: TriangleAlert,
  info: Info,
};

export const NoteCategoryIcon: React.FC<{
  category: BidNoteCategory;
  size?: number;
}> = ({ category, size = 12 }) => {
  const Icon = CATEGORY_ICONS[category] || MessageSquare;
  return <Icon size={size} />;
};

export const NoteCategoryChip: React.FC<{ category: BidNoteCategory }> = ({
  category,
}) => {
  const def = getNoteCategoryDef(category);
  return (
    <span
      className={styles.chip}
      style={{ color: def.color, background: def.soft }}
    >
      <NoteCategoryIcon category={def.value} size={11} />
      {def.label}
    </span>
  );
};

/** Category picker shared by the composer and the inline editor. */
export const NoteCategoryPicker: React.FC<{
  value: BidNoteCategory;
  onChange: (value: BidNoteCategory) => void;
}> = ({ value, onChange }) => (
  <div className={styles.categoryPicker} role="radiogroup">
    {NOTE_CATEGORIES.map((c) => {
      const active = c.value === value;
      return (
        <button
          key={c.value}
          type="button"
          role="radio"
          aria-checked={active}
          className={`${styles.categoryOption} ${active ? styles.categoryOptionActive : ""}`}
          style={
            active
              ? { color: c.color, background: c.soft, borderColor: c.color }
              : undefined
          }
          onClick={() => onChange(c.value)}
        >
          <NoteCategoryIcon category={c.value} size={12} />
          {c.label}
        </button>
      );
    })}
  </div>
);

const PersonStamp: React.FC<{ person: IPersonRef; at: string }> = ({
  person,
  at,
}) => (
  <>
    <strong>{person.name}</strong> · {formatDateTime(at)}
  </>
);

interface NoteCardProps {
  note: IBidNote;
  ctx: INotePermissionContext;
  /** Current user — stamped on edits/resolution. */
  by: IPersonRef;
  compact?: boolean;
  onUpdate?: (note: IBidNote) => void;
  onDelete?: (note: IBidNote) => void;
  /** Opens the tab that maintains a Scope / Hours note. */
  onOpenSource?: (source: "scope" | "hours") => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  ctx,
  by,
  compact = false,
  onUpdate,
  onDelete,
  onOpenSource,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(note.title || "");
  const [text, setText] = React.useState(note.text);
  const [category, setCategory] = React.useState<BidNoteCategory>(
    note.category,
  );
  const [showHistory, setShowHistory] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const def = getNoteCategoryDef(note.category);
  const deleted = !!note.deleted;
  const manage = !!onUpdate && canManageNote(note, ctx);
  const editContent = !!onUpdate && canEditNoteContent(note, ctx);
  const removable = !!onDelete && canDeleteNote(note, ctx);
  // Owner/moderator with delete rights, blocked only by the BID status.
  const deleteBlocked =
    !!onDelete &&
    note.source === "manual" &&
    ctx.isTerminal &&
    ctx.canDelete &&
    canManageNote(note, ctx);
  const history = note.history || [];
  const tabSource = note.source === "manual" ? null : note.source;

  const startEdit = (): void => {
    setTitle(note.title || "");
    setText(note.text);
    setCategory(note.category);
    setEditing(true);
  };

  const saveEdit = (): void => {
    if (!onUpdate || !text.trim()) return;
    const updated = editNote(note, { title, text, category }, by);
    if (updated !== note) onUpdate(updated);
    setEditing(false);
  };

  return (
    <article
      className={`${styles.card} ${compact ? styles.compact : ""} ${deleted ? styles.deleted : ""} ${note.resolved ? styles.resolved : ""}`}
      style={{ borderLeftColor: deleted ? undefined : def.color }}
    >
      <UserAvatar
        name={note.author.name}
        email={note.author.email}
        photoUrl={note.author.photoUrl}
        size={compact ? 28 : 34}
      />
      <div className={styles.body}>
        <header className={styles.header}>
          <div className={styles.headLine}>
            <span className={styles.author}>{note.author.name}</span>
            <NoteCategoryChip category={note.category} />
            {note.pinned && !deleted && !compact && (
              <span className={`${styles.chip} ${styles.pinnedChip}`}>
                <Pin size={10} /> Overview
              </span>
            )}
            {note.category === "pending" && note.resolved && (
              <span className={`${styles.chip} ${styles.resolvedChip}`}>
                <CircleCheck size={11} /> Resolved
              </span>
            )}
          </div>
          {!editing && !deleted && (manage || removable || deleteBlocked) && (
            <div className={styles.actions}>
              {manage && (
                <button
                  type="button"
                  className={styles.iconBtn}
                  title={note.pinned ? "Unpin from Overview" : "Pin to Overview"}
                  aria-label={
                    note.pinned ? "Unpin from Overview" : "Pin to Overview"
                  }
                  onClick={() => onUpdate!(setNotePinned(note, !note.pinned))}
                >
                  {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
              )}
              {manage && note.category === "pending" && (
                <button
                  type="button"
                  className={styles.iconBtn}
                  title={note.resolved ? "Reopen" : "Mark as resolved"}
                  aria-label={note.resolved ? "Reopen" : "Mark as resolved"}
                  onClick={() =>
                    onUpdate!(setNoteResolved(note, !note.resolved, by))
                  }
                >
                  {note.resolved ? (
                    <RotateCcw size={14} />
                  ) : (
                    <CircleCheck size={14} />
                  )}
                </button>
              )}
              {editContent && (
                <button
                  type="button"
                  className={styles.iconBtn}
                  title="Edit"
                  aria-label="Edit note"
                  onClick={startEdit}
                >
                  <Pencil size={14} />
                </button>
              )}
              {(removable || deleteBlocked) && (
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.dangerBtn}`}
                  title={
                    removable
                      ? "Delete"
                      : "Notes can't be deleted while the BID is in a terminal status"
                  }
                  aria-label="Delete note"
                  disabled={!removable}
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </header>

        {editing ? (
          <div className={styles.editor}>
            <NoteCategoryPicker value={category} onChange={setCategory} />
            <input
              className={styles.input}
              value={title}
              placeholder="Title (optional)"
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className={styles.textarea}
              value={text}
              autoFocus
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) saveEdit();
                if (e.key === "Escape") setEditing(false);
              }}
            />
            <div className={styles.editorActions}>
              <button
                type="button"
                className={styles.ghostBtn}
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.primaryBtn}
                disabled={!text.trim()}
                onClick={saveEdit}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            {note.title && <h5 className={styles.title}>{note.title}</h5>}
            <p className={styles.text}>{note.text}</p>
          </>
        )}

        <footer className={styles.meta}>
          <span>{formatDateTime(note.createdAt)}</span>
          {note.updatedBy && note.updatedAt && (
            <span>
              Edited by <PersonStamp person={note.updatedBy} at={note.updatedAt} />
            </span>
          )}
          {note.category === "pending" && note.resolved && (
            <span>
              Resolved by{" "}
              <PersonStamp person={note.resolved.by} at={note.resolved.at} />
            </span>
          )}
          {note.deleted && (
            <span className={styles.deletedStamp}>
              Deleted by{" "}
              <PersonStamp person={note.deleted.by} at={note.deleted.at} />
            </span>
          )}
          {tabSource && onOpenSource && (
            <button
              type="button"
              className={styles.linkBtn}
              onClick={() => onOpenSource(tabSource)}
            >
              <ExternalLink size={11} /> Edit in {TAB_NOTE_TABS[tabSource]}
            </button>
          )}
          {history.length > 0 && (
            <button
              type="button"
              className={styles.linkBtn}
              aria-expanded={showHistory}
              onClick={() => setShowHistory((v) => !v)}
            >
              <History size={11} /> History ({history.length})
            </button>
          )}
        </footer>

        {showHistory && history.length > 0 && (
          <ol className={styles.history}>
            <li className={styles.historyLabel}>Previous versions</li>
            {history
              .slice()
              .reverse()
              .map((h, i) => (
                <li key={`${h.editedAt}-${i}`} className={styles.historyItem}>
                  <UserAvatar
                    name={h.editedBy.name}
                    email={h.editedBy.email}
                    photoUrl={h.editedBy.photoUrl}
                    size={20}
                  />
                  <div className={styles.historyBody}>
                    <div className={styles.historyMeta}>
                      <PersonStamp person={h.editedBy} at={h.editedAt} />
                      {h.category !== note.category && (
                        <NoteCategoryChip category={h.category} />
                      )}
                    </div>
                    {h.title && (
                      <div className={styles.historyTitle}>{h.title}</div>
                    )}
                    <p className={styles.historyText}>{h.text}</p>
                  </div>
                </li>
              ))}
          </ol>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete note?"
        message="The note leaves the list and Overview but stays in the Deleted notes history."
        confirmLabel="Delete"
        variant="danger"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          if (onDelete) onDelete(note);
        }}
      />
    </article>
  );
};

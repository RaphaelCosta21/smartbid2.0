import * as React from "react";
import { ChevronDown, ChevronRight, FileText, Trash2 } from "lucide-react";
import { BidNoteCategory, IBid, IUser } from "../../models";
import { BidTab } from "../../config/bidTabs.config";
import { NOTE_CATEGORIES } from "../../config/noteCategories.config";
import {
  REQUEST_NOTES_KEY,
  isActiveNote,
  isListedNote,
  isOpenPending,
  sortNotesForList,
} from "../../utils/bidNotes";
import { useBidNoteActions } from "../../hooks/useBidNoteActions";
import { GlassCard } from "../common/GlassCard";
import { EmptyState } from "../common/EmptyState";
import { NoteCard, NoteCategoryIcon } from "./NoteCard";
import { NoteComposer } from "./NoteComposer";
import styles from "./NotesTab.module.scss";

export interface NotesTabProps {
  bid: IBid;
  canEdit?: boolean;
  canDelete?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: IUser;
  /** BID in a terminal status — notes can no longer be deleted. */
  isTerminal?: boolean;
  /** Opens another BID tab (Scope / Hours notes are edited there). */
  onOpenTab?: (tab: BidTab) => void;
}

type NotesFilter = "all" | "pinned" | "openPending" | BidNoteCategory;

export const NotesTab: React.FC<NotesTabProps> = ({
  bid,
  canEdit = false,
  canDelete = canEdit,
  onSave,
  currentUser,
  isTerminal = false,
  onOpenTab,
}) => {
  const { notes, ctx, by, add, update, remove } = useBidNoteActions(
    bid,
    { canEdit, canDelete, isTerminal, onSave },
    currentUser,
  );
  const [filter, setFilter] = React.useState<NotesFilter>("all");
  const [showDeleted, setShowDeleted] = React.useState(false);

  const requestNotes = ((bid.bidNotes || {}) as Record<string, string>)[
    REQUEST_NOTES_KEY
  ];
  const active = notes.filter(isListedNote);
  const deleted = notes
    .filter((n) => !isActiveNote(n))
    .sort((a, b) =>
      (b.deleted?.at || "").localeCompare(a.deleted?.at || ""),
    );

  const filters: { key: NotesFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: active.length },
    {
      key: "pinned",
      label: "On Overview",
      count: active.filter((n) => n.pinned).length,
    },
    {
      key: "openPending",
      label: "Open pending",
      count: active.filter(isOpenPending).length,
    },
    ...NOTE_CATEGORIES.map((c) => ({
      key: c.value as NotesFilter,
      label: c.label,
      count: active.filter((n) => n.category === c.value).length,
    })),
  ];

  const visible = sortNotesForList(
    active.filter((n) => {
      if (filter === "all") return true;
      if (filter === "pinned") return n.pinned;
      if (filter === "openPending") return isOpenPending(n);
      return n.category === filter;
    }),
  );

  const openSource = onOpenTab
    ? (source: "scope" | "hours") => onOpenTab(source)
    : undefined;

  return (
    <GlassCard
      title="Notes & Comments"
      subtitle="Comments, pending items, attention points and premisses. Pinned notes show on the Overview."
    >
      <div className={styles.container}>
        {requestNotes && (
          <section className={styles.requestNotes}>
            <div className={styles.requestLabel}>
              <FileText size={13} /> Request notes (from Commercial)
            </div>
            <p className={styles.requestText}>{requestNotes}</p>
          </section>
        )}

        {ctx.canEdit && <NoteComposer onSubmit={add} />}

        <div className={styles.filters} role="tablist">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className={`${styles.filterChip} ${filter === f.key ? styles.filterChipActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.key !== "all" &&
                f.key !== "pinned" &&
                f.key !== "openPending" && (
                  <NoteCategoryIcon category={f.key} size={11} />
                )}
              {f.label}
              <span className={styles.filterCount}>{f.count}</span>
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <EmptyState
            title={active.length === 0 ? "No notes yet" : "No notes match"}
            description={
              active.length === 0
                ? ctx.canEdit
                  ? "Add the first comment, pending item or premise above."
                  : "Notes added to this BID will appear here."
                : "Try another filter."
            }
          />
        ) : (
          <div className={styles.list}>
            {visible.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                ctx={ctx}
                by={by}
                onUpdate={update}
                onDelete={remove}
                onOpenSource={openSource}
              />
            ))}
          </div>
        )}

        {deleted.length > 0 && (
          <section className={styles.deletedSection}>
            <button
              type="button"
              className={styles.deletedToggle}
              aria-expanded={showDeleted}
              onClick={() => setShowDeleted((v) => !v)}
            >
              {showDeleted ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
              <Trash2 size={13} />
              Deleted notes ({deleted.length})
            </button>
            {showDeleted && (
              <div className={styles.list}>
                {deleted.map((note) => (
                  <NoteCard key={note.id} note={note} ctx={ctx} by={by} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </GlassCard>
  );
};

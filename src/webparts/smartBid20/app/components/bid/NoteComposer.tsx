import * as React from "react";
import { Pin } from "lucide-react";
import { BidNoteCategory } from "../../models";
import { INoteDraft } from "../../utils/bidNotes";
import { NoteCategoryPicker } from "./NoteCard";
import styles from "./NoteComposer.module.scss";

interface NoteComposerProps {
  onSubmit: (draft: INoteDraft) => void;
  onCancel?: () => void;
  defaultPinned?: boolean;
  defaultCategory?: BidNoteCategory;
  /** Hide the pin toggle (e.g. Overview always pins). */
  hidePin?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

export const NoteComposer: React.FC<NoteComposerProps> = ({
  onSubmit,
  onCancel,
  defaultPinned = false,
  defaultCategory = "comment",
  hidePin = false,
  autoFocus = false,
  placeholder = "Write a note, a pending item or a premise...",
}) => {
  const [category, setCategory] =
    React.useState<BidNoteCategory>(defaultCategory);
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const [pinned, setPinned] = React.useState(defaultPinned);
  const [expanded, setExpanded] = React.useState(autoFocus);

  const reset = (): void => {
    setCategory(defaultCategory);
    setTitle("");
    setText("");
    setPinned(defaultPinned);
    setExpanded(false);
  };

  const submit = (): void => {
    if (!text.trim()) return;
    onSubmit({ title, text, category, pinned });
    reset();
  };

  const cancel = (): void => {
    reset();
    if (onCancel) onCancel();
  };

  return (
    <div className={`${styles.composer} ${expanded ? styles.expanded : ""}`}>
      {expanded && (
        <NoteCategoryPicker value={category} onChange={setCategory} />
      )}
      {expanded && (
        <input
          className={styles.input}
          value={title}
          placeholder="Title (optional)"
          onChange={(e) => setTitle(e.target.value)}
        />
      )}
      <textarea
        className={styles.textarea}
        value={text}
        rows={expanded ? 3 : 1}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onFocus={() => setExpanded(true)}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
          if (e.key === "Escape") cancel();
        }}
      />
      {expanded && (
        <div className={styles.footer}>
          {!hidePin ? (
            <label className={styles.pinToggle}>
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
              />
              <Pin size={12} /> Pin to Overview (BID Analysis Notes /
              Premisses)
            </label>
          ) : (
            <span className={styles.hint}>Ctrl + Enter to save</span>
          )}
          <div className={styles.buttons}>
            <button type="button" className={styles.ghostBtn} onClick={cancel}>
              Cancel
            </button>
            <button
              type="button"
              className={styles.primaryBtn}
              disabled={!text.trim()}
              onClick={submit}
            >
              Add note
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

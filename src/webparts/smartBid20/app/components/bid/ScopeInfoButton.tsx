import * as React from "react";
import {
  ClipboardList,
  FileText,
  Info,
  MessageSquareText,
  Paperclip,
  X,
} from "lucide-react";
import { IBidAttachment } from "../../models";
import styles from "./ScopeInfoButton.module.scss";

const POPOVER_MAX_WIDTH = 400;
const POPOVER_MAX_HEIGHT = 420;
const POPOVER_GAP = 6;
const VIEWPORT_MARGIN = 8;
const HOVER_OPEN_DELAY = 120;
const HOVER_CLOSE_DELAY = 160;

let popoverSeq = 0;

const hasText = (v?: string): boolean => !!v && v.trim().length > 0;

export interface IScopeInfoButtonProps {
  /** Popover title, e.g. "Scope details" / "Section details" */
  title?: string;
  /** Row label shown under the title for context */
  subtitle?: string;
  /** Scope item / sub-item description (hidden when equal to subtitle) */
  description?: string;
  clientRequirement?: string;
  clientSpecs?: string[];
  comments?: string;
  attachments?: IBidAttachment[];
}

/**
 * Single compact trigger for the read-only Scope of Supply details of a row
 * (description, client requirement, specs, comments, attachments).
 * Hover previews the popover; click pins it (selectable text, clickable links)
 * until Esc, the close button or a click outside.
 */
export const ScopeInfoButton: React.FC<IScopeInfoButtonProps> = ({
  title = "Scope details",
  subtitle,
  description,
  clientRequirement,
  clientSpecs,
  comments,
  attachments,
}) => {
  const [open, setOpen] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);
  const [pos, setPos] = React.useState<React.CSSProperties>({});
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const popRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<number | undefined>(undefined);
  const idRef = React.useRef(`scope-info-pop-${++popoverSeq}`);

  const specs = (clientSpecs || []).filter(hasText);
  const files = attachments || [];
  const showDescription =
    hasText(description) &&
    (description || "").trim() !== (subtitle || "").trim();
  const showRequirement = hasText(clientRequirement);
  const showComments = hasText(comments);

  const clearTimer = (): void => {
    if (timerRef.current !== undefined) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  };

  // Fixed (viewport) coords — table wrappers clip absolutely positioned overlays
  const place = React.useCallback((): void => {
    const btn = btnRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(POPOVER_MAX_WIDTH, vw - VIEWPORT_MARGIN * 2);
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(r.left, vw - width - VIEWPORT_MARGIN),
    );
    const spaceBelow = vh - r.bottom - POPOVER_GAP - VIEWPORT_MARGIN;
    const spaceAbove = r.top - POPOVER_GAP - VIEWPORT_MARGIN;
    if (spaceBelow >= 240 || spaceBelow >= spaceAbove) {
      setPos({
        left,
        width,
        top: r.bottom + POPOVER_GAP,
        maxHeight: Math.min(POPOVER_MAX_HEIGHT, spaceBelow),
      });
    } else {
      setPos({
        left,
        width,
        bottom: vh - r.top + POPOVER_GAP,
        maxHeight: Math.min(POPOVER_MAX_HEIGHT, spaceAbove),
      });
    }
  }, []);

  const close = React.useCallback((): void => {
    clearTimer();
    setOpen(false);
    setPinned(false);
  }, []);

  React.useEffect(() => clearTimer, []);

  React.useEffect(() => {
    if (!open) return undefined;
    place();
    const onReflow = (): void => place();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open, place]);

  React.useEffect(() => {
    if (!pinned) return undefined;
    const onDown = (e: MouseEvent): void => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t) || popRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        close();
        btnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [pinned, close]);

  if (
    !showDescription &&
    !showRequirement &&
    specs.length === 0 &&
    !showComments &&
    files.length === 0
  )
    return null;

  const summary: string[] = [];
  if (showDescription) summary.push("Description");
  if (showRequirement || specs.length > 0)
    summary.push(specs.length > 0 ? `Specs (${specs.length})` : "Requirement");
  if (showComments) summary.push("Comments");
  if (files.length > 0)
    summary.push(files.length === 1 ? "1 file" : `${files.length} files`);

  const handleEnter = (): void => {
    clearTimer();
    if (open) return;
    timerRef.current = window.setTimeout(() => setOpen(true), HOVER_OPEN_DELAY);
  };

  const handleLeave = (): void => {
    clearTimer();
    if (pinned) return;
    timerRef.current = window.setTimeout(
      () => setOpen(false),
      HOVER_CLOSE_DELAY,
    );
  };

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    clearTimer();
    if (pinned) {
      close();
    } else {
      setPinned(true);
      setOpen(true);
    }
  };

  return (
    <span
      className={styles.wrap}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      // Keep clicks inside from toggling a parent row / section header
      onClick={(e) => e.stopPropagation()}
    >
      <button
        ref={btnRef}
        type="button"
        className={`${styles.trigger}${pinned ? ` ${styles.triggerPinned}` : ""}`}
        onClick={handleClick}
        aria-expanded={open}
        aria-controls={open ? idRef.current : undefined}
        aria-haspopup="dialog"
        aria-label={`${title}: ${summary.join(", ")}`}
        title={
          open ? undefined : `${title}: ${summary.join(" · ")} - click to pin`
        }
      >
        <ClipboardList size={14} />
      </button>
      {open && (
        <div
          ref={popRef}
          id={idRef.current}
          role="dialog"
          aria-label={title}
          className={styles.popover}
          style={pos}
        >
          <div className={styles.popHeader}>
            <span className={styles.popIcon}>
              <ClipboardList size={13} />
            </span>
            <span className={styles.popTitleGroup}>
              <span className={styles.popTitle}>{title}</span>
              {hasText(subtitle) && (
                <span className={styles.popSubtitle}>{subtitle}</span>
              )}
            </span>
            {pinned ? (
              <button
                type="button"
                className={styles.popClose}
                onClick={close}
                title="Close (Esc)"
                aria-label="Close"
              >
                <X size={13} />
              </button>
            ) : (
              <span className={styles.popHint}>Click to pin</span>
            )}
          </div>
          <div className={styles.popBody}>
            {showDescription && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  <Info size={11} /> Description
                </span>
                <p className={styles.textBlock}>{description}</p>
              </div>
            )}
            {showRequirement && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  <ClipboardList size={11} /> Client requirement
                </span>
                <p className={styles.requirement}>{clientRequirement}</p>
              </div>
            )}
            {specs.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  <ClipboardList size={11} /> Technical specifications
                  <span className={styles.sectionCount}>{specs.length}</span>
                </span>
                <ol className={styles.specList}>
                  {specs.map((spec, idx) => (
                    <li key={idx} className={styles.specItem}>
                      <span className={styles.specNum}>{idx + 1}</span>
                      <span className={styles.specText}>{spec}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {showComments && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  <MessageSquareText size={11} /> Scope comments
                </span>
                <p className={styles.textBlock}>{comments}</p>
              </div>
            )}
            {files.length > 0 && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>
                  <Paperclip size={11} /> Attachments
                  <span className={styles.sectionCount}>{files.length}</span>
                </span>
                <ul className={styles.fileList}>
                  {files.map((att) => (
                    <li key={att.id}>
                      <a
                        className={styles.fileLink}
                        href={att.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${att.fileName}`}
                      >
                        <FileText size={13} className={styles.fileIcon} />
                        <span className={styles.fileName}>{att.fileName}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
};

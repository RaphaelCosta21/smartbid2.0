/**
 * SideDrawer — floating liquid-glass side panel for drill-down details.
 * Rendered inline (no portal) so it also shows inside a fullscreen element. Keep it out of
 * ancestors with transform/filter/backdrop-filter, which would trap the fixed position.
 * Esc closes; ← / → call onPrev / onNext when provided.
 */
import * as React from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import animations from "../../styles/animations.module.scss";
import styles from "./SideDrawer.module.scss";

export interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Small uppercase context line above the title */
  eyebrow?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Shows a Back button (drill-down stack) */
  onBack?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** e.g. "3 / 25" between the prev / next arrows */
  position?: string;
  /** Panel width in px (capped by the viewport) */
  width?: number;
  /** Identifies the content; changing it scrolls the body back to the top */
  contentKey?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const isTypingTarget = (target: EventTarget | null): boolean => {
  const el = target as HTMLElement | null;
  if (!el || !el.tagName) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    el.isContentEditable
  );
};

export const SideDrawer: React.FC<SideDrawerProps> = ({
  open,
  onClose,
  title,
  eyebrow,
  subtitle,
  onBack,
  onPrev,
  onNext,
  position,
  width = 520,
  contentKey,
  footer,
  children,
}) => {
  const panelRef = React.useRef<HTMLElement>(null);
  const bodyRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onClose();
      } else if (!isTypingTarget(e.target)) {
        if (e.key === "ArrowLeft" && onPrev) onPrev();
        if (e.key === "ArrowRight" && onNext) onNext();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, onPrev, onNext]);

  React.useEffect(() => {
    if (open && panelRef.current) panelRef.current.focus();
  }, [open]);

  // New content (prev/next, drill-down) starts at the top
  React.useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [contentKey]);

  if (!open) return null;

  return (
    <>
      <div
        className={`${styles.scrim} ${animations.overlayFade}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        ref={panelRef}
        className={`${styles.panel} ${animations.drawerInRight}`}
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        tabIndex={-1}
      >
        <header className={styles.header}>
          <div className={styles.toolbar}>
            {onBack && (
              <button
                type="button"
                className={styles.textBtn}
                onClick={onBack}
              >
                <ArrowLeft size={14} />
                Back
              </button>
            )}
            <span className={styles.spacer} />
            {(onPrev || onNext) && (
              <div className={styles.stepper}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={onPrev}
                  disabled={!onPrev}
                  aria-label="Previous"
                  title="Previous (←)"
                >
                  <ChevronLeft size={16} />
                </button>
                {position && (
                  <span className={styles.position}>{position}</span>
                )}
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={onNext}
                  disabled={!onNext}
                  aria-label="Next"
                  title="Next (→)"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label="Close"
              title="Close (Esc)"
            >
              <X size={16} />
            </button>
          </div>
          {eyebrow && <div className={styles.eyebrow}>{eyebrow}</div>}
          <h3 className={styles.title}>{title}</h3>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </header>
        <div ref={bodyRef} className={styles.body}>
          {children}
        </div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </aside>
    </>
  );
};

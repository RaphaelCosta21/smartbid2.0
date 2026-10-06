/**
 * LiveFocusOverlay — "focus mode" for Live cards: the card grows from its place
 * into a large centered panel (container transform) and shrinks back on close.
 * Portaled into the app root: GlassCard's backdrop-filter would trap a fixed child.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Maximize2, Minimize2 } from "lucide-react";
import globalStyles from "../../styles/globals.module.scss";
import styles from "./LiveFocusOverlay.module.scss";

export interface FocusOrigin {
  rect: DOMRect;
  host: HTMLElement;
}

export interface FocusMode {
  ref: React.RefObject<HTMLDivElement>;
  origin: FocusOrigin | null;
  open: () => void;
  close: () => void;
}

export function useFocusMode(): FocusMode {
  const ref = React.useRef<HTMLDivElement>(null);
  const [origin, setOrigin] = React.useState<FocusOrigin | null>(null);
  const open = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const host =
      (el.closest(`.${globalStyles.smartBidRoot}`) as HTMLElement | null) ||
      document.body;
    setOrigin({ rect: el.getBoundingClientRect(), host });
  }, []);
  const close = React.useCallback(() => setOrigin(null), []);
  return { ref, origin, open, close };
}

export const FocusButton: React.FC<{ onClick: () => void; label: string }> = ({
  onClick,
  label,
}) => (
  <button
    type="button"
    className={styles.focusBtn}
    onClick={onClick}
    aria-label={`Expand ${label}`}
    title="Focus view"
  >
    <Maximize2 size={14} />
  </button>
);

interface LiveFocusOverlayProps {
  origin: FocusOrigin | null;
  onClose: () => void;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

type Phase = "closed" | "entering" | "open" | "exiting";

const EXIT_MS = 340;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function invert(from: DOMRect, to: DOMRect): string {
  const sx = to.width ? from.width / to.width : 1;
  const sy = to.height ? from.height / to.height : 1;
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`;
}

export const LiveFocusOverlay: React.FC<LiveFocusOverlayProps> = ({
  origin,
  onClose,
  title,
  subtitle,
  actions,
  children,
}) => {
  const [phase, setPhase] = React.useState<Phase>("closed");
  const originRef = React.useRef<FocusOrigin | null>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const returnFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (origin) {
      originRef.current = origin;
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setPhase("entering");
    } else {
      setPhase((p) => (p === "closed" ? p : "exiting"));
    }
  }, [origin]);

  React.useLayoutEffect(() => {
    const panel = panelRef.current;
    const from = originRef.current;
    if (!panel || !from) return undefined;
    const motion = !prefersReducedMotion();

    if (phase === "entering") {
      panel.style.transition = "none";
      panel.style.transform = "";
      if (motion) {
        panel.style.transform = invert(
          from.rect,
          panel.getBoundingClientRect(),
        );
      } else {
        panel.style.opacity = "0";
      }
      // Commit the inverted frame before animating back to identity
      void panel.offsetWidth;
      const raf = window.requestAnimationFrame(() => {
        panel.style.transition = "";
        panel.style.transform = "";
        panel.style.opacity = "";
        setPhase("open");
        closeRef.current?.focus();
      });
      return () => window.cancelAnimationFrame(raf);
    }

    if (phase === "exiting") {
      if (motion) {
        panel.style.transform = invert(
          from.rect,
          panel.getBoundingClientRect(),
        );
      }
      panel.style.opacity = "0";
      const timer = window.setTimeout(() => {
        setPhase("closed");
        returnFocusRef.current?.focus?.();
      }, EXIT_MS);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [phase]);

  React.useEffect(() => {
    if (phase === "closed" || phase === "exiting") return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

  const host = originRef.current?.host;
  if (phase === "closed" || !host) return null;

  return ReactDOM.createPortal(
    <div
      className={`${styles.root} ${phase === "open" ? styles.open : ""} ${
        phase === "exiting" ? styles.exiting : ""
      }`}
    >
      <div className={styles.scrim} onMouseDown={onClose} />
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>
              {title}
              <span className={styles.livePill}>
                <span className={styles.liveDot} />
                Live
              </span>
            </h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <div className={styles.actions}>
            {actions}
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close focus view"
              title="Close (Esc)"
            >
              <Minimize2 size={16} />
            </button>
          </div>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>,
    host,
  );
};

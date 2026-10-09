/**
 * GuidedTour — step by step product tour: a spotlight on the target element
 * (any element with a matching `data-tour` attribute) and a balloon with an arrow.
 * Steps whose target is not rendered when the tour opens are skipped.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAppRootHost } from "../../hooks/useAppRootHost";
import {
  getVisibleRect,
  IVisibleRect as IRect,
} from "../../utils/domVisibility";
import styles from "./GuidedTour.module.scss";

export type GuidedTourPlacement = "top" | "bottom" | "left" | "right";

export interface IGuidedTourStep {
  /** Value of the `data-tour` attribute of the element to highlight */
  target: string;
  title: string;
  body: string;
  placement?: GuidedTourPlacement;
}

export interface IGuidedTourLabels {
  next: string;
  back: string;
  skip: string;
  finish: string;
  close: string;
  stepOf: (step: number, total: number) => string;
}

interface GuidedTourProps {
  open: boolean;
  steps: IGuidedTourStep[];
  labels: IGuidedTourLabels;
  onClose: () => void;
}

interface IBalloonPos {
  top: number;
  left: number;
  placement: GuidedTourPlacement | "floating";
  arrow: number;
}

const SPOT_PAD = 8;
const GAP = 16;
const MARGIN = 12;
const ARROW_INSET = 20;

const OPPOSITE: Record<GuidedTourPlacement, GuidedTourPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

const PLACEMENT_CLASS: Record<string, string> = {
  top: styles.placeTop,
  bottom: styles.placeBottom,
  left: styles.placeLeft,
  right: styles.placeRight,
  floating: "",
};

function findTarget(id: string): HTMLElement | null {
  return document.querySelector(`[data-tour="${id}"]`) as HTMLElement | null;
}

function isRendered(id: string): boolean {
  const el = findTarget(id);
  return !!el && el.getClientRects().length > 0;
}

function prefersReducedMotion(): boolean {
  return (
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function getScrollParent(el: HTMLElement): HTMLElement | null {
  let p = el.parentElement;
  while (p && p !== document.body && p !== document.documentElement) {
    const oy = window.getComputedStyle(p).overflowY;
    if (
      (oy === "auto" || oy === "scroll") &&
      p.scrollHeight > p.clientHeight + 1
    )
      return p;
    p = p.parentElement;
  }
  return null;
}

/**
 * Scrolls only the nearest vertical scroller (not scrollIntoView, which would
 * also shift the SharePoint page around the web part) unless the target is on screen.
 */
function revealTarget(el: HTMLElement): void {
  const r = el.getBoundingClientRect();
  const vis = getVisibleRect(el);
  const needed = Math.min(r.height, window.innerHeight);
  if (vis && needed > 0 && vis.height / needed > 0.9) return;
  const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
  const parent = getScrollParent(el);
  const boxTop = parent ? parent.getBoundingClientRect().top : 0;
  const boxHeight = parent ? parent.clientHeight : window.innerHeight;
  const offset =
    r.height > boxHeight * 0.6
      ? r.top - boxTop - 16
      : r.top - boxTop - (boxHeight - r.height) / 2;
  if (parent) parent.scrollTo({ top: parent.scrollTop + offset, behavior });
  else window.scrollTo({ top: window.pageYOffset + offset, behavior });
}

function sameRect(a: IRect | null, b: IRect | null): boolean {
  if (!a || !b) return a === b;
  return (
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
}

function computePlacement(
  rect: IRect | null,
  bw: number,
  bh: number,
  preferred?: GuidedTourPlacement,
): IBalloonPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampX = (x: number): number =>
    Math.min(Math.max(x, MARGIN), Math.max(MARGIN, vw - bw - MARGIN));
  const clampY = (y: number): number =>
    Math.min(Math.max(y, MARGIN), Math.max(MARGIN, vh - bh - MARGIN));

  if (!rect) {
    return {
      top: clampY((vh - bh) / 2),
      left: clampX((vw - bw) / 2),
      placement: "floating",
      arrow: 0,
    };
  }

  const t = rect.top - SPOT_PAD;
  const l = rect.left - SPOT_PAD;
  const r = rect.left + rect.width + SPOT_PAD;
  const b = rect.top + rect.height + SPOT_PAD;
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const fits: Record<GuidedTourPlacement, boolean> = {
    top: t - GAP - MARGIN >= bh,
    bottom: vh - b - GAP - MARGIN >= bh,
    left: l - GAP - MARGIN >= bw,
    right: vw - r - GAP - MARGIN >= bw,
  };
  const order: GuidedTourPlacement[] = preferred
    ? [preferred, OPPOSITE[preferred], "bottom", "top", "right", "left"]
    : ["bottom", "top", "right", "left"];
  let placement: GuidedTourPlacement | undefined;
  for (let i = 0; i < order.length; i++) {
    if (fits[order[i]]) {
      placement = order[i];
      break;
    }
  }

  if (!placement) {
    // Target fills the screen: float the balloon over its lower part
    return {
      top: clampY(vh - bh - MARGIN * 2),
      left: clampX(cx - bw / 2),
      placement: "floating",
      arrow: 0,
    };
  }
  if (placement === "top" || placement === "bottom") {
    const left = clampX(cx - bw / 2);
    return {
      top: placement === "bottom" ? b + GAP : t - GAP - bh,
      left,
      placement,
      arrow: Math.min(Math.max(cx - left, ARROW_INSET), bw - ARROW_INSET),
    };
  }
  const top = clampY(cy - bh / 2);
  return {
    top,
    left: placement === "right" ? r + GAP : l - GAP - bw,
    placement,
    arrow: Math.min(Math.max(cy - top, ARROW_INSET), bh - ARROW_INSET),
  };
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  open,
  steps,
  labels,
  onClose,
}) => {
  const [probeRef, host] = useAppRootHost(open);
  const [targets, setTargets] = React.useState<string[]>([]);
  const [index, setIndex] = React.useState(0);
  const [rect, setRect] = React.useState<IRect | null>(null);
  const [pos, setPos] = React.useState<IBalloonPos | null>(null);
  const balloonRef = React.useRef<HTMLDivElement>(null);
  const nextRef = React.useRef<HTMLButtonElement>(null);
  const restoreFocusRef = React.useRef<HTMLElement | null>(null);
  const idRef = React.useRef("tour" + Math.random().toString(36).slice(2, 8));

  // Resolve the available steps once per opening
  React.useEffect(() => {
    if (!open) {
      setTargets([]);
      setRect(null);
      setPos(null);
      const prev = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (prev && prev.focus) prev.focus();
      return;
    }
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    const available = steps
      .filter((s) => isRendered(s.target))
      .map((s) => s.target);
    if (available.length === 0) {
      onClose();
      return;
    }
    setTargets(available);
    setIndex(0);
  }, [open]);

  const currentTarget = targets[index] || "";
  const current = currentTarget
    ? steps.filter((s) => s.target === currentTarget)[0]
    : undefined;
  const total = targets.length;
  const isLast = index >= total - 1;

  const goNext = (): void => {
    if (isLast) onClose();
    else setIndex(index + 1);
  };
  const goBack = (): void => {
    if (index > 0) setIndex(index - 1);
  };

  // Bring the target on screen, then follow it while anything scrolls or resizes
  React.useEffect(() => {
    if (!open || !currentTarget) return undefined;
    const el = findTarget(currentTarget);
    if (el) revealTarget(el);

    let raf = 0;
    const measure = (): void => {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        const target = findTarget(currentTarget);
        const next = target ? getVisibleRect(target) : null;
        setRect((prev) => (sameRect(prev, next) ? prev : next));
      });
    };
    measure();
    const settle = window.setTimeout(measure, 450);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, currentTarget]);

  // Place the balloon before paint so it never flashes in the wrong spot
  React.useLayoutEffect(() => {
    const balloon = balloonRef.current;
    if (!balloon || !current) return;
    const next = computePlacement(
      rect,
      balloon.offsetWidth,
      balloon.offsetHeight,
      current.placement,
    );
    setPos((prev) =>
      prev &&
      prev.placement === next.placement &&
      Math.abs(prev.top - next.top) < 0.5 &&
      Math.abs(prev.left - next.left) < 0.5 &&
      Math.abs(prev.arrow - next.arrow) < 0.5
        ? prev
        : next,
    );
  }, [rect, currentTarget, current && current.body]);

  React.useEffect(() => {
    if (open && currentTarget && nextRef.current) {
      nextRef.current.focus({ preventScroll: true });
    }
  }, [open, currentTarget]);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the balloon
  const keyHandlerRef = React.useRef<(e: KeyboardEvent) => void>(
    () => undefined,
  );
  keyHandlerRef.current = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      onClose();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goBack();
    } else if (e.key === "Tab" && balloonRef.current) {
      const focusables = balloonRef.current.querySelectorAll("button");
      if (focusables.length === 0) return;
      const first = focusables[0] as HTMLElement;
      const last = focusables[focusables.length - 1] as HTMLElement;
      const active = document.activeElement;
      if (
        e.shiftKey &&
        (active === first || !balloonRef.current.contains(active))
      ) {
        e.preventDefault();
        last.focus();
      } else if (
        !e.shiftKey &&
        (active === last || !balloonRef.current.contains(active))
      ) {
        e.preventDefault();
        first.focus();
      }
    }
  };
  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => keyHandlerRef.current(e);
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open]);

  const portal =
    open && host && current
      ? ReactDOM.createPortal(
          <div className={styles.root}>
            <div
              className={styles.blocker}
              onMouseDown={(e) => e.preventDefault()}
            />
            {rect ? (
              <div
                className={styles.spotlight}
                style={{
                  top: rect.top - SPOT_PAD,
                  left: rect.left - SPOT_PAD,
                  width: rect.width + SPOT_PAD * 2,
                  height: rect.height + SPOT_PAD * 2,
                }}
              />
            ) : (
              <div className={styles.dim} />
            )}
            <div
              ref={balloonRef}
              className={`${styles.balloon} ${pos ? PLACEMENT_CLASS[pos.placement] : styles.measuring}`}
              style={pos ? { top: pos.top, left: pos.left } : undefined}
              role="dialog"
              aria-modal="true"
              aria-labelledby={idRef.current + "-title"}
              aria-describedby={idRef.current + "-body"}
            >
              {pos && pos.placement !== "floating" && (
                <span
                  className={styles.arrow}
                  style={
                    pos.placement === "top" || pos.placement === "bottom"
                      ? { left: pos.arrow }
                      : { top: pos.arrow }
                  }
                />
              )}
              <div className={styles.head}>
                <span className={styles.stepChip} aria-live="polite">
                  {labels.stepOf(index + 1, total)}
                </span>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label={labels.close}
                  title={labels.close}
                >
                  <X size={14} />
                </button>
              </div>
              <div key={currentTarget} className={styles.content}>
                <h3 id={idRef.current + "-title"} className={styles.title}>
                  {current.title}
                </h3>
                <p id={idRef.current + "-body"} className={styles.body}>
                  {current.body}
                </p>
              </div>
              <div className={styles.progress} aria-hidden="true">
                <span
                  className={styles.progressFill}
                  style={{ width: `${((index + 1) / total) * 100}%` }}
                />
              </div>
              <div className={styles.footer}>
                {!isLast ? (
                  <button
                    type="button"
                    className={styles.skipBtn}
                    onClick={onClose}
                  >
                    {labels.skip}
                  </button>
                ) : (
                  <span />
                )}
                <div className={styles.navBtns}>
                  {index > 0 && (
                    <button
                      type="button"
                      className={styles.backBtn}
                      onClick={goBack}
                    >
                      <ChevronLeft size={14} />
                      {labels.back}
                    </button>
                  )}
                  <button
                    ref={nextRef}
                    type="button"
                    className={styles.nextBtn}
                    onClick={goNext}
                  >
                    {isLast ? labels.finish : labels.next}
                    {!isLast && <ChevronRight size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          host,
        )
      : null;

  return (
    <>
      <span ref={probeRef} hidden />
      {portal}
    </>
  );
};

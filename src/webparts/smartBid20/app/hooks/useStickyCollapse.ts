import * as React from "react";

/** Scroll distance after a manual expand (while stuck) that collapses the header again. */
const RECOLLAPSE_DISTANCE = 48;
/** Time for the expand transition to finish once unstuck before dropping the reserved space. */
const RESTORE_SETTLE_MS = 450;

export interface IStickyCollapse {
  /** The element is pinned to the top of its scroll container. */
  stuck: boolean;
  /** The user expanded the element while it was stuck. */
  manualOpen: boolean;
  setManualOpen: (open: boolean) => void;
}

const getScrollParent = (el: HTMLElement): HTMLElement | null => {
  let node = el.parentElement;
  while (node) {
    const overflowY = window.getComputedStyle(node).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return node;
    node = node.parentElement;
  }
  return null;
};

/**
 * Tracks a `position: sticky` element that must be the first in-flow child of
 * its parent. It reports when the element is stuck so it can collapse, and while
 * it is smaller than when it got stuck a bottom margin keeps its footprint, so
 * the content below never jumps (and the stuck state never flaps on short pages).
 * Writes `--sticky-progress` (0..1, scroll progress through the parent) on the element.
 */
export function useStickyCollapse(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean,
): IStickyCollapse {
  const [stuck, setStuck] = React.useState(false);
  const [manualOpen, setManualOpenState] = React.useState(false);
  const stuckRef = React.useRef(false);
  const manualOpenRef = React.useRef(false);
  const anchorRef = React.useRef(0);
  const getScrollTopRef = React.useRef<() => number>(() => 0);
  const beforeResizeRef = React.useRef<() => void>(() => undefined);

  const setManualOpen = React.useCallback((open: boolean): void => {
    beforeResizeRef.current();
    manualOpenRef.current = open;
    anchorRef.current = getScrollTopRef.current();
    setManualOpenState(open);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    const parent = el ? el.parentElement : null;
    if (!enabled || !el || !parent) return undefined;

    const scroller = getScrollParent(el);
    const target: HTMLElement | Window = scroller || window;
    getScrollTopRef.current = () =>
      scroller ? scroller.scrollTop : window.pageYOffset;

    stuckRef.current = false;
    manualOpenRef.current = false;
    setStuck(false);
    setManualOpenState(false);

    let reserved: number | null = null;
    let frame = 0;
    let settleTimer = 0;
    let slackTimer = 0;
    let slack = 0;
    const inlinePaddingBottom = parent.style.paddingBottom;
    const basePaddingBottom =
      parseFloat(window.getComputedStyle(parent).paddingBottom) || 0;

    // The margin compensation lands a frame after each transition step; at the
    // very bottom of the page that lag would clamp the scroll position. Temporary
    // off-screen slack below the content absorbs it while the header animates.
    const releaseSlack = (): void => {
      slack = 0;
      parent.style.paddingBottom = inlinePaddingBottom;
    };
    const holdSlack = (): void => {
      slack = Math.max(reserved || 0, el.offsetHeight);
      parent.style.paddingBottom = `${basePaddingBottom + slack}px`;
      window.clearTimeout(slackTimer);
      slackTimer = window.setTimeout(releaseSlack, RESTORE_SETTLE_MS);
    };
    beforeResizeRef.current = holdSlack;

    const compensate = (): void => {
      if (reserved === null) return;
      const diff = reserved - el.offsetHeight;
      el.style.marginBottom = diff > 0 ? `${diff}px` : "";
    };

    const measure = (): void => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const parentRect = parent.getBoundingClientRect();
      const parentStyle = window.getComputedStyle(parent);
      const naturalTop =
        parentRect.top +
        (parseFloat(parentStyle.borderTopWidth) || 0) +
        (parseFloat(parentStyle.paddingTop) || 0);
      // A sticky box is only displaced below its in-flow position while stuck
      const isStuck = rect.top > naturalTop + 0.5;

      let progress = 0;
      if (isStuck) {
        const viewBottom = scroller
          ? scroller.getBoundingClientRect().top + scroller.clientHeight
          : window.innerHeight;
        const span = parentRect.height - slack - (viewBottom - rect.top);
        progress =
          span > 0
            ? Math.min(1, Math.max(0, (rect.top - naturalTop) / span))
            : 1;
      }
      el.style.setProperty("--sticky-progress", progress.toFixed(4));

      if (isStuck !== stuckRef.current) {
        stuckRef.current = isStuck;
        window.clearTimeout(settleTimer);
        if (isStuck) {
          if (reserved === null) reserved = el.offsetHeight;
        } else {
          manualOpenRef.current = false;
          setManualOpenState(false);
          settleTimer = window.setTimeout(() => {
            reserved = null;
            el.style.marginBottom = "";
          }, RESTORE_SETTLE_MS);
        }
        holdSlack();
        setStuck(isStuck);
      } else if (
        isStuck &&
        manualOpenRef.current &&
        Math.abs(getScrollTopRef.current() - anchorRef.current) >
          RECOLLAPSE_DISTANCE
      ) {
        holdSlack();
        manualOpenRef.current = false;
        setManualOpenState(false);
      }
    };

    const schedule = (): void => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    const observer = new ResizeObserver(() => {
      compensate();
      schedule();
    });
    observer.observe(el);
    observer.observe(parent);
    target.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();

    return () => {
      target.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      window.clearTimeout(slackTimer);
      releaseSlack();
      beforeResizeRef.current = () => undefined;
      el.style.marginBottom = "";
      el.style.removeProperty("--sticky-progress");
    };
  }, [enabled]);

  return {
    stuck: enabled && stuck,
    manualOpen: enabled && manualOpen,
    setManualOpen,
  };
}

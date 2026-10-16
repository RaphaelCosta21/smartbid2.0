import * as React from "react";

interface IIndicatorRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ISlidingIndicator {
  containerRef: React.RefObject<HTMLDivElement>;
  /** Undefined while there is no selected tab to highlight. */
  style: React.CSSProperties | undefined;
  /** False on the first paint so the pill doesn't slide in from the origin. */
  animated: boolean;
}

/**
 * Tracks the `aria-selected="true"` tab inside a tablist so a background pill
 * can slide under it. The container must be `position: relative`.
 */
export function useSlidingIndicator(
  activeKey: string | number,
): ISlidingIndicator {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [rect, setRect] = React.useState<IIndicatorRect | null>(null);
  const [animated, setAnimated] = React.useState(false);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const measure = (): void => {
      const tab = container.querySelector<HTMLElement>(
        '[aria-selected="true"]',
      );
      if (!tab) {
        setRect(null);
        return;
      }
      // Hidden containers report 0; keep the last rect until it is visible again
      if (tab.offsetWidth === 0) return;
      const next = {
        x: tab.offsetLeft,
        y: tab.offsetTop,
        w: tab.offsetWidth,
        h: tab.offsetHeight,
      };
      setRect((prev) =>
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.w === next.w &&
        prev.h === next.h
          ? prev
          : next,
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [activeKey]);

  React.useEffect(() => {
    if (!rect || animated) return undefined;
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [rect, animated]);

  const style = rect
    ? {
        width: rect.w,
        height: rect.h,
        transform: `translate(${rect.x}px, ${rect.y}px)`,
      }
    : undefined;

  return { containerRef, style, animated };
}

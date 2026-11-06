import * as React from "react";

export interface IElementSize {
  width: number;
  height: number;
}

/**
 * Live content-box size of an element (ResizeObserver). Uses client sizes, so hover
 * transforms on ancestors don't make custom charts re-layout.
 */
export function useElementSize<T extends HTMLElement>(): [
  React.RefObject<T>,
  IElementSize,
] {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState<IElementSize>({ width: 0, height: 0 });

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = (): void => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      setSize((prev) =>
        prev.width === width && prev.height === height
          ? prev
          : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size];
}

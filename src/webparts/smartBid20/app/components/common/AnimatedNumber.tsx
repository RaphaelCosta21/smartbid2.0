/**
 * AnimatedNumber — headline figure with a short count-up when its value changes.
 * Use once per view (the main total); everything else should render statically.
 */
import * as React from "react";
import styles from "./AnimatedNumber.module.scss";

export interface AnimatedNumberProps {
  value: number;
  format: (value: number) => string;
  /** Count-up length in ms */
  duration?: number;
  className?: string;
}

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format,
  duration = 600,
  className,
}) => {
  const [shown, setShown] = React.useState(value);
  const fromRef = React.useRef(0);

  React.useEffect(() => {
    const from = fromRef.current;
    fromRef.current = value;
    if (prefersReducedMotion() || from === value) {
      setShown(value);
      return undefined;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(from + (value - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span
      className={`${styles.root} ${className || ""}`}
      aria-label={format(value)}
    >
      {format(shown)}
    </span>
  );
};

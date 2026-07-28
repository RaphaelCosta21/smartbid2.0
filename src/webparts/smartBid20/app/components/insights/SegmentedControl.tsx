import * as React from "react";
import styles from "./SegmentedControl.module.scss";

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ReactNode;
  title?: string;
}

interface SegmentedControlProps<T extends string | number> {
  value: T;
  segments: SegmentOption<T>[];
  onChange: (value: T) => void;
  size?: "sm" | "md";
  ariaLabel?: string;
  className?: string;
}

/**
 * SegmentedControl — compact glass toggle group for switching
 * chart views / metrics / granularities.
 */
export function SegmentedControl<T extends string | number>({
  value,
  segments,
  onChange,
  size = "md",
  ariaLabel,
  className,
}: SegmentedControlProps<T>): JSX.Element {
  return (
    <div
      className={`${styles.group} ${size === "sm" ? styles.sm : ""} ${className || ""}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {segments.map((seg) => {
        const active = seg.value === value;
        return (
          <button
            key={String(seg.value)}
            type="button"
            role="tab"
            aria-selected={active}
            title={seg.title || seg.label}
            className={`${styles.btn} ${active ? styles.active : ""}`}
            onClick={() => onChange(seg.value)}
          >
            {seg.icon && <span className={styles.icon}>{seg.icon}</span>}
            <span>{seg.label}</span>
          </button>
        );
      })}
    </div>
  );
}

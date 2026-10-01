import * as React from "react";
import { formatDaysLeft } from "../../utils/formatters";
import styles from "./CountdownTimer.module.scss";

interface CountdownTimerProps {
  targetDate: string;
  /** Stops the count at this date (see bidHelpers.getDueFreezeDate). */
  frozenAt?: Date | null;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  frozenAt,
  className,
}) => {
  const due = formatDaysLeft(targetDate, frozenAt);

  return (
    <span
      className={`${styles.timer} ${className || ""}`}
      style={{
        color: due.isOverdue
          ? "var(--danger)"
          : due.days !== null && due.days <= 3
            ? "var(--warning)"
            : "var(--text-secondary)",
      }}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      {due.text}
    </span>
  );
};

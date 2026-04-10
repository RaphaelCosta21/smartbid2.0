import * as React from "react";
import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "#3B82F6",
  height = 8,
  showLabel = false,
  className,
}) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      <div
        className={styles.track}
        style={{ borderRadius: height / 2, height }}
      >
        <div
          className={styles.fill}
          style={{
            width: `${percent}%`,
            background: color,
            borderRadius: height / 2,
          }}
        />
      </div>
      {showLabel && <span className={styles.label}>{percent}%</span>}
    </div>
  );
};

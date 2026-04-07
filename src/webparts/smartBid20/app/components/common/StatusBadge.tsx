import * as React from "react";
import { getStatusColor } from "../../config/status.config";
import styles from "./StatusBadge.module.scss";

interface StatusBadgeProps {
  status: string;
  color?: string;
  pulsing?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  color,
  pulsing,
}) => {
  const badgeColor = color || getStatusColor(status);

  return (
    <span
      className={`${styles.badge} ${pulsing ? styles.pulsing : ""}`}
      style={{
        background: `${badgeColor}18`,
        color: badgeColor,
        border: `1px solid ${badgeColor}30`,
      }}
    >
      <span className={styles.dot} style={{ background: badgeColor }} />
      {status}
    </span>
  );
};

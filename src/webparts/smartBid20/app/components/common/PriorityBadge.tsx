import * as React from "react";
import { PRIORITY_COLORS } from "../../utils/constants";
import styles from "./PriorityBadge.module.scss";

interface PriorityBadgeProps {
  priority: "Urgent" | "Normal" | "Low";
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
}) => {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS.Normal;
  const bg = color + "20";
  const pulse = priority === "Urgent";

  return (
    <span
      className={`${styles.badge} ${className || ""}`}
      style={{
        background: bg,
        color,
        border: `1px solid ${color}40`,
        animation: pulse ? "pulse 2s infinite" : undefined,
      }}
    >
      {priority}
    </span>
  );
};

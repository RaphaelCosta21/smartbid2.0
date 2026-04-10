import * as React from "react";
import styles from "./PriorityBadge.module.scss";

interface PriorityBadgeProps {
  priority: "Urgent" | "Normal" | "Low";
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
}) => {
  const config: Record<string, { color: string; bg: string; pulse: boolean }> =
    {
      Urgent: { color: "#EF4444", bg: "#EF444420", pulse: true },
      Normal: { color: "#3B82F6", bg: "#3B82F620", pulse: false },
      Low: { color: "#94A3B8", bg: "#94A3B820", pulse: false },
    };

  const { color, bg, pulse } = config[priority] || config.Normal;

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

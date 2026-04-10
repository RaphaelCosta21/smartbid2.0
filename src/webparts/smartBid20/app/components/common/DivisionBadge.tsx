import * as React from "react";
import styles from "./DivisionBadge.module.scss";

interface DivisionBadgeProps {
  division: string;
  className?: string;
}

export const DivisionBadge: React.FC<DivisionBadgeProps> = ({
  division,
  className,
}) => {
  const colors: Record<string, string> = {
    OPG: "#F59E0B",
    "SSR-Survey": "#06B6D4",
    "SSR-ROV": "#8B5CF6",
    "SSR-Integrated": "#EC4899",
  };

  const color = colors[division] || "#94A3B8";

  return (
    <span
      className={`${styles.badge} ${className || ""}`}
      style={{
        background: `${color}20`,
        color,
        border: `1px solid ${color}40`,
      }}
    >
      {division}
    </span>
  );
};

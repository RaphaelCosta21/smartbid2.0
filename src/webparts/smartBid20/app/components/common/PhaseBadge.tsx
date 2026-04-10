import * as React from "react";
import styles from "./PhaseBadge.module.scss";

interface PhaseBadgeProps {
  phase: string;
  label?: string;
  color?: string;
  className?: string;
}

export const PhaseBadge: React.FC<PhaseBadgeProps> = ({
  phase,
  label,
  color,
  className,
}) => {
  const phaseColors: Record<string, string> = {
    PHASE_0: "#94A3B8",
    PHASE_1: "#3B82F6",
    PHASE_2: "#06B6D4",
    PHASE_3: "#8B5CF6",
    PHASE_4: "#EC4899",
    PHASE_5: "#10B981",
  };

  const bgColor = color || phaseColors[phase] || "#94A3B8";

  return (
    <span
      className={`${styles.badge} ${className || ""}`}
      style={{
        background: `${bgColor}20`,
        color: bgColor,
        border: `1px solid ${bgColor}40`,
      }}
    >
      {label || phase}
    </span>
  );
};

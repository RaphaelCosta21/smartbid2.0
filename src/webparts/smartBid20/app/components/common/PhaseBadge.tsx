import * as React from "react";
import { useConfigStore } from "../../stores/useConfigStore";
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
  const config = useConfigStore((s) => s.config);

  const bgColor = React.useMemo(() => {
    if (color) return color;
    if (config?.phases) {
      const p = config.phases.find(
        (p) => p.value === phase || p.label === phase,
      );
      if (p?.color) return p.color;
    }
    return "#94A3B8";
  }, [color, phase, config]);

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

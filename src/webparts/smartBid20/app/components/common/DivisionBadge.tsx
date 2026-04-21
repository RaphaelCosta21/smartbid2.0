import * as React from "react";
import { useConfigStore } from "../../stores/useConfigStore";
import styles from "./DivisionBadge.module.scss";

interface DivisionBadgeProps {
  division: string;
  className?: string;
}

export const DivisionBadge: React.FC<DivisionBadgeProps> = ({
  division,
  className,
}) => {
  const config = useConfigStore((s) => s.config);

  const color = React.useMemo(() => {
    if (config?.divisions) {
      const div = config.divisions.find(
        (d) => d.value === division || d.label === division,
      );
      if (div?.color) return div.color;
    }
    return "#94A3B8";
  }, [config, division]);

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

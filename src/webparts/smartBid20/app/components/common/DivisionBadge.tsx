import * as React from "react";
import { useStatusColors } from "../../hooks/useStatusColors";
import styles from "./DivisionBadge.module.scss";

interface DivisionBadgeProps {
  division: string;
  className?: string;
}

export const DivisionBadge: React.FC<DivisionBadgeProps> = ({
  division,
  className,
}) => {
  const { getBusinessLineColor } = useStatusColors();
  const color = getBusinessLineColor(division);

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

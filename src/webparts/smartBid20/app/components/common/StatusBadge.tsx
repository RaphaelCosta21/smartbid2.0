import * as React from "react";
import { getStatusColor, getPhaseColor } from "../../config/status.config";
import { useConfigStore } from "../../stores/useConfigStore";
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
  const config = useConfigStore((s) => s.config);

  // Resolve color: explicit prop > config subStatuses > config terminalStatuses > config phases > hardcoded fallback
  const badgeColor = React.useMemo(() => {
    if (color) return color;
    if (config) {
      // Check subStatuses
      const sub = (config.subStatuses || []).find((s) => s.value === status);
      if (sub?.color) return sub.color;
      // Check terminalStatuses
      const term = ((config as any).terminalStatuses || []).find(
        (s: any) => s.value === status,
      );
      if (term?.color) return term.color;
      // Check phases (status might match a phase name)
      const phase = (config.phases || []).find((p) => p.value === status);
      if (phase?.color) return phase.color;
    }
    // Fallback to hardcoded
    return getStatusColor(status) || getPhaseColor(status) || "#94A3B8";
  }, [color, status, config]);

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

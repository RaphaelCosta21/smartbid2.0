import * as React from "react";
import { BID_PHASES } from "../../config/status.config";
import { useConfigStore } from "../../stores/useConfigStore";
import styles from "./BidPhaseProgress.module.scss";

interface BidPhaseProgressProps {
  currentPhase: string;
}

export const BidPhaseProgress: React.FC<BidPhaseProgressProps> = ({
  currentPhase,
}) => {
  const config = useConfigStore((s) => s.config);

  const phases = React.useMemo(() => {
    if (config?.phases && config.phases.length > 0) {
      return config.phases
        .filter((p) => p.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((p) => ({
          id: p.id,
          label: p.label,
          value: p.value,
          color: p.color || "#94A3B8",
        }));
    }
    return BID_PHASES.map((p) => ({
      id: p.id,
      label: p.label,
      value: p.value,
      color: p.color,
    }));
  }, [config]);

  const currentIndex = phases.findIndex((p) => p.value === currentPhase);

  return (
    <div className={styles.container}>
      {phases.map((phase, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={phase.id}>
            <div
              title={phase.label}
              className={styles.circle}
              style={{
                background: isCompleted
                  ? "#10b981"
                  : isCurrent
                    ? "#00c9a7"
                    : "var(--border-subtle)",
                color: isCompleted || isCurrent ? "white" : "var(--text-muted)",
                border: isCurrent ? "2px solid rgba(0, 201, 167, 0.4)" : "none",
              }}
            >
              {isCompleted ? "✓" : idx}
            </div>
            {idx < phases.length - 1 && (
              <div
                className={styles.connector}
                style={{
                  background: isCompleted ? "#10b981" : "var(--border-subtle)",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

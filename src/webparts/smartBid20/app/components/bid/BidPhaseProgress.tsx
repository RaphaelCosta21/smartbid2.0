import * as React from "react";
import { useConfigPhases } from "../../hooks/useConfigPhases";
import styles from "./BidPhaseProgress.module.scss";

interface BidPhaseProgressProps {
  currentPhase: string;
}

export const BidPhaseProgress: React.FC<BidPhaseProgressProps> = ({
  currentPhase,
}) => {
  const phases = useConfigPhases();

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
                    ? "var(--accent-brand)"
                    : "var(--border-subtle)",
                color: isCompleted
                  ? "white"
                  : isCurrent
                    ? "var(--primary-accent-contrast)"
                    : "var(--text-muted)",
                border: isCurrent
                  ? "2px solid color-mix(in srgb, var(--accent-brand) 40%, transparent)"
                  : "none",
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

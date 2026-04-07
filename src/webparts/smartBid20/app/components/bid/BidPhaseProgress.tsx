import * as React from "react";
import { BID_PHASES } from "../../config/status.config";

interface BidPhaseProgressProps {
  currentPhase: string;
}

export const BidPhaseProgress: React.FC<BidPhaseProgressProps> = ({
  currentPhase,
}) => {
  const currentIndex = BID_PHASES.findIndex((p) => p.value === currentPhase);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {BID_PHASES.map((phase, idx) => {
        const isCompleted = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        return (
          <React.Fragment key={phase.id}>
            <div
              title={phase.label}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
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
            {idx < BID_PHASES.length - 1 && (
              <div
                style={{
                  width: 12,
                  height: 2,
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

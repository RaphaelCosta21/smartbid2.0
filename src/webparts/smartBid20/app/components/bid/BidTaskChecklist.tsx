import * as React from "react";
import { IBidTask } from "../../models";

interface BidTaskChecklistProps {
  tasks: IBidTask[];
  onToggle?: (taskId: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const BidTaskChecklist: React.FC<BidTaskChecklistProps> = ({
  tasks,
  onToggle,
  readOnly = false,
  className,
}) => {
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <div className={className}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h4 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
          Tasks ({completedCount}/{tasks.length})
        </h4>
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          {tasks.length > 0
            ? Math.round((completedCount / tasks.length) * 100)
            : 0}
          % complete
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {tasks.map((task) => {
          const isCompleted = task.status === "completed";
          const isSkipped = task.status === "skipped";
          return (
            <div
              key={task.taskId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 8,
                background: isCompleted
                  ? "#10B98108"
                  : isSkipped
                    ? "#94A3B808"
                    : "transparent",
                opacity: isSkipped ? 0.5 : 1,
              }}
            >
              <input
                type="checkbox"
                checked={isCompleted}
                disabled={readOnly || isSkipped}
                onChange={() => onToggle?.(task.taskId)}
                style={{
                  width: 18,
                  height: 18,
                  cursor: readOnly ? "default" : "pointer",
                }}
              />
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: 14,
                    textDecoration: isCompleted
                      ? "line-through"
                      : isSkipped
                        ? "line-through"
                        : "none",
                    color:
                      isCompleted || isSkipped
                        ? "var(--text-secondary)"
                        : "var(--text-primary)",
                  }}
                >
                  <strong>{task.taskId}</strong> — {task.name}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                {task.assignedTo}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

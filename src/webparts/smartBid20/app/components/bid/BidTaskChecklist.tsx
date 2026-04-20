import * as React from "react";
import { IBidTask } from "../../models";
import styles from "./BidTaskChecklist.module.scss";

interface BidTaskChecklistProps {
  tasks: IBidTask[];
  onToggle?: (taskId: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const BidTaskChecklist: React.FC<BidTaskChecklistProps> = ({
  tasks = [],
  onToggle,
  readOnly = false,
  className,
}) => {
  const safeItems = tasks || [];
  const completedCount = safeItems.filter((t) => t.status === "completed").length;

  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.header}>
        <h4 className={styles.title}>
          Tasks ({completedCount}/{safeItems.length})
        </h4>
        <span className={styles.progressText}>
          {safeItems.length > 0
            ? Math.round((completedCount / safeItems.length) * 100)
            : 0}
          % complete
        </span>
      </div>
      <div className={styles.taskList}>
        {safeItems.map((task) => {
          const isCompleted = task.status === "completed";
          const isSkipped = task.status === "skipped";
          return (
            <div
              key={task.taskId}
              className={`${styles.taskItem} ${isSkipped ? styles.taskSkipped : ""}`}
              style={{
                background: isCompleted
                  ? "#10B98108"
                  : isSkipped
                    ? "#94A3B808"
                    : "transparent",
              }}
            >
              <input
                type="checkbox"
                checked={isCompleted}
                disabled={readOnly || isSkipped}
                onChange={() => onToggle?.(task.taskId)}
                className={styles.checkbox}
                style={{ cursor: readOnly ? "default" : "pointer" }}
              />
              <div className={styles.taskContent}>
                <span
                  className={styles.taskName}
                  style={{
                    textDecoration:
                      isCompleted || isSkipped ? "line-through" : "none",
                    color:
                      isCompleted || isSkipped
                        ? "var(--text-secondary)"
                        : "var(--text-primary)",
                  }}
                >
                  <strong>{task.taskId}</strong> — {task.name}
                </span>
              </div>
              <span className={styles.taskAssignee}>{task.assignedTo}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

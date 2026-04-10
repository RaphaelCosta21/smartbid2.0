import * as React from "react";
import styles from "./Timeline.module.scss";

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: React.ReactNode;
  color?: string;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className }) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      <div className={styles.line} />
      {items.map((item) => (
        <div key={item.id} className={styles.item}>
          <div
            className={styles.dot}
            style={{ background: item.color || "var(--accent-color, #3B82F6)" }}
          >
            {item.icon}
          </div>
          <div>
            <span className={styles.itemTitle}>{item.title}</span>
            {item.description && (
              <p className={styles.itemDescription}>{item.description}</p>
            )}
            <span className={styles.itemTimestamp}>{item.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

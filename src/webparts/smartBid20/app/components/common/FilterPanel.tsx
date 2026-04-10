import * as React from "react";
import styles from "./FilterPanel.module.scss";

interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onToggle,
  children,
  className,
}) => {
  return (
    <div className={className}>
      <button
        onClick={onToggle}
        className={styles.toggleBtn}
        style={{
          background: isOpen
            ? "var(--accent-color, #3B82F6)"
            : "var(--card-bg)",
          color: isOpen ? "#fff" : "var(--text-primary)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
        Filters
      </button>
      {isOpen && <div className={styles.panel}>{children}</div>}
    </div>
  );
};

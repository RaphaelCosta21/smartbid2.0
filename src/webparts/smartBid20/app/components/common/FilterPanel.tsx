import * as React from "react";

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
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          border: "1px solid var(--border-subtle)",
          borderRadius: 8,
          background: isOpen
            ? "var(--accent-color, #3B82F6)"
            : "var(--card-bg)",
          color: isOpen ? "#fff" : "var(--text-primary)",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
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
      {isOpen && (
        <div
          style={{
            marginTop: 12,
            padding: 20,
            background: "var(--card-bg)",
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

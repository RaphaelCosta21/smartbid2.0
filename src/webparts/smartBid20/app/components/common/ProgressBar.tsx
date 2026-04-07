import * as React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "#3B82F6",
  height = 8,
  showLabel = false,
  className,
}) => {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 8 }}
    >
      <div
        style={{
          flex: 1,
          background: "var(--border-subtle, #e5e7eb)",
          borderRadius: height / 2,
          height,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            borderRadius: height / 2,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {percent}%
        </span>
      )}
    </div>
  );
};

import * as React from "react";

interface PriorityBadgeProps {
  priority: "Urgent" | "High" | "Normal" | "Low";
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className,
}) => {
  const config: Record<string, { color: string; bg: string; pulse: boolean }> =
    {
      Urgent: { color: "#EF4444", bg: "#EF444420", pulse: true },
      High: { color: "#F59E0B", bg: "#F59E0B20", pulse: false },
      Normal: { color: "#3B82F6", bg: "#3B82F620", pulse: false },
      Low: { color: "#94A3B8", bg: "#94A3B820", pulse: false },
    };

  const { color, bg, pulse } = config[priority] || config.Normal;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 10px",
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 600,
        background: bg,
        color,
        border: `1px solid ${color}40`,
        animation: pulse ? "pulse 2s infinite" : undefined,
      }}
    >
      {priority}
    </span>
  );
};

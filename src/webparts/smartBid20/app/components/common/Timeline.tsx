import * as React from "react";

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
    <div
      className={className}
      style={{ position: "relative", paddingLeft: 24 }}
    >
      <div
        style={{
          position: "absolute",
          left: 7,
          top: 0,
          bottom: 0,
          width: 2,
          background: "var(--border-subtle)",
        }}
      />
      {items.map((item) => (
        <div
          key={item.id}
          style={{
            position: "relative",
            paddingLeft: 24,
            paddingBottom: 20,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -20,
              top: 2,
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: item.color || "var(--accent-color, #3B82F6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--card-bg, #fff)",
            }}
          >
            {item.icon}
          </div>
          <div>
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {item.title}
            </span>
            {item.description && (
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                {item.description}
              </p>
            )}
            <span
              style={{
                fontSize: 11,
                color: "var(--text-secondary)",
                opacity: 0.7,
              }}
            >
              {item.timestamp}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

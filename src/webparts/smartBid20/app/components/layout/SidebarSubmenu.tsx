import * as React from "react";

interface SidebarSubmenuProps {
  label: string;
  icon: React.ReactNode;
  isCollapsed?: boolean;
  children: React.ReactNode;
}

export const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  label,
  icon,
  isCollapsed,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={isCollapsed ? label : undefined}
        style={{
          display: "flex",
          alignItems: "center",
          gap: isCollapsed ? 0 : 12,
          justifyContent: isCollapsed ? "center" : "flex-start",
          padding: "10px 16px",
          width: "100%",
          border: "none",
          background: "transparent",
          color: "var(--sidebar-text, #ccc)",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 14,
        }}
      >
        <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
        {!isCollapsed && (
          <>
            <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </>
        )}
      </button>
      {isOpen && !isCollapsed && (
        <div style={{ paddingLeft: 24 }}>{children}</div>
      )}
    </div>
  );
};

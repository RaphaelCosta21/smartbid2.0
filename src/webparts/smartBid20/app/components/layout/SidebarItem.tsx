import * as React from "react";
import styles from "./Sidebar.module.scss";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  badge,
  isCollapsed,
  onClick,
}) => {
  return (
    <button
      className={`${styles.navItem || ""} ${isActive ? styles.active || "" : ""}`}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: isCollapsed ? 0 : 12,
        justifyContent: isCollapsed ? "center" : "flex-start",
        padding: "10px 16px",
        width: "100%",
        border: "none",
        background: isActive
          ? "var(--sidebar-active-bg, rgba(255,255,255,0.1))"
          : "transparent",
        color: isActive
          ? "var(--sidebar-active-text, #fff)"
          : "var(--sidebar-text, #ccc)",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 14,
        fontWeight: isActive ? 600 : 400,
        transition: "all 0.2s ease",
      }}
    >
      <span style={{ flexShrink: 0, display: "flex" }}>{icon}</span>
      {!isCollapsed && (
        <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
      )}
      {!isCollapsed && badge !== undefined && badge > 0 && (
        <span
          style={{
            background: "var(--accent-color, #3B82F6)",
            color: "#fff",
            borderRadius: 10,
            padding: "2px 8px",
            fontSize: 11,
            fontWeight: 600,
            minWidth: 20,
            textAlign: "center",
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

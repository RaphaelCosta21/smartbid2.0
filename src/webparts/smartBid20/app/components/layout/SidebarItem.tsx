import * as React from "react";
import styles from "./Sidebar.module.scss";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
  badgePulsing?: boolean;
  isCollapsed?: boolean;
  onClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  badge,
  badgePulsing,
  isCollapsed,
  onClick,
}) => {
  return (
    <div
      className={`${styles.navItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
    >
      {icon}
      {!isCollapsed && (
        <>
          <span className={styles.navLabel}>{label}</span>
          {badge !== undefined && badge > 0 && (
            <span
              className={`${styles.badge} ${badgePulsing ? styles.pulsing : ""}`}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </div>
  );
};

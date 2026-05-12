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
  onExternalClick?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  isActive,
  badge,
  badgePulsing,
  isCollapsed,
  onClick,
  onExternalClick,
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
          {onExternalClick && (
            <button
              className={styles.externalBtn}
              onClick={(e) => {
                e.stopPropagation();
                onExternalClick();
              }}
              title="Open in external view"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
              </svg>
            </button>
          )}
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

import * as React from "react";
import { Lock } from "lucide-react";
import styles from "./Sidebar.module.scss";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
  badgePulsing?: boolean;
  isCollapsed?: boolean;
  /** Listed but not clickable (no access for the user's team). */
  disabled?: boolean;
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
  disabled,
  onClick,
  onExternalClick,
}) => {
  const title = disabled
    ? `${label} - no access`
    : isCollapsed
      ? label
      : undefined;
  return (
    <div
      className={`${styles.navItem} ${isActive ? styles.active : ""} ${disabled ? styles.disabled : ""}`}
      onClick={disabled ? undefined : onClick}
      title={title}
      aria-disabled={disabled || undefined}
    >
      {icon}
      {!isCollapsed && (
        <>
          <span className={styles.navLabel}>{label}</span>
          {disabled && (
            <span className={styles.lockIcon}>
              <Lock />
            </span>
          )}
          {!disabled && onExternalClick && (
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
          {!disabled && badge !== undefined && badge > 0 && (
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

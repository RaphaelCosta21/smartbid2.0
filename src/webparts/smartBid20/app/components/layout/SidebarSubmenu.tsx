import * as React from "react";
import styles from "./Sidebar.module.scss";

interface SidebarSubmenuProps {
  label: string;
  icon: React.ReactNode;
  isCollapsed?: boolean;
  /** Every page in the submenu is inaccessible. */
  disabled?: boolean;
  children: React.ReactNode;
}

export const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  label,
  icon,
  isCollapsed,
  disabled,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = isOpen && !disabled;

  return (
    <div>
      <div
        className={`${styles.navItem} ${styles.submenuToggle} ${open ? styles.open : ""} ${disabled ? styles.disabled : ""}`}
        onClick={disabled ? undefined : () => setIsOpen(!isOpen)}
        title={disabled ? `${label} - no access` : isCollapsed ? label : undefined}
        aria-disabled={disabled || undefined}
      >
        {icon}
        {!isCollapsed && (
          <>
            <span className={styles.navLabel}>{label}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="chevron"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </>
        )}
      </div>
      {!isCollapsed && (
        <div className={`${styles.submenu} ${open ? styles.open : ""}`}>
          {children}
        </div>
      )}
    </div>
  );
};

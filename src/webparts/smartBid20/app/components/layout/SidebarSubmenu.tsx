import * as React from "react";
import styles from "./Sidebar.module.scss";

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
      <div
        className={`${styles.navItem} ${styles.submenuToggle} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isCollapsed ? label : undefined}
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
        <div className={`${styles.submenu} ${isOpen ? styles.open : ""}`}>
          {children}
        </div>
      )}
    </div>
  );
};

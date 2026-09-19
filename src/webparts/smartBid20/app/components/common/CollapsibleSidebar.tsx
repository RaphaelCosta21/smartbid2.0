import * as React from "react";
import styles from "./CollapsibleSidebar.module.scss";

export interface ICollapsibleSidebarProps {
  /** Accessible label shown while the sidebar is expanded. */
  label: string;
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
  children?: React.ReactNode;
  collapsedContent?: React.ReactNode;
  /** Pin the whole sidebar (incl. the toggle) while the page scrolls. */
  sticky?: boolean;
  /** Offset from the top of the viewport when sticky. Defaults to 16px. */
  stickyTop?: number;
}

/**
 * Shared shell for page-level sidebars. It standardizes the width transition
 * and accessible collapse control while leaving each page free to render its
 * own navigation content.
 */
export const CollapsibleSidebar: React.FC<ICollapsibleSidebarProps> = ({
  label,
  collapsed,
  onToggle,
  className,
  children,
  collapsedContent,
  sticky,
  stickyTop,
}) => (
  <aside
    className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""} ${sticky ? styles.sticky : ""} ${className || ""}`}
    style={
      sticky && stickyTop !== undefined
        ? ({
            ["--cs-sticky-top" as any]: `${stickyTop}px`,
          } as React.CSSProperties)
        : undefined
    }
    aria-label={label}
  >
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onToggle}
      title={collapsed ? `Expand ${label}` : `Collapse ${label}`}
      aria-label={collapsed ? `Expand ${label}` : `Collapse ${label}`}
      aria-expanded={!collapsed}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
      </svg>
    </button>
    <div className={styles.content}>
      {collapsed ? collapsedContent : children}
    </div>
  </aside>
);

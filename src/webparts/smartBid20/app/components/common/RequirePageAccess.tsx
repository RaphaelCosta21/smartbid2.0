import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Lock } from "lucide-react";
import { AccessAreaKey, AccessPermission } from "../../models";
import { NAVIGATION_ITEMS, INavItem } from "../../config/navigation.config";
import { useAccessLevel } from "../../hooks/useAccessLevel";
import { PageAccessContext, IPageAccess } from "../../hooks/usePageAccess";
import { EmptyState } from "./EmptyState";
import { SkeletonLoader } from "./SkeletonLoader";
import styles from "./RequirePageAccess.module.scss";

interface RequirePageAccessProps {
  /** Access matrix page key (= navigation item key). */
  pageKey?: string;
  /** For routes outside the sidebar that follow a whole area. */
  area?: AccessAreaKey;
  children: React.ReactNode;
}

const NAV_PAGES: INavItem[] = [];
NAVIGATION_ITEMS.forEach((item) => {
  if (item.section === "action") return;
  NAV_PAGES.push(item);
  (item.children || []).forEach((c) => NAV_PAGES.push(c));
});

export const ViewOnlyBanner: React.FC<{ message?: string }> = ({
  message = "You can browse this page, but changes are disabled for your team.",
}) => (
  <div className={styles.viewBanner} role="status">
    <Eye size={15} />
    <strong>View only</strong>
    <span>{message}</span>
  </div>
);

export const RequirePageAccess: React.FC<RequirePageAccessProps> = ({
  pageKey,
  area,
  children,
}) => {
  const navigate = useNavigate();
  const access = useAccessLevel();

  const level: AccessPermission = pageKey
    ? access.getPageLevel(pageKey)
    : area
      ? access.getAreaLevel(area)
      : "edit";

  const value = React.useMemo<IPageAccess>(
    () => ({
      pageKey,
      level,
      canEdit: level === "edit",
      isReadOnly: level === "view",
    }),
    [pageKey, level],
  );

  if (!access.isResolved) {
    return (
      <div className={styles.loading}>
        <SkeletonLoader height={120} borderRadius={16} />
        <SkeletonLoader height={18} count={6} />
      </div>
    );
  }

  if (level === "none") {
    const fallback = NAV_PAGES.find(
      (p) => p.key !== pageKey && access.canViewPage(p.key),
    );
    return (
      <div className={styles.denied}>
        <EmptyState
          variant="glass"
          icon={
            <span className={styles.lockIcon}>
              <Lock size={28} />
            </span>
          }
          title="You don't have access to this page"
          description="Your team's permissions do not include this page. Ask a SmartBid administrator if you need access."
          actionLabel={fallback ? `Go to ${fallback.label}` : undefined}
          onAction={fallback ? () => navigate(fallback.route) : undefined}
        />
      </div>
    );
  }

  return (
    <PageAccessContext.Provider value={value}>
      {level === "view" && <ViewOnlyBanner />}
      {children}
    </PageAccessContext.Provider>
  );
};

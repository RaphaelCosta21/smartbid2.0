/**
 * useAccessLevel — Hook for checking user access permissions.
 */

import { useAuthStore } from "../stores/useAuthStore";

export function useAccessLevel(): {
  canView: (section: string) => boolean;
  canEdit: (section: string) => boolean;
  isSuperAdmin: boolean;
} {
  const hasAccess = useAuthStore((s) => s.hasAccess);
  const currentUser = useAuthStore((s) => s.currentUser);

  return {
    canView: (section: string) => hasAccess(section, "view"),
    canEdit: (section: string) => hasAccess(section, "edit"),
    isSuperAdmin: !!currentUser.isSuperAdmin,
  };
}

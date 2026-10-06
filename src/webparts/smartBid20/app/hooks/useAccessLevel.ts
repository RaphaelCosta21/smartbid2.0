/**
 * useAccessLevel — Current user's permissions from the Access Levels matrix (System Config).
 */

import * as React from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useConfigStore } from "../stores/useConfigStore";
import { AccessAreaKey, AccessPermission } from "../models";
import {
  getEffectiveAreaLevel,
  getEffectiveBidTabLevel,
  getEffectivePageLevel,
  isSuperAdminUser,
} from "../utils/accessControl";

export interface IAccessLevelApi {
  getAreaLevel: (area: AccessAreaKey) => AccessPermission;
  getPageLevel: (pageKey: string) => AccessPermission;
  getBidTabLevel: (tabKey: string) => AccessPermission;
  canViewPage: (pageKey: string) => boolean;
  canEditPage: (pageKey: string) => boolean;
  isSuperAdmin: boolean;
  /** User and config are settled, so levels are final. */
  isResolved: boolean;
}

export function useAccessLevel(): IAccessLevelApi {
  const currentUser = useAuthStore((s) => s.currentUser);
  const userResolved = useAuthStore((s) => s.isResolved);
  const config = useConfigStore((s) => s.config);
  const configSettled = useConfigStore((s) => s.isLoaded || s.loadFailed);

  return React.useMemo(() => {
    const getPageLevel = (pageKey: string): AccessPermission =>
      getEffectivePageLevel(currentUser, config, pageKey);
    return {
      getAreaLevel: (area: AccessAreaKey) =>
        getEffectiveAreaLevel(currentUser, config, area),
      getPageLevel,
      getBidTabLevel: (tabKey: string) =>
        getEffectiveBidTabLevel(currentUser, config, tabKey),
      canViewPage: (pageKey: string) => getPageLevel(pageKey) !== "none",
      canEditPage: (pageKey: string) => getPageLevel(pageKey) === "edit",
      isSuperAdmin: isSuperAdminUser(currentUser),
      isResolved: userResolved && configSettled,
    };
  }, [currentUser, config, userResolved, configSettled]);
}

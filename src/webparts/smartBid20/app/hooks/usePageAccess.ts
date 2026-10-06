/**
 * usePageAccess — Level of the page being rendered, provided by RequirePageAccess.
 */

import * as React from "react";
import { AccessPermission } from "../models";

export interface IPageAccess {
  pageKey?: string;
  level: AccessPermission;
  canEdit: boolean;
  isReadOnly: boolean;
}

// Routes without a guard (Create Request, BID Details) keep full page access.
export const PageAccessContext = React.createContext<IPageAccess>({
  level: "edit",
  canEdit: true,
  isReadOnly: false,
});

export function usePageAccess(): IPageAccess {
  return React.useContext(PageAccessContext);
}

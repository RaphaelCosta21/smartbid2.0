/**
 * SpfxContext — React context to propagate WebPartContext down the tree.
 */
import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";

export const SpfxContext = React.createContext<WebPartContext | null>(null);

export function useSpfxContext(): WebPartContext {
  const ctx = React.useContext(SpfxContext);
  if (!ctx) {
    throw new Error("useSpfxContext must be used within SpfxContext.Provider");
  }
  return ctx;
}

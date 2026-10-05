/**
 * useSupplierServiceTypes — Supplier service types from System Configuration,
 * falling back to the built-in seed until an admin saves the list.
 */
import * as React from "react";
import { IConfigOption } from "../models";
import { useConfigStore } from "../stores/useConfigStore";
import { resolveServiceTypes } from "../utils/supplierProfile";

export interface ISupplierServiceTypes {
  /** Every configured option (inactive included), for label lookups. */
  all: IConfigOption[];
  /** Active options, sorted for pickers, filters and the AI prompt. */
  active: IConfigOption[];
  byId: Record<string, IConfigOption>;
}

export function useSupplierServiceTypes(): ISupplierServiceTypes {
  const list = useConfigStore((s) => s.config?.supplierServiceTypes);
  return React.useMemo(() => {
    const { all, active } = resolveServiceTypes(list);
    const byId: Record<string, IConfigOption> = {};
    all.forEach((o) => (byId[o.id] = o));
    return { all, active, byId };
  }, [list]);
}

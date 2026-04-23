import * as React from "react";
import { BID_PHASES } from "../config/status.config";
import { useConfigStore } from "../stores/useConfigStore";

export interface IConfigPhase {
  id: string;
  label: string;
  value: string;
  color: string;
  order: number;
}

/**
 * Returns config-aware phases from SystemConfiguration.
 * Falls back to BID_PHASES if no config is available.
 */
export function useConfigPhases(): IConfigPhase[] {
  const config = useConfigStore((s) => s.config);

  return React.useMemo(() => {
    if (config?.phases && config.phases.length > 0) {
      return config.phases
        .filter((p) => p.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((p) => ({
          id: p.id,
          label: p.label,
          value: p.value,
          color: p.color || "#94A3B8",
          order: p.order || 0,
        }));
    }
    return BID_PHASES.map((p) => ({
      id: p.id,
      label: p.label,
      value: p.value,
      color: p.color,
      order: p.order,
    }));
  }, [config]);
}

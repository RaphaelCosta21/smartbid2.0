/**
 * useStatusColors — Returns color lookup functions that
 * read from SystemConfig store first, falling back to static config.
 */
import * as React from "react";
import { useConfigStore } from "../stores/useConfigStore";
import {
  getPhaseColor as staticPhaseColor,
  getStatusColor as staticStatusColor,
} from "../config/status.config";
import { PRIORITY_COLORS } from "../utils/constants";

interface StatusColorLookup {
  getPhaseColor: (phaseValue: string) => string;
  getStatusColor: (statusValue: string) => string;
  getPriorityColor: (priority: string) => string;
}

export function useStatusColors(): StatusColorLookup {
  const config = useConfigStore((s) => s.config);

  return React.useMemo(() => {
    const phaseMap = new Map<string, string>();
    const subStatusMap = new Map<string, string>();

    if (config) {
      (config.phases || []).forEach((p) => {
        if (p.value && p.color) phaseMap.set(p.value, p.color);
      });
      (config.subStatuses || []).forEach((s) => {
        if (s.value && s.color) subStatusMap.set(s.value, s.color);
      });
    }

    return {
      getPhaseColor: (phaseValue: string) =>
        phaseMap.get(phaseValue) || staticPhaseColor(phaseValue),

      getStatusColor: (statusValue: string) =>
        subStatusMap.get(statusValue) || staticStatusColor(statusValue),

      getPriorityColor: (priority: string) =>
        PRIORITY_COLORS[priority] || "#94A3B8",
    };
  }, [config]);
}

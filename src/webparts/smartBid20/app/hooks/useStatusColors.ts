/**
 * useStatusColors — Returns color lookup functions that
 * read from SystemConfig store first, falling back to static config.
 */
import * as React from "react";
import { useConfigStore } from "../stores/useConfigStore";
import { PRIORITY_COLORS } from "../utils/constants";
import {
  getPhaseColor as staticPhaseColor,
  getStatusColor as staticStatusColor,
} from "../config/status.config";

interface StatusColorLookup {
  getPhaseColor: (phaseValue: string) => string;
  getStatusColor: (statusValue: string) => string;
  getPriorityColor: (priority: string) => string;
  getDivisionColor: (division: string) => string;
}

export function useStatusColors(): StatusColorLookup {
  const config = useConfigStore((s) => s.config);

  return React.useMemo(() => {
    const phaseMap = new Map<string, string>();
    const subStatusMap = new Map<string, string>();
    const divisionMap = new Map<string, string>();

    if (config) {
      (config.phases || []).forEach((p) => {
        if (p.value && p.color) phaseMap.set(p.value, p.color);
      });
      (config.subStatuses || []).forEach((s) => {
        if (s.value && s.color) subStatusMap.set(s.value, s.color);
      });
      ((config as any).terminalStatuses || []).forEach((t: any) => {
        if (t.value && t.color) subStatusMap.set(t.value, t.color);
      });
      (config.divisions || []).forEach((d) => {
        if (d.value && d.color) divisionMap.set(d.value, d.color);
      });
    }

    return {
      getPhaseColor: (phaseValue: string) =>
        phaseMap.get(phaseValue) || staticPhaseColor(phaseValue),

      getStatusColor: (statusValue: string) =>
        subStatusMap.get(statusValue) || staticStatusColor(statusValue),

      getPriorityColor: (priority: string) => {
        return PRIORITY_COLORS[priority] || "#94A3B8";
      },

      getDivisionColor: (division: string) =>
        divisionMap.get(division) || "#94a3b8",
    };
  }, [config]);
}

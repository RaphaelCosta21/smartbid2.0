import * as React from "react";
import { IKPITargets, IPriorityRules } from "../models";
import { useConfigStore } from "../stores/useConfigStore";
import { resolveKpiTargets, resolvePriorityRules } from "../utils/kpiHelpers";

/** KPI targets + urgency rules from the SharePoint config (defaults until it loads). */
export function useKpiTargets(): {
  targets: IKPITargets;
  priorityRules: IPriorityRules;
} {
  const config = useConfigStore((s) => s.config);
  return React.useMemo(
    () => ({
      targets: resolveKpiTargets(config),
      priorityRules: resolvePriorityRules(config),
    }),
    [config],
  );
}

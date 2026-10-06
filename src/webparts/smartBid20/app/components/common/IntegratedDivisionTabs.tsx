/**
 * IntegratedDivisionTabs — Sub-tab wrapper for division-aware BIDs.
 *
 * Tab logic based on serviceLine:
 *  - "Integrated" → ROV + SURVEY tabs
 *  - "ROV"        → ROV tab only
 *  - "Survey"     → SURVEY tab only
 *  - Any OPG line → OPG tab only
 *  - Otherwise    → renders children directly (null division)
 *
 * OPG service lines: IMR, UWILD, Controls, Decommissioning, Installation, Engineer Solutions
 */
import * as React from "react";

export type IntegratedDivision = "ROV" | "SURVEY" | "OPG";

/** OPG service lines (category = "OPG" in config) */
const OPG_SERVICE_LINES = [
  "IMR",
  "UWILD",
  "Controls",
  "Decommissioning",
  "Installation",
  "Engineer Solutions",
];

interface IntegratedDivisionTabsProps {
  serviceLine: string;
  children: (activeDivision: IntegratedDivision | null) => React.ReactNode;
}

export interface IDivisionContext {
  divisions: IntegratedDivision[];
  active: IntegratedDivision | null;
  setActive: (division: IntegratedDivision) => void;
}

/** Division switcher state, rendered by the tab header (BidTabHeader). */
export const DivisionContext = React.createContext<IDivisionContext | null>(
  null,
);

/** Resolve which division tabs to show for a given serviceLine */
export function resolveDivisions(serviceLine: string): IntegratedDivision[] {
  if (serviceLine === "Integrated") return ["ROV", "SURVEY"];
  if (serviceLine === "ROV") return ["ROV"];
  if (serviceLine === "Survey") return ["SURVEY"];
  if (OPG_SERVICE_LINES.some((sl) => sl === serviceLine)) return ["OPG"];
  return [];
}

export const IntegratedDivisionTabs: React.FC<IntegratedDivisionTabsProps> = ({
  serviceLine,
  children,
}) => {
  const tabs = resolveDivisions(serviceLine);
  const [activeDivision, setActiveDivision] =
    React.useState<IntegratedDivision>(tabs[0] || "ROV");

  // Sync active tab when serviceLine changes
  React.useEffect(() => {
    const newTabs = resolveDivisions(serviceLine);
    if (newTabs.length > 0 && !newTabs.includes(activeDivision)) {
      setActiveDivision(newTabs[0]);
    }
  }, [serviceLine]);

  // No tabs needed → pass null
  if (tabs.length === 0) {
    return <>{children(null)}</>;
  }

  const active = tabs.length === 1 ? tabs[0] : activeDivision;
  return (
    <DivisionContext.Provider
      value={{ divisions: tabs, active, setActive: setActiveDivision }}
    >
      {children(active)}
    </DivisionContext.Provider>
  );
};

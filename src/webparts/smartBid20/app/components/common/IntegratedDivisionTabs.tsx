/**
 * IntegratedDivisionTabs — Sub-tab wrapper for division-aware BIDs.
 *
 * BIDs with two teams (Division INTEGRATED, or SSR service line "Integrated")
 * get one tab per team, lead first. Single-team BIDs keep the service-line rule:
 *  - "ROV"        → ROV tab only
 *  - "Survey"     → SURVEY tab only
 *  - Any OPG line → OPG tab only
 *  - Otherwise    → renders children directly (null division)
 */
import * as React from "react";
import {
  BidDivisionFields,
  getBidBusinessLines,
} from "../../utils/divisionHelpers";

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
  bid: BidDivisionFields;
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

/** Resolve which division tabs to show for a BID */
export function resolveDivisions(bid: BidDivisionFields): IntegratedDivision[] {
  const lines = getBidBusinessLines(bid);
  if (lines.length > 1) return lines;
  const serviceLine = bid.serviceLine;
  if (serviceLine === "ROV") return ["ROV"];
  if (serviceLine === "Survey") return ["SURVEY"];
  if (OPG_SERVICE_LINES.some((sl) => sl === serviceLine)) return ["OPG"];
  return [];
}

export const IntegratedDivisionTabs: React.FC<IntegratedDivisionTabsProps> = ({
  bid,
  children,
}) => {
  const tabs = resolveDivisions(bid);
  const tabsKey = tabs.join("|");
  const [activeDivision, setActiveDivision] =
    React.useState<IntegratedDivision>(tabs[0] || "ROV");

  // Sync active tab when the BID's teams change
  React.useEffect(() => {
    if (tabs.length > 0 && !tabs.includes(activeDivision)) {
      setActiveDivision(tabs[0]);
    }
  }, [tabsKey]);

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

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

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  gap: 0,
  marginBottom: 16,
  borderBottom: "2px solid var(--border-subtle)",
};

const tabStyle = (isActive: boolean): React.CSSProperties => ({
  padding: "8px 20px",
  fontSize: 13,
  fontWeight: isActive ? 700 : 500,
  cursor: "pointer",
  border: "none",
  background: "transparent",
  color: isActive ? "var(--primary-accent)" : "var(--text-secondary)",
  borderBottom: isActive
    ? "2px solid var(--primary-accent)"
    : "2px solid transparent",
  marginBottom: -2,
  transition: "color 0.15s, border-color 0.15s",
});

/** Resolve which division tabs to show for a given serviceLine */
function resolveTabs(serviceLine: string): IntegratedDivision[] {
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
  const tabs = resolveTabs(serviceLine);
  const [activeDivision, setActiveDivision] =
    React.useState<IntegratedDivision>(tabs[0] || "ROV");

  // Sync active tab when serviceLine changes
  React.useEffect(() => {
    const newTabs = resolveTabs(serviceLine);
    if (newTabs.length > 0 && !newTabs.includes(activeDivision)) {
      setActiveDivision(newTabs[0]);
    }
  }, [serviceLine]);

  // No tabs needed → pass null
  if (tabs.length === 0) {
    return <>{children(null)}</>;
  }

  // Single tab → pass division directly, no tab bar needed
  if (tabs.length === 1) {
    return <>{children(tabs[0])}</>;
  }

  // Multiple tabs (Integrated)
  return (
    <div>
      <div style={tabBarStyle}>
        {tabs.map((div) => (
          <button
            key={div}
            style={tabStyle(activeDivision === div)}
            onClick={() => setActiveDivision(div)}
          >
            {div}
          </button>
        ))}
      </div>
      {children(activeDivision)}
    </div>
  );
};

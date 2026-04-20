/**
 * IntegratedDivisionTabs — Sub-tab wrapper for Integrated BIDs.
 * Shows ROV / SURVEY sub-tabs above the tab content.
 * Only renders the sub-tabs when serviceLine === "Integrated".
 * Otherwise renders children directly.
 */
import * as React from "react";

export type IntegratedDivision = "ROV" | "SURVEY";

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

export const IntegratedDivisionTabs: React.FC<IntegratedDivisionTabsProps> = ({
  serviceLine,
  children,
}) => {
  const isIntegrated = serviceLine === "Integrated";
  const [activeDivision, setActiveDivision] =
    React.useState<IntegratedDivision>("ROV");

  if (!isIntegrated) {
    return <>{children(null)}</>;
  }

  return (
    <div>
      <div style={tabBarStyle}>
        {(["ROV", "SURVEY"] as IntegratedDivision[]).map((div) => (
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

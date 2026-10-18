import * as React from "react";
import { X, Radar } from "lucide-react";
import { useSurveyStore } from "../../stores/useSurveyStore";
import { buildFreeScene } from "../../utils/surveyFreeScene";
import { SceneNodeStates } from "./survey3d/sceneTypes";
import { EmptyState } from "../common/EmptyState";

const SurveySystemScene = React.lazy(
  () =>
    import(/* webpackChunkName: "survey-3d" */ "./SurveySystemScene"),
);

interface SurveyComposition3DProps {
  onClose: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background: "var(--overlay-bg)",
};
const panelStyle: React.CSSProperties = {
  width: "min(1200px, 94vw)",
  height: "90vh",
  display: "flex",
  flexDirection: "column",
  background: "var(--main-bg)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  boxShadow: "var(--elevation-4)",
  overflow: "hidden",
};
const headStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 18px",
  borderBottom: "1px solid var(--border)",
  background: "var(--card-bg)",
};
const eyebrowStyle: React.CSSProperties = {
  fontSize: "9px",
  letterSpacing: "0.08em",
  color: "var(--info)",
};
const titleStyle: React.CSSProperties = {
  margin: "2px 0 0",
  fontSize: "16px",
  fontWeight: 700,
  color: "var(--text-primary)",
};
const closeStyle: React.CSSProperties = {
  width: "28px",
  height: "28px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text-primary)",
  cursor: "pointer",
};
const sceneAreaStyle: React.CSSProperties = {
  position: "relative",
  flex: 1,
  minHeight: 0,
};

export const SurveyComposition3D: React.FC<SurveyComposition3DProps> = ({
  onClose,
}) => {
  const catalog = useSurveyStore((s) => s.catalog);
  const lines = useSurveyStore((s) => s.packageLines);
  const spreadId = useSurveyStore((s) => s.spreadId);

  const [activeZoneId, setActiveZoneId] = React.useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);
  const [hoverNodeId, setHoverNodeId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const spread = React.useMemo(() => {
    const spreads = catalog?.spreads || [];
    return spreads.find((s) => s.id === spreadId) || spreads[0];
  }, [catalog, spreadId]);

  const selectedIds = React.useMemo(() => lines.map((l) => l.equipmentId), [lines]);

  const { zones, focus } = React.useMemo(
    () => buildFreeScene(spread, catalog, selectedIds, activeZoneId),
    [spread, catalog, selectedIds, activeZoneId],
  );

  const nodeStates = React.useMemo<SceneNodeStates>(
    () => ({
      selectedNodeId,
      hoverNodeId,
      packageEquipmentIds: selectedIds,
      traceNodeIds: [],
      traceLinkKeys: [],
      hoverLinkKeys: [],
      overlay: "none",
      faultNodeId: null,
      offlineNodeIds: [],
    }),
    [selectedNodeId, hoverNodeId, selectedIds],
  );

  const noop = React.useCallback(() => undefined, []);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headStyle}>
          <div>
            <span style={eyebrowStyle}>SURVEY PORTAL</span>
            <h3 style={titleStyle}>3D composition</h3>
          </div>
          <button style={closeStyle} onClick={onClose} aria-label="Close">
            <X size={14} />
          </button>
        </div>
        <div style={sceneAreaStyle}>
          {selectedIds.length === 0 || !spread || !catalog ? (
            <EmptyState
              title="Your package is empty"
              description="Add equipment to the package to see it placed in 3D."
              icon={<Radar size={28} />}
            />
          ) : (
            <React.Suspense fallback={null}>
              <SurveySystemScene
                topInset={0}
                zones={zones}
                trunks={[]}
                focus={focus}
                spreadTitle="Composition"
                nodeStates={nodeStates}
                tracePath={null}
                cableInfo={null}
                tour={null}
                modesEnabled={false}
                mode="none"
                gapAvailable={false}
                onModeChange={noop}
                onZoneSelect={setActiveZoneId}
                onNodeSelect={setSelectedNodeId}
                onNodeHover={setHoverNodeId}
                onCableHover={noop}
                onInteract={noop}
                onTourStart={noop}
                onTourStep={noop}
                onTourStop={noop}
              />
            </React.Suspense>
          )}
        </div>
      </div>
    </div>
  );
};

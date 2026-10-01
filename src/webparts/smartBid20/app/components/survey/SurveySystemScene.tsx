import * as React from "react";
import { Keyboard, Play, ChevronLeft, ChevronRight, X, ArrowLeft } from "lucide-react";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { SurveyLinkKind } from "../../models";
import {
  createSurveyScene,
  isWebGLAvailable,
  SurveySceneApi,
} from "./survey3d/createSurveyScene";
import {
  CLUSTER_TITLES,
  LINK_KINDS,
  LINK_LABELS,
  SceneFocus,
  SceneNodeStates,
  ScenePick,
  SceneZone,
  clusterKeyOf,
} from "./survey3d/sceneTypes";
import styles from "./SurveySystemScene.module.scss";

export interface SurveySceneTour {
  step: number;
  total: number;
  title: string;
  caption: string;
}

interface SurveySystemSceneProps {
  /** Height (px) of the UI floating over the top of the canvas. */
  topInset: number;
  zones: SceneZone[];
  focus: SceneFocus | null;
  spreadTitle: string;
  nodeStates: SceneNodeStates;
  tracePath: { id: string; label: string }[] | null;
  tour: SurveySceneTour | null;
  onZoneSelect: (zoneId: string | null) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeHover: (nodeId: string | null) => void;
  onInteract: () => void;
  onTourStart: () => void;
  onTourStep: (delta: number) => void;
  onTourStop: () => void;
}

/** Node labels: full up to FULL_LABEL_MAX nodes, compact up to COMPACT_LABEL_MAX, then hover-only. */
const FULL_LABEL_MAX = 18;
const COMPACT_LABEL_MAX = 32;

const ZONE_TONES = [styles.zoneTone0, styles.zoneTone1, styles.zoneTone2];
const SWATCHES: Record<SurveyLinkKind, string> = {
  data: styles.swatchData,
  power: styles.swatchPower,
  video: styles.swatchVideo,
  rf: styles.swatchRf,
  subsea: styles.swatchSubsea,
  fibre: styles.swatchFibre,
  acoustic: styles.swatchAcoustic,
};

const SurveySystemScene: React.FC<SurveySystemSceneProps> = (props) => {
  const {
    topInset,
    zones,
    focus,
    spreadTitle,
    nodeStates,
    tracePath,
    tour,
    onZoneSelect,
    onNodeSelect,
    onTourStart,
    onTourStep,
    onTourStop,
  } = props;
  const hostRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useRef<SurveySceneApi | null>(null);
  const labelEls = React.useRef<Record<string, HTMLElement>>({});
  // The scene is created once; its callbacks read the latest props through this ref.
  const latest = React.useRef(props);
  latest.current = props;
  const [supported] = React.useState(isWebGLAvailable);

  React.useEffect(() => {
    if (!supported || !hostRef.current) return undefined;
    const reducedMotion =
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = createSurveyScene(hostRef.current, {
      reducedMotion,
      vesselModelUrl: SHAREPOINT_CONFIG.surveyVesselModelUrl,
      onPick: (pick: ScenePick) => {
        const p = latest.current;
        if (pick.type === "node") p.onNodeSelect(pick.nodeId);
        else if (pick.type === "zone") p.onZoneSelect(pick.zoneId);
        else {
          const zone = p.zones.find((z) => z.anchor === pick.anchor);
          if (zone) p.onZoneSelect(zone.id);
        }
      },
      onHoverNode: (nodeId) => latest.current.onNodeHover(nodeId),
      onInteract: () => latest.current.onInteract(),
    });
    apiRef.current = api;
    Object.keys(labelEls.current).forEach((k) => api.setLabel(k, labelEls.current[k]));
    api.setViewInset(latest.current.topInset);
    api.setZones(latest.current.zones);
    api.setFocus(latest.current.focus);
    api.setNodeStates(latest.current.nodeStates);
    return () => {
      apiRef.current = null;
      api.dispose();
    };
  }, [supported]);

  React.useEffect(() => {
    apiRef.current?.setViewInset(topInset);
  }, [topInset]);
  React.useEffect(() => {
    apiRef.current?.setZones(zones);
  }, [zones]);
  React.useEffect(() => {
    apiRef.current?.setFocus(focus);
  }, [focus]);
  React.useEffect(() => {
    apiRef.current?.setNodeStates(nodeStates);
  }, [nodeStates]);

  const registerLabel = (key: string) => (el: HTMLDivElement | null) => {
    if (el) labelEls.current[key] = el;
    else delete labelEls.current[key];
    apiRef.current?.setLabel(key, el);
  };

  if (!supported) {
    return (
      <div className={styles.fallback}>
        3D view needs WebGL, which is disabled or unsupported in this browser.
        Use the equipment explorer instead.
      </div>
    );
  }

  const activeZone = focus ? zones.find((z) => z.id === focus.zoneId) : undefined;
  const clusters: { key: string; count: number }[] = [];
  if (focus) {
    focus.nodes.forEach((n) => {
      const key = clusterKeyOf(n, focus);
      const c = clusters.find((x) => x.key === key);
      if (c) c.count++;
      else clusters.push({ key, count: 1 });
    });
  }
  const nodeCount = focus ? focus.nodes.length : 0;
  const labelAll = nodeCount <= COMPACT_LABEL_MAX;
  const compact = nodeCount > FULL_LABEL_MAX;
  const nodeLabelVisible = (id: string): boolean =>
    labelAll ||
    nodeStates.hoverNodeId === id ||
    nodeStates.selectedNodeId === id ||
    nodeStates.traceNodeIds.indexOf(id) >= 0;
  const legendKinds = focus
    ? LINK_KINDS.filter((k) => focus.links.some((l) => l.kind === k))
    : [];

  return (
    <div
      className={styles.root}
      style={{ ["--scene-top" as string]: `${topInset}px` } as React.CSSProperties}
    >
      <div ref={hostRef} className={styles.canvasHost} />
      <div className={styles.labels}>
        {zones.map((zone) => (
          <div key={zone.id} ref={registerLabel(`zone:${zone.id}`)} className={styles.anchor}>
            <button
              className={`${styles.zoneLabel} ${ZONE_TONES[zone.colorIndex % ZONE_TONES.length]}`}
              onClick={() => onZoneSelect(zone.id)}
            >
              <span className={styles.zoneText}>{zone.title}</span>
              <span className={styles.zoneCount}>{zone.count} items</span>
              <span className={styles.zoneStem} />
            </button>
          </div>
        ))}

        {focus &&
          clusters.map((c) => (
            <div key={c.key} ref={registerLabel(`cluster:${c.key}`)} className={styles.anchor}>
              <span className={styles.clusterLabel}>
                {CLUSTER_TITLES[c.key] || c.key} · {c.count}
              </span>
            </div>
          ))}

        {focus &&
          focus.nodes
            .filter((n) => nodeLabelVisible(n.id))
            .map((n) => (
              <div key={n.id} ref={registerLabel(`node:${n.id}`)} className={styles.anchor}>
                <button
                  className={`${styles.nodeLabel} ${compact ? styles.nodeCompact : ""} ${
                    nodeStates.selectedNodeId === n.id ? styles.nodeActive : ""
                  }`}
                  title={n.label}
                  onClick={() => onNodeSelect(n.id)}
                >
                  {n.label}
                  {n.vesselSupplied && <span className={styles.nodeTag}>VESSEL</span>}
                  {n.catalog && <span className={styles.nodeTag}>CATALOG</span>}
                </button>
              </div>
            ))}
      </div>

      {focus && (
        <div className={styles.breadcrumb}>
          <button className={styles.crumbBack} onClick={() => onZoneSelect(null)}>
            <ArrowLeft size={11} /> Overview
          </button>
          <span>{spreadTitle}</span>
          <ChevronRight size={11} />
          <strong>{activeZone ? activeZone.title : ""}</strong>
        </div>
      )}

      {zones.length > 0 && !tour && (
        <button className={styles.tourButton} onClick={onTourStart}>
          <Play size={11} /> Guided tour
        </button>
      )}

      <div className={styles.bottomStack}>
        {tour && (
          <div className={styles.tourCard} role="status" aria-live="polite">
            <div className={styles.tourHead}>
              <span className={styles.tourStep}>
                STEP {tour.step + 1}/{tour.total}
              </span>
              <strong>{tour.title}</strong>
              <button className={styles.tourIcon} onClick={onTourStop} aria-label="Stop tour">
                <X size={12} />
              </button>
            </div>
            <p className={styles.tourCaption}>{tour.caption}</p>
            <div className={styles.tourActions}>
              <button onClick={() => onTourStep(-1)} disabled={tour.step === 0}>
                <ChevronLeft size={12} /> Back
              </button>
              <button onClick={() => onTourStep(1)}>
                {tour.step + 1 === tour.total ? "Finish" : "Next"} <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {tracePath && tracePath.length > 1 && (
          <div className={styles.tracePath}>
            <span className={styles.traceTitle}>SIGNAL PATH</span>
            {tracePath.map((step, i) => (
              <React.Fragment key={step.id}>
                {i > 0 && <ChevronRight size={10} className={styles.traceArrow} />}
                <button className={styles.traceChip} onClick={() => onNodeSelect(step.id)}>
                  {step.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {legendKinds.length > 0 && (
          <div className={styles.legend}>
            {legendKinds.map((k) => (
              <span key={k} className={styles.legendItem}>
                <span className={`${styles.legendSwatch} ${SWATCHES[k]}`} />
                {LINK_LABELS[k]}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.hint} tabIndex={0} aria-label="Navigation controls">
        <span className={styles.hintTip}>
          <Keyboard size={12} /> Hold <kbd>Space</kbd> + drag to move
        </span>
        <dl className={styles.hintList}>
          <dt><kbd>Drag</kbd></dt>
          <dd>Orbit</dd>
          <dt><kbd>Space</kbd> + <kbd>Drag</kbd> / right-drag</dt>
          <dd>Move</dd>
          <dt><kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> / arrows</dt>
          <dd>Glide</dd>
          <dt><kbd>Q</kbd> / <kbd>E</kbd></dt>
          <dd>Down / up</dd>
          <dt><kbd>Shift</kbd></dt>
          <dd>Faster</dd>
          <dt><kbd>Scroll</kbd></dt>
          <dd>Zoom</dd>
          <dt><kbd>R</kbd></dt>
          <dd>Reset view</dd>
          {focus && (
            <>
              <dt><kbd>Esc</kbd></dt>
              <dd>Back to overview</dd>
            </>
          )}
        </dl>
      </div>
    </div>
  );
};

export default SurveySystemScene;

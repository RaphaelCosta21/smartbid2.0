import * as React from "react";
import {
  Keyboard,
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  ArrowLeft,
  ArrowUpRight,
  Cable,
  Unplug,
} from "lucide-react";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { SurveyLinkKind, SurveySceneAnchor } from "../../models";
import {
  createSurveyScene,
  isWebGLAvailable,
  SurveySceneApi,
} from "./survey3d/createSurveyScene";
import {
  LINK_KINDS,
  LINK_LABELS,
  SceneFocus,
  SceneNodeStates,
  ScenePick,
  SceneTrunk,
  SceneZone,
} from "./survey3d/sceneTypes";
import styles from "./SurveySystemScene.module.scss";

export interface SurveySceneTour {
  step: number;
  total: number;
  title: string;
  caption: string;
}

export interface SurveyCableInfo {
  kind: SurveyLinkKind;
  title: string;
  detail: string;
}

export interface SurveyTraceStep {
  id: string;
  label: string;
  /** Cable code of the link that reaches this step. */
  cable?: string;
}

interface SurveySystemSceneProps {
  /** Height (px) of the UI floating over the top of the canvas. */
  topInset: number;
  zones: SceneZone[];
  trunks: SceneTrunk[];
  focus: SceneFocus | null;
  spreadTitle: string;
  nodeStates: SceneNodeStates;
  tracePath: SurveyTraceStep[] | null;
  cableInfo: SurveyCableInfo | null;
  tour: SurveySceneTour | null;
  onZoneSelect: (zoneId: string | null) => void;
  onNodeSelect: (nodeId: string) => void;
  onNodeHover: (nodeId: string | null) => void;
  onCableHover: (key: string | null) => void;
  onInteract: () => void;
  onTourStart: () => void;
  onTourStep: (delta: number) => void;
  onTourStop: () => void;
}

/** Node labels: full up to FULL_LABEL_MAX nodes, compact up to COMPACT_LABEL_MAX, then hover-only. */
const FULL_LABEL_MAX = 18;
const COMPACT_LABEL_MAX = 40;

/** Rooms sit a few metres apart on deck: stagger stem heights so their labels never stack. */
const STEM_TIERS: Partial<Record<SurveySceneAnchor, string>> = {
  "rov-control": styles.stemLow,
  bridge: styles.stemMid,
  "survey-online": styles.stemHigh,
  mast: styles.stemTop,
  "vessel-hull": styles.zoneDown,
  rov: styles.stemLow,
};
/** Anchors without a zone of their own open the closest room. */
const ANCHOR_FALLBACK: Partial<Record<SurveySceneAnchor, SurveySceneAnchor>> = {
  umbilical: "rov-control",
  vessel: "survey-online",
};
const SWATCHES: Record<SurveyLinkKind, string> = {
  data: styles.swatchData,
  power: styles.swatchPower,
  video: styles.swatchVideo,
  rf: styles.swatchRf,
  subsea: styles.swatchSubsea,
  fibre: styles.swatchFibre,
  acoustic: styles.swatchAcoustic,
  timing: styles.swatchTiming,
};

const zoneForAnchor = (zones: SceneZone[], anchor: SurveySceneAnchor): SceneZone | undefined =>
  zones.find((z) => z.anchor === anchor) ||
  (ANCHOR_FALLBACK[anchor] ? zones.find((z) => z.anchor === ANCHOR_FALLBACK[anchor]) : undefined);

const SurveySystemScene: React.FC<SurveySystemSceneProps> = (props) => {
  const {
    topInset,
    zones,
    trunks,
    focus,
    spreadTitle,
    nodeStates,
    tracePath,
    cableInfo,
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
  const [hotZoneId, setHotZoneId] = React.useState<string | null>(null);
  const [linesOn, setLinesOn] = React.useState(true);

  React.useEffect(() => {
    if (!supported || !hostRef.current) return undefined;
    const reducedMotion =
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const zoneOfPick = (pick: ScenePick | null): string | null => {
      if (!pick) return null;
      if (pick.type === "zone") return pick.zoneId;
      if (pick.type === "anchor") {
        const zone = zoneForAnchor(latest.current.zones, pick.anchor);
        return zone ? zone.id : null;
      }
      return null;
    };
    let hoverNode: string | null = null;
    let hoverCable: string | null = null;
    const api = createSurveyScene(hostRef.current, {
      reducedMotion,
      vesselModelUrl: SHAREPOINT_CONFIG.surveyVesselModelUrl,
      onPick: (pick: ScenePick) => {
        const p = latest.current;
        if (pick.type === "node") p.onNodeSelect(pick.nodeId);
        else if (pick.type === "cable") return;
        else {
          const zoneId = zoneOfPick(pick);
          if (zoneId) p.onZoneSelect(zoneId);
        }
      },
      onHover: (pick) => {
        const p = latest.current;
        const node = pick && pick.type === "node" ? pick.nodeId : null;
        const cable = pick && pick.type === "cable" ? pick.key : null;
        if (node !== hoverNode) p.onNodeHover((hoverNode = node));
        if (cable !== hoverCable) p.onCableHover((hoverCable = cable));
        setHotZoneId(zoneOfPick(pick));
      },
      onInteract: () => latest.current.onInteract(),
    });
    apiRef.current = api;
    Object.keys(labelEls.current).forEach((k) => api.setLabel(k, labelEls.current[k]));
    api.setViewInset(latest.current.topInset);
    api.setZones(latest.current.zones);
    api.setTrunks(latest.current.trunks);
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
    apiRef.current?.setTrunks(trunks);
  }, [trunks]);
  React.useEffect(() => {
    apiRef.current?.setFocus(focus);
  }, [focus]);
  React.useEffect(() => {
    apiRef.current?.setNodeStates(nodeStates);
  }, [nodeStates]);
  React.useEffect(() => {
    apiRef.current?.setLinksVisible(linesOn);
  }, [linesOn]);

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
      const c = clusters.find((x) => x.key === n.cluster);
      if (c) c.count++;
      else clusters.push({ key: n.cluster, count: 1 });
    });
  }
  const nodeCount = focus ? focus.nodes.length : 0;
  const labelAll = nodeCount <= COMPACT_LABEL_MAX;
  const compact = nodeCount > FULL_LABEL_MAX;
  const nodeLabelVisible = (id: string, portal: boolean): boolean =>
    portal ||
    labelAll ||
    nodeStates.hoverNodeId === id ||
    nodeStates.selectedNodeId === id ||
    nodeStates.traceNodeIds.indexOf(id) >= 0;
  // Overview arcs are monochrome, so the colour legend only applies inside a room.
  const legendKinds = focus && linesOn
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
              className={`${styles.zoneLabel} ${STEM_TIERS[zone.anchor] || ""} ${
                hotZoneId === zone.id ? styles.zoneHot : ""
              }`}
              onClick={() => onZoneSelect(zone.id)}
            >
              <span className={styles.zoneText}>{zone.title}</span>
              <span className={styles.zoneCount}>{zone.countLabel}</span>
              <span className={styles.zoneStem} />
            </button>
          </div>
        ))}

        {focus &&
          clusters.map((c, i) => (
            <div key={c.key} ref={registerLabel(`cluster:${c.key}`)} className={styles.anchor}>
              <span className={`${styles.clusterLabel} ${i % 2 ? styles.clusterAlt : ""}`}>
                {focus.clusterTitles[c.key] || c.key} · {c.count}
              </span>
            </div>
          ))}

        {focus &&
          focus.nodes
            .filter((n) => nodeLabelVisible(n.id, n.role === "portal"))
            .map((n) => (
              <div key={n.id} ref={registerLabel(`node:${n.id}`)} className={styles.anchor}>
                <button
                  className={`${styles.nodeLabel} ${compact ? styles.nodeCompact : ""} ${
                    n.role === "portal" ? styles.nodePortal : ""
                  } ${n.bidState === "out" ? styles.nodeOut : ""} ${
                    nodeStates.selectedNodeId === n.id ? styles.nodeActive : ""
                  }`}
                  title={
                    n.role === "portal"
                      ? `Go to ${n.label}`
                      : n.bidState === "out"
                        ? `${n.label} - not considered in the BID`
                        : n.label
                  }
                  onClick={() => onNodeSelect(n.id)}
                >
                  {n.role === "portal" && <ArrowUpRight size={10} className={styles.portalArrow} />}
                  {n.label}
                  {n.vesselSupplied && <span className={styles.nodeTag}>VESSEL</span>}
                  {n.role === "catalog" && (
                    <span className={styles.nodeTag}>{n.bidState === "in" ? "IN BID" : "CATALOG"}</span>
                  )}
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

      <div className={styles.sceneTools}>
        <button
          className={`${styles.linesToggle} ${linesOn ? "" : styles.linesOff}`}
          onClick={() => setLinesOn(!linesOn)}
          aria-pressed={!linesOn}
          title={linesOn ? "Hide connection lines" : "Show connection lines"}
        >
          {linesOn ? <Unplug size={11} /> : <Cable size={11} />}
          {linesOn ? "Hide lines" : "Show lines"}
        </button>
        {zones.length > 0 && !tour && (
          <button className={styles.tourButton} onClick={onTourStart}>
            <Play size={11} /> Guided tour
          </button>
        )}
      </div>

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
                {i > 0 && (
                  <span className={styles.traceHop}>
                    {step.cable && <span className={styles.traceCable}>{step.cable}</span>}
                    <ChevronRight size={10} className={styles.traceArrow} />
                  </span>
                )}
                <button className={styles.traceChip} onClick={() => onNodeSelect(step.id)}>
                  {step.label}
                </button>
              </React.Fragment>
            ))}
          </div>
        )}

        {cableInfo && linesOn && (
          <div className={styles.cableInfo} role="status">
            <Cable size={12} className={styles.cableIcon} />
            <span className={`${styles.legendSwatch} ${SWATCHES[cableInfo.kind]}`} />
            <strong>{cableInfo.title}</strong>
            <span className={styles.cableDetail}>{cableInfo.detail}</span>
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

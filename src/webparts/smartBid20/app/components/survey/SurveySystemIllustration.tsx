import * as React from "react";
import { SurveySceneAnchor } from "../../models";
import {
  SURVEY_CNAV_IMG,
  SURVEY_CNAV_MASK,
  SURVEY_FLOW_ARROWS,
  SURVEY_SATELLITE_IMG,
  SURVEY_VESSEL_IMG,
} from "./surveyAssets";
import {
  ANCHOR_POINTS,
  ART_H as H,
  ART_RECTS,
  ART_W as W,
  ArtRect,
  FLOW_POINTS,
} from "./surveyArtboard";
import styles from "./SurveySystemIllustration.module.scss";

export interface SurveySceneLabel {
  anchor: SurveySceneAnchor;
  items: { id: string; text: string }[];
}

interface SurveySystemIllustrationProps {
  labels: SurveySceneLabel[];
  highlight: SurveySceneAnchor | "";
  selectedId: string | null;
  onSelect: (equipmentId: string) => void;
  /** Overlays (system panel, detail drawer, popover) laid out on the same artboard. */
  children?: React.ReactNode;
}

const rect = ([x, y, w, h]: ArtRect): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
});

const point = (x: number, y: number): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
});

const SATELLITE_TX = FLOW_POINTS.satelliteTx;
const CNAV_RX = FLOW_POINTS.cnavRx;
const CNAV_OUT = FLOW_POINTS.cnavOut;
const MAST = FLOW_POINTS.mast;
const HULL = FLOW_POINTS.hull;
const TARGET = FLOW_POINTS.target;

const reducedMotion = (): boolean =>
  !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Packets travelling along a straight path (SMIL, so it scales with the SVG). */
const Packets: React.FC<{
  from: [number, number];
  to: [number, number];
  count: number;
  dur: number;
  r: number;
  className: string;
}> = ({ from, to, count, dur, r, className }) => {
  const path = `M${from[0]},${from[1]} L${to[0]},${to[1]}`;
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    dots.push(
      <circle key={i} r={r} className={className} cx={from[0]} cy={from[1]}>
        <animateMotion
          path={path}
          dur={`${dur}s`}
          begin={`${(i * dur) / count}s`}
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.15;0.85;1"
          dur={`${dur}s`}
          begin={`${(i * dur) / count}s`}
          repeatCount="indefinite"
        />
      </circle>,
    );
  }
  return <>{dots}</>;
};

export const SurveySystemIllustration: React.FC<SurveySystemIllustrationProps> = ({
  labels,
  highlight,
  selectedId,
  onSelect,
  children,
}) => {
  const [animate] = React.useState(() => !reducedMotion());

  return (
    <div className={styles.artboard}>
      <div className={styles.glassBox} style={rect(ART_RECTS.glassBox)} />

      <span className={styles.glowLarge} style={rect(ART_RECTS.glowLarge)} />
      <span className={styles.glowSmall} style={rect(ART_RECTS.glowSmall)} />

      <div className={styles.satellite} style={rect(ART_RECTS.satellite)}>
        <img src={SURVEY_SATELLITE_IMG} alt="GNSS satellite" />
      </div>

      <div className={styles.vessel} style={rect(ART_RECTS.vessel)}>
        <img src={SURVEY_VESSEL_IMG} alt="Survey vessel" />
      </div>

      <svg
        className={styles.flows}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* GNSS signal: satellite → C-Nav receiver */}
        <line
          className={styles.beamHalo}
          x1={SATELLITE_TX[0]}
          y1={SATELLITE_TX[1]}
          x2={CNAV_RX[0]}
          y2={CNAV_RX[1]}
        />
        <line
          className={styles.beamCore}
          x1={SATELLITE_TX[0]}
          y1={SATELLITE_TX[1]}
          x2={CNAV_RX[0]}
          y2={CNAV_RX[1]}
        />
        {/* Corrected position: C-Nav → vessel navigation */}
        <line
          className={styles.dataLink}
          x1={CNAV_OUT[0]}
          y1={CNAV_OUT[1]}
          x2={MAST[0]}
          y2={MAST[1]}
        />
        {/* Acoustic link: hull transceiver → subsea target */}
        <line
          className={styles.dataLink}
          x1={HULL[0]}
          y1={HULL[1]}
          x2={TARGET[0]}
          y2={TARGET[1]}
        />
        {animate && (
          <>
            <Packets from={SATELLITE_TX} to={CNAV_RX} count={3} dur={2.4} r={4} className={styles.packet} />
            <Packets from={CNAV_OUT} to={MAST} count={2} dur={1.8} r={3} className={styles.packetAccent} />
            <Packets from={HULL} to={TARGET} count={2} dur={2.2} r={3} className={styles.packet} />
            <Packets from={TARGET} to={HULL} count={1} dur={2.2} r={3} className={styles.packetAccent} />
            {[0, 1, 2].map((i) => (
              <ellipse
                key={i}
                className={styles.ping}
                cx={HULL[0]}
                cy={HULL[1]}
                rx={4}
                ry={1.5}
              >
                <animate attributeName="rx" values="4;120" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
                <animate attributeName="ry" values="1.5;32" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`${HULL[1]};${HULL[1] + 90}`} dur="3s" begin={`${i}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
          </>
        )}
      </svg>

      <span
        className={styles.arrows}
        style={{
          ...rect(ART_RECTS.arrows),
          WebkitMaskImage: `url("${SURVEY_FLOW_ARROWS}")`,
          maskImage: `url("${SURVEY_FLOW_ARROWS}")`,
        }}
      />

      <div className={styles.cnav} style={rect(ART_RECTS.cnav)}>
        <img
          src={SURVEY_CNAV_IMG}
          alt="C-Nav receiver"
          style={{
            WebkitMaskImage: `url("${SURVEY_CNAV_MASK}")`,
            maskImage: `url("${SURVEY_CNAV_MASK}")`,
          }}
        />
        <span className={styles.led} />
      </div>

      {labels.map((group) => {
        const [x, y] = ANCHOR_POINTS[group.anchor];
        return (
          <div
            key={group.anchor}
            className={`${styles.marker} ${group.anchor === highlight ? styles.markerActive : ""}`}
            style={point(x, y)}
          >
            {group.items.map((item) => (
              <button
                key={item.id}
                className={item.id === selectedId ? styles.chipSelected : styles.chip}
                onClick={() => onSelect(item.id)}
              >
                {item.text}
              </button>
            ))}
          </div>
        );
      })}

      {children}
    </div>
  );
};

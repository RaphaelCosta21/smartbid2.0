import * as React from "react";
import { SurveySceneAnchor } from "../../models";
import {
  SURVEY_CNAV_IMG,
  SURVEY_CNAV_MASK,
  SURVEY_FLOW_ARROWS,
  SURVEY_SATELLITE_IMG,
  SURVEY_VESSEL_IMG,
} from "./surveyAssets";
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

// Artboard = Figma frame 71:761 (1301 wide), cropped from y=300 so the header stays in HTML.
const W = 1301;
const H = 1113;

const rect = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
});

const point = (x: number, y: number): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
});

// Marker positions; gnss/vessel come from the Figma "Equipment marker chip" layers.
const ANCHOR_POINTS: Record<SurveySceneAnchor, [number, number]> = {
  gnss: [1040, 116],
  vessel: [825, 270],
  "vessel-hull": [705, 612],
  rov: [470, 650],
  beacons: [565, 700],
  seabed: [880, 690],
  "subsea-target": [765, 712],
};

const SATELLITE_TX: [number, number] = [1069.7, 83.3];
const CNAV_RX: [number, number] = [974.85, 303.4];
const CNAV_OUT: [number, number] = [860, 312];
const MAST: [number, number] = [660, 372];
const HULL: [number, number] = [690, 600];
const TARGET: [number, number] = [765, 712];

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
      <div className={styles.glassBox} style={rect(173, 19, 974, 714)} />

      <span className={styles.glowLarge} style={rect(870, 9, 180, 169)} />
      <span className={styles.glowSmall} style={rect(897, 41, 110, 117)} />

      <div className={styles.satellite} style={rect(897, 21, 126, 157)}>
        <img src={SURVEY_SATELLITE_IMG} alt="GNSS satellite" />
      </div>

      <div className={styles.vessel} style={rect(302, -22, 713, 892)}>
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
          ...rect(1004 - 12, 210.4 - 116.7, 24, 233.4),
          WebkitMaskImage: `url("${SURVEY_FLOW_ARROWS}")`,
          maskImage: `url("${SURVEY_FLOW_ARROWS}")`,
        }}
      />

      <div className={styles.cnav} style={rect(849, 292, 51, 36)}>
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

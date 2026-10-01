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
  ART_H,
  ART_RECTS,
  ART_W,
  ArtPoint,
  ArtRect,
  FLOW_POINTS,
} from "./surveyArtboard";
import type { SurveySceneLabel } from "./SurveySystemIllustration";
import styles from "./SurveySystemDepthScene.module.scss";

interface SurveySystemDepthSceneProps {
  labels: SurveySceneLabel[];
  highlight: SurveySceneAnchor | "";
  selectedId: string | null;
  onSelect: (equipmentId: string) => void;
  children?: React.ReactNode;
}

type Vec3 = [number, number, number];

const PERSPECTIVE = 1400;
const CX = ART_W / 2;
const CY = ART_H / 2;

// Depth (px toward the viewer) of each Figma layer.
const Z = {
  satellite: 220,
  glow: 200,
  cnav: 70,
  vessel: 0,
  seabed: -200,
};

const ANCHOR_Z: Record<SurveySceneAnchor, number> = {
  gnss: 235,
  vessel: 85,
  "vessel-hull": 10,
  rov: -80,
  beacons: -180,
  seabed: -180,
  "subsea-target": -200,
};

const shrink = (z: number): number => (PERSPECTIVE - z) / PERSPECTIVE;

/** 3D point that projects exactly onto Figma point (x, y) when the scene is at rest. */
const lift = ([x, y]: ArtPoint, z: number): Vec3 => [
  CX + (x - CX) * shrink(z),
  CY + (y - CY) * shrink(z),
  z,
];

/** Flat Figma layer pushed to depth z, scaled so its rest-pose footprint matches the design. */
const layer = ([x, y, w, h]: ArtRect, z: number): React.CSSProperties => ({
  left: x,
  top: y,
  width: w,
  height: h,
  transformOrigin: `${CX - x}px ${CY - y}px`,
  transform: `translateZ(${z}px) scale(${shrink(z)})`,
});

const reducedMotion = (): boolean =>
  !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A straight 3D segment (local +x runs from `from` to `to`); children ride along it. */
const Segment: React.FC<{ from: Vec3; to: Vec3; className: string }> = ({
  from,
  to,
  className,
  children,
}) => {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const dz = to[2] - from[2];
  const flat = Math.sqrt(dx * dx + dz * dz);
  const length = Math.sqrt(flat * flat + dy * dy);
  const yaw = Math.atan2(-dz, dx);
  const pitch = Math.atan2(dy, flat);
  return (
    <div
      className={className}
      style={{
        left: from[0],
        top: from[1],
        width: length,
        transform: `translateZ(${from[2]}px) rotateY(${yaw}rad) rotateZ(${pitch}rad)`,
      }}
    >
      {children}
    </div>
  );
};

const Packets: React.FC<{ count: number; dur: number; className: string }> = ({
  count,
  dur,
  className,
}) => {
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    dots.push(
      <span
        key={i}
        className={className}
        style={{ animationDuration: `${dur}s`, animationDelay: `${(i * dur) / count}s` }}
      />,
    );
  }
  return <>{dots}</>;
};

// Deterministic "plankton" so the layout is stable between renders.
const PARTICLES = (() => {
  const list: React.CSSProperties[] = [];
  let seed = 7;
  const rnd = (): number => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  for (let i = 0; i < 28; i++) {
    list.push({
      ["--x" as string]: `${180 + rnd() * 960}px`,
      ["--y" as string]: `${80 + rnd() * 640}px`,
      ["--z" as string]: `${-260 + rnd() * 460}px`,
      ["--s" as string]: `${2 + rnd() * 3}px`,
      animationDuration: `${7 + rnd() * 7}s`,
      animationDelay: `${-rnd() * 10}s`,
    } as React.CSSProperties);
  }
  return list;
})();

export const SurveySystemDepthScene: React.FC<SurveySystemDepthSceneProps> = ({
  labels,
  highlight,
  selectedId,
  onSelect,
  children,
}) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const target = React.useRef({ x: 0, y: 0 });
  const [scale, setScale] = React.useState(1);
  const [still] = React.useState(reducedMotion);

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const update = (): void => setScale((el.clientWidth || ART_W) / ART_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Camera: intro dolly, idle sway and mouse tilt, eased every frame via CSS variables.
  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || still) return undefined;
    const cur = { x: 12, y: -6, d: -180 };
    let frame = 0;
    const tick = (t: number): void => {
      frame = requestAnimationFrame(tick);
      if (document.hidden) return;
      const tx = target.current.x + Math.sin(t / 3200) * 1.2;
      const ty = target.current.y + Math.cos(t / 4100) * 2;
      cur.x += (tx - cur.x) * 0.05;
      cur.y += (ty - cur.y) * 0.05;
      cur.d += (0 - cur.d) * 0.04;
      el.style.setProperty("--tilt-x", cur.x.toFixed(3));
      el.style.setProperty("--tilt-y", cur.y.toFixed(3));
      el.style.setProperty("--dolly", `${cur.d.toFixed(1)}px`);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [still]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>): void => {
    const r = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    target.current = { x: -ny * 10, y: nx * 14 };
  };

  const satTx = lift(FLOW_POINTS.satelliteTx, Z.satellite);
  const cnavRx = lift(FLOW_POINTS.cnavRx, Z.cnav);
  const cnavOut = lift(FLOW_POINTS.cnavOut, Z.cnav);
  const mast = lift(FLOW_POINTS.mast, Z.vessel);
  const hull = lift(FLOW_POINTS.hull, Z.vessel);
  const seabed = lift(FLOW_POINTS.target, Z.seabed);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={{ height: ART_H * scale }}
      onMouseMove={still ? undefined : handleMove}
      onMouseLeave={() => (target.current = { x: 0, y: 0 })}
    >
      <div className={styles.scaler} style={{ width: ART_W, height: ART_H, transform: `scale(${scale})` }}>
        <div
          className={styles.glassBox}
          style={{
            left: ART_RECTS.glassBox[0],
            top: ART_RECTS.glassBox[1],
            width: ART_RECTS.glassBox[2],
            height: ART_RECTS.glassBox[3],
          }}
        />

        <div className={styles.viewport} style={{ perspective: PERSPECTIVE }}>
          <div className={styles.scene}>
            {PARTICLES.map((p, i) => (
              <span key={i} className={styles.particle} style={p} />
            ))}

            {/* Sonar cone + pings from the hull transceiver */}
            <div className={styles.sonar} style={{ left: hull[0], top: hull[1] }}>
              <span className={styles.cone} />
              <span className={`${styles.cone} ${styles.coneCross}`} />
              <span className={styles.ping} />
              <span className={styles.ping} style={{ animationDelay: "1s" }} />
              <span className={styles.ping} style={{ animationDelay: "2s" }} />
            </div>

            <div className={styles.vessel} style={layer(ART_RECTS.vessel, Z.vessel)}>
              <img src={SURVEY_VESSEL_IMG} alt="Survey vessel" />
            </div>

            <span className={styles.glow} style={layer(ART_RECTS.glowLarge, Z.glow)}>
              <span />
            </span>
            <span className={`${styles.glow} ${styles.glowLate}`} style={layer(ART_RECTS.glowSmall, Z.glow)}>
              <span />
            </span>

            <div className={styles.satellite} style={layer(ART_RECTS.satellite, Z.satellite)}>
              <img src={SURVEY_SATELLITE_IMG} alt="GNSS satellite" />
            </div>

            <div className={styles.cnav} style={layer(ART_RECTS.cnav, Z.cnav)}>
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

            {/* GNSS signal: satellite → C-Nav, with the Figma flow arrows riding the beam */}
            <Segment from={satTx} to={cnavRx} className={styles.beam}>
              <span
                className={styles.beamArrows}
                style={{
                  WebkitMaskImage: `url("${SURVEY_FLOW_ARROWS}")`,
                  maskImage: `url("${SURVEY_FLOW_ARROWS}")`,
                }}
              />
              {!still && <Packets count={3} dur={2.4} className={styles.packet} />}
            </Segment>

            {/* Corrected position: C-Nav → vessel navigation */}
            <Segment from={cnavOut} to={mast} className={styles.link}>
              {!still && <Packets count={2} dur={1.8} className={styles.packetAccent} />}
            </Segment>

            {/* Acoustic link: hull → subsea target (and the reply back) */}
            <Segment from={hull} to={seabed} className={styles.link}>
              {!still && <Packets count={2} dur={2.2} className={styles.packet} />}
            </Segment>
            <Segment from={seabed} to={hull} className={styles.linkGhost}>
              {!still && <Packets count={1} dur={2.2} className={styles.packetAccent} />}
            </Segment>

            {labels.map((group) => {
              const z = ANCHOR_Z[group.anchor];
              const [x, y] = lift(ANCHOR_POINTS[group.anchor], z);
              return (
                <div
                  key={group.anchor}
                  className={`${styles.marker} ${group.anchor === highlight ? styles.markerActive : ""}`}
                  style={{
                    transform: `translate3d(${x}px, ${y}px, ${z}px) translate(-50%, -50%) scale(${shrink(z)})`,
                  }}
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
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

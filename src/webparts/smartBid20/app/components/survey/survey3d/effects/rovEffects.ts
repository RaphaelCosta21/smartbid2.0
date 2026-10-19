import * as THREE from "three";
import { EffectBuilder } from "./effectTypes";
import {
  COLORS,
  DEG,
  arcGizmo,
  arrowGeometry,
  flatRing,
  glowMat,
  hitSeabed,
  lineMat,
  orient,
  signed,
} from "./effectUtils";

const TAU = Math.PI * 2;
const tmp = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/** ROV pitch and roll (no heave: the vehicle is not on the surface) with arcs on its axes. */
export const buildRovMotion: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const pitchArc = arcGizmo(2.9, 1.3, COLORS.teal);
  const rollArc = arcGizmo(2.3, 1.3, COLORS.yellow);
  rollArc.rotation.y = Math.PI / 2;
  group.add(pitchArc, rollArc);
  // Yaw outermost, then roll about the forward axis (x), then pitch about the lateral axis (z).
  ctx.rov.rotation.order = "YXZ";

  return {
    group,
    update: (t, _dt, k) => {
      ctx.rov.rotation.x = k * 0.22 * Math.sin((t * TAU) / 4.2);
      ctx.rov.rotation.z = k * 0.18 * Math.sin((t * TAU) / 5.3 + 0.8);
      ctx.rov.getWorldPosition(tmp);
      group.position.copy(tmp);
      group.rotation.y = ctx.rov.rotation.y;
      return `ROV ROLL ${signed(ctx.rov.rotation.x * DEG)}° · PITCH ${signed(ctx.rov.rotation.z * DEG)}°`;
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      return 14;
    },
  };
};

/** Acoustic pulse from the ROV to the seabed and back: the time of the echo is the altitude. */
export const buildAltimeterEcho: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const down = flatRing(0.9, 1, COLORS.teal, 0.9);
  const echo = flatRing(0.9, 1, COLORS.yellow, 0.9);
  const flash = flatRing(0, 1.1, COLORS.yellow, 0.6);
  const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const line = new THREE.Line(lineGeo, lineMat(COLORS.slate, 0.9));
  group.add(down, echo, flash, line);
  const PERIOD = 2.4;

  return {
    group,
    update: (t, _dt, k) => {
      ctx.rov.getWorldPosition(tmp);
      tmp.y -= 0.6;
      const floor = ctx.seabedHeight(tmp.x, tmp.z);
      const altitude = tmp.y - floor;
      const phase = (t % PERIOD) / PERIOD;
      const goingDown = phase < 0.5;
      const p = goingDown ? phase * 2 : (phase - 0.5) * 2;
      down.visible = goingDown;
      echo.visible = !goingDown;
      const ring = goingDown ? down : echo;
      ring.position.set(tmp.x, goingDown ? tmp.y - p * altitude : floor + p * altitude, tmp.z);
      ring.scale.setScalar(0.5 + (goingDown ? p : 1 - p) * 2.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - p * 0.5) * 0.9 * k;
      flash.position.set(tmp.x, floor + 0.05, tmp.z);
      const hit = Math.max(0, 1 - Math.abs(phase - 0.5) * 8);
      flash.scale.setScalar(0.6 + hit * 2);
      (flash.material as THREE.MeshBasicMaterial).opacity = hit * 0.7 * k;
      const pos = lineGeo.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, tmp.x, tmp.y, tmp.z);
      pos.setXYZ(1, tmp.x, floor, tmp.z);
      pos.needsUpdate = true;
      return `ALTITUDE ${altitude.toFixed(1)} m`;
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      out.y -= 1.5;
      return 13;
    },
  };
};

/** Water column above the ROV and pressure arrows closing on it, stronger the deeper it goes. */
export const buildWaterPressure: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const TICKS = 14;
  const columnGeo = new THREE.BufferGeometry().setFromPoints(
    new Array((TICKS + 1) * 2).fill(0).map(() => new THREE.Vector3()),
  );
  const column = new THREE.LineSegments(columnGeo, lineMat(COLORS.slate, 0.9));
  group.add(column);
  const arrows: THREE.Mesh[] = [];
  const COUNT = 8;
  for (let i = 0; i < COUNT; i++) {
    const arrow = new THREE.Mesh(arrowGeometry(0.22), glowMat(COLORS.alert, 0.9));
    arrows.push(arrow);
    group.add(arrow);
  }

  return {
    group,
    update: (t, _dt, k) => {
      ctx.rov.getWorldPosition(tmp);
      const depth = Math.max(0.5, -tmp.y);
      const pos = columnGeo.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, tmp.x, 0.3, tmp.z);
      pos.setXYZ(1, tmp.x, tmp.y, tmp.z);
      for (let i = 0; i < TICKS; i++) {
        const y = 0.3 + ((tmp.y - 0.3) * (i + 1)) / (TICKS + 1);
        pos.setXYZ(2 + i * 2, tmp.x - 0.35, y, tmp.z);
        pos.setXYZ(3 + i * 2, tmp.x + 0.35, y, tmp.z);
      }
      pos.needsUpdate = true;
      const length = 0.8 + depth * 0.1;
      const pulse = 0.4 * Math.sin(t * 3);
      arrows.forEach((arrow, i) => {
        const a = (i / COUNT) * TAU;
        const reach = 2.4 + length + pulse;
        tmpB.set(Math.cos(a), 0, Math.sin(a));
        arrow.position.set(tmp.x + tmpB.x * reach, tmp.y, tmp.z + tmpB.z * reach);
        orient(arrow, tmpB.clone().negate());
        arrow.scale.y = length;
        (arrow.material as THREE.MeshBasicMaterial).opacity = 0.9 * k;
      });
      return `DEPTH ${depth.toFixed(1)} m · PRESSURE ${(1.013 + depth / 10).toFixed(2)} bar`;
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      out.y *= 0.5;
      return 24;
    },
  };
};

/** The three boom cameras looking at the work area, lighting the seabed where they point. */
export const buildCameraView: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const LENGTH = 7;
  const coneGeo = new THREE.ConeGeometry(2.1, LENGTH, 24, 1, true);
  coneGeo.translate(0, -LENGTH / 2, 0); // apex at the origin, axis along -y
  const cones: THREE.Mesh[] = [];
  const spots: THREE.Mesh[] = [];
  const yaws = [0.38, 0, -0.38];
  yaws.forEach(() => {
    const cone = new THREE.Mesh(coneGeo, glowMat(COLORS.yellow, 0.16));
    cones.push(cone);
    const spot = flatRing(0, 1.3, COLORS.yellow, 0.5);
    spots.push(spot);
    group.add(cone, spot);
  });
  const axis = new THREE.Vector3(0, -1, 0);
  const dir = new THREE.Vector3();
  const hit = new THREE.Vector3();

  return {
    group,
    update: (t, _dt, k) => {
      ctx.rov.getWorldPosition(tmp);
      yaws.forEach((yaw, i) => {
        // Local +x is the ROV's forward axis; the cameras look ahead and 35 degrees down.
        dir.set(Math.cos(yaw) * Math.cos(0.61), -Math.sin(0.61), Math.sin(yaw) * Math.cos(0.61));
        dir.applyQuaternion(ctx.rov.quaternion).normalize();
        tmpB.set(0.9, -0.2, yaw * 1.4).applyQuaternion(ctx.rov.quaternion).add(tmp);
        cones[i].position.copy(tmpB);
        cones[i].quaternion.setFromUnitVectors(axis, dir);
        hitSeabed(tmpB, dir, ctx.seabedHeight, hit);
        spots[i].position.set(hit.x, hit.y + 0.06, hit.z);
        (spots[i].material as THREE.MeshBasicMaterial).opacity = (0.35 + 0.15 * Math.sin(t * 5 + i)) * k;
      });
      return "CAMERAS 3 · LIVE";
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      out.y -= 1.5;
      return 14;
    },
  };
};

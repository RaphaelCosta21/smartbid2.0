import * as THREE from "three";
import { EffectBuilder, EffectContext } from "./effectTypes";
import {
  COLORS,
  DEG,
  UP,
  arcGizmo,
  arrowGeometry,
  glowMat,
  labelSprite,
  lineMat,
  signed,
} from "./effectUtils";

const TAU = Math.PI * 2;
const tmp = new THREE.Vector3();

/** Vessel roll, pitch and heave exaggerated; arcs show the three axes the MRU measures. */
export const buildVesselMotion: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const pitchArc = arcGizmo(9, 1.2, COLORS.teal);
  const rollArc = arcGizmo(5.5, 1.2, COLORS.yellow);
  rollArc.rotation.y = Math.PI / 2;
  const heaveGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, -3, 0),
    new THREE.Vector3(0, 3, 0),
  ]);
  const heaveLine = new THREE.Line(heaveGeo, lineMat(COLORS.green, 0.9));
  const heaveUp = new THREE.Mesh(arrowGeometry(0.28), glowMat(COLORS.green, 0.9));
  heaveUp.scale.y = 0.9;
  heaveUp.position.y = 3;
  const heaveDown = new THREE.Mesh(arrowGeometry(0.28), glowMat(COLORS.green, 0.9));
  heaveDown.scale.y = 0.9;
  heaveDown.rotation.x = Math.PI;
  heaveDown.position.y = -3;
  group.add(pitchArc, rollArc, heaveLine, heaveUp, heaveDown);

  return {
    group,
    update: (t, _dt, k) => {
      const pitch = k * 0.09 * Math.sin((t * TAU) / 6.5);
      const roll = k * 0.12 * Math.sin((t * TAU) / 5 + 1);
      const heave = k * 0.55 * Math.sin((t * TAU) / 4.3 + 0.5);
      // The idle sway has already been written this frame: the effect adds on top of it.
      ctx.vessel.rotation.z += pitch;
      ctx.vessel.rotation.x += roll;
      ctx.vessel.position.y += heave;
      ctx.vessel.getWorldPosition(tmp);
      group.position.set(tmp.x, tmp.y + 1.5, tmp.z);
      return (
        `ROLL ${signed(ctx.vessel.rotation.x * DEG)}° · ` +
        `PITCH ${signed(ctx.vessel.rotation.z * DEG)}° · ` +
        `HEAVE ${signed(ctx.vessel.position.y, 2)} m`
      );
    },
    focus: (out) => {
      ctx.vessel.getWorldPosition(out);
      out.y += 2;
      return 34;
    },
  };
};

const NORTH_BEARING = 274.07; // matches the HDT sample on the packet
const northDir = new THREE.Vector3(
  Math.cos((NORTH_BEARING * Math.PI) / 180),
  0,
  -Math.sin((NORTH_BEARING * Math.PI) / 180),
);

/** The craft turns slowly against a fixed compass ring: the gyro keeps reading true North. */
export function buildHeading(target: "vessel" | "rov"): EffectBuilder {
  return (ctx: EffectContext) => {
    const radius = target === "vessel" ? 10 : 3.4;
    const object = target === "vessel" ? ctx.vessel : ctx.rov;
    const group = new THREE.Group();
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, radius * 0.006, 6, 72),
      glowMat(COLORS.teal, 0.8),
    );
    ring.rotation.x = Math.PI / 2;
    const tickPoints: THREE.Vector3[] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * TAU;
      const len = i % 3 === 0 ? 0.12 : 0.06;
      tickPoints.push(
        new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius),
        new THREE.Vector3(Math.cos(a) * radius * (1 - len), 0, Math.sin(a) * radius * (1 - len)),
      );
    }
    const ticks = new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(tickPoints),
      lineMat(COLORS.ice, 0.8),
    );
    const north = labelSprite("N", "#ffc72c");
    north.scale.setScalar(radius * 0.32);
    north.position.copy(northDir).multiplyScalar(radius * 1.16);
    const northArrow = new THREE.Mesh(arrowGeometry(radius * 0.03), glowMat(COLORS.yellow, 0.9));
    northArrow.scale.y = radius * 0.22;
    northArrow.position.copy(northDir).multiplyScalar(radius * 0.88);
    northArrow.quaternion.setFromUnitVectors(UP, northDir);
    const needleGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(1, 0, 0),
    ]);
    const needle = new THREE.Line(needleGeo, lineMat(COLORS.alert, 1));
    needle.scale.setScalar(radius * 1.12);
    group.add(ring, ticks, north, northArrow, needle);
    const spriteMat = north.material as THREE.SpriteMaterial;
    const bow = new THREE.Vector3();

    return {
      group,
      update: (t, _dt, k) => {
        const swing = k * (target === "vessel" ? 0.34 : 0.5) * Math.sin((t * TAU) / 9);
        if (target === "vessel") object.rotation.y = swing;
        else object.rotation.y += swing;
        object.getWorldPosition(tmp);
        group.position.set(tmp.x, target === "vessel" ? tmp.y + 0.4 : tmp.y, tmp.z);
        spriteMat.opacity = k;
        bow.set(1, 0, 0).applyQuaternion(object.quaternion);
        bow.y = 0;
        bow.normalize();
        needle.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), bow);
        const crossY = northDir.z * bow.x - northDir.x * bow.z;
        const bearing = (((-Math.atan2(crossY, northDir.dot(bow)) * DEG) % 360) + 360) % 360;
        return `${target === "vessel" ? "HDT" : "ROV HDT"} ${bearing.toFixed(1)}°T`;
      },
      focus: (out) => {
        object.getWorldPosition(out);
        return target === "vessel" ? 32 : 14;
      },
    };
  };
}

/** The air above presses on the sea surface: the barometer reference that depth is corrected with. */
export const buildAirPressure: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const layer = new THREE.Mesh(new THREE.CircleGeometry(9, 40), glowMat(COLORS.teal, 0.16));
  layer.rotation.x = -Math.PI / 2;
  layer.position.y = 11;
  group.add(layer);
  const arrows: THREE.Mesh[] = [];
  const COUNT = 8;
  for (let i = 0; i < COUNT; i++) {
    const arrow = new THREE.Mesh(arrowGeometry(0.3), glowMat(COLORS.ice, 0.9, true));
    arrow.rotation.x = Math.PI;
    const a = (i / COUNT) * TAU;
    const r = i % 2 === 0 ? 3 : 6.2;
    arrow.userData.x = Math.cos(a) * r;
    arrow.userData.z = Math.sin(a) * r;
    arrows.push(arrow);
    group.add(arrow);
  }
  return {
    group,
    update: (t, _dt, k) => {
      ctx.vessel.getWorldPosition(tmp);
      group.position.set(tmp.x, 0, tmp.z);
      arrows.forEach((arrow, i) => {
        const phase = (t * 0.5 + i / COUNT) % 1;
        arrow.scale.y = 1.8;
        arrow.position.set(arrow.userData.x, 10.5 - phase * 6.5, arrow.userData.z);
        (arrow.material as THREE.MeshBasicMaterial).opacity = Math.sin(phase * Math.PI) * 0.9 * k;
      });
      return `AIR ${(1013.2 + Math.sin(t * 0.7) * 1.2).toFixed(1)} hPa`;
    },
    focus: (out) => {
      ctx.vessel.getWorldPosition(out);
      out.y += 5;
      return 34;
    },
  };
};

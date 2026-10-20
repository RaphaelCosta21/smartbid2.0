import * as THREE from "three";
import { EffectBuilder } from "./effectTypes";
import { COLORS, DEG, glowMat, hitSeabed, lineMat } from "./effectUtils";

const tmp = new THREE.Vector3();
const tmpB = new THREE.Vector3();

/** Fan of beams from the ROV's multibeam heads: every echo becomes one depth point. */
export const buildBathymetry: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const BEAMS = 21;
  const blank = (n: number): THREE.Vector3[] => new Array(n).fill(0).map(() => new THREE.Vector3());
  const fanGeo = new THREE.BufferGeometry().setFromPoints(blank(BEAMS * 2));
  const fan = new THREE.LineSegments(fanGeo, lineMat(COLORS.teal, 0.8, true));
  const pointsGeo = new THREE.BufferGeometry().setFromPoints(blank(BEAMS));
  const pointsMat = new THREE.PointsMaterial({
    color: COLORS.yellow,
    size: 0.45,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const points = new THREE.Points(pointsGeo, pointsMat);
  group.add(fan, points);
  const across = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const first = new THREE.Vector3();
  const last = new THREE.Vector3();

  return {
    group,
    update: (t, _dt, k) => {
      ctx.rov.getWorldPosition(tmp);
      tmp.y -= 0.5;
      across.set(0, 0, 1).applyQuaternion(ctx.rov.quaternion);
      const fanPos = fanGeo.attributes.position as THREE.BufferAttribute;
      const hitPos = pointsGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < BEAMS; i++) {
        const angle = (i / (BEAMS - 1) - 0.5) * 1.9;
        dir.set(0, -Math.cos(angle), 0).addScaledVector(across, Math.sin(angle));
        hitSeabed(tmp, dir, ctx.seabedHeight, tmpB);
        fanPos.setXYZ(i * 2, tmp.x, tmp.y, tmp.z);
        fanPos.setXYZ(i * 2 + 1, tmpB.x, tmpB.y, tmpB.z);
        hitPos.setXYZ(i, tmpB.x, tmpB.y + 0.05, tmpB.z);
        if (i === 0) first.copy(tmpB);
        if (i === BEAMS - 1) last.copy(tmpB);
      }
      fanPos.needsUpdate = true;
      hitPos.needsUpdate = true;
      (fan.material as THREE.LineBasicMaterial).opacity = (0.6 + 0.2 * Math.sin(t * 6)) * k;
      pointsMat.opacity = k;
      return `BEAMS ${BEAMS} · SWATH ${first.distanceTo(last).toFixed(1)} m`;
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      out.y -= 1.5;
      return 15;
    },
  };
};

/** Ping from the hull to a beacon and the reply back: range comes from the echo, angle from the array. */
export const buildUsblPing: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.4, 14, 14), glowMat(COLORS.yellow, 0.9, true));
  const lineGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const line = new THREE.Line(lineGeo, lineMat(COLORS.slate, 0.8));
  group.add(pulse, line);
  const PERIOD = 2.2;
  const hull = new THREE.Vector3();
  const coneMat = ctx.cone.material as THREE.MeshBasicMaterial;

  return {
    group,
    update: (t, _dt, k) => {
      const count = ctx.beaconTops.length;
      if (!count) return null;
      const index = Math.floor(t / PERIOD) % count;
      const phase = (t % PERIOD) / PERIOD;
      const outbound = phase < 0.5;
      const p = outbound ? phase * 2 : (phase - 0.5) * 2;
      ctx.hullAnchor.getWorldPosition(hull);
      const top = ctx.beaconTops[index];
      top.getWorldPosition(tmp);
      pulse.position.lerpVectors(outbound ? hull : tmp, outbound ? tmp : hull, p);
      pulse.scale.setScalar(0.8 + 0.3 * Math.sin(t * 12));
      (pulse.material as THREE.MeshBasicMaterial).opacity = 0.9 * k;
      const pos = lineGeo.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, hull.x, hull.y, hull.z);
      pos.setXYZ(1, tmp.x, tmp.y, tmp.z);
      pos.needsUpdate = true;
      // The main loop writes the cone and beacon glow every frame; the effect brightens them on top.
      coneMat.opacity += 0.1 * k;
      const arrived = Math.max(0, 1 - Math.abs(phase - 0.5) * 6);
      (top.material as THREE.MeshStandardMaterial).emissiveIntensity += arrived * 1.8 * k;
      const range = hull.distanceTo(tmp);
      const angle = Math.acos(THREE.MathUtils.clamp((hull.y - tmp.y) / Math.max(range, 0.01), -1, 1));
      return `RANGE ${range.toFixed(1)} m · ANGLE ${(angle * DEG).toFixed(0)}°`;
    },
    focus: (out) => {
      ctx.hullAnchor.getWorldPosition(out);
      out.y -= 6;
      return 30;
    },
  };
};

/** Magnetic field loops around the pipe under the ROV: the coils read them to find position and cover. */
export const buildPipeField: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const samples: THREE.Vector3[][] = ctx.pipes.map((curve) => curve.getSpacedPoints(80));
  const RINGS = 5;
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < RINGS; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1, 0.05, 6, 32), glowMat(COLORS.teal, 0.9, true));
    rings.push(ring);
    group.add(ring);
  }
  const frameGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-1.3, 0, -0.7),
    new THREE.Vector3(1.3, 0, -0.7),
    new THREE.Vector3(1.3, 0, 0.7),
    new THREE.Vector3(-1.3, 0, 0.7),
  ]);
  const frame = new THREE.LineLoop(frameGeo, lineMat(COLORS.yellow, 0.9));
  const linkGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const link = new THREE.Line(linkGeo, lineMat(COLORS.slate, 0.8));
  group.add(frame, link);
  const axisZ = new THREE.Vector3(0, 0, 1);
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  return {
    group,
    update: (t, _dt, k) => {
      if (!samples.length) return null;
      ctx.rov.getWorldPosition(tmp);
      let best = Infinity;
      samples.forEach((pts) => {
        for (let j = 1; j < pts.length - 1; j++) {
          const d = pts[j].distanceToSquared(tmp);
          if (d < best) {
            best = d;
            point.copy(pts[j]);
            tangent.subVectors(pts[j + 1], pts[j - 1]).normalize();
          }
        }
      });
      rings.forEach((ring, i) => {
        const offset = (i - (RINGS - 1) / 2) * 0.9;
        ring.position.copy(point).addScaledVector(tangent, offset);
        ring.quaternion.setFromUnitVectors(axisZ, tangent);
        const phase = (t * 0.8 + i / RINGS) % 1;
        ring.scale.setScalar(0.8 + phase * 1.7);
        (ring.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.8 * k;
      });
      frame.position.set(tmp.x, tmp.y - 0.7, tmp.z);
      frame.rotation.y = ctx.rov.rotation.y;
      const pos = linkGeo.attributes.position as THREE.BufferAttribute;
      pos.setXYZ(0, tmp.x, tmp.y - 0.7, tmp.z);
      pos.setXYZ(1, point.x, point.y, point.z);
      pos.needsUpdate = true;
      return `COVER ${(0.86 + 0.12 * Math.sin(t * 0.9)).toFixed(2)} m`;
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      out.y -= 1.5;
      return 14;
    },
  };
};

const SOUND_SPEEDS = [1540, 1522, 1506, 1496, 1494, 1500];
const SOUND_COLORS = [COLORS.alert, COLORS.yellow, COLORS.green, COLORS.teal, COLORS.steel, COLORS.slate];

/** Water column under the ROV in layers of different sound speed; a probe samples it and a ray bends. */
export const buildSoundColumn: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const LAYERS = SOUND_SPEEDS.length;
  const slabs = SOUND_COLORS.map((color) => {
    const slab = new THREE.Mesh(new THREE.BoxGeometry(7, 1, 7), glowMat(color, 0.22));
    group.add(slab);
    return slab;
  });
  const probe = new THREE.Mesh(new THREE.SphereGeometry(0.38, 14, 14), glowMat(COLORS.ice, 0.95, true));
  const rayGeo = new THREE.BufferGeometry().setFromPoints(
    new Array(LAYERS + 1).fill(0).map(() => new THREE.Vector3()),
  );
  const ray = new THREE.Line(rayGeo, lineMat(COLORS.yellow, 0.95));
  group.add(probe, ray);
  const hull = new THREE.Vector3();
  const PERIOD = 6;

  return {
    group,
    update: (t, _dt, k) => {
      ctx.rov.getWorldPosition(tmp);
      const top = 0.3;
      const bottom = ctx.seabedHeight(tmp.x, tmp.z);
      const height = (top - bottom) / LAYERS;
      slabs.forEach((slab, i) => {
        slab.scale.set(1, Math.max(0.1, height * 0.96), 1);
        slab.position.set(tmp.x, top - (i + 0.5) * height, tmp.z);
      });
      const f = (t % PERIOD) / PERIOD;
      probe.position.set(tmp.x, top - f * (top - bottom), tmp.z);
      (probe.material as THREE.MeshBasicMaterial).opacity = 0.95 * k;
      const s = THREE.MathUtils.clamp(f * LAYERS - 0.5, 0, LAYERS - 1);
      const i0 = Math.floor(s);
      const i1 = Math.min(LAYERS - 1, i0 + 1);
      const speed = SOUND_SPEEDS[i0] + (SOUND_SPEEDS[i1] - SOUND_SPEEDS[i0]) * (s - i0);
      ctx.hullAnchor.getWorldPosition(hull);
      const pos = rayGeo.attributes.position as THREE.BufferAttribute;
      let bend = 0;
      for (let j = 0; j <= LAYERS; j++) {
        const u = j / LAYERS;
        if (j > 0) bend += (SOUND_SPEEDS[j - 1] - 1510) * 0.04;
        pos.setXYZ(
          j,
          hull.x + (tmp.x - hull.x) * u + bend,
          hull.y + (bottom - hull.y) * u,
          hull.z + (tmp.z - hull.z) * u,
        );
      }
      pos.needsUpdate = true;
      return `SV ${speed.toFixed(1)} m/s · DEPTH ${Math.max(0, -probe.position.y).toFixed(1)} m`;
    },
    focus: (out) => {
      ctx.rov.getWorldPosition(out);
      out.y *= 0.5;
      return 26;
    },
  };
};

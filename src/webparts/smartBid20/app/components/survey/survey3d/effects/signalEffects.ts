import * as THREE from "three";
import { EffectBuilder } from "./effectTypes";
import { COLORS, glowMat } from "./effectUtils";

const tmp = new THREE.Vector3();
const tmpB = new THREE.Vector3();

const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/** One synchronised pulse per second leaves every satellite for the antenna: time tick + clock message. */
export const buildPpsTick: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const shells = ctx.satellites.map(() => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), glowMat(COLORS.ice, 0.4, true));
    group.add(m);
    return m;
  });
  const balls = ctx.satellites.map(() => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), glowMat(COLORS.yellow, 0.95, true));
    group.add(m);
    return m;
  });
  const flash = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), glowMat(COLORS.yellow, 0.7, true));
  group.add(flash);

  return {
    group,
    update: (t, _dt, k) => {
      const phase = t % 1;
      ctx.antennaAnchor.getWorldPosition(tmpB);
      ctx.satellites.forEach((sat, i) => {
        sat.getWorldPosition(tmp);
        shells[i].position.copy(tmp);
        shells[i].scale.setScalar(0.5 + phase * 3);
        (shells[i].material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.45 * k;
        balls[i].position.lerpVectors(tmp, tmpB, phase);
        (balls[i].material as THREE.MeshBasicMaterial).opacity = 0.95 * k;
      });
      const hit = Math.max(0, (phase - 0.85) / 0.15);
      flash.position.copy(tmpB);
      flash.scale.setScalar(0.3 + hit * 1.6);
      (flash.material as THREE.MeshBasicMaterial).opacity = hit * 0.8 * k;
      return `PPS 1 Hz · ZDA 12:35:${pad2((19 + Math.floor(t)) % 60)}Z`;
    },
    focus: (out) => {
      ctx.antennaAnchor.getWorldPosition(out);
      return 40;
    },
  };
};

/** Correction satellites: the GNSS beams turn green, and the receiver applies them internally. */
export const buildCorrections: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const base = ctx.gnssMaterials.map((m) => m.color.clone());
  const target = new THREE.Color(COLORS.green);
  return {
    group,
    update: (_t, _dt, k) => {
      ctx.gnssMaterials.forEach((m, i) => m.color.copy(base[i]).lerp(target, k));
      return null;
    },
    focus: (out) => {
      ctx.antennaAnchor.getWorldPosition(out);
      return 40;
    },
  };
};

/** Radio waves spreading from the mast antenna. */
export const buildRadioWaves: EffectBuilder = (ctx) => {
  const group = new THREE.Group();
  const shells: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const mat = glowMat(COLORS.teal, 0.45, true);
    mat.wireframe = true;
    const shell = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mat);
    shells.push(shell);
    group.add(shell);
  }
  return {
    group,
    update: (t, _dt, k) => {
      ctx.mastAnchor.getWorldPosition(tmp);
      shells.forEach((shell, i) => {
        const phase = (t * 0.45 + i / 3) % 1;
        shell.position.copy(tmp);
        shell.scale.setScalar(0.8 + phase * 11);
        (shell.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.45 * k;
      });
      return "UHF · TX";
    },
    focus: (out) => {
      ctx.mastAnchor.getWorldPosition(out);
      return 26;
    },
  };
};

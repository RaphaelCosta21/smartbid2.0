/**
 * Animated cables between exploded nodes: one curved tube per diagram link,
 * colored by link kind, with particles flowing from → to.
 */
import * as THREE from "three";
import { SurveyLinkKind } from "../../../models";
import { LINK_COLORS, LINK_KINDS, SceneLink } from "./sceneTypes";

interface Cable {
  key: string;
  kind: SurveyLinkKind;
  curve: THREE.QuadraticBezierCurve3;
  tube: THREE.Mesh;
  /** Fat invisible tube for picking; shows the halo while hovered. */
  hit: THREE.Mesh;
  particles: THREE.Mesh[];
}

type KindMaterials = Record<SurveyLinkKind, THREE.MeshBasicMaterial>;

const makeMaterials = (opacity: number): KindMaterials => {
  const result = {} as KindMaterials;
  LINK_KINDS.forEach((kind) => {
    result[kind] = new THREE.MeshBasicMaterial({
      color: LINK_COLORS[kind],
      transparent: true,
      opacity,
      depthWrite: false,
    });
  });
  return result;
};

const BASE_OPACITY = 0.9;
const DIM_OPACITY = 0.12;
const HALO_OPACITY = 0.35;
const PARTICLES_PER_CABLE = 2;

export class CableNetwork {
  public readonly group = new THREE.Group();
  private cables: Cable[] = [];
  private normal = makeMaterials(BASE_OPACITY);
  private dim = makeMaterials(DIM_OPACITY);
  private particle = makeMaterials(1);
  private halo = makeMaterials(HALO_OPACITY);
  private hidden = new THREE.MeshBasicMaterial({ visible: false });
  private particleGeo = new THREE.SphereGeometry(0.075, 10, 8);
  private trace: Record<string, boolean> | null = null;
  private hoverKey: string | null = null;
  private fade = 0;
  private visibleTarget = false;
  private enabled = true;

  public build(
    links: SceneLink[],
    positions: Record<string, THREE.Vector3>,
    viewDir: THREE.Vector3,
    up: THREE.Vector3,
  ): void {
    this.clear();
    links.forEach((link) => {
      const a = positions[link.from];
      const b = positions[link.to];
      if (!a || !b) return;
      const len = a.distanceTo(b);
      const control = a
        .clone()
        .add(b)
        .multiplyScalar(0.5)
        .addScaledVector(viewDir, 0.6 + len * 0.08)
        .addScaledVector(up, len * 0.12);
      const curve = new THREE.QuadraticBezierCurve3(a.clone(), control, b.clone());
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 24, 0.035, 6, false),
        this.normal[link.kind],
      );
      this.group.add(tube);
      const hit = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.14, 6, false), this.hidden);
      hit.userData.pick = { type: "cable", key: link.key };
      this.group.add(hit);
      const particles: THREE.Mesh[] = [];
      for (let i = 0; i < PARTICLES_PER_CABLE; i++) {
        const p = new THREE.Mesh(this.particleGeo, this.particle[link.kind]);
        particles.push(p);
        this.group.add(p);
      }
      this.cables.push({ key: link.key, kind: link.kind, curve, tube, hit, particles });
    });
    this.applyTrace();
  }

  public setHover(key: string | null): void {
    this.hoverKey = key;
    this.cables.forEach((cable) => {
      cable.hit.material = cable.key === key ? this.halo[cable.kind] : this.hidden;
    });
  }

  /** Fades the network in/out (cables appear once the nodes have emerged). */
  public setVisible(visible: boolean): void {
    this.visibleTarget = visible;
  }

  /** User switch: hides the network regardless of the emerge animation. */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public setTrace(linkKeys: string[] | null): void {
    if (!linkKeys || linkKeys.length === 0) {
      this.trace = null;
    } else {
      this.trace = {};
      linkKeys.forEach((k) => (this.trace![k] = true));
    }
    this.applyTrace();
  }

  public update(dt: number, time: number, reducedMotion: boolean): void {
    const goal = this.visibleTarget && this.enabled ? 1 : 0;
    this.fade = reducedMotion ? goal : THREE.MathUtils.damp(this.fade, goal, 6, dt);
    this.group.visible = this.fade > 0.01;
    LINK_KINDS.forEach((kind) => {
      this.normal[kind].opacity = BASE_OPACITY * this.fade;
      this.dim[kind].opacity = DIM_OPACITY * this.fade;
      this.particle[kind].opacity = this.fade;
      this.halo[kind].opacity = HALO_OPACITY * this.fade;
    });
    if (!this.group.visible) return;
    this.cables.forEach((cable, c) => {
      const traced = !!this.trace && !!this.trace[cable.key];
      const speed = traced || cable.key === this.hoverKey ? 0.65 : 0.28;
      cable.particles.forEach((p, i) => {
        const k = reducedMotion ? (i + 0.5) / PARTICLES_PER_CABLE : (time * speed + i / PARTICLES_PER_CABLE + c * 0.13) % 1;
        cable.curve.getPoint(k, p.position);
      });
    });
  }

  public clear(): void {
    this.cables.forEach((cable) => {
      this.group.remove(cable.tube);
      this.group.remove(cable.hit);
      cable.tube.geometry.dispose();
      cable.hit.geometry.dispose();
      cable.particles.forEach((p) => this.group.remove(p));
    });
    this.cables = [];
    this.hoverKey = null;
  }

  public dispose(): void {
    this.clear();
    this.particleGeo.dispose();
    this.hidden.dispose();
    [this.normal, this.dim, this.particle, this.halo].forEach((set) =>
      LINK_KINDS.forEach((kind) => set[kind].dispose()),
    );
  }

  private applyTrace(): void {
    this.cables.forEach((cable) => {
      const traced = !this.trace || !!this.trace[cable.key];
      cable.tube.material = traced ? this.normal[cable.kind] : this.dim[cable.kind];
      cable.particles.forEach((p) => (p.visible = traced));
    });
  }
}

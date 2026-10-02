/**
 * Overview trunks: one animated arc per pair of rooms that share cables on the
 * one-line diagram. Endpoints follow moving anchors (vessel heave, ROV), so the
 * arc is a 1px line plus a stream of instanced dots recomputed every frame.
 */
import * as THREE from "three";
import { SurveyLinkKind, SurveySceneAnchor } from "../../../models";
import { LINK_COLORS, LINK_KINDS, SceneTrunk } from "./sceneTypes";

interface Trunk {
  key: string;
  kind: SurveyLinkKind;
  from: THREE.Object3D;
  to: THREE.Object3D;
  group: THREE.Group;
  line: THREE.Line;
  dots: THREE.InstancedMesh;
  curve: THREE.QuadraticBezierCurve3;
}

const LINE_POINTS = 32;
const DOTS = 14;
const LINE_OPACITY = 0.55;
const SURFACE_Y = -0.5;

export class TrunkNetwork {
  public readonly group = new THREE.Group();
  private trunks: Trunk[] = [];
  private dotGeo = new THREE.SphereGeometry(0.13, 8, 6);
  private lineMats = {} as Record<SurveyLinkKind, THREE.LineBasicMaterial>;
  private dotMats = {} as Record<SurveyLinkKind, THREE.MeshBasicMaterial>;
  private hoverKey: string | null = null;
  private fade = 1;
  private visibleTarget = true;
  private matrix = new THREE.Matrix4();
  private point = new THREE.Vector3();
  private scale = new THREE.Vector3();
  private quat = new THREE.Quaternion();

  constructor(private readonly resolve: (anchor: SurveySceneAnchor) => THREE.Object3D | null) {
    LINK_KINDS.forEach((kind) => {
      this.lineMats[kind] = new THREE.LineBasicMaterial({
        color: LINK_COLORS[kind],
        transparent: true,
        opacity: LINE_OPACITY,
        depthWrite: false,
      });
      this.dotMats[kind] = new THREE.MeshBasicMaterial({
        color: LINK_COLORS[kind],
        transparent: true,
        depthWrite: false,
      });
    });
  }

  public build(trunks: SceneTrunk[]): void {
    this.clear();
    trunks.forEach((t) => {
      const from = this.resolve(t.from);
      const to = this.resolve(t.to);
      if (!from || !to || from === to) return;
      const group = new THREE.Group();
      group.userData.pick = { type: "cable", key: t.key };
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(
          new Array(LINE_POINTS).fill(0).map(() => new THREE.Vector3()),
        ),
        this.lineMats[t.kind],
      );
      line.frustumCulled = false;
      const dots = new THREE.InstancedMesh(this.dotGeo, this.dotMats[t.kind], DOTS);
      dots.frustumCulled = false;
      group.add(line, dots);
      this.group.add(group);
      this.trunks.push({
        key: t.key,
        kind: t.kind,
        from,
        to,
        group,
        line,
        dots,
        curve: new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3(),
        ),
      });
    });
  }

  public setVisible(visible: boolean): void {
    this.visibleTarget = visible;
  }

  public setHover(key: string | null): void {
    this.hoverKey = key;
  }

  public update(dt: number, time: number, reducedMotion: boolean): void {
    const goal = this.visibleTarget ? 1 : 0;
    this.fade = reducedMotion ? goal : THREE.MathUtils.damp(this.fade, goal, 5, dt);
    this.group.visible = this.fade > 0.01;
    if (!this.group.visible) return;
    const anyHover = !!this.hoverKey;
    LINK_KINDS.forEach((kind) => {
      this.lineMats[kind].opacity = LINE_OPACITY * this.fade;
      this.dotMats[kind].opacity = this.fade;
    });

    this.trunks.forEach((t, ti) => {
      const c = t.curve;
      t.from.getWorldPosition(c.v0);
      t.to.getWorldPosition(c.v2);
      const dist = c.v0.distanceTo(c.v2);
      c.v1.lerpVectors(c.v0, c.v2, 0.5);
      if (c.v0.y > SURFACE_Y && c.v2.y > SURFACE_Y) {
        // Topside: arc over the deck so short room-to-room hops stay readable.
        c.v1.y += 1.2 + dist * 0.45;
      } else {
        // Subsea: a gentle sideways bow, clear of the tether.
        c.v1.x -= 1.5 + dist * 0.08;
      }

      const pos = t.line.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < LINE_POINTS; i++) {
        c.getPoint(i / (LINE_POINTS - 1), this.point);
        pos.setXYZ(i, this.point.x, this.point.y, this.point.z);
      }
      pos.needsUpdate = true;
      t.line.geometry.computeBoundingSphere();

      const hot = t.key === this.hoverKey;
      const muted = anyHover && !hot;
      const speed = hot ? 0.5 : 0.18;
      const size = hot ? 1.7 : muted ? 0.6 : 1;
      for (let i = 0; i < DOTS; i++) {
        const k = reducedMotion ? i / DOTS : (i / DOTS + time * speed + ti * 0.11) % 1;
        c.getPoint(k, this.point);
        // Taper at the ends so the stream reads as leaving / entering the rooms.
        const s = size * Math.min(1, Math.sin(Math.PI * k) * 2.2);
        this.scale.setScalar(Math.max(0.05, s));
        this.matrix.compose(this.point, this.quat, this.scale);
        t.dots.setMatrixAt(i, this.matrix);
      }
      t.dots.instanceMatrix.needsUpdate = true;
      t.dots.computeBoundingSphere();
    });
  }

  public clear(): void {
    this.trunks.forEach((t) => {
      this.group.remove(t.group);
      t.line.geometry.dispose();
      t.dots.dispose();
    });
    this.trunks = [];
    this.hoverKey = null;
  }

  public dispose(): void {
    this.clear();
    this.dotGeo.dispose();
    LINK_KINDS.forEach((kind) => {
      this.lineMats[kind].dispose();
      this.dotMats[kind].dispose();
    });
  }
}

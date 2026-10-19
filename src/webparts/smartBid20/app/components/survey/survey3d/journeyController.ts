/**
 * Data journey in 3D: a glowing packet (with a short trail) travels each step once at a steady
 * speed (satellite beam, a cable of the open room, or arriving from another room) and then rests
 * on its destination until the page moves to the next step. The deliverables appear as floating
 * cards at the end.
 */
import * as THREE from "three";
import { SceneJourneyStep } from "./sceneTypes";
import { buildDeliverable, disposeTree } from "./deliverableModels";

export interface JourneyHooks {
  cableCurve: (key: string) => THREE.Curve<THREE.Vector3> | null;
  nodeObject: (nodeId: string) => THREE.Object3D | null;
  satellite: () => THREE.Object3D;
  antenna: () => THREE.Object3D;
  /** Room currently exploded in the scene (null = overview). */
  openZoneId: () => string | null;
}

/** World units per second along a cable: one steady pace whatever the cable length. */
const TRAVEL_SPEED = 4.5;
const TRAVEL_MIN = 1.1;
const TRAVEL_MAX = 2.8;
const SATELLITE_SECONDS = 2.6;
const REST_LIFT = 1.15;
/** The halo swells when the packet first appears on the sensor: the signal became a message. */
const FLASH_SECONDS = 0.7;
const TRAIL = 7;
const TRAIL_GAP = 0.022;
const CARD_SPACING = 3.9;
const ROW_SPACING = 4.4;
const CARDS_PER_ROW = 3;
const CARD_STAGGER = 0.18;

export class JourneyController {
  public readonly group = new THREE.Group();
  private readonly packetAnchor = new THREE.Object3D();
  private packet: THREE.Mesh;
  private halo: THREE.Mesh;
  private trail: THREE.Mesh[] = [];
  private trailGeo = new THREE.SphereGeometry(0.13, 10, 10);
  private packetMat = new THREE.MeshBasicMaterial({ color: 0xffc72c });
  private haloMat = new THREE.MeshBasicMaterial({
    color: 0xffc72c,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  private cards = new THREE.Group();
  private cardItems: { group: THREE.Group; delay: number }[] = [];
  private cardsKey = "";
  private cardsT = 0;
  private step: SceneJourneyStep | null = null;
  /** Step clock: runs once the step's path exists in the scene. */
  private t = 0;
  private travelSeconds = TRAVEL_MIN;
  private travelMeasured = false;
  private flash = 0;
  private packetShown = false;
  private tmpA = new THREE.Vector3();
  private tmpB = new THREE.Vector3();
  private tmpC = new THREE.Vector3();

  constructor(
    private readonly hooks: JourneyHooks,
    private readonly reducedMotion: boolean,
  ) {
    this.packet = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), this.packetMat);
    this.halo = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), this.haloMat);
    this.packet.add(this.halo);
    this.packet.visible = false;
    for (let i = 0; i < TRAIL; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffc72c,
        transparent: true,
        opacity: 0.55 * (1 - (i + 1) / (TRAIL + 1)),
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const dot = new THREE.Mesh(this.trailGeo, mat);
      dot.scale.setScalar(1 - i / (TRAIL + 2));
      dot.visible = false;
      this.trail.push(dot);
      this.group.add(dot);
    }
    this.group.add(this.packet, this.packetAnchor, this.cards);
  }

  /** Label target for the packet's HTML caption; null while the packet is hidden. */
  public get packetTarget(): THREE.Object3D | null {
    return this.packetShown ? this.packetAnchor : null;
  }

  public get cardCount(): number {
    return this.cardItems.length;
  }

  public setStep(step: SceneJourneyStep | null): void {
    const same = !!step && !!this.step && step.key === this.step.key;
    const afterPhenomenon = !!this.step && this.step.mode === "phenomenon";
    this.step = step;
    if (!same) {
      this.t = 0;
      this.travelSeconds = TRAVEL_MIN;
      this.travelMeasured = false;
      this.flash = afterPhenomenon && !!step && step.mode === "node" ? FLASH_SECONDS : 0;
    }
    if (step) {
      this.packetMat.color.setHex(step.color);
      this.haloMat.color.setHex(step.color);
      this.trail.forEach((d) => (d.material as THREE.MeshBasicMaterial).color.setHex(step.color));
    }
    const deliverables = step && step.mode === "deliverables" ? step.deliverables || [] : [];
    const key = deliverables.map((d) => `${d.id}:${d.subtitle}`).join("|");
    if (key !== this.cardsKey) this.buildCards(step, key);
  }

  /** Arranges the deliverable cards around `center`, in rows across the camera's right vector. */
  public placeCards(center: THREE.Vector3, right: THREE.Vector3): void {
    const n = this.cardItems.length;
    const rows = Math.ceil(n / CARDS_PER_ROW);
    this.cardItems.forEach((item, i) => {
      const row = Math.floor(i / CARDS_PER_ROW);
      const inRow = Math.min(CARDS_PER_ROW, n - row * CARDS_PER_ROW);
      const col = i - row * CARDS_PER_ROW;
      item.group.position
        .copy(center)
        .addScaledVector(right, (col - (inRow - 1) / 2) * CARD_SPACING)
        .setY(center.y + ((rows - 1) / 2 - row) * ROW_SPACING);
    });
  }

  public update(dt: number, time: number, camera: THREE.Camera): void {
    const ready = this.isReady();
    if (this.step && ready) {
      this.measureTravel();
      this.t += dt;
    }
    if (this.flash > 0 && this.packetShown) this.flash = Math.max(0, this.flash - dt);
    this.updatePacket(time, ready);

    this.cardsT += dt;
    this.cardItems.forEach((item, i) => {
      const k = this.reducedMotion
        ? 1
        : THREE.MathUtils.clamp((this.cardsT - item.delay) / 0.6, 0, 1);
      const ease = 1 - Math.pow(1 - k, 3);
      item.group.scale.setScalar(Math.max(0.001, ease));
      item.group.quaternion.copy(camera.quaternion);
      const mini = item.group.children[1];
      if (mini && !this.reducedMotion) {
        mini.position.y = 1.85 + Math.sin(time * 1.3 + i) * 0.08;
        mini.rotation.y = Math.sin(time * 0.5 + i) * 0.35;
      }
    });
  }

  public dispose(): void {
    this.clearCards();
    disposeTree(this.packet);
    this.trail.forEach((d) => (d.material as THREE.Material).dispose());
    this.trailGeo.dispose();
  }

  /** The step's path exists: its room is open and its equipment / cable has emerged. */
  private isReady(): boolean {
    const step = this.step;
    if (!step) return false;
    if (step.mode === "node" || step.mode === "cable") {
      if (step.zoneId && this.hooks.openZoneId() !== step.zoneId) return false;
      if (step.mode === "cable") return !!step.linkKey && !!this.hooks.cableCurve(step.linkKey);
      return !!step.nodeId && !!this.hooks.nodeObject(step.nodeId);
    }
    return true;
  }

  /** Travel time follows the cable length so the packet keeps one steady speed. */
  private measureTravel(): void {
    if (this.travelMeasured) return;
    this.travelMeasured = true;
    const step = this.step as SceneJourneyStep;
    const key =
      step.mode === "cable" ? step.linkKey : step.mode === "node" ? step.arriveLinkKey : undefined;
    const curve = key ? this.hooks.cableCurve(key) : null;
    if (curve) {
      this.travelSeconds = THREE.MathUtils.clamp(
        curve.getLength() / TRAVEL_SPEED,
        TRAVEL_MIN,
        TRAVEL_MAX,
      );
    }
  }

  /** Point on the step's travel path at k (0..1); false when the step has no path. */
  private pathPoint(k: number, out: THREE.Vector3): boolean {
    const step = this.step as SceneJourneyStep;
    const u = THREE.MathUtils.clamp(k, 0, 1);
    if (step.mode === "satellites") {
      this.hooks.satellite().getWorldPosition(this.tmpC);
      this.hooks.antenna().getWorldPosition(out);
      out.lerpVectors(this.tmpC, out, u);
      return true;
    }
    const key = step.mode === "cable" ? step.linkKey : step.arriveLinkKey;
    const reverse = step.mode === "cable" ? step.reverse : step.arriveReverse;
    const curve = key ? this.hooks.cableCurve(key) : null;
    if (!curve) return false;
    curve.getPointAt(reverse ? 1 - u : u, out);
    return true;
  }

  private updatePacket(time: number, ready: boolean): void {
    const step = this.step;
    const pos = this.tmpA;
    let shown = false;
    let travelK = -1;
    if (step && ready) {
      if (step.mode === "satellites") {
        travelK = this.reducedMotion ? 1 : this.t / SATELLITE_SECONDS;
      } else if (step.mode === "cable") {
        travelK = this.reducedMotion ? 1 : this.t / this.travelSeconds;
      } else if (step.mode === "node" && step.arriveLinkKey && !this.reducedMotion) {
        const k = this.t / this.travelSeconds;
        if (k < 1) travelK = k;
      }
      if (travelK >= 0) {
        shown = this.pathPoint(travelK, pos);
      } else if (step.mode === "node" && step.nodeId) {
        const node = this.hooks.nodeObject(step.nodeId);
        if (node) {
          node.getWorldPosition(pos);
          pos.y += REST_LIFT + (this.reducedMotion ? 0 : Math.sin(time * 3) * 0.08);
          shown = true;
        }
      }
    }
    this.packetShown = shown;
    this.packet.visible = shown;
    const trailOn = shown && travelK > 0 && travelK < 1 && !this.reducedMotion;
    this.trail.forEach((dot, i) => {
      const k = travelK - (i + 1) * TRAIL_GAP;
      dot.visible = trailOn && k > 0 && this.pathPoint(k, this.tmpB);
      if (dot.visible) dot.position.copy(this.tmpB);
    });
    if (!shown) return;
    this.packet.position.copy(pos);
    this.packetAnchor.position.copy(pos);
    if (!this.reducedMotion) {
      const swell = 1 + 2.2 * (this.flash / FLASH_SECONDS);
      this.halo.scale.setScalar((1 + Math.sin(time * 6) * 0.18) * swell);
    }
  }

  private buildCards(step: SceneJourneyStep | null, key: string): void {
    this.clearCards();
    this.cardsKey = key;
    this.cardsT = 0;
    if (!step || !step.deliverables) return;
    step.deliverables.forEach((d, i) => {
      const group = buildDeliverable(d);
      group.scale.setScalar(0.001);
      this.cards.add(group);
      this.cardItems.push({ group, delay: 0.4 + i * CARD_STAGGER });
    });
  }

  private clearCards(): void {
    this.cardItems.forEach((item) => {
      this.cards.remove(item.group);
      disposeTree(item.group);
    });
    this.cardItems = [];
    this.cardsKey = "";
  }
}

/**
 * Zone focus: builds the exploded equipment of one spread zone, animates it out of
 * its physical location, keeps per-node state (package / vessel / selected / trace)
 * and drives the cable network.
 */
import * as THREE from "three";
import { EquipmentModelFactory } from "./equipmentModels";
import { ExplodeLayout } from "./explodeLayout";
import { CableNetwork } from "./cableFlow";
import { SceneFocus, SceneNode, SceneNodeStates } from "./sceneTypes";

interface NodeEntry {
  node: SceneNode;
  group: THREE.Group;
  model: THREE.Object3D;
  plinth: THREE.Mesh;
  origin: THREE.Vector3;
  target: THREE.Vector3;
  delay: number;
  progress: number;
  phase: number;
}

interface LeavingEntry {
  entry: NodeEntry;
  from: THREE.Vector3;
  t: number;
}

const PLINTH = {
  normal: 0x0097a9,
  package: 0xffc72c,
  vessel: 0x7a99ac,
  catalog: 0x5b7f95,
  trace: 0xdc4405,
  selected: 0xffffff,
};

const EMERGE_SECONDS = 0.9;
const STAGGER_SECONDS = 0.03;
const MAX_STAGGER = 1.1;
const RETRACT_SECONDS = 0.45;

const easeOutCubic = (k: number): number => 1 - Math.pow(1 - k, 3);
const easeOutBack = (k: number): number => {
  const c1 = 1.4;
  return 1 + (c1 + 1) * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
};

const EMPTY_STATES: SceneNodeStates = {
  selectedNodeId: null,
  hoverNodeId: null,
  packageEquipmentIds: [],
  traceNodeIds: [],
  traceLinkKeys: [],
};

export class FocusController {
  public readonly group = new THREE.Group();
  private factory = new EquipmentModelFactory();
  private cables = new CableNetwork();
  private entries: Record<string, NodeEntry> = {};
  private leaving: LeavingEntry[] = [];
  private clusterAnchors: Record<string, THREE.Object3D> = {};
  private plinthGeo = new THREE.RingGeometry(0.6, 0.72, 40);
  private states: SceneNodeStates = EMPTY_STATES;
  private layout: ExplodeLayout | null = null;
  private elapsed = 0;
  private emerged = false;
  private generation = 0;

  constructor(private readonly reducedMotion: boolean) {
    this.group.add(this.cables.group);
  }

  public get isOpen(): boolean {
    return !!this.layout;
  }

  public open(
    focus: SceneFocus,
    layout: ExplodeLayout,
    origins: Record<string, THREE.Vector3>,
  ): void {
    this.retractAll();
    this.generation++;
    const generation = this.generation;
    this.layout = layout;
    this.elapsed = 0;
    this.emerged = false;

    focus.nodes.forEach((node, i) => {
      const target = layout.positions[node.id];
      if (!target) return;
      const group = new THREE.Group();
      group.userData.pick = { type: "node", nodeId: node.id };
      const model = this.factory.build(node.shape, node.vesselSupplied);
      group.add(model);
      const plinth = new THREE.Mesh(
        this.plinthGeo,
        new THREE.MeshBasicMaterial({ color: PLINTH.normal, side: THREE.DoubleSide }),
      );
      plinth.rotation.x = -Math.PI / 2;
      plinth.position.y = -0.72;
      group.add(plinth);
      const origin = (origins[node.id] || layout.center).clone();
      group.position.copy(origin);
      group.scale.setScalar(0.001);
      this.group.add(group);
      const entry: NodeEntry = {
        node,
        group,
        model,
        plinth,
        origin,
        target,
        delay: Math.min(i * STAGGER_SECONDS, MAX_STAGGER),
        progress: 0,
        phase: i * 0.7,
      };
      this.entries[node.id] = entry;

      if (node.modelUrl) {
        this.factory
          .loadGlb(node.modelUrl)
          .then((glb) => {
            if (generation !== this.generation || this.entries[node.id] !== entry) return;
            group.remove(entry.model);
            entry.model = glb;
            group.add(glb);
          })
          .catch(() => {
            /* keep the procedural archetype */
          });
      }
    });

    layout.clusters.forEach((cluster) => {
      const anchor = new THREE.Object3D();
      anchor.position.copy(cluster.labelPosition);
      this.group.add(anchor);
      this.clusterAnchors[cluster.key] = anchor;
    });

    this.cables.build(focus.links, layout.positions, layout.viewDir, layout.up);
    this.cables.setVisible(false);
    this.applyStates();
  }

  public close(): void {
    this.generation++;
    this.retractAll();
    this.layout = null;
  }

  public setStates(states: SceneNodeStates): void {
    this.states = states;
    this.applyStates();
  }

  /** "node:<id>" or "cluster:<anchor>" label targets; null while hidden or still emerging. */
  public getLabelTarget(key: string): THREE.Object3D | null {
    if (key.indexOf("node:") === 0) {
      const entry = this.entries[key.slice(5)];
      return entry && entry.progress >= 1 ? entry.group : null;
    }
    if (key.indexOf("cluster:") === 0) {
      return this.emerged ? this.clusterAnchors[key.slice(8)] || null : null;
    }
    return null;
  }

  public update(dt: number, time: number): void {
    this.elapsed += dt;
    const up = this.layout ? this.layout.up : new THREE.Vector3(0, 1, 0);
    const trace = this.states.traceNodeIds;
    let pending = 0;

    Object.keys(this.entries).forEach((id) => {
      const e = this.entries[id];
      const local = this.reducedMotion
        ? 1
        : THREE.MathUtils.clamp((this.elapsed - e.delay) / EMERGE_SECONDS, 0, 1);
      e.progress = local;
      if (local < 1) pending++;
      const k = easeOutCubic(local);
      e.group.position
        .lerpVectors(e.origin, e.target, k)
        .addScaledVector(up, Math.sin(Math.PI * k) * 1.4);

      let stateScale = 1;
      if (this.states.selectedNodeId === id) stateScale = 1.2 + Math.sin(time * 4) * 0.05;
      else if (this.states.hoverNodeId === id) stateScale = 1.12;
      else if (trace.length > 0 && trace.indexOf(id) < 0) stateScale = 0.8;
      e.group.scale.setScalar(Math.max(0.001, easeOutBack(local)) * stateScale);
      if (!this.reducedMotion) e.model.rotation.y = Math.sin(time * 0.6 + e.phase) * 0.35;
    });

    if (!this.emerged && pending === 0 && this.layout) {
      this.emerged = true;
      this.cables.setVisible(true);
    }

    this.leaving = this.leaving.filter((l) => {
      l.t = this.reducedMotion ? 1 : l.t + dt / RETRACT_SECONDS;
      const k = easeOutCubic(Math.min(1, l.t));
      l.entry.group.position.lerpVectors(l.from, l.entry.origin, k);
      l.entry.group.scale.setScalar(Math.max(0.001, 1 - k));
      if (l.t < 1) return true;
      this.disposeEntry(l.entry);
      return false;
    });

    this.cables.update(dt, time, this.reducedMotion);
  }

  public dispose(): void {
    Object.keys(this.entries).forEach((id) => this.disposeEntry(this.entries[id]));
    this.leaving.forEach((l) => this.disposeEntry(l.entry));
    this.entries = {};
    this.leaving = [];
    this.cables.dispose();
    this.factory.dispose();
    this.plinthGeo.dispose();
  }

  private retractAll(): void {
    Object.keys(this.entries).forEach((id) => {
      const entry = this.entries[id];
      entry.group.userData.pick = undefined;
      this.leaving.push({ entry, from: entry.group.position.clone(), t: 0 });
    });
    this.entries = {};
    Object.keys(this.clusterAnchors).forEach((k) => this.group.remove(this.clusterAnchors[k]));
    this.clusterAnchors = {};
    this.cables.clear();
    this.cables.setVisible(false);
  }

  private disposeEntry(entry: NodeEntry): void {
    this.group.remove(entry.group);
    (entry.plinth.material as THREE.Material).dispose();
  }

  private applyStates(): void {
    const s = this.states;
    Object.keys(this.entries).forEach((id) => {
      const e = this.entries[id];
      let color = PLINTH.normal;
      if (s.selectedNodeId === id) color = PLINTH.selected;
      else if (s.traceNodeIds.indexOf(id) >= 0) color = PLINTH.trace;
      else if (e.node.vesselSupplied) color = PLINTH.vessel;
      else if (s.packageEquipmentIds.indexOf(e.node.equipmentId) >= 0) color = PLINTH.package;
      else if (e.node.catalog) color = PLINTH.catalog;
      (e.plinth.material as THREE.MeshBasicMaterial).color.setHex(color);
    });
    this.cables.setTrace(s.traceLinkKeys.length ? s.traceLinkKeys : null);
  }
}

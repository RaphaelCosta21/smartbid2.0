/**
 * Exploded layout: nodes are grouped into clusters (by physical location) and laid
 * out as grids on a plane facing the focus camera, clusters ordered left→right by
 * where they sit on the vessel. Also returns the camera pose that fits everything.
 */
import * as THREE from "three";

export interface LayoutItem {
  id: string;
  cluster: string;
  origin: THREE.Vector3;
}

export interface LayoutCluster {
  key: string;
  count: number;
  labelPosition: THREE.Vector3;
}

export interface ExplodeLayout {
  positions: Record<string, THREE.Vector3>;
  clusters: LayoutCluster[];
  center: THREE.Vector3;
  cameraPosition: THREE.Vector3;
  right: THREE.Vector3;
  up: THREE.Vector3;
  viewDir: THREE.Vector3;
}

export interface LayoutOptions {
  target: THREE.Vector3;
  /** Unit vector from the target towards the camera. */
  viewDir: THREE.Vector3;
  /** Extra lift of the grid above the target, in world units. */
  lift: number;
  camera: THREE.PerspectiveCamera;
  spacing?: number;
  maxRows?: number;
  gap?: number;
  /** Clusters always placed at the right end (e.g. reference-only catalog items). */
  lastClusters?: string[];
  /** Share of the camera's vertical field that is actually visible (UI may cover part of it). */
  verticalFraction?: number;
}

const WORLD_UP = new THREE.Vector3(0, 1, 0);

export function layoutExplode(items: LayoutItem[], opts: LayoutOptions): ExplodeLayout {
  const spacing = opts.spacing || 2;
  const maxRows = opts.maxRows || 4;
  const gap = opts.gap || 1.4;
  const viewDir = opts.viewDir.clone().normalize();
  const right = new THREE.Vector3().crossVectors(WORLD_UP, viewDir).normalize();
  const up = new THREE.Vector3().crossVectors(viewDir, right).normalize();

  const groups: Record<string, LayoutItem[]> = {};
  const order: string[] = [];
  items.forEach((item) => {
    if (!groups[item.cluster]) {
      groups[item.cluster] = [];
      order.push(item.cluster);
    }
    groups[item.cluster].push(item);
  });
  const screenX = (key: string): number => {
    const sum = new THREE.Vector3();
    groups[key].forEach((i) => sum.add(i.origin));
    return sum.divideScalar(groups[key].length).dot(right);
  };
  const last = opts.lastClusters || [];
  const rank = (key: string): number => (last.indexOf(key) >= 0 ? 1 : 0);
  order.sort((a, b) => rank(a) - rank(b) || screenX(a) - screenX(b));

  const grids = order.map((key) => {
    const n = groups[key].length;
    const rows = Math.min(maxRows, n);
    const cols = Math.ceil(n / rows);
    return { key, n, cols, rowsUsed: Math.ceil(n / cols), width: cols * spacing };
  });
  const totalWidth = grids.reduce((s, g) => s + g.width, 0) + gap * Math.max(0, grids.length - 1);
  const maxHeight = grids.reduce((h, g) => Math.max(h, g.rowsUsed * spacing), 0);

  const center = opts.target.clone().addScaledVector(up, maxHeight / 2 + opts.lift);
  const positions: Record<string, THREE.Vector3> = {};
  const clusters: LayoutCluster[] = [];
  let x0 = -totalWidth / 2;
  grids.forEach((grid) => {
    groups[grid.key].forEach((item, i) => {
      const col = i % grid.cols;
      const row = Math.floor(i / grid.cols);
      const x = x0 + (col + 0.5) * spacing;
      const y = maxHeight / 2 - (row + 0.5) * spacing;
      positions[item.id] = center.clone().addScaledVector(right, x).addScaledVector(up, y);
    });
    clusters.push({
      key: grid.key,
      count: grid.n,
      labelPosition: center
        .clone()
        .addScaledVector(right, x0 + grid.width / 2)
        .addScaledVector(up, maxHeight / 2 + 0.35),
    });
    x0 += grid.width + gap;
  });

  const vFov = THREE.MathUtils.degToRad(opts.camera.fov);
  const tanFull = Math.tan(vFov / 2);
  const tanV = tanFull * (opts.verticalFraction || 1);
  const tanH = tanFull * opts.camera.aspect;
  const fitWidth = (totalWidth + spacing) / 2 / tanH;
  const fitHeight = (maxHeight + spacing * 1.5) / 2 / tanV;
  const distance = Math.max(fitWidth, fitHeight, 9) * 1.18;
  return {
    positions,
    clusters,
    center,
    cameraPosition: center.clone().addScaledVector(viewDir, distance),
    right,
    up,
    viewDir,
  };
}

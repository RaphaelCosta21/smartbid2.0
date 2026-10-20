import * as THREE from "three";

export const COLORS = {
  teal: 0x0097a9,
  yellow: 0xffc72c,
  green: 0x009b77,
  alert: 0xdc4405,
  ice: 0xf4fbff,
  slate: 0x7a99ac,
  steel: 0x5b7f95,
};

export const DEG = 180 / Math.PI;
export const UP = new THREE.Vector3(0, 1, 0);

/** Signed number with a fixed number of decimals ("+1.2", "-0.4"). */
export const signed = (n: number, digits = 1): string =>
  `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(digits)}`;

/**
 * Glowing translucent material. Static materials fade with the effect automatically (applyFade);
 * `dynamic` ones are driven by the effect itself (pulses) and must multiply by `k` on their own.
 */
export function glowMat(color: number, opacity: number, dynamic = false): THREE.MeshBasicMaterial {
  const m = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  m.userData.base = opacity;
  m.userData.dynamic = dynamic;
  return m;
}

export function lineMat(color: number, opacity: number, dynamic = false): THREE.LineBasicMaterial {
  const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  m.userData.base = opacity;
  m.userData.dynamic = dynamic;
  return m;
}

/** Hides the group when absent and scales the static materials' opacity by `k`. */
export function applyFade(group: THREE.Object3D, k: number): void {
  group.visible = k > 0.003;
  if (!group.visible) return;
  group.traverse((o) => {
    const mat = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
    if (!mat || Array.isArray(mat)) return;
    if (mat.userData.base !== undefined && !mat.userData.dynamic) mat.opacity = mat.userData.base * k;
  });
}

export function disposeGroup(group: THREE.Object3D): void {
  group.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!mat) return;
    (Array.isArray(mat) ? mat : [mat]).forEach((m) => {
      const map = (m as THREE.SpriteMaterial).map;
      if (map) map.dispose();
      m.dispose();
    });
  });
}

/** Small text sprite ("N" on a compass ring). */
export function labelSprite(text: string, color: string): THREE.Sprite {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.font = "bold 88px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;
    ctx.fillText(text, 64, 70);
  }
  const material = new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(canvas),
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.renderOrder = 10;
  return sprite;
}

/** Spike-shaped arrow of unit length: base at the origin, tip at +y (scale y for the length). */
export function arrowGeometry(radius = 0.2): THREE.ConeGeometry {
  const geo = new THREE.ConeGeometry(radius, 1, 10, 1, true);
  geo.translate(0, 0.5, 0);
  return geo;
}

/** Orients an object whose long axis is +y along `dir` (unit vector). */
export function orient(obj: THREE.Object3D, dir: THREE.Vector3): void {
  obj.quaternion.setFromUnitVectors(UP, dir);
}

/** Where a ray from `origin` along `dir` (pointing down) meets the seabed. */
export function hitSeabed(
  origin: THREE.Vector3,
  dir: THREE.Vector3,
  height: (x: number, z: number) => number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const down = Math.max(0.2, -dir.y);
  let s = Math.max(1, (origin.y - height(origin.x, origin.z)) / down);
  for (let i = 0; i < 4; i++) {
    const x = origin.x + dir.x * s;
    const z = origin.z + dir.z * s;
    s = Math.max(0.5, (origin.y - height(x, z)) / down);
  }
  return out.copy(origin).addScaledVector(dir, s);
}

/** Flat ring (or disc) lying on the horizontal plane. */
export function flatRing(inner: number, outer: number, color: number, opacity: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 48), glowMat(color, opacity, true));
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

/** Partial torus used as a rotation-arc gizmo; it lies in the XY plane around +z. */
export function arcGizmo(radius: number, arc: number, color: number): THREE.Mesh {
  const geo = new THREE.TorusGeometry(radius, 0.07, 6, 40, arc);
  geo.rotateZ(-arc / 2);
  return new THREE.Mesh(geo, glowMat(color, 0.85));
}

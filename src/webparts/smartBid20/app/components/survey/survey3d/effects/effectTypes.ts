/**
 * Shared contracts of the physical-signal effects of the data journey: each effect draws what a
 * sensor measures (vessel motion, echoes, pressure, ...) over the scene while its journey step
 * is shown. Effects live in the scene root, follow the moving objects every frame and fade with `k`.
 */
import * as THREE from "three";

/** Scene objects an effect may follow or move (vessel pose, ROV tilt, beacons, satellites...). */
export interface EffectContext {
  vessel: THREE.Object3D;
  rov: THREE.Object3D;
  /** GNSS antenna on the mast the satellite beams point to. */
  antennaAnchor: THREE.Object3D;
  mastAnchor: THREE.Object3D;
  hullAnchor: THREE.Object3D;
  satellites: THREE.Object3D[];
  /** Materials of the GNSS beams and photons (recoloured by the corrections effect). */
  gnssMaterials: THREE.MeshBasicMaterial[];
  beaconTops: THREE.Mesh[];
  /** USBL acoustic cone under the hull. */
  cone: THREE.Mesh;
  /** Pipelines lying on the seabed. */
  pipes: THREE.Curve<THREE.Vector3>[];
  seabedHeight: (x: number, z: number) => number;
}

export interface SceneEffect {
  group: THREE.Group;
  /**
   * `t` is the effect clock (s), `k` its presence 0..1 (fades in and out). Returns a readout line
   * for the journey card, or null.
   */
  update: (t: number, dt: number, k: number) => string | null;
  /** Writes the world point the camera should frame and returns the camera distance. */
  focus: (out: THREE.Vector3) => number;
}

export type EffectBuilder = (ctx: EffectContext) => SceneEffect;

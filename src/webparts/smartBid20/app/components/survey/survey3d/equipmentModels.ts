/**
 * Procedural equipment archetypes for the exploded spread view. Prototypes are
 * built once per (shape, muted) and cloned, so geometries/materials are shared.
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SceneShape } from "./sceneTypes";

const OII = {
  navy: 0x003b5c,
  deep: 0x00263e,
  yellow: 0xffc72c,
  slate: 0x5b7f95,
  steel: 0x7a99ac,
  teal: 0x0097a9,
  green: 0x009b77,
  orange: 0xdc4405,
  red: 0xc8102e,
  white: 0xf4fbff,
};

type Tone = "body" | "dark" | "steel" | "accent" | "screen" | "white" | "orange" | "green" | "red";

const TONES: Record<Tone, number> = {
  body: OII.navy,
  dark: OII.deep,
  steel: OII.steel,
  accent: OII.yellow,
  screen: OII.teal,
  white: OII.white,
  orange: OII.orange,
  green: OII.green,
  red: OII.red,
};

const GLOWING: Tone[] = ["screen", "green", "red"];
const TARGET_SIZE = 1.15;

export class EquipmentModelFactory {
  private materials: Record<string, THREE.Material> = {};
  private geometries: Record<string, THREE.BufferGeometry> = {};
  private prototypes: Record<string, THREE.Object3D> = {};
  private glbs: Record<string, Promise<THREE.Object3D>> = {};
  private loader = new GLTFLoader();

  public build(shape: SceneShape, muted: boolean): THREE.Object3D {
    const key = `${shape}|${muted ? 1 : 0}`;
    if (!this.prototypes[key]) {
      this.prototypes[key] = normalize(this.buildShape(shape, muted));
    }
    return this.prototypes[key].clone();
  }

  /** Resolves with a normalized clone; rejects for unsafe URLs or load errors. */
  public loadGlb(url: string): Promise<THREE.Object3D> {
    if (!/^(https:\/\/|\/)/i.test(url)) return Promise.reject(new Error("Unsafe model URL"));
    if (!this.glbs[url]) {
      this.glbs[url] = new Promise((resolve, reject) =>
        this.loader.load(url, (gltf) => resolve(normalize(gltf.scene)), undefined, reject),
      );
    }
    return this.glbs[url].then((proto) => proto.clone());
  }

  public dispose(): void {
    Object.keys(this.geometries).forEach((k) => this.geometries[k].dispose());
    Object.keys(this.materials).forEach((k) => this.materials[k].dispose());
    this.geometries = {};
    this.materials = {};
    this.prototypes = {};
  }

  private mat(tone: Tone, muted: boolean): THREE.Material {
    const key = `${tone}|${muted ? 1 : 0}`;
    if (!this.materials[key]) {
      const color = muted ? (tone === "dark" || tone === "body" ? OII.slate : OII.steel) : TONES[tone];
      const glowing = !muted && GLOWING.indexOf(tone) >= 0;
      this.materials[key] = new THREE.MeshStandardMaterial({
        color,
        roughness: tone === "steel" || tone === "white" ? 0.35 : 0.55,
        metalness: tone === "steel" ? 0.55 : 0.15,
        emissive: glowing ? new THREE.Color(color) : new THREE.Color(0x000000),
        emissiveIntensity: glowing ? 0.65 : 0,
      });
    }
    return this.materials[key];
  }

  private geo(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
    if (!this.geometries[key]) this.geometries[key] = make();
    return this.geometries[key];
  }

  private buildShape(shape: SceneShape, muted: boolean): THREE.Group {
    const g = new THREE.Group();
    const m = (tone: Tone): THREE.Material => this.mat(tone, muted);
    const box = (w: number, h: number, d: number, tone: Tone, x = 0, y = 0, z = 0): THREE.Mesh => {
      const mesh = new THREE.Mesh(this.geo(`b${w}|${h}|${d}`, () => new THREE.BoxGeometry(w, h, d)), m(tone));
      mesh.position.set(x, y, z);
      g.add(mesh);
      return mesh;
    };
    const cyl = (r: number, h: number, tone: Tone, x = 0, y = 0, z = 0, r2 = r): THREE.Mesh => {
      const mesh = new THREE.Mesh(
        this.geo(`c${r}|${r2}|${h}`, () => new THREE.CylinderGeometry(r, r2, h, 24)),
        m(tone),
      );
      mesh.position.set(x, y, z);
      g.add(mesh);
      return mesh;
    };
    const sphere = (r: number, tone: Tone, x = 0, y = 0, z = 0): THREE.Mesh => {
      const mesh = new THREE.Mesh(this.geo(`s${r}`, () => new THREE.SphereGeometry(r, 20, 16)), m(tone));
      mesh.position.set(x, y, z);
      g.add(mesh);
      return mesh;
    };
    const torus = (r: number, t: number, tone: Tone, x = 0, y = 0, z = 0): THREE.Mesh => {
      const mesh = new THREE.Mesh(this.geo(`t${r}|${t}`, () => new THREE.TorusGeometry(r, t, 12, 36)), m(tone));
      mesh.position.set(x, y, z);
      g.add(mesh);
      return mesh;
    };
    const leds = (count: number, w: number, y: number, z: number, tone: Tone): void => {
      for (let i = 0; i < count; i++) {
        box(0.05, 0.04, 0.02, tone, -w / 2 + (i + 0.5) * (w / count), y, z);
      }
    };

    switch (shape) {
      case "monitor": {
        box(1.3, 0.8, 0.07, "dark", 0, 0.25);
        box(1.18, 0.68, 0.02, "screen", 0, 0.25, 0.04);
        box(0.12, 0.35, 0.08, "steel", 0, -0.3);
        box(0.55, 0.05, 0.3, "steel", 0, -0.48);
        break;
      }
      case "workstation": {
        box(0.42, 0.95, 0.85, "dark", -0.45, 0);
        box(0.3, 0.04, 0.02, "screen", -0.45, 0.3, 0.43);
        leds(2, 0.2, 0.38, 0.43, "green");
        box(0.9, 0.55, 0.05, "dark", 0.35, 0.15);
        box(0.8, 0.46, 0.02, "screen", 0.35, 0.15, 0.03);
        box(0.08, 0.25, 0.06, "steel", 0.35, -0.25);
        box(0.4, 0.04, 0.25, "steel", 0.35, -0.38);
        break;
      }
      case "rack": {
        box(0.8, 1.5, 0.7, "dark");
        for (let i = 0; i < 5; i++) {
          box(0.7, 0.18, 0.02, "body", 0, 0.52 - i * 0.26, 0.36);
          leds(3, 0.3, 0.52 - i * 0.26, 0.375, i % 2 ? "green" : "screen");
        }
        box(0.82, 0.05, 0.72, "steel", 0, 0.77);
        break;
      }
      case "switch": {
        box(1.4, 0.2, 0.6, "steel");
        box(1.3, 0.12, 0.02, "dark", 0, 0, 0.31);
        leds(12, 1.2, 0, 0.325, "screen");
        box(1.4, 0.2, 0.6, "dark", 0, -0.24);
        break;
      }
      case "serial-box": {
        box(0.75, 0.3, 0.5, "body");
        box(0.65, 0.04, 0.02, "steel", 0, 0.08, 0.26);
        leds(4, 0.4, -0.05, 0.26, "accent");
        break;
      }
      case "receiver": {
        box(1.0, 0.35, 0.65, "body");
        box(0.4, 0.18, 0.02, "screen", -0.2, 0.02, 0.33);
        leds(3, 0.25, 0.02, 0.33, "green");
        box(1.02, 0.04, 0.67, "accent", 0, 0.19);
        break;
      }
      case "gnss-dome": {
        cyl(0.05, 0.7, "steel", 0, -0.2);
        cyl(0.32, 0.12, "dark", 0, 0.18);
        const dome = sphere(0.32, "white", 0, 0.24);
        dome.scale.set(1, 0.6, 1);
        break;
      }
      case "whip-antenna": {
        cyl(0.16, 0.18, "dark", 0, -0.55);
        cyl(0.025, 1.2, "white", 0, 0.1, 0, 0.04);
        sphere(0.06, "accent", 0, 0.72);
        break;
      }
      case "panel-antenna": {
        cyl(0.05, 0.9, "steel", 0, -0.2);
        box(0.45, 0.85, 0.1, "white", 0, 0.25, 0.08);
        box(0.3, 0.6, 0.02, "steel", 0, 0.25, 0.14);
        break;
      }
      case "radio": {
        box(0.85, 0.38, 0.6, "dark");
        box(0.35, 0.16, 0.02, "screen", -0.15, 0.03, 0.31);
        const knob = cyl(0.06, 0.06, "accent", 0.25, 0.03, 0.33);
        knob.rotation.x = Math.PI / 2;
        cyl(0.02, 0.6, "steel", 0.3, 0.48);
        break;
      }
      case "ups": {
        box(0.6, 0.95, 0.75, "dark");
        box(0.3, 0.14, 0.02, "accent", 0, 0.25, 0.38);
        leds(3, 0.25, 0.08, 0.38, "green");
        break;
      }
      case "printer": {
        box(0.95, 0.42, 0.65, "steel");
        box(0.7, 0.04, 0.4, "white", 0, 0.24, -0.05);
        box(0.6, 0.06, 0.25, "white", 0, -0.1, 0.42);
        box(0.2, 0.06, 0.02, "screen", 0.3, 0.1, 0.33);
        break;
      }
      case "gyro": {
        cyl(0.4, 0.55, "steel");
        cyl(0.42, 0.08, "accent", 0, 0.3);
        cyl(0.42, 0.08, "dark", 0, -0.3);
        torus(0.4, 0.03, "screen", 0, 0, 0).rotation.x = Math.PI / 2;
        break;
      }
      case "probe": {
        const body = cyl(0.13, 0.95, "steel");
        body.rotation.z = Math.PI / 2;
        const cap = cyl(0.15, 0.12, "accent", 0.5, 0);
        cap.rotation.z = Math.PI / 2;
        const tip = cyl(0.08, 0.1, "screen", -0.53, 0);
        tip.rotation.z = Math.PI / 2;
        break;
      }
      case "subsea-bottle": {
        const body = cyl(0.27, 1.15, "steel");
        body.rotation.z = Math.PI / 2;
        [-0.6, 0.6].forEach((x) => {
          const cap = cyl(0.3, 0.1, "accent", x, 0);
          cap.rotation.z = Math.PI / 2;
        });
        [-0.2, 0.2].forEach((x) => {
          const band = cyl(0.285, 0.05, "dark", x, 0);
          band.rotation.z = Math.PI / 2;
        });
        break;
      }
      case "sonar-head": {
        [-0.32, 0.32].forEach((x) => {
          cyl(0.28, 0.32, "dark", x, 0);
          cyl(0.24, 0.02, "screen", x, -0.17);
        });
        box(1.2, 0.08, 0.2, "accent", 0, 0.2);
        break;
      }
      case "camera": {
        const body = cyl(0.16, 0.55, "dark");
        body.rotation.x = Math.PI / 2;
        const lens = cyl(0.11, 0.03, "screen", 0, 0, 0.29);
        lens.rotation.x = Math.PI / 2;
        box(0.08, 0.3, 0.08, "steel", 0, -0.3);
        box(0.5, 0.05, 0.3, "steel", 0, -0.45);
        break;
      }
      case "laser": {
        const body = cyl(0.1, 0.55, "steel");
        body.rotation.z = Math.PI / 2;
        const beam = cyl(0.015, 0.7, "green", -0.62, 0, 0, 0.04);
        beam.rotation.z = Math.PI / 2;
        box(0.12, 0.25, 0.12, "dark", 0.1, -0.2);
        break;
      }
      case "coil-frame": {
        box(1.3, 0.06, 0.06, "orange", 0, 0.3);
        box(1.3, 0.06, 0.06, "orange", 0, -0.3);
        box(0.06, 0.66, 0.06, "orange", -0.65, 0);
        box(0.06, 0.66, 0.06, "orange", 0.65, 0);
        [-0.4, 0, 0.4].forEach((x) => torus(0.17, 0.035, "accent", x, 0));
        break;
      }
      case "transponder": {
        cyl(0.17, 0.9, "accent");
        cyl(0.2, 0.14, "dark", 0, -0.5);
        sphere(0.14, "screen", 0, 0.5);
        torus(0.19, 0.025, "dark", 0, 0.15).rotation.x = Math.PI / 2;
        break;
      }
      case "fibre-reel": {
        torus(0.42, 0.13, "screen");
        cyl(0.18, 0.3, "dark").rotation.x = Math.PI / 2;
        [-0.16, 0.16].forEach((z) => {
          const flange = cyl(0.58, 0.03, "steel", 0, 0, z);
          flange.rotation.x = Math.PI / 2;
        });
        break;
      }
      case "network-cloud": {
        sphere(0.3, "white", 0, 0.05);
        sphere(0.22, "white", -0.32, -0.05);
        sphere(0.24, "white", 0.32, -0.03);
        torus(0.5, 0.025, "screen", 0, 0, 0).rotation.x = Math.PI / 2;
        break;
      }
      case "portal": {
        // Two crossed rings read as a gateway from any angle.
        torus(0.5, 0.05, "accent");
        torus(0.5, 0.05, "accent").rotation.y = Math.PI / 2;
        sphere(0.2, "screen");
        break;
      }
      case "system-core":
      default: {
        const shell = new THREE.Mesh(
          this.geo("ico", () => new THREE.IcosahedronGeometry(0.55, 0)),
          m("screen"),
        );
        shell.scale.setScalar(0.9);
        g.add(shell);
        sphere(0.25, "accent");
        torus(0.68, 0.03, "accent").rotation.x = Math.PI / 2.4;
        break;
      }
    }
    return g;
  }
}

/** Scales an object to TARGET_SIZE and centers it on the origin. */
function normalize(obj: THREE.Object3D): THREE.Object3D {
  const wrapper = new THREE.Group();
  wrapper.add(obj);
  const bounds = new THREE.Box3().setFromObject(obj);
  const size = bounds.getSize(new THREE.Vector3());
  const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z, 0.001);
  obj.scale.multiplyScalar(scale);
  const center = bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale);
  obj.position.sub(center);
  return wrapper;
}

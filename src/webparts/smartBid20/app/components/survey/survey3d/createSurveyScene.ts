/**
 * Survey System 3D scene (vanilla three.js — @react-three/fiber needs React 18).
 * Imported only through the lazy "survey-3d" chunk.
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { SurveySceneAnchor } from "../../../models";
import { FocusController } from "./focusController";
import { layoutExplode } from "./explodeLayout";
import { TrunkNetwork } from "./trunkFlow";
import {
  SceneFocus,
  SceneNodeStates,
  ScenePick,
  SceneTrunk,
  SceneZone,
  CATALOG_CLUSTER,
  PORTAL_CLUSTER,
} from "./sceneTypes";

// WebGL can't read CSS custom properties; OII palette mirrored here (light fog/white stay neutral).
const PALETTE = {
  fog: 0x00263e,
  water: 0x0097a9,
  seabed: 0x5b7f95,
  hull: 0x003b5c,
  bootTop: 0xc8102e,
  deck: 0x7a99ac,
  superstructure: 0xf4fbff,
  windows: 0x00263e,
  helideck: 0x009b77,
  yellow: 0xffc72c,
  satellite: 0xffc72c,
  solar: 0x00263e,
  acoustic: 0x0097a9,
  dark: 0x00263e,
  manifold: 0xdc4405,
  pipeline: 0xffc72c,
  steel: 0x7a99ac,
};

const SEABED_Y = -16;
const DIORAMA_RADIUS = 40;
/** Overview vessel is enlarged so its rooms sit further apart; it shrinks back while a room is open. */
const VESSEL_SCALE = { overview: 1.7, focus: 1 };
/** Rooms of the one-line diagram that live on the vessel; a click on the hull picks the nearest. */
const VESSEL_ROOMS: SurveySceneAnchor[] = ["mast", "bridge", "survey-online", "rov-control", "vessel-hull"];

export interface SurveySceneApi {
  /** Keys: an anchor, "zone:<id>", "node:<id>" or "cluster:<key>". */
  setLabel: (key: string, el: HTMLElement | null) => void;
  setZones: (zones: SceneZone[]) => void;
  /** Room-to-room cable arcs drawn in the overview. */
  setTrunks: (trunks: SceneTrunk[]) => void;
  /** Pixels at the top of the canvas covered by UI; the scene is centred in the area below. */
  setViewInset: (top: number) => void;
  setFocus: (focus: SceneFocus | null) => void;
  setNodeStates: (states: SceneNodeStates) => void;
  dispose: () => void;
}

export interface SurveySceneOptions {
  reducedMotion: boolean;
  vesselModelUrl: string;
  onPick: (pick: ScenePick) => void;
  /** What is under the pointer (node, cable, room or anchor); null when nothing. */
  onHover: (pick: ScenePick | null) => void;
  /** Any pointer press on the canvas (used to interrupt the guided tour). */
  onInteract: () => void;
}

export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

const std = (color: number, extra?: THREE.MeshStandardMaterialParameters) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1, ...extra });

const glow = (color: number, opacity: number): THREE.MeshBasicMaterial =>
  new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

const box = (
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh => {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  return m;
};

function buildProceduralVessel(): THREE.Group {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(-6, -1.3);
  shape.lineTo(3.8, -1.3);
  shape.quadraticCurveTo(6.4, -0.9, 6.6, 0);
  shape.quadraticCurveTo(6.4, 0.9, 3.8, 1.3);
  shape.lineTo(-6, 1.3);
  shape.lineTo(-6, -1.3);

  const hullGeo = new THREE.ExtrudeGeometry(shape, { depth: 1.7, bevelEnabled: false });
  hullGeo.rotateX(-Math.PI / 2);
  const hull = new THREE.Mesh(hullGeo, [std(PALETTE.deck), std(PALETTE.hull)]);
  hull.position.y = -0.9;
  g.add(hull);

  const bootGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.22, bevelEnabled: false });
  bootGeo.rotateX(-Math.PI / 2);
  bootGeo.scale(1.004, 1, 1.02);
  const boot = new THREE.Mesh(bootGeo, std(PALETTE.bootTop));
  boot.position.y = -0.35;
  g.add(boot);

  const white = std(PALETTE.superstructure, { roughness: 0.4 });
  g.add(box(2.6, 1.4, 2.3, white, 2.8, 1.5, 0));
  g.add(box(2.0, 1.0, 2.0, white, 3.0, 2.7, 0));
  g.add(box(0.05, 0.35, 1.8, std(PALETTE.windows, { roughness: 0.2 }), 4.03, 2.8, 0));

  const heli = new THREE.Mesh(
    new THREE.CylinderGeometry(1.6, 1.6, 0.12, 8),
    std(PALETTE.helideck),
  );
  heli.position.set(4.9, 3.4, 0);
  g.add(heli);
  g.add(box(0.2, 0.2, 0.2, std(PALETTE.steel), 4.9, 3.1, 0));

  const yellow = std(PALETTE.yellow, { roughness: 0.45 });
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.38, 1.4, 16), yellow);
  pedestal.position.set(-2.8, 1.5, 0.7);
  g.add(pedestal);
  const boom = box(5.2, 0.28, 0.28, yellow, -0.6, 3.0, 0.7);
  boom.rotation.z = 0.55;
  g.add(boom);

  g.add(box(0.25, 2.4, 0.25, yellow, -5.6, 2.0, 1.0));
  g.add(box(0.25, 2.4, 0.25, yellow, -5.6, 2.0, -1.0));
  g.add(box(0.3, 0.3, 2.3, yellow, -5.6, 3.2, 0));

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.3, 8), std(PALETTE.steel));
  mast.position.set(3.1, 3.85, 0.6);
  g.add(mast);

  // Survey online and ROV control containers on the aft deck
  const containerMat = std(PALETTE.dark, { roughness: 0.5 });
  const stripeMat = std(PALETTE.acoustic, { roughness: 0.4 });
  [-1.4, -3.4].forEach((x) => {
    g.add(box(1.7, 0.9, 1.0, containerMat, x, 1.25, -0.75));
    g.add(box(1.72, 0.1, 1.02, stripeMat, x, 1.5, -0.75));
  });
  return g;
}

function buildSatellite(): THREE.Group {
  const g = new THREE.Group();
  g.add(box(1.4, 1.1, 1.1, std(PALETTE.satellite, { metalness: 0.7, roughness: 0.3 }), 0, 0, 0));
  const panel = std(PALETTE.solar, { metalness: 0.6, roughness: 0.25 });
  g.add(box(3.4, 0.06, 1.2, panel, 2.5, 0, 0));
  g.add(box(3.4, 0.06, 1.2, panel, -2.5, 0, 0));
  const dish = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 0.4, 20, 1, true),
    std(PALETTE.superstructure, { side: THREE.DoubleSide }),
  );
  dish.position.y = -0.75;
  g.add(dish);
  return g;
}

function buildRov(): THREE.Group {
  const g = new THREE.Group();
  g.add(box(1.8, 0.5, 1.2, std(PALETTE.yellow, { roughness: 0.4 }), 0, 0.3, 0));
  g.add(box(1.9, 0.5, 1.25, std(PALETTE.dark), 0, -0.2, 0));
  const thruster = std(PALETTE.steel);
  [-0.7, 0.7].forEach((x) =>
    [-0.7, 0.7].forEach((z) => {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 12), thruster);
      t.rotation.z = Math.PI / 2;
      t.position.set(x, -0.1, z);
      g.add(t);
    }),
  );
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), glow(0xffffff, 0.9));
  lamp.position.set(0.98, -0.1, 0);
  g.add(lamp);
  return g;
}

function buildManifold(): THREE.Group {
  const g = new THREE.Group();
  const orange = std(PALETTE.manifold, { roughness: 0.5 });
  g.add(box(4.2, 0.35, 3.0, std(PALETTE.steel), 0, 0.17, 0));
  [-1.8, 1.8].forEach((x) =>
    [-1.2, 1.2].forEach((z) => g.add(box(0.2, 1.6, 0.2, orange, x, 1.1, z))),
  );
  g.add(box(4.0, 0.2, 0.2, orange, 0, 1.9, 1.2));
  g.add(box(4.0, 0.2, 0.2, orange, 0, 1.9, -1.2));
  const header = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 3.4, 14), std(PALETTE.yellow));
  header.rotation.z = Math.PI / 2;
  header.position.y = 0.8;
  g.add(header);
  return g;
}

function seabedHeight(x: number, z: number): number {
  return (
    SEABED_Y +
    Math.sin(x * 0.09) * Math.cos(z * 0.11) * 0.9 +
    Math.sin(x * 0.33 + z * 0.21) * 0.25
  );
}

export function createSurveyScene(
  container: HTMLElement,
  opts: SurveySceneOptions,
): SurveySceneApi {
  let width = container.clientWidth || 800;
  let height = container.clientHeight || 520;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  // Transparent background: the page's glass box and ocean photo show through.
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(PALETTE.fog, 80, 180);

  const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 400);
  camera.position.set(46, 22, 54);
  let insetTop = 0;
  // Render a taller virtual frame and show its lower part, so the centre sits below the inset.
  const applyView = (): void => {
    const fullHeight = height + insetTop;
    camera.aspect = width / fullHeight;
    if (insetTop > 0) camera.setViewOffset(width, fullHeight, 0, 0, width, height);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, -5, 0);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = true;
  controls.screenSpacePanning = true;
  controls.panSpeed = 0.9;
  controls.minDistance = 26;
  controls.maxDistance = 110;
  controls.maxPolarAngle = Math.PI * 0.62;
  controls.autoRotate = !opts.reducedMotion;
  controls.autoRotateSpeed = 0.3;
  const stopAutoRotate = (): void => {
    controls.autoRotate = false;
  };
  controls.addEventListener("start", stopAutoRotate);

  scene.add(new THREE.HemisphereLight(0xcfeeff, 0x0b2a44, 1.3));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(20, 40, 15);
  scene.add(sun);
  const subseaLight = new THREE.PointLight(PALETTE.acoustic, 80, 45, 2);
  subseaLight.position.set(0, -9, 0);
  scene.add(subseaLight);

  // Ocean surface (circular diorama)
  const waterGeo = new THREE.RingGeometry(0, DIORAMA_RADIUS, 96, 28);
  waterGeo.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(
    waterGeo,
    std(PALETTE.water, {
      transparent: true,
      opacity: 0.45,
      roughness: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  scene.add(water);
  const waterPos = waterGeo.attributes.position as THREE.BufferAttribute;

  // Seabed
  const bedGeo = new THREE.RingGeometry(0, DIORAMA_RADIUS, 96, 24);
  bedGeo.rotateX(-Math.PI / 2);
  const bedPos = bedGeo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < bedPos.count; i++) {
    bedPos.setY(i, seabedHeight(bedPos.getX(i), bedPos.getZ(i)));
  }
  bedGeo.computeVertexNormals();
  scene.add(new THREE.Mesh(bedGeo, std(PALETTE.seabed, { roughness: 1, flatShading: true })));

  // Water column wall + cyan rims give the cut-away diorama look
  const column = new THREE.Mesh(
    new THREE.CylinderGeometry(DIORAMA_RADIUS, DIORAMA_RADIUS, -SEABED_Y, 96, 1, true),
    new THREE.MeshBasicMaterial({
      color: PALETTE.water,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  column.position.y = SEABED_Y / 2;
  scene.add(column);
  [0.05, SEABED_Y + 0.3].forEach((y) => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * DIORAMA_RADIUS, y, Math.sin(a) * DIORAMA_RADIUS));
    }
    scene.add(
      new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.LineBasicMaterial({ color: PALETTE.acoustic, transparent: true, opacity: 0.7 }),
      ),
    );
  });

  // Vessel (procedural until the GLB loads)
  const vessel = new THREE.Group();
  let vesselScale = VESSEL_SCALE.overview;
  let vesselScaleGoal = VESSEL_SCALE.overview;
  vessel.scale.setScalar(vesselScale);
  let vesselModel: THREE.Object3D = buildProceduralVessel();
  vessel.add(vesselModel);
  scene.add(vessel);
  const cnavAnchor = new THREE.Object3D();
  cnavAnchor.position.set(3.1, 4.6, 0.6);
  vessel.add(cnavAnchor);
  const hullAnchor = new THREE.Object3D();
  hullAnchor.position.set(0.5, -1.2, 0);
  vessel.add(hullAnchor);

  // Rooms of the one-line diagram on the vessel (equipment emerges from here)
  const roomAnchor = (x: number, y: number, z: number): THREE.Object3D => {
    const o = new THREE.Object3D();
    o.position.set(x, y, z);
    vessel.add(o);
    return o;
  };
  const mastAnchor = roomAnchor(2.6, 4.9, -0.6);
  const bridgeAnchor = roomAnchor(4.1, 2.8, 0.9);
  const surveyRoomAnchor = roomAnchor(-1.4, 1.9, -0.75);
  const rovControlAnchor = roomAnchor(-3.4, 1.9, -0.75);
  vessel.userData.pick = { type: "anchor", anchor: "vessel" };
  const vesselOrbAnchor = roomAnchor(0, 7.6, 0);

  let disposed = false;
  new GLTFLoader().load(
    opts.vesselModelUrl,
    (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const scale = 13 / Math.max(size.x, size.z, 0.001);
      model.scale.setScalar(scale);
      const center = bounds.getCenter(new THREE.Vector3()).multiplyScalar(scale);
      model.position.set(-center.x, -bounds.min.y * scale - size.y * scale * 0.18, -center.z);
      vessel.remove(vesselModel);
      disposeObject(vesselModel);
      vesselModel = model;
      vessel.add(model);
    },
    undefined,
    () => {
      /* no GLB uploaded yet — keep the procedural vessel */
    },
  );

  // GNSS satellite + beam
  const satellite = buildSatellite();
  satellite.position.set(18, 24, -16);
  scene.add(satellite);
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1, 8, 1, true), glow(PALETTE.acoustic, 0.55));
  scene.add(beam);
  const photons: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 12), glow(PALETTE.acoustic, 0.95));
    photons.push(p);
    scene.add(p);
  }

  // USBL acoustic cone + ping rings
  const cone = new THREE.Mesh(new THREE.ConeGeometry(6.5, 14, 48, 1, true), glow(PALETTE.acoustic, 0.13));
  cone.position.y = -8.2;
  scene.add(cone);
  const rings: THREE.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 64), glow(PALETTE.acoustic, 0.6));
    ring.rotation.x = -Math.PI / 2;
    rings.push(ring);
    scene.add(ring);
  }

  // Seabed assets
  const manifold = buildManifold();
  manifold.position.set(-2, seabedHeight(-2, 3), 3);
  scene.add(manifold);
  const targetAnchor = new THREE.Object3D();
  targetAnchor.position.set(0, 2.4, 0);
  manifold.add(targetAnchor);

  const pipeMat = std(PALETTE.pipeline, { roughness: 0.5 });
  [
    [new THREE.Vector3(-4, 0, 3), new THREE.Vector3(-14, 0, 8), new THREE.Vector3(-26, 0, 5), new THREE.Vector3(-37, 0, 12)],
    [new THREE.Vector3(0, 0, 3), new THREE.Vector3(10, 0, 10), new THREE.Vector3(22, 0, 7), new THREE.Vector3(34, 0, 16)],
  ].forEach((pts) => {
    pts.forEach((p) => (p.y = seabedHeight(p.x, p.z) + 0.15));
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.14, 8, false),
      pipeMat,
    );
    scene.add(tube);
  });

  const beacons: THREE.Group[] = [];
  const beaconTops: THREE.Mesh[] = [];
  [
    [-8, 6],
    [7, 8],
    [1, -8],
  ].forEach(([x, z]) => {
    const b = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 1.3, 14), std(PALETTE.steel));
    body.position.y = 0.65;
    b.add(body);
    const top = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 14, 14),
      std(PALETTE.yellow, { emissive: new THREE.Color(PALETTE.yellow), emissiveIntensity: 0.6 }),
    );
    top.position.y = 1.45;
    b.add(top);
    b.position.set(x, seabedHeight(x, z), z);
    beacons.push(b);
    beaconTops.push(top);
    scene.add(b);
  });
  const seabedAnchor = new THREE.Object3D();
  seabedAnchor.position.set(10, seabedHeight(10, -4) + 0.5, -4);
  scene.add(seabedAnchor);

  // ROV, tether and LBL range lines
  const rov = buildRov();
  rov.userData.pick = { type: "anchor", anchor: "rov" };
  scene.add(rov);
  const rovOrbAnchor = new THREE.Object3D();
  rovOrbAnchor.position.set(0, 2.6, 0);
  rov.add(rovOrbAnchor);
  const TETHER_POINTS = 28;
  const tetherGeo = new THREE.BufferGeometry().setFromPoints(
    new Array(TETHER_POINTS).fill(0).map(() => new THREE.Vector3()),
  );
  const tether = new THREE.Line(tetherGeo, new THREE.LineBasicMaterial({ color: PALETTE.yellow }));
  tether.userData.pick = { type: "anchor", anchor: "umbilical" };
  scene.add(tether);
  const umbilicalAnchor = new THREE.Object3D();
  scene.add(umbilicalAnchor);
  const tetherCurve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(),
    new THREE.Vector3(),
    new THREE.Vector3(),
  );
  const tetherPoint = new THREE.Vector3();
  const rangeLines = beacons.map(() => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const line = new THREE.Line(
      geo,
      new THREE.LineDashedMaterial({ color: PALETTE.acoustic, dashSize: 0.5, gapSize: 0.35, transparent: true, opacity: 0.8 }),
    );
    scene.add(line);
    return line;
  });

  const anchors: Record<SurveySceneAnchor, THREE.Object3D> = {
    gnss: satellite,
    vessel: cnavAnchor,
    mast: mastAnchor,
    bridge: bridgeAnchor,
    "survey-online": surveyRoomAnchor,
    "rov-control": rovControlAnchor,
    "vessel-hull": hullAnchor,
    umbilical: umbilicalAnchor,
    rov,
    beacons: beacons[0],
    seabed: seabedAnchor,
    "subsea-target": targetAnchor,
  };
  const labels: Record<string, HTMLElement> = {};

  const tmpA = new THREE.Vector3();
  const tmpB = new THREE.Vector3();
  const tmpC = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const clock = new THREE.Clock();
  let time = 0;
  let rovTime = 0;
  let rovFrozen = false;
  let frame = 0;

  // Zone labels (text only) float above the vessel, the ROV and the umbilical midpoint
  let zoneAnchors: { zone: SceneZone; follow: THREE.Object3D }[] = [];
  const zoneFollow = (anchor: SurveySceneAnchor): THREE.Object3D =>
    anchor === "vessel" ? vesselOrbAnchor : anchor === "rov" ? rovOrbAnchor : anchors[anchor];

  // Zone focus (exploded equipment + cables)
  const focusCtl = new FocusController(opts.reducedMotion);
  scene.add(focusCtl.group);
  const trunks = new TrunkNetwork((anchor) => anchors[anchor] || null);
  scene.add(trunks.group);
  let focusZoneId: string | null = null;
  let focusSignature = "";
  const HOME_POSITION = camera.position.clone();
  const HOME_TARGET = controls.target.clone();
  const HOME_MIN_DISTANCE = controls.minDistance;
  let tween: {
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    k: number;
  } | null = null;
  const flyTo = (position: THREE.Vector3, target: THREE.Vector3): void => {
    controls.autoRotate = false;
    if (opts.reducedMotion) {
      camera.position.copy(position);
      controls.target.copy(target);
      tween = null;
      return;
    }
    tween = {
      fromPos: camera.position.clone(),
      toPos: position.clone(),
      fromTarget: controls.target.clone(),
      toTarget: target.clone(),
      k: 0,
    };
    controls.enabled = false;
  };
  const easeInOutCubic = (k: number): number =>
    k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

  const labelTarget = (key: string): THREE.Object3D | null => {
    if (key.indexOf("zone:") === 0) {
      if (focusZoneId) return null;
      const z = zoneAnchors.find((a) => a.zone.id === key.slice(5));
      return z ? z.follow : null;
    }
    if (key.indexOf("node:") === 0 || key.indexOf("cluster:") === 0) {
      return focusCtl.getLabelTarget(key);
    }
    return anchors[key as SurveySceneAnchor] || null;
  };

  const updateLabels = (): void => {
    Object.keys(labels).forEach((key) => {
      const el = labels[key];
      const target = labelTarget(key);
      if (!target) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        return;
      }
      target.getWorldPosition(tmpA);
      tmpA.project(camera);
      const visible = tmpA.z < 1 && Math.abs(tmpA.x) < 1.1 && Math.abs(tmpA.y) < 1.1;
      el.style.opacity = visible ? "1" : "0";
      el.style.visibility = visible ? "" : "hidden";
      const x = ((tmpA.x + 1) / 2) * width;
      const y = ((1 - tmpA.y) / 2) * height;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
  };

  // Picking: click (not drag) on the vessel rooms, ROV, umbilical, trunks, nodes or cables
  const raycaster = new THREE.Raycaster();
  raycaster.params.Line = { threshold: 0.6 };
  const pointer = new THREE.Vector2();
  const roomPos = new THREE.Vector3();
  const isShown = (obj: THREE.Object3D | null): boolean => {
    for (let o = obj; o; o = o.parent) if (!o.visible) return false;
    return true;
  };
  /** Nearest vessel room zone to a point on the hull (rooms are only a few metres apart). */
  const nearestRoom = (point: THREE.Vector3): string | null => {
    let best: string | null = null;
    let bestDist = Infinity;
    zoneAnchors.forEach((z) => {
      if (VESSEL_ROOMS.indexOf(z.zone.anchor) < 0) return;
      const d = z.follow.getWorldPosition(roomPos).distanceToSquared(point);
      if (d < bestDist) {
        bestDist = d;
        best = z.zone.id;
      }
    });
    return best;
  };
  const pickAt = (clientX: number, clientY: number): ScenePick | null => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(pointer, camera);
    // The tether is rewritten every frame, so its cached bounds go stale.
    tetherGeo.computeBoundingSphere();
    const roots: THREE.Object3D[] = [focusCtl.group, trunks.group, vessel, rov, tether];
    const hits = raycaster.intersectObjects(roots, true);
    for (let i = 0; i < hits.length; i++) {
      let o: THREE.Object3D | null = hits[i].object;
      while (o && !o.userData.pick) o = o.parent;
      if (!o || !isShown(o)) continue;
      const pick = o.userData.pick as ScenePick;
      if (o === vessel) {
        const zoneId = nearestRoom(hits[i].point);
        if (zoneId) return { type: "zone", zoneId };
      }
      return pick;
    }
    return null;
  };
  const pickKey = (pick: ScenePick | null): string =>
    !pick
      ? ""
      : pick.type === "node"
        ? `n:${pick.nodeId}`
        : pick.type === "zone"
          ? `z:${pick.zoneId}`
          : pick.type === "cable"
            ? `c:${pick.key}`
            : `a:${pick.anchor}`;
  let down = { x: 0, y: 0, at: 0 };
  let hoverKey = "";
  let hoverQueued = false;
  const setHover = (pick: ScenePick | null): void => {
    const key = pickKey(pick);
    if (key === hoverKey) return;
    hoverKey = key;
    const cable = pick && pick.type === "cable" ? pick.key : null;
    focusCtl.setCableHover(cable);
    trunks.setHover(cable);
    opts.onHover(pick);
  };
  const onPointerDown = (e: PointerEvent): void => {
    down = { x: e.clientX, y: e.clientY, at: performance.now() };
    opts.onInteract();
  };
  const onPointerUp = (e: PointerEvent): void => {
    const moved = Math.abs(e.clientX - down.x) + Math.abs(e.clientY - down.y);
    if (spaceHeld || moved > 6 || performance.now() - down.at > 600) return;
    const pick = pickAt(e.clientX, e.clientY);
    if (pick) opts.onPick(pick);
  };
  const onPointerMove = (e: PointerEvent): void => {
    if (hoverQueued || e.buttons) return;
    hoverQueued = true;
    requestAnimationFrame(() => {
      hoverQueued = false;
      if (disposed) return;
      const pick = pickAt(e.clientX, e.clientY);
      renderer.domElement.style.cursor = spaceHeld ? "move" : pick ? "pointer" : "";
      setHover(pick);
    });
  };
  const onPointerEnter = (): void => {
    pointerInside = true;
  };
  const onPointerLeave = (): void => {
    pointerInside = false;
    renderer.domElement.style.cursor = "";
    setHover(null);
  };
  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  renderer.domElement.addEventListener("pointerup", onPointerUp);
  renderer.domElement.addEventListener("pointermove", onPointerMove);
  renderer.domElement.addEventListener("pointerenter", onPointerEnter);
  renderer.domElement.addEventListener("pointerleave", onPointerLeave);

  // Keyboard navigation: only while the pointer is over the scene (or the canvas has focus)
  renderer.domElement.tabIndex = 0;
  let pointerInside = false;
  let spaceHeld = false;
  let boost = false;
  const keys: Record<string, boolean> = {};
  const NAV_CODES = ["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const BOUNDS = { radius: 46, minY: -17, maxY: 16 };
  let focusView: { position: THREE.Vector3; target: THREE.Vector3 } | null = null;

  const navActive = (): boolean =>
    pointerInside || document.activeElement === renderer.domElement;
  const isTyping = (target: EventTarget | null): boolean => {
    const el = target as HTMLElement | null;
    return !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  };
  const setPanMode = (on: boolean): void => {
    spaceHeld = on;
    controls.mouseButtons.LEFT = on ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
    renderer.domElement.style.cursor = on ? "move" : "";
  };
  const resetView = (): void => {
    if (focusView) flyTo(focusView.position, focusView.target);
    else flyTo(HOME_POSITION, HOME_TARGET);
  };
  const onKeyDown = (e: KeyboardEvent): void => {
    boost = e.shiftKey;
    if (!navActive() || isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.code === "Space") {
      e.preventDefault();
      if (!spaceHeld) setPanMode(true);
      opts.onInteract();
    } else if (e.code === "KeyR" || e.code === "Home") {
      e.preventDefault();
      resetView();
      opts.onInteract();
    } else if (NAV_CODES.indexOf(e.code) >= 0) {
      e.preventDefault();
      keys[e.code] = true;
      opts.onInteract();
    }
  };
  const onKeyUp = (e: KeyboardEvent): void => {
    boost = e.shiftKey;
    if (e.code === "Space" && spaceHeld) setPanMode(false);
    delete keys[e.code];
  };
  const onWindowBlur = (): void => {
    Object.keys(keys).forEach((k) => delete keys[k]);
    boost = false;
    if (spaceHeld) setPanMode(false);
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onWindowBlur);

  const axis = (plus: string[], minus: string[]): number =>
    (plus.some((k) => keys[k]) ? 1 : 0) - (minus.some((k) => keys[k]) ? 1 : 0);
  const moveDelta = new THREE.Vector3();
  const moveForward = new THREE.Vector3();
  const moveRight = new THREE.Vector3();
  const applyKeyboardMove = (dt: number): void => {
    const fwd = axis(["KeyW", "ArrowUp"], ["KeyS", "ArrowDown"]);
    const side = axis(["KeyD", "ArrowRight"], ["KeyA", "ArrowLeft"]);
    const vert = axis(["KeyE"], ["KeyQ"]);
    if (!fwd && !side && !vert) return;
    tween = null;
    controls.enabled = true;
    controls.autoRotate = false;
    moveForward.subVectors(controls.target, camera.position).setY(0);
    if (moveForward.lengthSq() < 1e-6) moveForward.set(0, 0, -1);
    moveForward.normalize();
    moveRight.crossVectors(moveForward, up).normalize();
    moveDelta
      .set(0, 0, 0)
      .addScaledVector(moveForward, fwd)
      .addScaledVector(moveRight, side)
      .addScaledVector(up, vert)
      .normalize();
    const speed = (4 + camera.position.distanceTo(controls.target) * 0.5) * (boost ? 2.5 : 1);
    moveDelta.multiplyScalar(speed * dt);
    camera.position.add(moveDelta);
    controls.target.add(moveDelta);
  };
  // Keeps panning / gliding inside the diorama.
  const clampTarget = (): void => {
    const target = controls.target;
    moveDelta.copy(target);
    const r = Math.hypot(target.x, target.z);
    if (r > BOUNDS.radius) {
      moveDelta.x *= BOUNDS.radius / r;
      moveDelta.z *= BOUNDS.radius / r;
    }
    moveDelta.y = THREE.MathUtils.clamp(target.y, BOUNDS.minY, BOUNDS.maxY);
    moveDelta.sub(target);
    if (moveDelta.lengthSq() > 0) {
      target.add(moveDelta);
      camera.position.add(moveDelta);
    }
  };

  const tick = (): void => {
    frame = requestAnimationFrame(tick);
    if (document.hidden) return;
    const dt = Math.min(clock.getDelta(), 0.1);
    if (!opts.reducedMotion) time += dt;
    if (!opts.reducedMotion && !rovFrozen) rovTime += dt;
    const t = time;

    for (let i = 0; i < waterPos.count; i++) {
      const x = waterPos.getX(i);
      const z = waterPos.getZ(i);
      waterPos.setY(i, Math.sin(x * 0.14 + t * 0.9) * 0.22 + Math.cos(z * 0.18 + t * 0.7) * 0.18);
    }
    waterPos.needsUpdate = true;

    vessel.position.y = Math.sin(t * 0.8) * 0.12;
    if (vesselScale !== vesselScaleGoal) {
      vesselScale = opts.reducedMotion
        ? vesselScaleGoal
        : THREE.MathUtils.damp(vesselScale, vesselScaleGoal, 3.5, dt);
      if (Math.abs(vesselScale - vesselScaleGoal) < 0.002) vesselScale = vesselScaleGoal;
      vessel.scale.setScalar(vesselScale);
    }
    vessel.rotation.z = Math.sin(t * 0.6) * 0.015;
    vessel.rotation.x = Math.cos(t * 0.5) * 0.012;

    satellite.position.y = 24 + Math.sin(t * 0.4) * 0.4;
    satellite.rotation.y = t * 0.15;

    // GNSS beam from satellite to the C-Nav antenna
    satellite.getWorldPosition(tmpA);
    cnavAnchor.getWorldPosition(tmpB);
    tmpC.subVectors(tmpB, tmpA);
    const len = tmpC.length();
    beam.position.copy(tmpA).addScaledVector(tmpC, 0.5);
    beam.scale.set(1, len, 1);
    beam.quaternion.setFromUnitVectors(up, tmpC.normalize());
    photons.forEach((p, i) => {
      const k = (t * 0.35 + i / photons.length) % 1;
      p.position.lerpVectors(tmpA, tmpB, k);
    });

    // USBL pings travelling down the cone
    hullAnchor.getWorldPosition(tmpA);
    cone.position.x = tmpA.x;
    cone.position.z = tmpA.z;
    (cone.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 2) * 0.04;
    rings.forEach((ring, i) => {
      const k = (t * 0.4 + i / rings.length) % 1;
      ring.position.set(tmpA.x, tmpA.y - k * 14, tmpA.z);
      ring.scale.setScalar(0.3 + k * 6.3);
      (ring.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - k);
    });

    beaconTops.forEach((top, i) => {
      (top.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.max(0, Math.sin(t * 3 - i * 1.3)) * 1.2;
    });

    // ROV survey pattern around the manifold (paused while the Subsea zone is open)
    const a = rovTime * 0.22;
    rov.position.set(-2 + Math.cos(a) * 5.5, -10.5 + Math.sin(rovTime * 0.7) * 0.35, 3 + Math.sin(a) * 4);
    rov.rotation.y = -a - Math.PI / 2;

    // Tether: vessel moonpool → ROV with a sagging midpoint
    tetherCurve.v0.set(-0.5, -0.9, 0);
    vessel.localToWorld(tetherCurve.v0);
    tetherCurve.v2.copy(rov.position).setY(rov.position.y + 0.6);
    tetherCurve.v1.lerpVectors(tetherCurve.v0, tetherCurve.v2, 0.5);
    tetherCurve.v1.x += 2;
    tetherCurve.v1.y -= 3;
    const tetherPos = tetherGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < TETHER_POINTS; i++) {
      tetherCurve.getPoint(i / (TETHER_POINTS - 1), tetherPoint);
      tetherPos.setXYZ(i, tetherPoint.x, tetherPoint.y, tetherPoint.z);
    }
    tetherPos.needsUpdate = true;
    tetherCurve.getPoint(0.5, umbilicalAnchor.position);

    rangeLines.forEach((line, i) => {
      const pos = line.geometry.attributes.position as THREE.BufferAttribute;
      beaconTops[i].getWorldPosition(tmpA);
      pos.setXYZ(0, rov.position.x, rov.position.y, rov.position.z);
      pos.setXYZ(1, tmpA.x, tmpA.y, tmpA.z);
      pos.needsUpdate = true;
      line.computeLineDistances();
      (line.material as THREE.LineDashedMaterial).opacity = 0.35 + Math.max(0, Math.sin(t * 3 - i * 1.3)) * 0.6;
    });

    applyKeyboardMove(dt);
    if (tween) {
      tween.k = Math.min(1, tween.k + dt / 1.4);
      const e = easeInOutCubic(tween.k);
      camera.position.lerpVectors(tween.fromPos, tween.toPos, e);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
      if (tween.k >= 1) {
        tween = null;
        controls.enabled = true;
      }
    }
    focusCtl.update(dt, time);
    trunks.update(dt, time, opts.reducedMotion);

    controls.update();
    clampTarget();
    renderer.render(scene, camera);
    updateLabels();
  };
  tick();

  const resizeObserver = new ResizeObserver(() => {
    width = container.clientWidth || width;
    height = container.clientHeight || height;
    applyView();
    renderer.setSize(width, height);
  });
  resizeObserver.observe(container);

  const ZONE_VIEW: Partial<Record<SurveySceneAnchor, { elevation: number; lift: number }>> = {
    vessel: { elevation: 0.42, lift: 3.4 },
    mast: { elevation: 0.35, lift: 4 },
    "survey-online": { elevation: 0.42, lift: 3.4 },
    bridge: { elevation: 0.35, lift: 3 },
    "rov-control": { elevation: 0.42, lift: 3 },
    // Below the keel: the grid opens under the hull, in the water column.
    "vessel-hull": { elevation: 0.12, lift: -7 },
    rov: { elevation: 0.16, lift: 1.4 },
    umbilical: { elevation: 0.22, lift: 0.6 },
  };
  const zoneTarget = (anchor: SurveySceneAnchor): THREE.Vector3 =>
    anchor === "vessel"
      ? vessel.getWorldPosition(new THREE.Vector3()).setY(1.2)
      : anchors[anchor].getWorldPosition(new THREE.Vector3());

  return {
    setLabel: (key, el) => {
      if (el) labels[key] = el;
      else delete labels[key];
    },
    setZones: (zones) => {
      zoneAnchors = zones.map((zone) => ({ zone, follow: zoneFollow(zone.anchor) }));
    },
    setTrunks: (list) => {
      trunks.build(list);
    },
    setViewInset: (top) => {
      insetTop = Math.max(0, Math.round(top));
      applyView();
    },
    setFocus: (focus) => {
      if (!focus) {
        if (!focusZoneId) return;
        focusZoneId = null;
        focusSignature = "";
        focusView = null;
        rovFrozen = false;
        focusCtl.close();
        trunks.setVisible(true);
        vesselScaleGoal = VESSEL_SCALE.overview;
        controls.minDistance = HOME_MIN_DISTANCE;
        flyTo(HOME_POSITION, HOME_TARGET);
        return;
      }
      const signature = `${focus.zoneId}|${focus.nodes
        .map((n) => `${n.id}:${n.bidState || ""}`)
        .join(",")}|${focus.links.length}`;
      if (signature === focusSignature) return;
      focusSignature = signature;
      focusZoneId = focus.zoneId;
      rovFrozen = focus.anchor === "rov";
      trunks.setVisible(false);
      vesselScaleGoal = VESSEL_SCALE.focus;
      // Lay the room out where its anchors will be once the vessel has shrunk.
      vessel.scale.setScalar(vesselScaleGoal);
      vessel.updateMatrixWorld(true);

      const view = ZONE_VIEW[focus.anchor] || { elevation: 0.25, lift: 1 };
      const target = zoneTarget(focus.anchor);
      // Keep the user's current azimuth so the fly-to feels continuous.
      const horizontal = new THREE.Vector3().subVectors(camera.position, controls.target).setY(0);
      if (horizontal.lengthSq() < 1e-4) horizontal.set(0, 0, 1);
      horizontal.normalize();
      const viewDir = new THREE.Vector3(horizontal.x, view.elevation, horizontal.z).normalize();

      const origins: Record<string, THREE.Vector3> = {};
      const items = focus.nodes.map((node) => {
        const from = (node.anchor && anchors[node.anchor]) || anchors[focus.anchor];
        const origin = from.getWorldPosition(new THREE.Vector3());
        origins[node.id] = origin;
        return { id: node.id, cluster: node.cluster, origin };
      });
      const layout = layoutExplode(items, {
        target,
        viewDir,
        lift: view.lift,
        camera,
        lastClusters: [CATALOG_CLUSTER, PORTAL_CLUSTER],
        verticalFraction: Math.max(0.3, (height - insetTop) / (height + insetTop)),
      });
      vessel.scale.setScalar(vesselScale);
      vessel.updateMatrixWorld(true);
      focusCtl.open(focus, layout, origins);
      controls.minDistance = 4;
      focusView = { position: layout.cameraPosition.clone(), target: layout.center.clone() };
      flyTo(layout.cameraPosition, layout.center);
    },
    setNodeStates: (states) => {
      focusCtl.setStates(states);
    },
    dispose: () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerenter", onPointerEnter);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onWindowBlur);
      controls.removeEventListener("start", stopAutoRotate);
      controls.dispose();
      focusCtl.dispose();
      trunks.dispose();
      disposeObject(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}

function disposeObject(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!mat) return;
    (Array.isArray(mat) ? mat : [mat]).forEach((m) => {
      Object.keys(m).forEach((k) => {
        const v = (m as any)[k];
        if (v && v.isTexture) v.dispose();
      });
      m.dispose();
    });
  });
}

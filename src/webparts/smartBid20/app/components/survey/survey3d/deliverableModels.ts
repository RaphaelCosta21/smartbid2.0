/**
 * Client deliverables as small 3D objects for the end of the data journey: a title card plus a
 * procedural miniature (report pages, DTM terrain, chart, video screen, point cloud, calibration target).
 */
import * as THREE from "three";
import type { DeliverableVisual } from "../../../config/surveyDataFormats";
import { SceneJourneyDeliverable } from "./sceneTypes";

// WebGL can't read CSS custom properties; OII palette mirrored here.
const C = {
  navy: 0x00263e,
  navyMid: 0x003b5c,
  teal: 0x0097a9,
  green: 0x009b77,
  yellow: 0xffc72c,
  orange: 0xdc4405,
  red: 0xc8102e,
  ice: 0xf4fbff,
  slate: 0x5b7f95,
  muted: 0x7a99ac,
};

const ACCENT: Record<DeliverableVisual, string> = {
  report: "#ffc72c",
  dtm: "#0097a9",
  chart: "#009b77",
  video: "#dc4405",
  points: "#7a99ac",
  calibration: "#f4fbff",
};

const CARD_W = 3.2;
const CARD_H = 1.6;
const FONT = '"Segoe UI", Arial, sans-serif';

const canvasTexture = (canvas: HTMLCanvasElement): THREE.CanvasTexture => {
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
};

const makeCanvas = (
  w: number,
  h: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  return { canvas, ctx: canvas.getContext("2d") as CanvasRenderingContext2D };
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

const wrap = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] => {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  words.forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/\s+\S*$/, "")}…`;
    return kept;
  }
  return lines;
};

function buildCard(d: SceneJourneyDeliverable): THREE.Mesh {
  const { canvas, ctx } = makeCanvas(512, 256);
  roundRect(ctx, 0, 0, 512, 256, 22);
  ctx.fillStyle = "#00263e";
  ctx.fill();
  ctx.fillStyle = ACCENT[d.visual];
  ctx.fillRect(0, 0, 512, 12);
  ctx.font = `700 34px ${FONT}`;
  ctx.fillStyle = "#f4fbff";
  wrap(ctx, d.title, 470, 3).forEach((l, i) => ctx.fillText(l, 22, 64 + i * 40));
  ctx.font = `600 24px ${FONT}`;
  ctx.fillStyle = ACCENT[d.visual];
  ctx.fillText(wrap(ctx, d.subtitle, 470, 1)[0] || "", 22, 230);
  return new THREE.Mesh(
    new THREE.PlaneGeometry(CARD_W, CARD_H),
    new THREE.MeshBasicMaterial({
      map: canvasTexture(canvas),
      transparent: true,
      side: THREE.DoubleSide,
    }),
  );
}

function buildReport(): THREE.Group {
  const g = new THREE.Group();
  const { canvas, ctx } = makeCanvas(256, 340);
  ctx.fillStyle = "#f4fbff";
  ctx.fillRect(0, 0, 256, 340);
  ctx.fillStyle = "#ffc72c";
  ctx.fillRect(20, 20, 216, 26);
  ctx.fillStyle = "#7a99ac";
  for (let i = 0; i < 9; i++) ctx.fillRect(20, 70 + i * 22, i % 3 === 2 ? 140 : 216, 8);
  ctx.strokeStyle = "#0097a9";
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 280, 90, 40);
  const front = canvasTexture(canvas);
  const pageMat = new THREE.MeshStandardMaterial({ color: C.ice, roughness: 0.8 });
  for (let i = 2; i >= 0; i--) {
    const page = new THREE.Mesh(
      new THREE.BoxGeometry(1.3, 1.7, 0.03),
      i === 0
        ? [pageMat, pageMat, pageMat, pageMat, new THREE.MeshBasicMaterial({ map: front }), pageMat]
        : pageMat,
    );
    page.position.set(i * 0.12, -i * 0.06, -i * 0.08);
    page.rotation.z = i * 0.06;
    g.add(page);
  }
  return g;
}

function buildDtm(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(2.6, 1.7, 48, 30);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const colors: number[] = [];
  const stops = [
    new THREE.Color(C.navyMid),
    new THREE.Color(C.teal),
    new THREE.Color(C.green),
    new THREE.Color(C.yellow),
  ];
  const tmp = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // Rolling seabed with a pipeline trench across it.
    const z =
      0.16 * Math.sin(x * 2.1) +
      0.12 * Math.cos(y * 3.2 + x) -
      0.22 * Math.exp(-Math.pow(y - x * 0.25, 2) * 18);
    pos.setZ(i, z);
    const k = THREE.MathUtils.clamp((z + 0.35) / 0.65, 0, 0.999) * (stops.length - 1);
    const s = Math.floor(k);
    tmp.copy(stops[s]).lerp(stops[s + 1], k - s);
    colors.push(tmp.r, tmp.g, tmp.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.7,
      side: THREE.DoubleSide,
    }),
  );
  mesh.rotation.x = -1.05;
  return mesh;
}

function buildChart(): THREE.Mesh {
  const { canvas, ctx } = makeCanvas(384, 240);
  ctx.fillStyle = "#f4fbff";
  ctx.fillRect(0, 0, 384, 240);
  ctx.strokeStyle = "#d7e2ec";
  ctx.lineWidth = 1;
  for (let x = 0; x <= 384; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 240);
    ctx.stroke();
  }
  for (let y = 0; y <= 240; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(384, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#0097a9";
  ctx.lineWidth = 2;
  for (let r = 1; r <= 5; r++) {
    ctx.beginPath();
    ctx.ellipse(190, 120, r * 34, r * 20, 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.strokeStyle = "#c8102e";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(10, 200);
  ctx.bezierCurveTo(120, 160, 240, 90, 374, 40);
  ctx.stroke();
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.5),
    new THREE.MeshBasicMaterial({ map: canvasTexture(canvas), side: THREE.DoubleSide }),
  );
  mesh.rotation.x = -0.35;
  return mesh;
}

function buildVideo(): THREE.Group {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 1.45, 0.12),
    new THREE.MeshStandardMaterial({ color: C.navy, roughness: 0.4, metalness: 0.3 }),
  );
  g.add(body);
  const { canvas, ctx } = makeCanvas(384, 224);
  const grad = ctx.createLinearGradient(0, 0, 0, 224);
  grad.addColorStop(0, "#0097a9");
  grad.addColorStop(1, "#00263e");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 384, 224);
  ctx.fillStyle = "#ffc72c";
  ctx.fillRect(40, 150, 300, 10);
  ctx.fillStyle = "rgba(244,251,255,0.9)";
  ctx.beginPath();
  ctx.moveTo(165, 70);
  ctx.lineTo(165, 140);
  ctx.lineTo(225, 105);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#c8102e";
  ctx.beginPath();
  ctx.arc(30, 26, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `700 20px ${FONT}`;
  ctx.fillText("REC", 46, 33);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 1.28),
    new THREE.MeshBasicMaterial({ map: canvasTexture(canvas) }),
  );
  screen.position.z = 0.065;
  g.add(screen);
  return g;
}

function buildPoints(): THREE.Points {
  const positions: number[] = [];
  const colors: number[] = [];
  const a = new THREE.Color(C.teal);
  const b = new THREE.Color(C.yellow);
  const tmp = new THREE.Color();
  for (let i = 0; i < 700; i++) {
    const u = Math.random();
    const x = (u - 0.5) * 2.6;
    const y = Math.sin(u * Math.PI * 1.6) * 0.35 + (Math.random() - 0.5) * 0.5;
    const z = Math.sin(x * 3) * 0.08 + (Math.random() - 0.5) * 0.05;
    positions.push(x, y, z);
    tmp.copy(a).lerp(b, (y + 0.6) / 1.2);
    colors.push(tmp.r, tmp.g, tmp.b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.06, vertexColors: true }));
  pts.rotation.x = -0.6;
  return pts;
}

function buildCalibration(): THREE.Group {
  const g = new THREE.Group();
  [0.28, 0.52, 0.76].forEach((r, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.035, 8, 48),
      new THREE.MeshStandardMaterial({ color: i === 0 ? C.orange : i === 1 ? C.ice : C.teal }),
    );
    g.add(ring);
  });
  const barMat = new THREE.MeshStandardMaterial({ color: C.ice });
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.03, 0.03), barMat));
  g.add(new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.8, 0.03), barMat));
  const dotMat = new THREE.MeshBasicMaterial({ color: C.yellow });
  for (let i = 0; i < 9; i++) {
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), dotMat);
    dot.position.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, 0.05);
    g.add(dot);
  }
  return g;
}

const MINIATURE: Record<DeliverableVisual, () => THREE.Object3D> = {
  report: buildReport,
  dtm: buildDtm,
  chart: buildChart,
  video: buildVideo,
  points: buildPoints,
  calibration: buildCalibration,
};

/** Card (title + format) with its miniature floating above; faces +z (billboarded by the caller). */
export function buildDeliverable(d: SceneJourneyDeliverable): THREE.Group {
  const g = new THREE.Group();
  g.add(buildCard(d));
  const mini = MINIATURE[d.visual]();
  mini.position.y = CARD_H / 2 + 1.05;
  mini.userData.spin = true;
  g.add(mini);
  return g;
}

export function disposeTree(root: THREE.Object3D): void {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
    if (!mat) return;
    (Array.isArray(mat) ? mat : [mat]).forEach((m) => {
      const map = (m as THREE.MeshBasicMaterial).map;
      if (map) map.dispose();
      m.dispose();
    });
  });
}

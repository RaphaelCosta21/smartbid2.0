/**
 * Spread template graph: expands zone lines into physical instances
 * (e.g. network-switch#1..#3) and walks the one-line diagram links.
 */
import {
  ISurveyCatalog,
  ISurveyEquipment,
  ISurveySpread,
  SurveyLinkKind,
  SurveySceneAnchor,
  SurveySceneShape,
} from "../models";

export interface ISpreadNode {
  /** "online-master-pc" or "network-switch#2" when the diagram distinguishes instances. */
  id: string;
  equipmentId: string;
  instance: number;
  zoneId: string;
  label: string;
  anchor: SurveySceneAnchor | "";
  qty: number;
  qtyLabel?: string;
  vesselSupplied: boolean;
  category?: string;
  /** spread = zone line, diagram = only on the links, catalog = generic catalog item shown for reference. */
  source: "spread" | "diagram" | "catalog";
}

export interface ISpreadLinkRef {
  key: string;
  from: string;
  to: string;
  kind: SurveyLinkKind;
  cable?: string;
}

export interface ISignalPath {
  nodeIds: string[];
  linkKeys: string[];
}

export const SIGNAL_HUB_ID = "online-master-pc";
/** Video sources end on the online monitors when they never reach the hub. */
const SIGNAL_FALLBACK_IDS = ["survey-online-monitors"];

const baseId = (ref: string): string => ref.split("#")[0];
const instanceOf = (ref: string): number => {
  const n = parseInt(ref.split("#")[1], 10);
  return isNaN(n) ? 0 : n;
};

export function expandSpreadNodes(
  spread: ISurveySpread,
  catalog: ISurveyCatalog,
): ISpreadNode[] {
  const byId: Record<string, ISurveyEquipment> = {};
  catalog.equipment.forEach((e) => (byId[e.id] = e));

  const instances: Record<string, number[]> = {};
  spread.links.forEach((l) =>
    [l.from, l.to].forEach((ref) => {
      const n = instanceOf(ref);
      if (!n) return;
      const list = instances[baseId(ref)] || (instances[baseId(ref)] = []);
      if (list.indexOf(n) < 0) list.push(n);
    }),
  );

  const nodes: ISpreadNode[] = [];
  const seenNode: Record<string, boolean> = {};
  const seenEq: Record<string, boolean> = {};
  // Instance numbers claimed by lines that name them explicitly (e.g. switch [2] on the bridge line).
  const claimed: Record<string, number[]> = {};
  spread.zones.forEach((zone) =>
    zone.lines.forEach((line) =>
      (line.instances || []).forEach((n) =>
        (claimed[line.equipmentId] || (claimed[line.equipmentId] = [])).push(n),
      ),
    ),
  );

  spread.zones.forEach((zone) =>
    zone.lines.forEach((line) => {
      const eq = byId[line.equipmentId];
      if (!eq) return;
      const nums = (
        line.instances
          ? line.instances.slice()
          : (instances[eq.id] || []).filter((n) => (claimed[eq.id] || []).indexOf(n) < 0)
      ).sort((a, b) => a - b);
      const common = {
        equipmentId: eq.id,
        zoneId: zone.id,
        anchor: zone.sceneAnchor || eq.sceneAnchor,
        qtyLabel: line.qtyLabel,
        vesselSupplied: !!line.vesselSupplied,
        category: line.category,
        source: "spread" as const,
      };
      if (nums.length === 0) {
        if (seenNode[eq.id]) return;
        seenNode[eq.id] = seenEq[eq.id] = true;
        nodes.push({ ...common, id: eq.id, instance: 0, label: eq.title, qty: line.qty });
        return;
      }
      nums.forEach((n) => {
        const id = `${eq.id}#${n}`;
        if (seenNode[id]) return;
        seenNode[id] = seenEq[eq.id] = true;
        nodes.push({ ...common, id, instance: n, label: `${eq.title} #${n}`, qty: 1 });
      });
    }),
  );

  // Diagram-only equipment joins the room of the first node it is wired to.
  spread.links.forEach((l) => {
    [
      [l.from, l.to],
      [l.to, l.from],
    ].forEach(([ref, other]) => {
      const id = baseId(ref);
      if (seenEq[id] || !byId[id]) return;
      const peer = nodes.find((n) => n.id === other || n.equipmentId === baseId(other));
      if (!peer) return;
      seenEq[id] = true;
      nodes.push({
        id,
        equipmentId: id,
        instance: 0,
        zoneId: peer.zoneId,
        label: byId[id].title,
        anchor: peer.anchor,
        qty: 1,
        vesselSupplied: false,
        source: "diagram",
      });
    });
  });
  return nodes;
}

const SUBSEA_ANCHORS: SurveySceneAnchor[] = ["rov", "beacons", "seabed", "subsea-target"];
const anchorClass = (anchor: SurveySceneAnchor | ""): string =>
  anchor === "umbilical"
    ? "infra"
    : anchor && SUBSEA_ANCHORS.indexOf(anchor) >= 0
      ? "subsea"
      : "topside";

/** Room a generic catalog item belongs to when no room shares its exact anchor. */
const CATALOG_ROOM: Record<string, SurveySceneAnchor> = {
  "": "survey-online",
  vessel: "survey-online",
  gnss: "survey-online",
  beacons: "rov",
  seabed: "rov",
  "subsea-target": "rov",
  umbilical: "rov-control",
};

/** Catalog equipment outside the spread, placed in the room (zone) that matches its location. */
export function catalogNodes(
  spread: ISurveySpread,
  catalog: ISurveyCatalog,
  spreadNodes: ISpreadNode[],
): ISpreadNode[] {
  const rooms = spread.zones.filter((z) => !!z.sceneAnchor);
  if (rooms.length === 0) return [];
  const used: Record<string, boolean> = {};
  spreadNodes.forEach((n) => (used[n.equipmentId] = true));
  const roomFor = (anchor: SurveySceneAnchor | "") =>
    rooms.find((z) => z.sceneAnchor === anchor) ||
    rooms.find((z) => z.sceneAnchor === CATALOG_ROOM[anchor]) ||
    rooms.find((z) => anchorClass(z.sceneAnchor) === anchorClass(anchor)) ||
    rooms[0];
  return catalog.equipment
    .filter((eq) => !used[eq.id])
    .map((eq) => ({
      id: eq.id,
      equipmentId: eq.id,
      instance: 0,
      zoneId: roomFor(eq.sceneAnchor).id,
      label: eq.title,
      anchor: eq.sceneAnchor,
      qty: 1,
      vesselSupplied: false,
      source: "catalog" as const,
    }));
}

export function resolveSpreadLinks(
  spread: ISurveySpread,
  nodes: ISpreadNode[],
): ISpreadLinkRef[] {
  const ids: Record<string, boolean> = {};
  nodes.forEach((n) => (ids[n.id] = true));
  const resolve = (ref: string): string | null =>
    ids[ref] ? ref : ids[`${ref}#1`] ? `${ref}#1` : ids[baseId(ref)] ? baseId(ref) : null;

  const result: ISpreadLinkRef[] = [];
  spread.links.forEach((l, i) => {
    const from = resolve(l.from);
    const to = resolve(l.to);
    if (!from || !to || from === to) return;
    result.push({ key: `${from}>${to}~${i}`, from, to, kind: l.kind, cable: l.cable });
  });
  return result;
}

/**
 * Shortest wiring path from a node to the online hub. Timing (PPS/ZDA) cables are not signal
 * paths and video only flows from → to; other links are bidirectional.
 */
export function traceSignalPath(
  links: ISpreadLinkRef[],
  fromId: string,
  hubEquipmentId: string = SIGNAL_HUB_ID,
): ISignalPath | null {
  const targets = [hubEquipmentId].concat(SIGNAL_FALLBACK_IDS);
  if (targets.indexOf(baseId(fromId)) >= 0) return null;
  const adjacency: Record<string, { to: string; key: string }[]> = {};
  const edge = (a: string, b: string, key: string): void => {
    (adjacency[a] || (adjacency[a] = [])).push({ to: b, key });
  };
  links.forEach((l) => {
    if (l.kind === "timing") return;
    edge(l.from, l.to, l.key);
    if (l.kind !== "video") edge(l.to, l.from, l.key);
  });

  for (let t = 0; t < targets.length; t++) {
    const path = shortestPath(adjacency, fromId, targets[t]);
    if (path) return path;
  }
  return null;
}

function shortestPath(
  adjacency: Record<string, { to: string; key: string }[]>,
  fromId: string,
  targetEquipmentId: string,
): ISignalPath | null {
  const prev: Record<string, { node: string; key: string } | null> = { [fromId]: null };
  const queue = [fromId];
  let found: string | null = null;
  while (queue.length && !found) {
    const current = queue.shift()!;
    (adjacency[current] || []).forEach((e) => {
      if (found || prev[e.to] !== undefined) return;
      prev[e.to] = { node: current, key: e.key };
      if (baseId(e.to) === targetEquipmentId) found = e.to;
      else queue.push(e.to);
    });
  }
  if (!found) return null;

  const nodeIds: string[] = [];
  const linkKeys: string[] = [];
  let cursor: string | null = found;
  while (cursor) {
    nodeIds.unshift(cursor);
    const step: { node: string; key: string } | null = prev[cursor];
    if (step) linkKeys.unshift(step.key);
    cursor = step ? step.node : null;
  }
  return { nodeIds, linkKeys };
}

/** Direct links of a node — used when it has no wired path to the hub (e.g. acoustic C-Nodes). */
export function directLinks(links: ISpreadLinkRef[], id: string): ISignalPath | null {
  const nodeIds = [id];
  const linkKeys: string[] = [];
  links.forEach((l) => {
    const other = l.from === id ? l.to : l.to === id ? l.from : null;
    if (!other) return;
    linkKeys.push(l.key);
    if (nodeIds.indexOf(other) < 0) nodeIds.push(other);
  });
  return linkKeys.length ? { nodeIds, linkKeys } : null;
}

const SHAPE_RULES: [RegExp, SurveySceneShape][] = [
  [/monitor|display|helmsman/i, "monitor"],
  [/\bpc\b|workstation|computer/i, "workstation"],
  [/server|raid|rack/i, "rack"],
  [/switch/i, "switch"],
  [/antenna/i, "whip-antenna"],
  [/ups\b/i, "ups"],
  [/printer/i, "printer"],
  [/gyro|octans|mru|\bins\b|heading/i, "gyro"],
  [/sonar|mbes|multibeam|echosounder|r2sonic/i, "sonar-head"],
  [/camera|video/i, "camera"],
  [/laser/i, "laser"],
  [/coil|tracker/i, "coil-frame"],
  [/transponder|beacon|node|compatt|hpt/i, "transponder"],
  [/fibre|fiber|umbilical/i, "fibre-reel"],
  [/internet/i, "network-cloud"],
  [/system/i, "system-core"],
  [/mux|bottle|subsea/i, "subsea-bottle"],
  [/radio/i, "radio"],
  [/receiver|topside|gnss|interface/i, "receiver"],
  [/svs|altimeter|probe|sensor|barometer/i, "probe"],
];

export function resolveSceneShape(eq: ISurveyEquipment): SurveySceneShape {
  if (eq.sceneShape) return eq.sceneShape;
  const text = `${eq.title} ${eq.technology}`;
  for (let i = 0; i < SHAPE_RULES.length; i++) {
    if (SHAPE_RULES[i][0].test(text)) return SHAPE_RULES[i][1];
  }
  return "serial-box";
}

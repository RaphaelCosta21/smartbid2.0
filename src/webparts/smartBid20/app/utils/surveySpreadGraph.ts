/**
 * Spread template graph: expands zone lines into physical instances
 * (e.g. network-switch#1..#3) and walks the one-line diagram links.
 */
import {
  ISurveyCatalog,
  ISurveyEquipment,
  ISurveyPipelineNode,
  ISurveySpread,
  SurveyLinkKind,
  SurveyPipelineStage,
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
  const adjacency = buildAdjacency(links);
  for (let t = 0; t < targets.length; t++) {
    const target = targets[t];
    const path = shortestPath(adjacency, fromId, (id) => baseId(id) === target);
    if (path) return path;
  }
  return null;
}

type Adjacency = Record<string, { to: string; key: string }[]>;

function buildAdjacency(links: ISpreadLinkRef[]): Adjacency {
  const adjacency: Adjacency = {};
  const edge = (a: string, b: string, key: string): void => {
    (adjacency[a] || (adjacency[a] = [])).push({ to: b, key });
  };
  links.forEach((l) => {
    if (l.kind === "timing") return;
    edge(l.from, l.to, l.key);
    if (l.kind !== "video") edge(l.to, l.from, l.key);
  });
  return adjacency;
}

function shortestPath(
  adjacency: Adjacency,
  fromId: string,
  isTarget: (nodeId: string) => boolean,
): ISignalPath | null {
  const prev: Record<string, { node: string; key: string } | null> = { [fromId]: null };
  const queue = [fromId];
  let found: string | null = null;
  while (queue.length && !found) {
    const current = queue.shift()!;
    (adjacency[current] || []).forEach((e) => {
      if (found || prev[e.to] !== undefined) return;
      prev[e.to] = { node: current, key: e.key };
      if (isTarget(e.to)) found = e.to;
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

export type LineageStageKey =
  | "capture"
  | "transport"
  | "acquisition"
  | "display"
  | "storage"
  | "processing"
  | "deliverable"
  | "open";

export interface ILineageItem {
  key: string;
  label: string;
  sublabel?: string;
  /** Longer explanation shown as a tooltip. */
  hint?: string;
  /** Clickable when the item is a piece of equipment in the catalog. */
  equipmentId?: string;
  current?: boolean;
  /** Not yet validated by a survey SME. */
  inferred?: boolean;
}

export interface ILineageStage {
  key: LineageStageKey;
  title: string;
  items: ILineageItem[];
}

export interface IDataLineage {
  stages: ILineageStage[];
  /** Physical wiring path (source → acquisition host) for the 3D trace; null when aggregated. */
  path: ISignalPath | null;
}

const STAGE_TITLES: Record<LineageStageKey, string> = {
  capture: "CAPTURE",
  transport: "TRANSPORT",
  acquisition: "SOFTWARE",
  display: "DISPLAY",
  storage: "STORAGE",
  processing: "PROCESSING",
  deliverable: "CLIENT DELIVERABLES",
  open: "NEXT STEP",
};

const LOGICAL_STAGES: SurveyPipelineStage[] = ["software", "storage", "processing", "deliverable"];
const STAGE_KEY: Record<SurveyPipelineStage, LineageStageKey> = {
  software: "acquisition",
  storage: "storage",
  processing: "processing",
  deliverable: "deliverable",
};

const overlaps = (a?: string[], b?: string[]): boolean =>
  !!a && !!b && a.some((x) => b.indexOf(x) >= 0);

interface IDataRoute {
  src: ISpreadNode;
  path: ISignalPath | null;
  /** Software → storage → processing → deliverables reached by the source data types. */
  chain: ISurveyPipelineNode[];
}

/**
 * End-to-end data lineage of a spread node: sensor → wiring → software → storage → processing
 * → client deliverables. Flow direction comes from equipment data roles/types (the diagram link
 * directions are not consistent). Returns null when the node carries no lineage annotations.
 */
export function traceDataLineage(
  nodeId: string,
  nodes: ISpreadNode[],
  links: ISpreadLinkRef[],
  equipmentById: Record<string, ISurveyEquipment>,
  pipeline: ISurveyPipelineNode[],
): IDataLineage | null {
  const node = nodes.find((n) => n.id === nodeId);
  const eq = node && equipmentById[node.equipmentId];
  if (!node || !eq || !eq.dataRole || pipeline.length === 0) return null;

  const adjacency = buildAdjacency(links);
  const spreadNodes = nodes.filter((n) => n.source !== "catalog");
  const nodeById: Record<string, ISpreadNode> = {};
  spreadNodes.forEach((n) => (nodeById[n.id] = n));
  const pipeById: Record<string, ISurveyPipelineNode> = {};
  pipeline.forEach((p) => (pipeById[p.id] = p));
  const software = pipeline.filter((p) => p.stage === "software");
  const present = (equipmentId?: string): boolean =>
    !!equipmentId && spreadNodes.some((n) => n.equipmentId === equipmentId);
  const nodeLabel = (id: string): string => (nodeById[id] ? nodeById[id].label : id);

  const route = (src: ISpreadNode): IDataRoute => {
    const types = (equipmentById[src.equipmentId] || ({} as ISurveyEquipment)).dataTypes || [];
    const sw = software.filter((p) => overlaps(p.consumes, types));
    const hosts = sw.map((p) => p.hostEquipmentId).filter((h) => present(h)) as string[];
    let path: ISignalPath | null = null;
    if (hosts.indexOf(src.equipmentId) >= 0) path = { nodeIds: [src.id], linkKeys: [] };
    else if (hosts.length) {
      path = shortestPath(adjacency, src.id, (id) => hosts.indexOf(baseId(id)) >= 0);
    }
    if (!path) path = traceSignalPath(links, src.id);

    const chain: ISurveyPipelineNode[] = [];
    const seen: Record<string, boolean> = {};
    const queue = sw.slice();
    sw.forEach((p) => (seen[p.id] = true));
    while (queue.length) {
      const p = queue.shift()!;
      chain.push(p);
      (p.feeds || []).forEach((id) => {
        const next = pipeById[id];
        if (!next || seen[id]) return;
        if (next.consumes && !overlaps(next.consumes, types)) return;
        seen[id] = true;
        queue.push(next);
      });
    }
    return { src, path, chain };
  };

  const hostSub = (p: ISurveyPipelineNode): string | undefined => {
    if (!p.hostEquipmentId) return undefined;
    const host = spreadNodes.find((n) => n.equipmentId === p.hostEquipmentId);
    const hostEq = equipmentById[p.hostEquipmentId];
    return host ? `on ${host.label}` : hostEq ? `on ${hostEq.title}` : "host not in the diagram";
  };
  const logicalItem = (p: ISurveyPipelineNode): ILineageItem => ({
    key: p.id,
    label: p.title,
    sublabel: hostSub(p),
    hint: p.description,
    equipmentId:
      p.hostEquipmentId && equipmentById[p.hostEquipmentId] ? p.hostEquipmentId : undefined,
    current: !!p.hostEquipmentId && p.hostEquipmentId === eq.id,
    inferred: !p.validated,
  });
  const nodeItem = (n: ISpreadNode, current?: boolean): ILineageItem => ({
    key: n.id,
    label: n.label,
    equipmentId: n.equipmentId,
    current: !!current,
  });
  const logicalStages = (chain: ISurveyPipelineNode[]): ILineageStage[] => {
    const stages: ILineageStage[] = [];
    LOGICAL_STAGES.forEach((stage) => {
      const items = pipeline
        .filter((p) => p.stage === stage && chain.indexOf(p) >= 0)
        .map(logicalItem);
      if (items.length) stages.push({ key: STAGE_KEY[stage], title: STAGE_TITLES[STAGE_KEY[stage]], items });
    });
    if (!stages.some((s) => s.key === "deliverable")) {
      stages.push({
        key: "open",
        title: STAGE_TITLES.open,
        items: [
          {
            key: "open",
            label: "Downstream use to confirm",
            sublabel: "Survey SME review",
            inferred: true,
          },
        ],
      });
    }
    return stages;
  };
  const stage = (key: LineageStageKey, items: ILineageItem[]): ILineageStage => ({
    key,
    title: STAGE_TITLES[key],
    items,
  });

  const role = eq.dataRole;
  if (role === "source" || role === "rf-frontend") {
    const r = route(node);
    const ids = r.path ? r.path.nodeIds : [node.id];
    const last = baseId(ids[ids.length - 1]);
    const endsOnHost =
      ids.length > 1 && r.chain.some((p) => p.stage === "software" && p.hostEquipmentId === last);
    const hops = ids
      .slice(1, endsOnHost ? -1 : undefined)
      .filter((id) => (equipmentById[baseId(id)] || ({} as ISurveyEquipment)).dataRole !== "display");
    const stages = [stage("capture", [nodeItem(node, true)])];
    if (hops.length) {
      stages.push(
        stage(
          "transport",
          hops.map((id) => ({ key: id, label: nodeLabel(id), equipmentId: baseId(id) })),
        ),
      );
    }
    return { stages: stages.concat(logicalStages(r.chain)), path: r.path };
  }

  const sources = spreadNodes.filter((n) => {
    const r = (equipmentById[n.equipmentId] || ({} as ISurveyEquipment)).dataRole;
    return r === "source" || r === "rf-frontend";
  });

  if (role === "display") {
    const shows = software.filter((p) => (p.displays || []).indexOf(eq.id) >= 0);
    if (shows.length === 0) return null;
    const feeding = sources.filter((s) =>
      overlaps(
        (equipmentById[s.equipmentId].dataTypes || []) as string[],
        shows.reduce((acc: string[], p) => acc.concat(p.consumes || []), []),
      ),
    );
    return {
      stages: [
        stage("capture", feeding.map((s) => nodeItem(s))),
        stage("acquisition", shows.map(logicalItem)),
        stage("display", [nodeItem(node, true)]),
      ],
      path: null,
    };
  }

  // Transport and support: every source wired through this node. Computers and storage: only
  // the data handled by the software they host (other links merely end on them).
  const throughWiring = role === "transport" || role === "support";
  const routes = sources
    .map(route)
    .filter(
      (r) =>
        (throughWiring && !!r.path && r.path.nodeIds.indexOf(node.id) >= 0) ||
        r.chain.some((p) => p.hostEquipmentId === eq.id),
    );
  if (routes.length === 0) return null;
  let chain: ISurveyPipelineNode[] = [];
  routes.forEach((r) => r.chain.forEach((p) => chain.indexOf(p) < 0 && chain.push(p)));
  if (role === "compute") {
    // A computer shows its own software and what is downstream of it, not its peers' software.
    const reach: Record<string, boolean> = {};
    const queue = chain.filter((p) => p.stage === "software" && p.hostEquipmentId === eq.id);
    queue.forEach((p) => (reach[p.id] = true));
    while (queue.length) {
      (queue.shift()!.feeds || []).forEach((id) => {
        if (reach[id] || !pipeById[id]) return;
        reach[id] = true;
        queue.push(pipeById[id]);
      });
    }
    chain = chain.filter((p) => reach[p.id] && (p.stage !== "software" || p.hostEquipmentId === eq.id));
  }
  const stages = [stage("capture", routes.map((r) => nodeItem(r.src)))];
  if (role === "transport") stages.push(stage("transport", [nodeItem(node, true)]));
  return { stages: stages.concat(logicalStages(chain)), path: null };
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

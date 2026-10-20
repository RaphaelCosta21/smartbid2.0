/**
 * Types shared by the 3D scene and React. No three.js import here, so pages can
 * use them without pulling the lazy "survey-3d" chunk into the main bundle.
 */
import { SurveyLinkKind, SurveySceneAnchor, SurveySceneShape } from "../../../models";
import type { DeliverableVisual, JourneyEffectKind } from "../../../config/surveyDataFormats";

export interface SceneZone {
  id: string;
  title: string;
  anchor: SurveySceneAnchor;
  /** e.g. "7 items" or "5/7 in BID". */
  countLabel: string;
}

/** Equipment archetypes plus the scene-only gateway to another room. */
export type SceneShape = SurveySceneShape | "portal";

/** spread = line of the template, catalog = reference only, portal = link to another room. */
export type SceneNodeRole = "spread" | "catalog" | "portal";

export interface SceneNode {
  id: string;
  equipmentId: string;
  label: string;
  shape: SceneShape;
  modelUrl: string | null;
  /** Physical location the node emerges from; falls back to the zone anchor. */
  anchor: SurveySceneAnchor | "";
  vesselSupplied: boolean;
  role: SceneNodeRole;
  /** Group in the exploded grid (equipment family, catalog or portal). */
  cluster: string;
  /** Compared BID: "in" = in its scope, "out" = not considered (greyed); null = no BID. */
  bidState: "in" | "out" | null;
}

export interface SceneLink {
  key: string;
  from: string;
  to: string;
  kind: SurveyLinkKind;
  cable?: string;
}

export interface SceneFocus {
  zoneId: string;
  anchor: SurveySceneAnchor;
  nodes: SceneNode[];
  links: SceneLink[];
  clusterTitles: Record<string, string>;
}

/** Cables between two rooms, aggregated into one arc for the overview. */
export interface SceneTrunk {
  key: string;
  from: SurveySceneAnchor;
  to: SurveySceneAnchor;
  kind: SurveyLinkKind;
}

/** Analysis overlay driving plinth colours: explore (default), failure cascade or BID gap. */
export type SceneOverlay = "none" | "fault" | "gap";

export interface SceneNodeStates {
  selectedNodeId: string | null;
  hoverNodeId: string | null;
  packageEquipmentIds: string[];
  traceNodeIds: string[];
  traceLinkKeys: string[];
  /** Cables of the hovered node, highlighted while nothing is traced. */
  hoverLinkKeys: string[];
  /** Active analysis overlay. */
  overlay: SceneOverlay;
  /** Node simulated as failed (fault overlay). */
  faultNodeId: string | null;
  /** Nodes that lose the online hub because of the fault. */
  offlineNodeIds: string[];
  /** Show only the traced cables (data journey); the others are hidden, not dimmed. */
  isolateTrace?: boolean;
}

export type ScenePick =
  | { type: "zone"; zoneId: string }
  | { type: "anchor"; anchor: SurveySceneAnchor }
  | { type: "node"; nodeId: string }
  /** A focus cable (link key) or an overview trunk (trunk key). */
  | { type: "cable"; key: string };

export interface SceneJourneyDeliverable {
  id: string;
  title: string;
  subtitle: string;
  visual: DeliverableVisual;
}

/**
 * satellites = GNSS beam; node / cable = inside the open room; overview = vessel; deliverables = 3D cards;
 * phenomenon = the physical signal drawn over the vessel / ROV / seabed (no packet yet).
 */
export type SceneJourneyMode =
  | "satellites"
  | "node"
  | "cable"
  | "overview"
  | "deliverables"
  | "phenomenon";

/** One step of the data journey as the 3D scene draws it (travelling packet + camera). */
export interface SceneJourneyStep {
  key: string;
  mode: SceneJourneyMode;
  /** Room the step happens in; the packet waits until this room is open. */
  zoneId?: string | null;
  nodeId?: string;
  linkKey?: string;
  reverse?: boolean;
  /** Cable from another room travelled before the packet rests on the node. */
  arriveLinkKey?: string;
  arriveReverse?: boolean;
  /** Packet colour (link kind colour). */
  color: number;
  /** Physical-signal effect played while this step is shown (phenomenon / satellites). */
  effect?: JourneyEffectKind;
  deliverables?: SceneJourneyDeliverable[];
}

export const LINK_KINDS: SurveyLinkKind[] = [
  "data",
  "power",
  "video",
  "rf",
  "subsea",
  "fibre",
  "acoustic",
  "timing",
];

export const LINK_COLORS: Record<SurveyLinkKind, number> = {
  data: 0x0097a9,
  power: 0xdc4405,
  video: 0xffc72c,
  rf: 0x7a99ac,
  subsea: 0x009b77,
  fibre: 0x5b7f95,
  acoustic: 0xb0bac1,
  timing: 0xf4fbff,
};

export const LINK_LABELS: Record<SurveyLinkKind, string> = {
  data: "Data",
  power: "Power",
  video: "Video",
  rf: "RF / antenna",
  subsea: "Subsea",
  fibre: "Fibre",
  acoustic: "Acoustic",
  timing: "Timing (PPS/ZDA)",
};

export const CATALOG_CLUSTER = "catalog";
export const PORTAL_CLUSTER = "portal";
export const PORTAL_PREFIX = "room:";
export const TRUNK_PREFIX = "trunk:";

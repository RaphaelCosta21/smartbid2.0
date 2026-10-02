/**
 * Types shared by the 3D scene and React. No three.js import here, so pages can
 * use them without pulling the lazy "survey-3d" chunk into the main bundle.
 */
import { SurveyLinkKind, SurveySceneAnchor, SurveySceneShape } from "../../../models";

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

export interface SceneNodeStates {
  selectedNodeId: string | null;
  hoverNodeId: string | null;
  packageEquipmentIds: string[];
  traceNodeIds: string[];
  traceLinkKeys: string[];
  /** Cables of the hovered node, highlighted while nothing is traced. */
  hoverLinkKeys: string[];
}

export type ScenePick =
  | { type: "zone"; zoneId: string }
  | { type: "anchor"; anchor: SurveySceneAnchor }
  | { type: "node"; nodeId: string }
  /** A focus cable (link key) or an overview trunk (trunk key). */
  | { type: "cable"; key: string };

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
  acoustic: 0xc8102e,
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

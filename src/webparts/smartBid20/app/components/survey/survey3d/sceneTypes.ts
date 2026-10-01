/**
 * Types shared by the 3D scene and React. No three.js import here, so pages can
 * use them without pulling the lazy "survey-3d" chunk into the main bundle.
 */
import { SurveyLinkKind, SurveySceneAnchor, SurveySceneShape } from "../../../models";

export interface SceneZone {
  id: string;
  title: string;
  anchor: SurveySceneAnchor;
  colorIndex: number;
  count: number;
}

export interface SceneNode {
  id: string;
  equipmentId: string;
  label: string;
  shape: SurveySceneShape;
  modelUrl: string | null;
  /** Physical location the node emerges from; falls back to the zone anchor. */
  anchor: SurveySceneAnchor | "";
  vesselSupplied: boolean;
  /** Generic catalog item shown for reference (not part of the spread). */
  catalog: boolean;
}

export interface SceneLink {
  key: string;
  from: string;
  to: string;
  kind: SurveyLinkKind;
}

export interface SceneFocus {
  zoneId: string;
  anchor: SurveySceneAnchor;
  nodes: SceneNode[];
  links: SceneLink[];
}

export interface SceneNodeStates {
  selectedNodeId: string | null;
  hoverNodeId: string | null;
  packageEquipmentIds: string[];
  traceNodeIds: string[];
  traceLinkKeys: string[];
}

export type ScenePick =
  | { type: "zone"; zoneId: string }
  | { type: "anchor"; anchor: SurveySceneAnchor }
  | { type: "node"; nodeId: string };

/** Zone orb colors by zone order (OII primary yellow, secondary teal, tertiary green). */
export const ZONE_COLORS = [0xffc72c, 0x0097a9, 0x009b77];

export const LINK_KINDS: SurveyLinkKind[] = [
  "data",
  "power",
  "video",
  "rf",
  "subsea",
  "fibre",
  "acoustic",
];

export const LINK_COLORS: Record<SurveyLinkKind, number> = {
  data: 0x0097a9,
  power: 0xdc4405,
  video: 0xffc72c,
  rf: 0x7a99ac,
  subsea: 0x009b77,
  fibre: 0x5b7f95,
  acoustic: 0xc8102e,
};

export const LINK_LABELS: Record<SurveyLinkKind, string> = {
  data: "Data",
  power: "Power",
  video: "Video",
  rf: "RF / antenna",
  subsea: "Subsea",
  fibre: "Fibre",
  acoustic: "Acoustic",
};

export const CATALOG_CLUSTER = "catalog";

export const CLUSTER_TITLES: Record<string, string> = {
  mast: "Mast",
  bridge: "Bridge",
  "survey-online": "Survey room",
  "rov-control": "ROV control",
  "vessel-hull": "Hull",
  vessel: "Vessel",
  umbilical: "Umbilical",
  rov: "ROV",
  beacons: "Seabed array",
  seabed: "Seabed",
  "subsea-target": "Target",
  gnss: "GNSS",
  [CATALOG_CLUSTER]: "Also in catalog",
};

export const clusterKeyOf = (node: SceneNode, focus: SceneFocus): string =>
  node.catalog ? CATALOG_CLUSTER : node.anchor || focus.anchor;

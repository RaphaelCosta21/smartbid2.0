/**
 * "What if it fails?" cascade: the equipment knocked offline when one node fails, plus the data
 * types and client deliverables that stop arriving. Combines the physical wiring graph (who loses
 * the online hub) with the catalog data-flow annotations (pipeline + dataTypes). When the catalog
 * lacks those annotations the result falls back to a wiring-only estimate (partial = true).
 */
import { ISurveyEquipment, ISurveyPipelineNode, SurveyDataType } from "../models";
import { ISpreadLinkRef, ISpreadNode, reachableToHub } from "./surveySpreadGraph";

export interface IFailureImpact {
  failedNodeId: string;
  failedLabel: string;
  /** Spread nodes that lose their wired path to the online hub. */
  offlineNodeIds: string[];
  /** Immediate neighbours wired to the failed node. */
  directVictimLabels: string[];
  /** Readable data types that no longer reach any software. */
  lostDataTypes: string[];
  /** Client deliverables that depend on a lost data type. */
  lostDeliverables: string[];
  /** True when the catalog lacks the data-flow annotations: wiring-only estimate. */
  partial: boolean;
}

const DATA_TYPE_LABEL: Record<SurveyDataType, string> = {
  position: "Position",
  heading: "Heading",
  motion: "Motion",
  depth: "Depth",
  altitude: "Altitude",
  "sound-velocity": "Sound velocity",
  bathymetry: "Bathymetry",
  "acoustic-position": "Acoustic position",
  "pipe-tracking": "Pipe tracking",
  video: "Video",
  "time-sync": "Time sync",
  corrections: "GNSS corrections",
  comms: "Comms",
};

const overlaps = (a?: string[], b?: string[]): boolean =>
  !!a && !!b && a.some((x) => b.indexOf(x) >= 0);

const pushUnique = (list: string[], value: string): void => {
  if (list.indexOf(value) < 0) list.push(value);
};

export function computeFailureImpact(
  failedNodeId: string,
  nodes: ISpreadNode[],
  links: ISpreadLinkRef[],
  pipeline: ISurveyPipelineNode[],
  equipmentById: Record<string, ISurveyEquipment>,
): IFailureImpact {
  const nodeById: Record<string, ISpreadNode> = {};
  nodes.forEach((n) => (nodeById[n.id] = n));
  const failed = nodeById[failedNodeId];
  const spreadNodes = nodes.filter((n) => n.source !== "catalog");

  // Wiring cascade: nodes that reached the hub before but not once the failed node is removed.
  const before = reachableToHub(links);
  const after = reachableToHub(links, failedNodeId);
  const offlineNodeIds: string[] = [];
  spreadNodes.forEach((n) => {
    if (n.id !== failedNodeId && before[n.id] && !after[n.id]) offlineNodeIds.push(n.id);
  });

  const offlineSet: Record<string, boolean> = { [failedNodeId]: true };
  offlineNodeIds.forEach((id) => (offlineSet[id] = true));

  const directVictimLabels: string[] = [];
  links.forEach((l) => {
    const other = l.from === failedNodeId ? l.to : l.to === failedNodeId ? l.from : null;
    if (other) pushUnique(directVictimLabels, nodeById[other]?.label || other);
  });

  const typesOf = (n: ISpreadNode): SurveyDataType[] =>
    (equipmentById[n.equipmentId] || ({} as ISurveyEquipment)).dataTypes || [];
  const isSource = (n: ISpreadNode): boolean => {
    const role = (equipmentById[n.equipmentId] || ({} as ISurveyEquipment)).dataRole;
    return role === "source" || role === "rf-frontend";
  };

  // Data types still produced by a source that survives the fault.
  const sources = spreadNodes.filter(isSource);
  const available: SurveyDataType[] = [];
  sources
    .filter((s) => !offlineSet[s.id])
    .forEach((s) => typesOf(s).forEach((t) => pushUnique(available, t)));
  const lostTypes: SurveyDataType[] = [];
  sources.forEach((s) =>
    typesOf(s).forEach((t) => {
      if (available.indexOf(t) < 0) pushUnique(lostTypes, t);
    }),
  );

  // Deliverables fed (through the pipeline) by software that consumes a now-missing data type.
  const pipeById: Record<string, ISurveyPipelineNode> = {};
  pipeline.forEach((p) => (pipeById[p.id] = p));
  const lostDeliverables: string[] = [];
  const seen: Record<string, boolean> = {};
  const queue: ISurveyPipelineNode[] = [];
  pipeline
    .filter((p) => p.stage === "software" && overlaps(p.consumes, lostTypes))
    .forEach((p) => {
      seen[p.id] = true;
      queue.push(p);
    });
  while (queue.length) {
    const p = queue.shift()!;
    if (p.stage === "deliverable") pushUnique(lostDeliverables, p.title);
    (p.feeds || []).forEach((id) => {
      const next = pipeById[id];
      if (next && !seen[id]) {
        seen[id] = true;
        queue.push(next);
      }
    });
  }

  const hasAnnotations = pipeline.length > 0 && sources.some((s) => typesOf(s).length > 0);

  return {
    failedNodeId,
    failedLabel: failed ? failed.label : failedNodeId,
    offlineNodeIds,
    directVictimLabels,
    lostDataTypes: lostTypes.map((t) => DATA_TYPE_LABEL[t] || t),
    lostDeliverables,
    partial: !hasAnnotations,
  };
}

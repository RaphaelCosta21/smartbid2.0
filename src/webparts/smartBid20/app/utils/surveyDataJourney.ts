/**
 * surveyDataJourney.ts - Step-by-step "data journey" of one data type from its origin to the client
 * deliverables: origin -> sensor -> each cable and box on the wiring path -> acquisition software
 * -> storage -> processing -> deliverables. Each step carries the typical format of the data there.
 *
 * Pure (no React / three). Formats are "typical" (config/surveyDataFormats.ts), never read from the
 * catalog, so every step is flagged inferred unless the pipeline node was SME-validated.
 */
import {
  ILocalizedText,
  ISurveyEquipment,
  ISurveyPipelineNode,
  SurveyDataType,
  SurveyLang,
  SurveyLinkKind,
  SurveyPipelineStage,
} from "../models";
import {
  DATA_ORIGINS,
  DATA_SAMPLES,
  DATA_TYPE_NAMES,
  DELIVERABLE_RULES,
  DeliverableVisual,
  IDataFormat,
  JOURNEY_UI,
  LINK_FORMATS,
  ROLE_CAPTIONS,
  STAGE_FORMATS,
} from "../config/surveyDataFormats";
import { ISpreadLinkRef, ISpreadNode, traceDataRoute } from "./surveySpreadGraph";
import { getGlossaryTerm, protocolsForLink } from "./surveyGlossary";

export type JourneyStepKind =
  | "origin"
  | "node"
  | "cable"
  | "software"
  | "storage"
  | "processing"
  | "deliverables"
  | "open";

export interface IJourneyFormat {
  /** What the data is at this step (e.g. "NMEA 0183 · GGA"). */
  label: ILocalizedText;
  /** How it travels here (e.g. "Serial · NMEA 0183"); cables only. */
  carrier?: ILocalizedText;
  sample?: string;
  decodable: boolean;
  termIds: string[];
}

export interface IJourneyDeliverable {
  id: string;
  title: string;
  visual: DeliverableVisual;
  format: ILocalizedText;
}

export interface IJourneyStep {
  id: string;
  kind: JourneyStepKind;
  title: ILocalizedText;
  caption: ILocalizedText;
  /** Room to open in the scene; null = vessel overview. */
  zoneId: string | null;
  nodeId?: string;
  /** Cable the packet travels along (cable steps). */
  linkKey?: string;
  /** Travel against the link's from -> to direction. */
  reverse?: boolean;
  linkKind?: SurveyLinkKind;
  /** Cable from another room the packet arrives through before resting on the node. */
  arriveLinkKey?: string;
  arriveReverse?: boolean;
  /** Origin in the GNSS constellation. */
  satellites?: boolean;
  format: IJourneyFormat;
  deliverables?: IJourneyDeliverable[];
  inferred: boolean;
}

export interface IDataJourney {
  sourceNodeId: string;
  dataType: SurveyDataType;
  title: ILocalizedText;
  steps: IJourneyStep[];
  /** No wiring path or no downstream use in the catalog: the journey stops early. */
  partial: boolean;
}

export interface IJourneyContext {
  nodes: ISpreadNode[];
  links: ISpreadLinkRef[];
  equipmentById: Record<string, ISurveyEquipment>;
  pipeline: ISurveyPipelineNode[];
}

export interface IJourneyOption {
  key: string;
  sourceNodeId: string;
  dataType: SurveyDataType;
  sourceLabel: string;
  typeLabel: ILocalizedText;
}

const STAGE_ORDER: SurveyPipelineStage[] = ["software", "storage", "processing", "deliverable"];
const DATA_TYPE_ORDER = Object.keys(DATA_TYPE_NAMES) as SurveyDataType[];
const MAX_OPTIONS = 12;

const same = (text: string): ILocalizedText => ({ pt: text, en: text });
const compose = (fn: (lang: SurveyLang) => string): ILocalizedText => ({
  pt: fn("pt"),
  en: fn("en"),
});

const termNames = (ids: string[]): string =>
  ids
    .map((id) => {
      const term = getGlossaryTerm(id);
      return term ? term.term : "";
    })
    .filter(Boolean)
    .join(" · ");

const toFormat = (
  f: IDataFormat,
  carrier?: ILocalizedText,
  extraTerms?: string[],
): IJourneyFormat => ({
  label: f.label,
  carrier,
  sample: f.sample,
  decodable: !!f.decodable,
  termIds: uniq((f.termIds || []).concat(extraTerms || [])),
});

function uniq(list: string[]): string[] {
  const out: string[] = [];
  list.forEach((x) => out.indexOf(x) < 0 && out.push(x));
  return out;
}

const deliverableOf = (p: ISurveyPipelineNode): IJourneyDeliverable => {
  const rule = DELIVERABLE_RULES.filter((r) => r.match.test(`${p.id} ${p.title}`))[0];
  return { id: p.id, title: p.title, visual: rule.visual, format: rule.format };
};

/** One step per hop from the data's origin to the client deliverables, or null for unknown nodes. */
export function buildDataJourney(
  sourceNodeId: string,
  dataType: SurveyDataType,
  ctx: IJourneyContext,
): IDataJourney | null {
  const nodeById: Record<string, ISpreadNode> = {};
  ctx.nodes.forEach((n) => (nodeById[n.id] = n));
  const src = nodeById[sourceNodeId];
  if (!src) return null;
  const linkByKey: Record<string, ISpreadLinkRef> = {};
  ctx.links.forEach((l) => (linkByKey[l.key] = l));
  const eqOf = (nodeId: string): ISurveyEquipment | undefined =>
    nodeById[nodeId] ? ctx.equipmentById[nodeById[nodeId].equipmentId] : undefined;
  const labelOf = (nodeId: string): string => (nodeById[nodeId] ? nodeById[nodeId].label : nodeId);
  const zoneOf = (nodeId: string): string | null =>
    nodeById[nodeId] ? nodeById[nodeId].zoneId : null;

  const origin = DATA_ORIGINS[dataType];
  const payload = DATA_SAMPLES[dataType];
  const typeName = DATA_TYPE_NAMES[dataType];
  const steps: IJourneyStep[] = [];
  let partial = false;

  const cableStep = (
    fromId: string,
    toId: string,
    link: ISpreadLinkRef,
    carried: IDataFormat,
  ): void => {
    const fromEq = eqOf(fromId);
    const toEq = eqOf(toId);
    const protocols = protocolsForLink(link.kind, fromEq, toEq);
    const names = termNames(protocols);
    const base = LINK_FORMATS[link.kind];
    const carrier = compose((lang) =>
      names ? `${base.label[lang]} · ${names}` : base.label[lang],
    );
    steps.push({
      id: `cable:${link.key}`,
      kind: "cable",
      title: compose((lang) =>
        link.cable ? `${link.cable} · ${base.label[lang]}` : base.label[lang],
      ),
      caption: compose(
        (lang) =>
          `${JOURNEY_UI.leaves[lang]} ${labelOf(fromId)} → ${labelOf(toId)}. ` +
          (names
            ? lang === "pt"
              ? `O conteúdo não muda; muda o "envelope": ${names}.`
              : `The content does not change; the "envelope" does: ${names}.`
            : ""),
      ),
      zoneId: zoneOf(fromId),
      linkKey: link.key,
      reverse: link.from !== fromId,
      linkKind: link.kind,
      format: toFormat(carried, carrier, protocols.concat(base.termIds || [])),
      inferred: true,
    });
  };

  const nodeStep = (
    nodeId: string,
    caption: ILocalizedText,
    format: IJourneyFormat,
    arrive?: ISpreadLinkRef,
    prevId?: string,
  ): void => {
    const crossRoom = !!arrive && !!prevId && zoneOf(prevId) !== zoneOf(nodeId);
    steps.push({
      id: `node:${nodeId}`,
      kind: "node",
      title: same(labelOf(nodeId)),
      caption,
      zoneId: zoneOf(nodeId),
      nodeId,
      arriveLinkKey: crossRoom ? arrive!.key : undefined,
      arriveReverse: crossRoom ? arrive!.from !== prevId : undefined,
      format,
      inferred: true,
    });
  };

  // Satellite-born data enters through an RF front end (antenna) wired to the receiver.
  let antenna: { id: string; link: ISpreadLinkRef } | null = null;
  if (origin.satellites) {
    for (let i = 0; i < ctx.links.length && !antenna; i++) {
      const l = ctx.links[i];
      if (l.kind !== "rf") continue;
      const other = l.from === src.id ? l.to : l.to === src.id ? l.from : null;
      const otherEq = other ? eqOf(other) : undefined;
      if (other && otherEq && otherEq.dataRole === "rf-frontend") antenna = { id: other, link: l };
    }
  }

  steps.push({
    id: "origin",
    kind: "origin",
    title: origin.title,
    caption: origin.caption,
    zoneId: origin.satellites ? null : src.zoneId,
    nodeId: origin.satellites ? undefined : src.id,
    satellites: !!origin.satellites,
    format: toFormat(origin.format),
    inferred: true,
  });

  if (antenna) {
    const a = antenna;
    nodeStep(a.id, ROLE_CAPTIONS["rf-frontend"], toFormat(origin.format));
    cableStep(a.id, src.id, a.link, origin.format);
    nodeStep(
      src.id,
      compose((lang) => `${ROLE_CAPTIONS.source[lang]} (${payload.label[lang]})`),
      toFormat(payload),
      a.link,
      a.id,
    );
  } else {
    nodeStep(
      src.id,
      compose((lang) => `${ROLE_CAPTIONS.source[lang]} (${payload.label[lang]})`),
      toFormat(payload),
    );
  }

  const route = traceDataRoute(src, ctx.nodes, ctx.links, ctx.equipmentById, ctx.pipeline, [
    dataType,
  ]);
  const path = route.path;
  if (!path) partial = true;
  if (path) {
    for (let i = 0; i < path.nodeIds.length - 1; i++) {
      const fromId = path.nodeIds[i];
      const toId = path.nodeIds[i + 1];
      const link = linkByKey[path.linkKeys[i]];
      if (!link) continue;
      cableStep(fromId, toId, link, payload);
      const role = eqOf(toId) ? eqOf(toId)!.dataRole : undefined;
      nodeStep(
        toId,
        compose((lang) =>
          `${JOURNEY_UI.arrives[lang]} ${labelOf(toId)}. ${role ? ROLE_CAPTIONS[role][lang] : ""}`.trim(),
        ),
        toFormat(payload),
        link,
        fromId,
      );
    }
  }

  // Logical stages after the wiring, limited to this data type.
  const lastNodeId = path && path.nodeIds.length ? path.nodeIds[path.nodeIds.length - 1] : src.id;
  const hostNode = (equipmentId?: string): ISpreadNode | undefined => {
    if (!equipmentId) return undefined;
    if (nodeById[lastNodeId] && nodeById[lastNodeId].equipmentId === equipmentId)
      return nodeById[lastNodeId];
    return ctx.nodes.filter((n) => n.equipmentId === equipmentId && n.source !== "catalog")[0];
  };
  const chain = route.chain
    .slice()
    .sort((a, b) => STAGE_ORDER.indexOf(a.stage) - STAGE_ORDER.indexOf(b.stage));
  let lastZone = zoneOf(lastNodeId);
  chain
    .filter((p) => p.stage === "software" || p.stage === "storage")
    .forEach((p) => {
      const host = hostNode(p.hostEquipmentId);
      if (host) lastZone = host.zoneId;
      const stage = p.stage === "software" ? STAGE_FORMATS.software : STAGE_FORMATS.storage;
      steps.push({
        id: `${p.stage}:${p.id}`,
        kind: p.stage === "software" ? "software" : "storage",
        title: same(p.title),
        caption: p.description ? same(p.description) : stage.label,
        zoneId: host ? host.zoneId : lastZone,
        nodeId: host ? host.id : undefined,
        format: {
          label: stage.label,
          sample: payload.sample,
          decodable: !!payload.decodable,
          termIds: uniq((stage.termIds || []).concat(payload.termIds || [])),
        },
        inferred: !p.validated,
      });
    });
  chain
    .filter((p) => p.stage === "processing")
    .forEach((p) => {
      steps.push({
        id: `processing:${p.id}`,
        kind: "processing",
        title: same(p.title),
        caption: compose(
          (lang) => `${p.description ? `${p.description} ` : ""}${JOURNEY_UI.offline[lang]}`,
        ),
        zoneId: null,
        format: toFormat(STAGE_FORMATS.processing),
        inferred: !p.validated,
      });
    });
  const deliverables = chain.filter((p) => p.stage === "deliverable").map(deliverableOf);
  if (deliverables.length) {
    steps.push({
      id: "deliverables",
      kind: "deliverables",
      title: STAGE_FORMATS.deliverables.label,
      caption: compose((lang) =>
        lang === "pt"
          ? `${typeName.pt} chega ao cliente em ${deliverables.length} entregável(is): ${deliverables.map((d) => d.title).join(", ")}.`
          : `${typeName.en} reaches the client in ${deliverables.length} deliverable(s): ${deliverables.map((d) => d.title).join(", ")}.`,
      ),
      zoneId: null,
      format: toFormat(STAGE_FORMATS.deliverables),
      deliverables,
      inferred: chain.some((p) => p.stage === "deliverable" && !p.validated),
    });
  } else {
    partial = true;
    steps.push({
      id: "open",
      kind: "open",
      title: compose((lang) =>
        lang === "pt" ? "Próximo passo a confirmar" : "Next step to confirm",
      ),
      caption: JOURNEY_UI.open,
      zoneId: null,
      format: toFormat(STAGE_FORMATS.processing),
      inferred: true,
    });
  }

  return {
    sourceNodeId,
    dataType,
    title: compose((lang) => `${typeName[lang]} · ${src.label}`),
    steps,
    partial,
  };
}

const isSourceRole = (eq?: ISurveyEquipment): boolean =>
  !!eq && (eq.dataRole === "source" || eq.dataRole === "rf-frontend");

/** Journeys that start at, pass through or are processed on this node (empty when none). */
export function listJourneys(nodeId: string, ctx: IJourneyContext): IJourneyOption[] {
  const node = ctx.nodes.filter((n) => n.id === nodeId)[0];
  const eq = node ? ctx.equipmentById[node.equipmentId] : undefined;
  if (!node || !eq || !ctx.pipeline.length) return [];
  const options: IJourneyOption[] = [];
  const add = (src: ISpreadNode, dataType: SurveyDataType): void => {
    const key = `${src.id}|${dataType}`;
    if (options.length >= MAX_OPTIONS || options.some((o) => o.key === key)) return;
    options.push({
      key,
      sourceNodeId: src.id,
      dataType,
      sourceLabel: src.label,
      typeLabel: DATA_TYPE_NAMES[dataType],
    });
  };

  if (isSourceRole(eq)) {
    (eq.dataTypes || []).forEach((t) => add(node, t));
  } else {
    ctx.nodes
      .filter(
        (n) =>
          n.source !== "catalog" &&
          (ctx.equipmentById[n.equipmentId] || ({} as ISurveyEquipment)).dataRole === "source",
      )
      .forEach((src) => {
        (ctx.equipmentById[src.equipmentId].dataTypes || []).forEach((t) => {
          const r = traceDataRoute(src, ctx.nodes, ctx.links, ctx.equipmentById, ctx.pipeline, [t]);
          const onPath = !!r.path && r.path.nodeIds.indexOf(nodeId) >= 0;
          const hosted = r.chain.some((p) => p.hostEquipmentId === eq.id);
          if (onPath || hosted) add(src, t);
        });
      });
  }
  return options.sort(
    (a, b) => DATA_TYPE_ORDER.indexOf(a.dataType) - DATA_TYPE_ORDER.indexOf(b.dataType),
  );
}

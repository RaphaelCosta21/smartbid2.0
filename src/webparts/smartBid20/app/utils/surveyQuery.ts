/**
 * surveyQuery.ts — Rule-based natural-language answering for the Survey Portal.
 *
 * A small, deterministic intent matcher that answers plain questions about the
 * active spread and catalog without any backend call: "what does the USBL do?",
 * "what fails if the switch dies?", "is the MRU in the BID?", "what's missing?".
 * It reuses the physical wiring graph (links) and the failure cascade, so the
 * answers line up with what the 3D scene shows.
 *
 * When Azure AI is configured (ai.config.ts), the UI can offer to escalate the
 * same question to the grounded chat assistant — this file stays offline-only.
 */
import {
  ISurveyCatalog,
  ISurveyEquipment,
  ISurveyPipelineNode,
  ISurveySpread,
  SurveyDataType,
  SurveyLang,
} from "../models";
import { ISpreadLinkRef, ISpreadNode } from "./surveySpreadGraph";
import { computeFailureImpact } from "./surveyFailure";
import { findGlossaryTerm, loadGlossaryLang, localize } from "./surveyGlossary";

export type SurveyAnswerTone = "default" | "good" | "bad" | "warn";

export interface ISurveyAnswerChip {
  /** Equipment id, used by the UI to select/highlight the item in the scene. */
  id: string;
  label: string;
  tone?: SurveyAnswerTone;
}

export interface ISurveyAnswer {
  kind: "answer" | "empty";
  /** Which rule produced the answer (telemetry / debugging). */
  intent: string;
  title: string;
  text: string;
  bullets?: string[];
  chips?: ISurveyAnswerChip[];
  /** Spread node id to focus in the scene, when the answer is about one node. */
  focusNodeId?: string | null;
  /** Glossary term the answer explains; the UI offers to open its full card. */
  glossaryTermId?: string;
}

export interface ISurveyQueryContext {
  catalog: ISurveyCatalog;
  spread?: ISurveySpread | null;
  nodes: ISpreadNode[];
  links: ISpreadLinkRef[];
  pipeline: ISurveyPipelineNode[];
  equipmentById: Record<string, ISurveyEquipment>;
  considered: Record<string, boolean> | null;
  bidNumber: string | null;
}

const DATA_TYPE_WORDS: { type: SurveyDataType; words: string[] }[] = [
  { type: "position", words: ["position", "posicao", "fix", "navigation", "navegacao"] },
  { type: "heading", words: ["heading", "proa", "rumo", "azimuth"] },
  { type: "motion", words: ["motion", "movimento", "heave", "pitch", "roll", "attitude"] },
  { type: "depth", words: ["depth", "profundidade"] },
  { type: "altitude", words: ["altitude", "altura"] },
  { type: "sound-velocity", words: ["sound velocity", "velocidade do som", "svp", "svp profile"] },
  { type: "bathymetry", words: ["bathymetry", "batimetria", "multibeam", "multifeixe", "seabed"] },
  { type: "acoustic-position", words: ["acoustic position", "posicao acustica", "usbl", "lbl", "beacon"] },
  { type: "pipe-tracking", words: ["pipe tracking", "rastreamento de duto", "pipe", "pipeline tracking"] },
  { type: "video", words: ["video", "overlay", "camera"] },
  { type: "time-sync", words: ["time sync", "timing", "pps", "zda", "sincronizacao"] },
  { type: "corrections", words: ["corrections", "correcoes", "rtk", "gnss corrections", "differential"] },
  { type: "comms", words: ["comms", "comunicacao", "communication", "telemetry"] },
];

const DATA_TYPE_LABEL: Record<SurveyDataType, string> = {
  position: "position",
  heading: "heading",
  motion: "motion",
  depth: "depth",
  altitude: "altitude",
  "sound-velocity": "sound velocity",
  bathymetry: "bathymetry",
  "acoustic-position": "acoustic position",
  "pipe-tracking": "pipe tracking",
  video: "video",
  "time-sync": "time sync",
  corrections: "GNSS corrections",
  comms: "comms",
};

/** Lowercase, strip accents, collapse whitespace — so pt-BR and English match the same keywords. */
const normalize = (s: string): string =>
  (s || "")
    .toLowerCase()
    .replace(/[áàâãä]/g, "a")
    .replace(/[éèêë]/g, "e")
    .replace(/[íìîï]/g, "i")
    .replace(/[óòôõö]/g, "o")
    .replace(/[úùûü]/g, "u")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9#\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const hasAny = (q: string, words: string[]): boolean =>
  words.some((w) => q.indexOf(normalize(w)) >= 0);

interface IEquipmentMatch {
  eq: ISurveyEquipment;
  node?: ISpreadNode;
  matched: string;
}

/** Best equipment mentioned in the question: the longest catalog name found as a substring. */
const findEquipment = (q: string, ctx: ISurveyQueryContext): IEquipmentMatch | null => {
  let best: IEquipmentMatch | null = null;
  ctx.catalog.equipment.forEach((eq) => {
    const names: string[] = [eq.title, eq.model].concat(eq.aliases || []);
    names.forEach((raw) => {
      const name = normalize(raw);
      if (name.length < 3) return;
      if (q.indexOf(name) < 0) return;
      if (!best || name.length > best.matched.length) {
        const node = ctx.nodes.filter((n) => n.equipmentId === eq.id && n.source !== "catalog")[0];
        best = { eq, node, matched: name };
      }
    });
  });
  return best;
};

const uniqueLabels = (labels: string[]): string[] => {
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  labels.forEach((l) => {
    const key = l.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    out.push(l);
  });
  return out;
};

const empty = (intent: string, title: string, text: string): ISurveyAnswer => ({
  kind: "empty",
  intent,
  title,
  text,
});

/** Immediate wiring neighbours of a spread node, as readable equipment labels. */
const neighbourLabels = (nodeId: string, ctx: ISurveyQueryContext): string[] => {
  const labelOf = (id: string): string => {
    const node = ctx.nodes.filter((n) => n.id === id)[0];
    if (node) return node.label;
    const eq = ctx.equipmentById[id.split("#")[0]];
    return eq ? eq.title : id;
  };
  const out: string[] = [];
  ctx.links.forEach((l) => {
    if (l.from === nodeId) out.push(labelOf(l.to));
    else if (l.to === nodeId) out.push(labelOf(l.from));
  });
  return uniqueLabels(out);
};

// ---- Intent handlers (first non-null wins) ----

const answerFailure = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["fail", "fails", "fail?", "falha", "falhar", "cai", "cair", "down", "breaks", "lose", "quebra", "pane"]))
    return null;
  const match = findEquipment(q, ctx);
  if (!match) return null;
  if (!match.node) {
    return empty(
      "failure",
      match.eq.title,
      `${match.eq.title} is in the catalog but not wired into this spread, so there is no cascade to simulate here.`,
    );
  }
  const impact = computeFailureImpact(
    match.node.id,
    ctx.nodes,
    ctx.links,
    ctx.pipeline,
    ctx.equipmentById,
  );
  const bullets: string[] = [];
  bullets.push(
    impact.offlineNodeIds.length > 0
      ? `${impact.offlineNodeIds.length} node${impact.offlineNodeIds.length === 1 ? "" : "s"} lose their path to the online hub.`
      : "No other node loses the hub — the loss is contained to this item.",
  );
  if (impact.lostDataTypes.length)
    bullets.push(`Data lost: ${impact.lostDataTypes.join(", ")}.`);
  if (impact.lostDeliverables.length)
    bullets.push(`Deliverables hit: ${impact.lostDeliverables.join(", ")}.`);
  if (impact.directVictimLabels.length)
    bullets.push(`Directly wired to: ${impact.directVictimLabels.slice(0, 6).join(", ")}.`);
  if (impact.partial)
    bullets.push("Wiring-only estimate — the catalog lacks full data-flow annotations here.");
  return {
    kind: "answer",
    intent: "failure",
    title: `If ${match.eq.title} fails`,
    text:
      impact.offlineNodeIds.length > 0
        ? `Losing ${match.eq.title} cascades across the spread. Open "What if it fails?" and click it to see the dimmed nodes.`
        : `${match.eq.title} fails without cascading — its own data stops, but the rest keeps its path to the hub.`,
    bullets,
    chips: [{ id: match.eq.id, label: match.eq.title, tone: "bad" }],
    focusNodeId: match.node.id,
  };
};

const answerConnections = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["connect", "connects", "connected", "conecta", "conectado", "liga", "ligado", "wired", "cabo", "cable", "feeds", "talks to"]))
    return null;
  const match = findEquipment(q, ctx);
  if (!match) return null;
  let labels: string[] = [];
  if (match.node) labels = neighbourLabels(match.node.id, ctx);
  if (!labels.length) labels = uniqueLabels(match.eq.connectsTo || []);
  if (!labels.length) {
    return empty(
      "connections",
      match.eq.title,
      `No wiring is recorded for ${match.eq.title} in this spread.`,
    );
  }
  return {
    kind: "answer",
    intent: "connections",
    title: `${match.eq.title} connects to`,
    text: `${match.eq.title} is wired to ${labels.length} item${labels.length === 1 ? "" : "s"} in this spread.`,
    bullets: labels.slice(0, 10),
    chips: [{ id: match.eq.id, label: match.eq.title }],
    focusNodeId: match.node ? match.node.id : null,
  };
};

const answerInBid = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["in the bid", "no bid", "na bid", "considered", "considerad", "cotad", "priced", "included", "incluido"]))
    return null;
  const match = findEquipment(q, ctx);
  if (!match) return null;
  if (!ctx.considered) {
    return empty(
      "in-bid",
      match.eq.title,
      "Select a BID in the header first, then I can tell you whether it covers this item.",
    );
  }
  const inBid = !!ctx.considered[match.eq.id];
  return {
    kind: "answer",
    intent: "in-bid",
    title: match.eq.title,
    text: inBid
      ? `Yes — ${match.eq.title} is considered in ${ctx.bidNumber || "the selected BID"}.`
      : `No — ${match.eq.title} is not covered by ${ctx.bidNumber || "the selected BID"} yet.`,
    chips: [{ id: match.eq.id, label: match.eq.title, tone: inBid ? "good" : "bad" }],
    focusNodeId: match.node ? match.node.id : null,
  };
};

const answerMissing = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["missing", "falta", "faltando", "gap", "left out", "fora do bid", "not in the bid", "nao esta no bid"]))
    return null;
  if (!ctx.spread) return null;
  if (!ctx.considered) {
    return empty(
      "missing",
      "BID gap",
      "Select a BID in the header first, then I can list what this spread needs that the BID is missing.",
    );
  }
  const seen: Record<string, boolean> = {};
  const chips: ISurveyAnswerChip[] = [];
  ctx.spread.zones.forEach((z) =>
    z.lines.forEach((l) => {
      if (seen[l.equipmentId] || l.vesselSupplied) return;
      seen[l.equipmentId] = true;
      if (!ctx.considered![l.equipmentId]) {
        const eq = ctx.equipmentById[l.equipmentId];
        chips.push({ id: l.equipmentId, label: eq ? eq.title : l.equipmentId, tone: "bad" });
      }
    }),
  );
  if (!chips.length) {
    return {
      kind: "answer",
      intent: "missing",
      title: "BID gap",
      text: `Every priced item in this spread is already covered by ${ctx.bidNumber || "the BID"}.`,
    };
  }
  return {
    kind: "answer",
    intent: "missing",
    title: "Missing from the BID",
    text: `${chips.length} priced spread item${chips.length === 1 ? "" : "s"} are not covered by ${ctx.bidNumber || "the BID"} yet.`,
    chips,
  };
};

const answerWhere = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["where", "onde", "which room", "qual sala", "qual zona", "located", "fica", "room", "sala"]))
    return null;
  const match = findEquipment(q, ctx);
  if (!match || !match.node) return null;
  const zone = (ctx.spread?.zones || []).filter((z) => z.id === match.node!.zoneId)[0];
  if (!zone) return null;
  return {
    kind: "answer",
    intent: "where",
    title: match.eq.title,
    text: `${match.eq.title} sits in the "${zone.title}" area of the spread.`,
    chips: [{ id: match.eq.id, label: match.eq.title }],
    focusNodeId: match.node.id,
  };
};

const answerProduces = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["produce", "produz", "gives", "source of", "fonte de", "measures", "mede", "what makes", "origin"]))
    return null;
  const hit = DATA_TYPE_WORDS.filter((d) => hasAny(q, d.words))[0];
  if (!hit) return null;
  const chips: ISurveyAnswerChip[] = [];
  const seen: Record<string, boolean> = {};
  ctx.nodes.forEach((n) => {
    if (seen[n.equipmentId]) return;
    const eq = ctx.equipmentById[n.equipmentId];
    if (eq && eq.dataTypes && eq.dataTypes.indexOf(hit.type) >= 0) {
      seen[n.equipmentId] = true;
      chips.push({ id: eq.id, label: eq.title, tone: "good" });
    }
  });
  if (!chips.length) {
    return empty(
      "produces",
      DATA_TYPE_LABEL[hit.type],
      `No equipment in this spread is annotated as a source of ${DATA_TYPE_LABEL[hit.type]}.`,
    );
  }
  return {
    kind: "answer",
    intent: "produces",
    title: `Sources of ${DATA_TYPE_LABEL[hit.type]}`,
    text: `${chips.length} item${chips.length === 1 ? "" : "s"} in this spread carry ${DATA_TYPE_LABEL[hit.type]}.`,
    chips,
  };
};

const answerCount = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  if (!hasAny(q, ["how many", "quantos", "quantas", "count", "number of", "numero de"])) return null;
  const family = ctx.catalog.families.filter((f) => q.indexOf(normalize(f.title)) >= 0)[0];
  if (family) {
    let count = 0;
    const seen: Record<string, boolean> = {};
    ctx.nodes.forEach((n) => {
      if (seen[n.equipmentId]) return;
      const eq = ctx.equipmentById[n.equipmentId];
      if (eq && eq.familyId === family.id) {
        seen[n.equipmentId] = true;
        count++;
      }
    });
    return {
      kind: "answer",
      intent: "count",
      title: family.title,
      text: `This spread has ${count} ${family.title.toLowerCase()} item${count === 1 ? "" : "s"}.`,
    };
  }
  const total = new Array<string>();
  const seen: Record<string, boolean> = {};
  ctx.nodes.forEach((n) => {
    if (n.source === "catalog" || seen[n.equipmentId]) return;
    seen[n.equipmentId] = true;
    total.push(n.equipmentId);
  });
  return {
    kind: "answer",
    intent: "count",
    title: "Spread size",
    text: `This spread wires ${total.length} distinct equipment items across ${(ctx.spread?.zones || []).filter((z) => z.sceneAnchor).length} rooms.`,
  };
};

const DEFINE_CUES_PT = [
  "o que e",
  "o que sao",
  "explique",
  "explica",
  "significa",
  "quer dizer",
  "para que serve",
  "como funciona",
  "definicao",
];
const DEFINE_CUES_EN = [
  "what is",
  "what are",
  "what s",
  "whats",
  "explain",
  "mean",
  "define",
  "stand for",
  "how does",
  "how do",
];

/** Explains a glossary term ("o que é NMEA?"); a more specific equipment name in the question wins instead. */
const answerDefine = (q: string, ctx: ISurveyQueryContext, raw: string): ISurveyAnswer | null => {
  const hit = findGlossaryTerm(raw);
  if (!hit) return null;
  const matched = normalize(hit.matched);
  const pt = hasAny(q, DEFINE_CUES_PT);
  const cued = pt || hasAny(q, DEFINE_CUES_EN);
  if (!cued && q !== matched) return null;
  const eqMatch = findEquipment(q, ctx);
  if (eqMatch && eqMatch.matched.length > matched.length) return null;
  const lang: SurveyLang = pt ? "pt" : cued ? "en" : loadGlossaryLang();
  const term = hit.term;
  const bullets: string[] = [];
  if (term.analogy)
    bullets.push(`${lang === "pt" ? "Analogia" : "Analogy"}: ${localize(term.analogy, lang)}`);
  (term.details || []).slice(0, 2).forEach((d) => bullets.push(localize(d, lang)));
  if (term.bidNote)
    bullets.push(`${lang === "pt" ? "No BID" : "In a BID"}: ${localize(term.bidNote, lang)}`);
  const chips: ISurveyAnswerChip[] = [];
  (term.equipmentIds || []).forEach((id) => {
    const eq = ctx.equipmentById[id];
    if (eq && chips.length < 6) chips.push({ id, label: eq.title });
  });
  return {
    kind: "answer",
    intent: "define",
    title: term.fullName ? `${term.term} · ${localize(term.fullName, lang)}` : term.term,
    text: localize(term.oneLiner, lang),
    bullets: bullets.length ? bullets : undefined,
    chips: chips.length ? chips : undefined,
    glossaryTermId: term.id,
  };
};

const answerWhatIs = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  const match = findEquipment(q, ctx);
  if (!match) return null;
  const eq = match.eq;
  const text = eq.whatDoesItDo || eq.summary || eq.whatIsIt || `${eq.title} — ${eq.technology}.`;
  const bullets: string[] = [];
  if (eq.whatIsIt && eq.whatIsIt !== text) bullets.push(eq.whatIsIt);
  if (eq.bidConsiderations && eq.bidConsiderations.length)
    bullets.push(`BID note: ${eq.bidConsiderations[0]}`);
  return {
    kind: "answer",
    intent: "what-is",
    title: eq.title,
    text,
    bullets: bullets.length ? bullets : undefined,
    chips: [{ id: eq.id, label: eq.title }],
    focusNodeId: match.node ? match.node.id : null,
  };
};

const answerSearch = (q: string, ctx: ISurveyQueryContext): ISurveyAnswer | null => {
  const tokens = q.split(" ").filter((t) => t.length >= 3);
  if (!tokens.length) return null;
  const chips: ISurveyAnswerChip[] = [];
  const seen: Record<string, boolean> = {};
  ctx.catalog.equipment.forEach((eq) => {
    if (chips.length >= 8 || seen[eq.id]) return;
    const hay = normalize(
      [eq.title, eq.technology, eq.model, eq.manufacturer].concat(eq.aliases || []).join(" "),
    );
    if (tokens.some((t) => hay.indexOf(t) >= 0)) {
      seen[eq.id] = true;
      chips.push({ id: eq.id, label: eq.title });
    }
  });
  if (!chips.length) return null;
  return {
    kind: "answer",
    intent: "search",
    title: "Closest matches",
    text: "I couldn't map that to a specific question, but these catalog items look related:",
    chips,
  };
};

const HANDLERS: ((q: string, ctx: ISurveyQueryContext, raw: string) => ISurveyAnswer | null)[] = [
  answerFailure,
  answerConnections,
  answerInBid,
  answerMissing,
  answerWhere,
  answerProduces,
  answerCount,
  answerDefine,
  answerWhatIs,
  answerSearch,
];

/** Answers a plain-language question about the active spread / catalog. */
export function answerSurveyQuery(raw: string, ctx: ISurveyQueryContext): ISurveyAnswer {
  const q = normalize(raw);
  if (q.length < 2 || !ctx.catalog.equipment.length) {
    return empty("none", "Ask about the spread", "Try: \u201Cwhat does the USBL do?\u201D or \u201Cwhat fails if the switch dies?\u201D");
  }
  for (let i = 0; i < HANDLERS.length; i++) {
    const answer = HANDLERS[i](q, ctx, raw);
    if (answer) return answer;
  }
  return empty(
    "none",
    "No match",
    "I couldn't answer that from the catalog. Try naming an equipment, or ask what fails, what connects, or what's missing from the BID.",
  );
}

/** Example prompts shown in the ask panel to teach what the engine understands. */
export const SURVEY_QUERY_EXAMPLES: string[] = [
  "What does the USBL do?",
  "What fails if the network switch dies?",
  "What connects to the online PC?",
  "What's missing from the BID?",
  "What produces position?",
  "O que é NMEA?",
  "What is PPS?",
];

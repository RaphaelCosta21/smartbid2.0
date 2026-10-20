/**
 * surveyGlossary.ts - Lookup, auto-link matching and cable-protocol heuristics for the survey glossary.
 *
 * Pure helpers (no React). The matcher is accent- and case-insensitive, requires word boundaries
 * (no regex lookbehind: ES5 target) and keeps short all-caps acronyms case-sensitive so "ins" or "dop"
 * in running prose do not link to INS / DOP.
 */
import {
  ILocalizedText,
  ISurveyEquipment,
  ISurveyGlossaryTerm,
  SurveyLang,
  SurveyLinkKind,
} from "../models";
import { SURVEY_GLOSSARY } from "../config/surveyGlossary";
import { ISpreadLinkRef, ISpreadNode, resolveSceneShape } from "./surveySpreadGraph";

const TERM_BY_ID: Record<string, ISurveyGlossaryTerm> = {};
SURVEY_GLOSSARY.forEach((term) => (TERM_BY_ID[term.id] = term));

export function getGlossaryTerm(id: string): ISurveyGlossaryTerm | undefined {
  return TERM_BY_ID[id];
}

export function localize(text: ILocalizedText | undefined, lang: SurveyLang): string {
  return text ? text[lang] || text.en : "";
}

// ---- Language preference ----

const LANG_KEY = "smartbid.survey.lang";

export function loadGlossaryLang(): SurveyLang {
  try {
    const saved = window.localStorage.getItem(LANG_KEY);
    if (saved === "pt" || saved === "en") return saved;
  } catch (e) {
    // storage unavailable: fall through to the browser language
  }
  const nav = typeof navigator !== "undefined" ? navigator.language || "" : "";
  return nav.toLowerCase().indexOf("pt") === 0 ? "pt" : "en";
}

export function saveGlossaryLang(lang: SurveyLang): void {
  try {
    window.localStorage.setItem(LANG_KEY, lang);
  } catch (e) {
    // silent: the preference just won't persist
  }
}

// ---- Matching ----

const FOLD_FROM = "áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ";
const FOLD_TO = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
const FOLD_RE = new RegExp("[" + FOLD_FROM + "]", "g");

/** Strips accents one character for one, so indexes stay valid on the original text. */
const fold = (s: string): string =>
  s.replace(FOLD_RE, (ch) => FOLD_TO.charAt(FOLD_FROM.indexOf(ch)));

const isWordChar = (ch: string): boolean => /[A-Za-z0-9]/.test(ch);

const escapeRe = (s: string): string => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

interface INeedle {
  raw: string;
  termId: string;
  /** Short all-caps acronyms must match the exact case. */
  strictCase: boolean;
}

interface IMatcher {
  re: RegExp;
  byKey: Record<string, INeedle>;
}

let matcher: IMatcher | null = null;

const getMatcher = (): IMatcher => {
  if (matcher) return matcher;
  const byKey: Record<string, INeedle> = {};
  SURVEY_GLOSSARY.forEach((term) => {
    [term.term].concat(term.aliases).forEach((raw) => {
      const key = fold(raw).toLowerCase();
      if (!key || byKey[key]) return;
      byKey[key] = {
        raw,
        termId: term.id,
        strictCase: raw.length <= 4 && raw === raw.toUpperCase() && /[A-Z]/.test(raw),
      };
    });
  });
  const keys = Object.keys(byKey).sort((a, b) => b.length - a.length);
  matcher = { re: new RegExp(keys.map(escapeRe).join("|"), "gi"), byKey };
  return matcher;
};

export interface IGlossaryMention {
  termId: string;
  index: number;
  text: string;
}

/** Every glossary mention in the text, left to right, longest alias first. */
export function scanGlossary(text: string): IGlossaryMention[] {
  const out: IGlossaryMention[] = [];
  if (!text) return out;
  const { re, byKey } = getMatcher();
  const folded = fold(text);
  re.lastIndex = 0;
  let m: RegExpExecArray | null = re.exec(folded);
  while (m) {
    const hit = m[0];
    const start = m.index;
    const end = start + hit.length;
    const needle = byKey[hit.toLowerCase()];
    const before = start > 0 ? folded.charAt(start - 1) : "";
    const after = end < folded.length ? folded.charAt(end) : "";
    const leftOk = !isWordChar(hit.charAt(0)) || !before || !isWordChar(before);
    const rightOk = !isWordChar(hit.charAt(hit.length - 1)) || !after || !isWordChar(after);
    const caseOk = !needle || !needle.strictCase || text.slice(start, end) === needle.raw;
    if (needle && leftOk && rightOk && caseOk) {
      out.push({
        termId: needle.termId,
        index: start,
        text: text.slice(start, end),
      });
    } else {
      re.lastIndex = start + 1;
    }
    m = re.exec(folded);
  }
  return out;
}

export interface IGlossarySegment {
  text: string;
  termId?: string;
}

/** Splits text into plain and glossary segments; only the first mention of each term is linked unless `all`. */
export function splitByGlossary(text: string, opts?: { all?: boolean }): IGlossarySegment[] {
  const mentions = scanGlossary(text);
  if (!mentions.length) return [{ text }];
  const seen: Record<string, boolean> = {};
  const segments: IGlossarySegment[] = [];
  let cursor = 0;
  mentions.forEach((mention) => {
    if (!(opts && opts.all) && seen[mention.termId]) return;
    seen[mention.termId] = true;
    if (mention.index > cursor) segments.push({ text: text.slice(cursor, mention.index) });
    segments.push({ text: mention.text, termId: mention.termId });
    cursor = mention.index + mention.text.length;
  });
  if (cursor < text.length) segments.push({ text: text.slice(cursor) });
  return segments;
}

/** Terms whose name, aliases, full name or one-liner contain every word of the query. */
export function searchGlossary(query: string, lang: SurveyLang): ISurveyGlossaryTerm[] {
  const words = fold(query).toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return SURVEY_GLOSSARY;
  return SURVEY_GLOSSARY.filter((term) => {
    const hay = fold(
      [term.term, term.fullName ? term.fullName[lang] : "", term.oneLiner[lang]]
        .concat(term.aliases)
        .join(" "),
    ).toLowerCase();
    return words.every((w) => hay.indexOf(w) >= 0);
  });
}

// ---- Cable protocols (heuristic) ----

type EndpointClass = "serial-box" | "network" | "nmea-sensor" | "other";

const NETWORK_SHAPES = ["switch", "workstation", "rack", "monitor", "network-cloud", "printer"];
const NMEA_SENSOR_SHAPES = ["gyro", "receiver", "gnss-dome"];
/** Serial lines whose strings are vendor specific, not NMEA (so the cable is not labelled NMEA). */
const SERIAL_ONLY_IDS = ["barometer", "rov-instrument-rack"];
/** Boxes the scene draws like serial servers although they are not (Ethernet side only). */
const ETHERNET_ONLY_IDS = ["bullet-poe"];

const classify = (eq: ISurveyEquipment | undefined): EndpointClass => {
  if (!eq) return "other";
  if (ETHERNET_ONLY_IDS.indexOf(eq.id) >= 0) return "network";
  if (SERIAL_ONLY_IDS.indexOf(eq.id) >= 0) return "other";
  const shape = resolveSceneShape(eq);
  if (shape === "serial-box") return "serial-box";
  if (NETWORK_SHAPES.indexOf(shape) >= 0) return "network";
  if (NMEA_SENSOR_SHAPES.indexOf(shape) >= 0) return "nmea-sensor";
  return "other";
};

const textOf = (eq: ISurveyEquipment | undefined): string =>
  eq ? `${eq.title} ${eq.technology} ${eq.model}` : "";

/**
 * Typical protocols a cable carries, inferred from its kind and the shapes at its ends.
 * This is a heuristic (not read from the catalog), so the UI labels it "typical".
 */
export function protocolsForLink(
  kind: SurveyLinkKind,
  from?: ISurveyEquipment,
  to?: ISurveyEquipment,
): string[] {
  const a = classify(from);
  const b = classify(to);
  const pair = [a, b];
  const has = (c: EndpointClass): boolean => pair.indexOf(c) >= 0;
  switch (kind) {
    case "timing":
      return ["pps", "nmea-zda"];
    case "data":
      if (has("serial-box") && has("network")) return ["tcp-ip", "serial-server"];
      if (has("serial-box")) {
        const vendorSerial = [from, to].some((e) => !!e && SERIAL_ONLY_IDS.indexOf(e.id) >= 0);
        return vendorSerial ? ["serial"] : ["serial", "nmea-0183"];
      }
      if (has("network")) return ["tcp-ip"];
      if (has("nmea-sensor")) return ["serial", "nmea-0183"];
      return [];
    case "rf":
      return /gnss|gps|c-nav|hemisphere|iridium/i.test(textOf(from) + textOf(to)) ? ["gnss"] : [];
    case "acoustic":
      return /lbl|compatt/i.test(textOf(from) + textOf(to))
        ? ["lbl", "transponder"]
        : ["usbl", "transponder"];
    default:
      return [];
  }
}

/** Protocols across several cables (e.g. a trunk), most frequent first. */
export function protocolsForLinkRefs(
  links: ISpreadLinkRef[],
  nodeById: Record<string, ISpreadNode>,
  equipmentById: Record<string, ISurveyEquipment>,
): string[] {
  const counts: Record<string, number> = {};
  const order: string[] = [];
  links.forEach((l) => {
    const from = nodeById[l.from] ? equipmentById[nodeById[l.from].equipmentId] : undefined;
    const to = nodeById[l.to] ? equipmentById[nodeById[l.to].equipmentId] : undefined;
    protocolsForLink(l.kind, from, to).forEach((id) => {
      if (!TERM_BY_ID[id]) return;
      if (!counts[id]) order.push(id);
      counts[id] = (counts[id] || 0) + 1;
    });
  });
  return order
    .map((id, i) => ({ id, i }))
    .sort((x, y) => counts[y.id] - counts[x.id] || x.i - y.i)
    .map((x) => x.id);
}

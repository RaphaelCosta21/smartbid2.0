/**
 * supplierMatching — Name normalization and matching so one company is never
 * registered twice under different spellings ("VATES" vs "VATES FERRAMENTAS
 * ESPECIAIS R.O.V LTDA"). Pure functions over ISupplier.
 */
import { ISupplier } from "../models";
import { normalizeText } from "./pastBidHelpers";

const LEGAL_SUFFIXES = [
  "ltda",
  "ltd",
  "limited",
  "me",
  "epp",
  "eireli",
  "sa",
  "inc",
  "incorporated",
  "llc",
  "llp",
  "lp",
  "corp",
  "corporation",
  "co",
  "company",
  "cia",
  "gmbh",
  "ag",
  "bv",
  "nv",
  "plc",
  "srl",
  "spa",
  "sas",
  "pty",
  "oy",
  "ab",
];
const CONNECTORS = ["e", "and"];

/** Accent/case-free, dotted abbreviations joined ("R.O.V" -> "rov", "S/A" -> "sa"). */
function looseText(value: string): string {
  return normalizeText(value)
    .replace(/&/g, " and ")
    .replace(/[.'`\u00b4/]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function supplierTokens(name: string): string[] {
  const text = looseText(name);
  const tokens = text ? text.split(" ") : [];
  let stripped = false;
  while (tokens.length > 1) {
    const last = tokens[tokens.length - 1];
    if (LEGAL_SUFFIXES.indexOf(last) >= 0) {
      tokens.pop();
      stripped = true;
    } else if (stripped && CONNECTORS.indexOf(last) >= 0) {
      tokens.pop();
    } else {
      break;
    }
  }
  return tokens;
}

/** Comparison key: loose text without trailing legal-form suffixes. */
export function normalizeSupplierName(name: string): string {
  return supplierTokens(name).join(" ");
}

/** Short trade name: drops trailing legal-form words, keeping the original casing. */
export function toTradeName(raw: string): string {
  const words = (raw || "").trim().split(/\s+/).filter(Boolean);
  const isSuffix = (w: string): boolean =>
    LEGAL_SUFFIXES.indexOf(looseText(w).replace(/ /g, "")) >= 0;
  while (words.length > 1) {
    const last = words[words.length - 1];
    if (isSuffix(last) || /^[-,.&]+$/.test(last)) {
      words.pop();
    } else if (words.length > 2 && isSuffix(words[words.length - 2] + last)) {
      words.splice(words.length - 2, 2);
    } else {
      break;
    }
  }
  return words.join(" ").replace(/[\s,\-&]+$/, "");
}

function supplierKeys(s: ISupplier): string[] {
  return [s.name].concat(s.aliases || []).map(normalizeSupplierName);
}

/**
 * Deterministic match on the normalized name or any alias. This is the only
 * match that may rename a value automatically.
 */
export function findSupplierMatch(
  name: string,
  suppliers: ISupplier[],
): ISupplier | undefined {
  const key = normalizeSupplierName(name);
  if (!key) return undefined;
  const byName = suppliers.find((s) => normalizeSupplierName(s.name) === key);
  if (byName) return byName;
  return suppliers.find((s) =>
    (s.aliases || []).some((a) => normalizeSupplierName(a) === key),
  );
}

/** The registered name for a typed/extracted name, or the trimmed input. */
export function canonicalSupplierName(
  name: string,
  suppliers: ISupplier[],
): string {
  const match = findSupplierMatch(name, suppliers);
  return match ? match.name : (name || "").trim();
}

/**
 * Suggestion only: a registered name whose words start the typed name (or the
 * other way round), e.g. "VATES" for "VATES FERRAMENTAS ESPECIAIS ROV".
 */
export function findPossibleMatch(
  name: string,
  suppliers: ISupplier[],
): ISupplier | undefined {
  const tokens = supplierTokens(name);
  if (tokens.length === 0) return undefined;
  let best: ISupplier | undefined;
  let bestLength = 0;
  suppliers.forEach((s) => {
    supplierKeys(s).forEach((key) => {
      const other = key ? key.split(" ") : [];
      const shorter = other.length < tokens.length ? other : tokens;
      const longer = other.length < tokens.length ? tokens : other;
      if (shorter.length === 0 || shorter.length === longer.length) return;
      if (shorter.join(" ").length < 3) return;
      const isPrefix = shorter.every((t, i) => longer[i] === t);
      if (isPrefix && shorter.length > bestLength) {
        best = s;
        bestLength = shorter.length;
      }
    });
  });
  return best;
}

export interface ISupplierSuggestion {
  supplier: ISupplier;
  /** Alias that matched the query, when the name itself did not. */
  matchedAlias?: string;
}

/** Combobox suggestions ranked by name prefix, word prefix, then contains. */
export function rankSupplierSuggestions(
  query: string,
  suppliers: ISupplier[],
  limit: number,
): ISupplierSuggestion[] {
  const q = looseText(query);
  const byName = (a: ISupplier, b: ISupplier): number =>
    a.name.localeCompare(b.name);
  if (!q) {
    return suppliers
      .slice()
      .sort((a, b) => Number(b.active) - Number(a.active) || byName(a, b))
      .slice(0, limit)
      .map((supplier) => ({ supplier }));
  }
  const scored: Array<ISupplierSuggestion & { score: number }> = [];
  suppliers.forEach((supplier) => {
    const name = looseText(supplier.name);
    let score = 0;
    if (name.indexOf(q) === 0) score = 4;
    else if ((" " + name).indexOf(" " + q) >= 0) score = 3;
    else if (name.indexOf(q) >= 0) score = 2;
    let matchedAlias: string | undefined;
    if (score === 0) {
      matchedAlias = (supplier.aliases || []).find(
        (a) => looseText(a).indexOf(q) >= 0,
      );
      if (matchedAlias) score = 1;
    }
    if (score > 0) scored.push({ supplier, matchedAlias, score });
  });
  return scored
    .sort((a, b) => b.score - a.score || byName(a.supplier, b.supplier))
    .slice(0, limit)
    .map(({ supplier, matchedAlias }) => ({ supplier, matchedAlias }));
}

/** Maps every normalized name/alias to its supplier, for bulk lookups. */
export function buildSupplierKeyIndex(
  suppliers: ISupplier[],
): Record<string, ISupplier> {
  const index: Record<string, ISupplier> = {};
  suppliers.forEach((s) => {
    supplierKeys(s).forEach((key) => {
      if (key && !index[key]) index[key] = s;
    });
  });
  // Names win over aliases when both collide.
  suppliers.forEach((s) => {
    const key = normalizeSupplierName(s.name);
    if (key) index[key] = s;
  });
  return index;
}

/**
 * Scope of Supply helpers shared by Scope, Assets Breakdown and cost search.
 */

/** "Development" is legacy: merged into Eng. Solutions, still found on older BIDs */
const ENG_SOLUTIONS_SUBTYPES = ["eng. solutions", "development"];

/** Sub-types that auto-flag ENG? and enable the Preliminary Concept Form */
export function isEngSolutionsSubType(subType: string | undefined): boolean {
  return (
    ENG_SOLUTIONS_SUBTYPES.indexOf((subType || "").trim().toLowerCase()) >= 0
  );
}

export const PN_NOT_APPLICABLE = "N/A";
export const PN_TO_CONFIRM = "TBC";

/** True for the exact values written by the PN marker menu */
export function isPartNumberMarker(pn: string | undefined): boolean {
  const v = (pn || "").trim().toUpperCase();
  return v === PN_NOT_APPLICABLE || v === PN_TO_CONFIRM;
}

/** Placeholder spellings compared with accents, spaces and punctuation stripped */
const PN_PLACEHOLDER_WORDS = [
  "NA",
  "NAP",
  "ND",
  "TBD",
  "TBC",
  "TBA",
  "TBI",
  "NONE",
  "NIL",
  "NULL",
  "UNKNOWN",
  "NOPN",
  "NOTAPPLICABLE",
  "NOTAVAILABLE",
  "TOBECONFIRMED",
  "TOBEDEFINED",
  "TOBEADVISED",
  "NAOAPLICAVEL",
  "NAOSEAPLICA",
  "SEMPN",
  "ACONFIRMAR",
  "ADEFINIR",
];
const PN_PLACEHOLDER_PREFIXES = ["TBD", "TBC", "TBA"];

/**
 * True when the PN is a marker or a typed placeholder (N/A, NA, TBD, TBC, "-", "not applicable"...)
 * and must never be used for matching.
 */
export function isPlaceholderPartNumber(pn: string | undefined): boolean {
  const upper = (pn || "")
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
  if (!upper) return false;
  const tokens = upper.split(/[^A-Z0-9]+/).filter((t) => !!t);
  if (tokens.length === 0) return true;
  if (PN_PLACEHOLDER_WORDS.indexOf(tokens.join("")) >= 0) return true;
  // "TBC by supplier", "N/A - client to provide"
  if (PN_PLACEHOLDER_PREFIXES.indexOf(tokens[0]) >= 0) return true;
  return tokens[0] === "N" && tokens[1] === "A";
}

/** Real PN usable for searches/matching, or "" when blank or a placeholder */
export function searchablePartNumber(pn: string | undefined): string {
  const v = (pn || "").trim();
  return isPlaceholderPartNumber(v) ? "" : v;
}

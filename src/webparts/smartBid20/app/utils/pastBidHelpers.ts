/**
 * pastBidHelpers — Search, Knowledge Base status and "related BIDs" scoring for
 * the Past Bids page. Pure functions over IBid.
 */
import { IBid } from "../models";
import { getPastBidYear, mergeUnique } from "./pastBidDocument";

export type PastBidKbStatus = "published" | "failed" | "not-published";

export const PAST_BID_NO_OUTCOME = "Not recorded";

export const PAST_BID_KB_STATUS_LABELS: Record<PastBidKbStatus, string> = {
  published: "In Knowledge Base",
  failed: "Publish failed",
  "not-published": "Not published",
};

export function getPastBidKbStatus(bid: IBid): PastBidKbStatus {
  const doc = bid.knowledgeProfile && bid.knowledgeProfile.doc;
  if (!doc) return "not-published";
  return doc.status === "published" ? "published" : "failed";
}

/** Flat, sortable/filterable view of a past BID (Past Bids page, Favorites). */
export interface IPastBidRow {
  bid: IBid;
  bidNumber: string;
  client: string;
  project: string;
  division: string;
  serviceLine: string;
  completedDate: string;
  year: string;
  outcome: string;
  kbStatus: PastBidKbStatus;
  categories: string[];
  tags: string[];
  searchText: string;
}

export function toPastBidRow(bid: IBid): IPastBidRow {
  const profile = bid.knowledgeProfile;
  return {
    bid,
    bidNumber: bid.bidNumber,
    client: bid.opportunityInfo?.client || "",
    project: bid.opportunityInfo?.projectName || "",
    division: bid.division || "",
    serviceLine: bid.serviceLine || "",
    completedDate: bid.completedDate || "",
    year: getPastBidYear(bid),
    outcome: bid.bidResult?.outcome || PAST_BID_NO_OUTCOME,
    kbStatus: getPastBidKbStatus(bid),
    categories: profile ? profile.scopeCategories : [],
    tags: profile ? profile.tags : [],
    searchText: getPastBidSearchText(bid),
  };
}

/** Multi-select filter match: nothing selected, or any value selected. */
export function matchesAnyOf(selected: string[], values: string[]): boolean {
  return selected.length === 0 || values.some((v) => selected.indexOf(v) >= 0);
}

/** De-duplicated, sorted options for a MultiSelectDropdown. */
export function toFilterOptions(
  values: string[],
  descending?: boolean,
): { value: string; label: string }[] {
  const unique = mergeUnique(values).sort((a, b) => a.localeCompare(b));
  if (descending) unique.reverse();
  return unique.map((v) => ({ value: v, label: v }));
}

/** Lower-case and accent-free, so "Decomissionamento" matches "decomissionamento". */
export function normalizeText(value: string): string {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/** Everything the Past Bids search looks at, normalized once per BID. */
export function getPastBidSearchText(bid: IBid): string {
  const opp = bid.opportunityInfo;
  const profile = bid.knowledgeProfile;
  const parts: string[] = [
    bid.bidNumber,
    bid.crmNumber,
    bid.division,
    bid.serviceLine,
    opp?.client || "",
    opp?.projectName || "",
    opp?.projectDescription || "",
    opp?.vessel || "",
    opp?.field || "",
    opp?.region || "",
  ];
  if (profile) {
    parts.push(profile.summary || "");
    parts.push((profile.tags || []).join(" "));
    parts.push((profile.scopeCategories || []).join(" "));
  }
  (bid.scopeItems || []).forEach((i) => {
    parts.push(
      i.sectionTitle || "",
      i.description || "",
      i.equipmentOffer || "",
      i.partNumber || "",
      i.resourceType || "",
      i.resourceSubType || "",
    );
    (i.subItems || []).forEach((s) =>
      parts.push(
        s.description || "",
        s.equipmentOffer || "",
        s.partNumber || "",
      ),
    );
  });
  (bid.equipmentList || []).forEach((e) =>
    parts.push(e.toolDescription || "", e.partNumber || ""),
  );
  return normalizeText(parts.filter(Boolean).join(" \u2022 "));
}

/** Every whitespace-separated term of the query must appear in the text. */
export function matchesPastBidSearch(
  searchText: string,
  query: string,
): boolean {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  return terms.every((t) => searchText.indexOf(t) >= 0);
}

export interface IRelatedBid {
  bid: IBid;
  score: number;
  reasons: string[];
}

function lowerSet(values: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  (values || []).forEach((v) => {
    const t = (v || "").trim();
    if (t) out[t.toLowerCase()] = t;
  });
  return out;
}

function subTypes(bid: IBid): string[] {
  return (bid.scopeItems || [])
    .filter((i) => !i.isSection && i.resourceSubType)
    .map((i) => i.resourceSubType);
}

const MIN_RELATED_SCORE = 3;

/** Past BIDs that share tags, scope categories, client or equipment with `target`. */
export function findRelatedBids(
  target: IBid,
  candidates: IBid[],
  limit = 5,
): IRelatedBid[] {
  const tp = target.knowledgeProfile;
  const tTags = lowerSet(tp ? tp.tags : []);
  const tCats = lowerSet(tp ? tp.scopeCategories : []);
  const tSubs = lowerSet(subTypes(target));
  const tClient = (target.opportunityInfo?.client || "").trim().toLowerCase();

  const results: IRelatedBid[] = [];
  candidates.forEach((c) => {
    if (c.bidNumber === target.bidNumber) return;
    const cp = c.knowledgeProfile;
    let score = 0;
    const reasons: string[] = [];
    const counted: Record<string, boolean> = {};

    const cCats = lowerSet(cp ? cp.scopeCategories : []);
    Object.keys(cCats).forEach((k) => {
      if (tCats[k]) {
        score += 3;
        reasons.push(tCats[k]);
        counted[k] = true;
      }
    });
    const cTags = lowerSet(cp ? cp.tags : []);
    Object.keys(cTags).forEach((k) => {
      if (tTags[k] && !counted[k]) {
        score += 3;
        reasons.push(tTags[k]);
        counted[k] = true;
      }
    });
    let subHits = 0;
    const cSubs = lowerSet(subTypes(c));
    Object.keys(cSubs).forEach((k) => {
      if (tSubs[k] && !counted[k] && subHits < 3) {
        score += 1;
        subHits++;
        reasons.push(tSubs[k]);
        counted[k] = true;
      }
    });
    const cClient = (c.opportunityInfo?.client || "").trim().toLowerCase();
    if (tClient && cClient === tClient) {
      score += 2;
      reasons.unshift("Same client");
    }
    if (target.serviceLine && c.serviceLine === target.serviceLine) score += 1;
    else if (c.division === target.division) score += 1;

    if (score >= MIN_RELATED_SCORE) results.push({ bid: c, score, reasons });
  });

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.bid.completedDate || "").localeCompare(
        a.bid.completedDate || "",
      );
    })
    .slice(0, limit);
}

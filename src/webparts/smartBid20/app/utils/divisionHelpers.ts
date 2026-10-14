/**
 * Division / service line rules shared by the whole app.
 *
 * Business lines (OPG, ROV, SURVEY) are the teams of a BID. They match the
 * Members Management tags and drive the per-team tabs, ERNs, costs and approvals.
 */
import {
  BaseDivision,
  BusinessLine,
  IBid,
  IConfigOption,
  IIntegratedLines,
  ITeamMember,
} from "../models";

export const INTEGRATED_DIVISION = "INTEGRATED";
export const INTEGRATED_DIVISION_LABEL = "Integrated (OPG + SSR)";
/** SSR service line covering both ROV and Survey. */
export const SSR_INTEGRATED_SERVICE_LINE = "Integrated";
export const BASE_DIVISIONS: BaseDivision[] = ["OPG", "SSR"];

export type BidDivisionFields = Pick<IBid, "division" | "serviceLine"> &
  Partial<Pick<IBid, "leadDivision" | "integratedLines">>;

export function isIntegratedDivision(
  division: string | null | undefined,
): boolean {
  return (division || "").toUpperCase() === INTEGRATED_DIVISION;
}

export function otherBaseDivision(division: BaseDivision): BaseDivision {
  return division === "OPG" ? "SSR" : "OPG";
}

export function getLeadDivision(bid: BidDivisionFields): BaseDivision {
  return bid.leadDivision === "SSR" ? "SSR" : "OPG";
}

function ssrLines(serviceLine: string | null | undefined): BusinessLine[] {
  const sl = (serviceLine || "").trim().toLowerCase();
  if (sl === "rov") return ["ROV"];
  if (sl === "survey") return ["SURVEY"];
  if (sl === SSR_INTEGRATED_SERVICE_LINE.toLowerCase())
    return ["ROV", "SURVEY"];
  return [];
}

/** Teams of a division + service line pair. */
export function divisionBusinessLines(
  division: BaseDivision,
  serviceLine: string | null | undefined,
): BusinessLine[] {
  return division === "OPG" ? ["OPG"] : ssrLines(serviceLine);
}

/** Teams of a BID, lead first. Empty when the SSR service line is unknown. */
export function getBidBusinessLines(bid: BidDivisionFields): BusinessLine[] {
  const div: string = bid.division || "";
  if (isIntegratedDivision(div)) {
    const lines = bid.integratedLines || {};
    const lead = getLeadDivision(bid);
    const out: BusinessLine[] = [];
    [lead, otherBaseDivision(lead)].forEach((d) => {
      divisionBusinessLines(d, lines[d]).forEach((bl) => {
        if (out.indexOf(bl) < 0) out.push(bl);
      });
    });
    return out;
  }
  if (div === "OPG") return ["OPG"];
  if (div === "SSR-ROV") return ["ROV"];
  if (div === "SSR-Survey") return ["SURVEY"];
  if (div === "SSR-Integrated") return ["ROV", "SURVEY"];
  return ssrLines(bid.serviceLine);
}

export function hasMultipleBusinessLines(bid: BidDivisionFields): boolean {
  return getBidBusinessLines(bid).length > 1;
}

export function businessLineDivision(line: BusinessLine): BaseDivision {
  return line === "OPG" ? "OPG" : "SSR";
}

export function getBusinessLineLabel(line: BusinessLine | string): string {
  return line === "SURVEY" ? "Survey" : line;
}

/** Config service line value a team works under (used to resolve ERN choices). */
export function getBusinessLineServiceLine(
  bid: BidDivisionFields,
  line: BusinessLine,
): string {
  if (line === "ROV") return "ROV";
  if (line === "SURVEY") return "Survey";
  if (isIntegratedDivision(bid.division)) {
    return (bid.integratedLines || {}).OPG || "";
  }
  return bid.serviceLine || "";
}

/** Short team label, e.g. "OPG - UWILD", "SSR - ROV" or "Survey". */
export function getTrackLabel(
  bid: BidDivisionFields,
  line: BusinessLine,
): string {
  if (!isIntegratedDivision(bid.division)) return getBusinessLineLabel(line);
  const div = businessLineDivision(line);
  const sl = (bid.integratedLines || {})[div];
  return sl ? `${div} - ${sl}` : div;
}

/** Config service line values of a BID (both lines for INTEGRATED). */
export function getBidServiceLines(bid: BidDivisionFields): string[] {
  if (!isIntegratedDivision(bid.division)) {
    return bid.serviceLine ? [bid.serviceLine] : [];
  }
  const lines = bid.integratedLines || {};
  const lead = getLeadDivision(bid);
  return [lines[lead], lines[otherBaseDivision(lead)]].filter(
    (v): v is string => !!v,
  );
}

export function composeIntegratedServiceLine(
  lead: BaseDivision,
  lines: IIntegratedLines,
): string {
  return [lines[lead], lines[otherBaseDivision(lead)]]
    .filter(Boolean)
    .join(" + ");
}

/** Division fields to persist; clears the INTEGRATED-only fields for other divisions. */
export function buildDivisionFields(
  division: string,
  serviceLine: string,
  leadDivision?: BaseDivision,
  integratedLines?: IIntegratedLines,
): Pick<
  IBid,
  | "division"
  | "serviceLine"
  | "leadDivision"
  | "integratedLines"
  | "businessLines"
> {
  if (isIntegratedDivision(division)) {
    const lead: BaseDivision = leadDivision === "SSR" ? "SSR" : "OPG";
    const lines: IIntegratedLines = {
      OPG: (integratedLines || {}).OPG || "",
      SSR: (integratedLines || {}).SSR || "",
    };
    const fields = {
      division: INTEGRATED_DIVISION as IBid["division"],
      serviceLine: composeIntegratedServiceLine(lead, lines),
      leadDivision: lead,
      integratedLines: lines,
    };
    return { ...fields, businessLines: getBidBusinessLines(fields) };
  }
  const fields = {
    division: division as IBid["division"],
    serviceLine,
    leadDivision: undefined,
    integratedLines: undefined,
  };
  return { ...fields, businessLines: getBidBusinessLines(fields) };
}

/** Members tagged with any of the lines; OPG also accepts untagged members. */
export function memberMatchesBusinessLines(
  member: Pick<ITeamMember, "businessLines">,
  lines: BusinessLine[],
): boolean {
  const tags = member.businessLines || [];
  if (tags.length === 0) return lines.indexOf("OPG") >= 0;
  return lines.some((l) => tags.indexOf(l) >= 0);
}

/** Active service lines of a division; INTEGRATED lists both divisions' lines. */
export function serviceLineOptionsForDivision(
  serviceLines: IConfigOption[] | null | undefined,
  division: string,
): IConfigOption[] {
  const active = (serviceLines || []).filter((sl) => sl.isActive !== false);
  if (isIntegratedDivision(division)) {
    return active.filter(
      (sl) =>
        BASE_DIVISIONS.indexOf(sl.category as BaseDivision) >= 0 &&
        !isSsrIntegratedLine(sl),
    );
  }
  return active.filter((sl) => sl.category === division);
}

/** Service line choices of one division inside an INTEGRATED BID. */
export function integratedLineOptions(
  serviceLines: IConfigOption[] | null | undefined,
  division: BaseDivision,
): IConfigOption[] {
  return (serviceLines || []).filter(
    (sl) =>
      sl.isActive !== false &&
      sl.category === division &&
      !isSsrIntegratedLine(sl),
  );
}

function isSsrIntegratedLine(sl: IConfigOption): boolean {
  return (
    sl.category === "SSR" &&
    (sl.value || "").toLowerCase() === SSR_INTEGRATED_SERVICE_LINE.toLowerCase()
  );
}

type TaggedItem = { integratedDivision?: string };

function retagList<T extends TaggedItem>(
  list: T[] | undefined,
  removed: BusinessLine[],
  to: BusinessLine,
  counter: { n: number },
): T[] | undefined {
  if (!list) return list;
  let changed = false;
  const out = list.map((item) => {
    const tag = item.integratedDivision as BusinessLine | undefined;
    if (!tag || removed.indexOf(tag) < 0) return item;
    changed = true;
    counter.n++;
    return { ...item, integratedDivision: to } as T;
  });
  return changed ? out : list;
}

/** Hours section (items + section headers) with removed teams retagged. */
function retagSection<S>(
  s: S,
  removed: BusinessLine[],
  to: BusinessLine,
  counter: { n: number },
): S {
  if (!s) return s;
  const sec = s as unknown as { items?: TaggedItem[]; sections?: TaggedItem[] };
  return {
    ...sec,
    items: retagList(sec.items, removed, to, counter),
    sections: retagList(sec.sections, removed, to, counter),
  } as unknown as S;
}

/**
 * Moves items tagged with teams the BID no longer has to `to`, so they stay
 * visible in the per-team tabs. Returns only the changed collections.
 */
export function retagBusinessLineItems(
  bid: IBid,
  removed: BusinessLine[],
  to: BusinessLine,
): { patch: Partial<IBid>; count: number } {
  const counter = { n: 0 };
  const patch: Partial<IBid> = {};
  if (removed.length === 0) return { patch, count: 0 };
  const lists: (keyof IBid)[] = [
    "scopeItems",
    "assetBreakdown",
    "logisticsBreakdown",
    "certificationsBreakdown",
    "rtsItems",
    "mobilizationItems",
    "consumableItems",
    "rtsSections",
    "mobSections",
    "consSections",
  ];
  lists.forEach((key) => {
    const before = bid[key] as TaggedItem[] | undefined;
    const after = retagList(before, removed, to, counter);
    if (after !== before) (patch as Record<string, unknown>)[key] = after;
  });
  const hs = bid.hoursSummary;
  if (hs) {
    const start = counter.n;
    const eng = hs.engineeringHours;
    const next = {
      ...hs,
      engineeringHours: eng && {
        ...retagSection(eng, removed, to, counter),
        engineeringItems: retagList(eng.engineeringItems, removed, to, counter),
      },
      onshoreHours: retagSection(hs.onshoreHours, removed, to, counter),
      offshoreHours: retagSection(hs.offshoreHours, removed, to, counter),
    };
    if (counter.n > start) patch.hoursSummary = next as IBid["hoursSummary"];
  }
  return { patch, count: counter.n };
}

/** Adds the INTEGRATED division to configs saved before it existed. */
export function withIntegratedDivision(
  divisions: IConfigOption[] | null | undefined,
): IConfigOption[] {
  const list = divisions || [];
  if (list.some((d) => isIntegratedDivision(d.value))) return list;
  const order = list.reduce((m, d) => Math.max(m, d.order || 0), 0) + 1;
  return [
    ...list,
    {
      id: "div-integrated",
      label: INTEGRATED_DIVISION_LABEL,
      value: INTEGRATED_DIVISION,
      isActive: true,
      order,
      color: "#8b5cf6",
    },
  ];
}

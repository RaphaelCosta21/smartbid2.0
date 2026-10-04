/**
 * clarificationHelpers — Shared logic for the Clarif. & Qualif. library
 * (Clarifications Database list) and the BID Clarif. & Qualif. tab.
 */
import { IBid } from "../models/IBid";
import { IClarificationDbItem } from "../models/IClarificationDb";
import { IConfigOption, ISystemConfig } from "../models/ISystemConfig";

/** Values the legacy list stored in its mandatory Title column when there was no reference. */
const REF_PLACEHOLDERS = ["N/A", "NA", "-", "--", "---", "TBD", "TBC", "NONE"];

export function cleanClientDocRef(ref?: string | null): string {
  const v = (ref || "").trim();
  return REF_PLACEHOLDERS.indexOf(v.toUpperCase()) >= 0 ? "" : v;
}

/** Active options sorted by their configured order, then label. */
export function activeConfigOptions(list?: IConfigOption[]): IConfigOption[] {
  return (list || [])
    .filter((o) => o.isActive !== false)
    .sort(
      (a, b) =>
        (a.order || 0) - (b.order || 0) || a.label.localeCompare(b.label),
    );
}

export function configOptionLabel(
  list: IConfigOption[] | undefined,
  value: string,
): string {
  if (!value) return "";
  const opt = (list || []).find((o) => o.value === value || o.label === value);
  return opt ? opt.label : value;
}

/** Active service lines that belong to a division (`category` holds the division value). */
export function serviceLinesForDivision(
  config: ISystemConfig | null | undefined,
  division: string,
): IConfigOption[] {
  if (!config || !division) return [];
  return activeConfigOptions(config.serviceLines).filter(
    (sl) => sl.category === division,
  );
}

/**
 * Library rows for a completed BID: clarification rows with text (minus the
 * ones imported from the library or pushed by the legacy flow) and every
 * qualification table item (Description = topic, Comments = qualification text).
 */
export function buildLibraryRowsFromBid(bid: IBid): IClarificationDbItem[] {
  const base = {
    id: 0,
    approved: false,
    keyword: "",
    client: (bid.opportunityInfo && bid.opportunityInfo.client) || "",
    division: bid.division || "",
    serviceLine: bid.serviceLine || "",
    sourceBidNumber: bid.bidNumber,
  };
  const rows: IClarificationDbItem[] = [];
  (bid.clarifications || []).forEach((c) => {
    if (c.exportedToDatabase || c.libraryRefId) return;
    if (!(c.clarification || "").trim()) return;
    rows.push({
      ...base,
      baseType:
        c.baseType === "Qualification" ? "Qualification" : "Clarification",
      clientDocRef: cleanClientDocRef(c.item),
      etTopic: c.description || "",
      clarification: c.clarification,
      clientReply: c.clientResponse || "",
      date: c.responseDate || "",
      category: c.category || "",
      sourceItemId: c.id,
    });
  });
  (bid.qualificationTables || []).forEach((t) => {
    const title = (t.title || "").trim();
    (t.items || []).forEach((q) => {
      const description = (q.description || "").trim();
      const comments = (q.comments || "").trim();
      if (!description && !comments) return;
      // Tables have no client reply or approval; the table title is kept as keyword
      rows.push({
        ...base,
        baseType: "Qualification",
        clientDocRef: "",
        etTopic: comments ? description : title,
        clarification: comments || description,
        clientReply: "",
        keyword: title,
        date: "",
        category: t.category || "",
        sourceItemId: q.id,
      });
    });
  });
  return rows;
}

/**
 * aiQuotationMapper — Maps AI-extracted quotation lines onto the shape the
 * Add Quotation modal uses, resolving AI-suggested group/sub-group NAMES to the
 * configured Favorite group/sub-group ids (case-insensitive). Unmatched names
 * are left blank so the user can pick them manually before saving.
 */
import {
  IExtractedQuotationLine,
  IFavoriteGroup,
  QuotationType,
} from "../models";

/** A quotation line ready to prefill the Add Quotation modal. */
export interface IQuotationLineDraft {
  groupId: string;
  subGroupId: string;
  partNumber: string;
  description: string;
  supplier: string;
  leadTimeDays: number;
  quotationDate: string;
  type: QuotationType;
  cost: number;
  currency: string;
  notes: string;
}

/**
 * Resolve an AI-suggested group / sub-group NAME to configured ids.
 * Matching is case-insensitive. Returns blank ids when there is no match.
 */
export function resolveQuotationGroup(
  groupName: string | undefined,
  subGroupName: string | undefined,
  groups: IFavoriteGroup[],
): { groupId: string; subGroupId: string } {
  if (!groupName) return { groupId: "", subGroupId: "" };
  const target = groupName.trim().toLowerCase();
  const group = (groups || []).find(
    (g) => (g.name || "").trim().toLowerCase() === target,
  );
  if (!group) return { groupId: "", subGroupId: "" };

  let subGroupId = "";
  if (subGroupName) {
    const subTarget = subGroupName.trim().toLowerCase();
    const sub = (group.subGroups || []).find(
      (s) => (s.name || "").trim().toLowerCase() === subTarget,
    );
    if (sub) subGroupId = sub.id;
  }
  return { groupId: group.id, subGroupId };
}

/** Map a single AI-extracted quotation line into a modal-ready draft line. */
export function mapExtractedQuotationLine(
  ai: IExtractedQuotationLine,
  groups: IFavoriteGroup[],
): IQuotationLineDraft {
  const { groupId, subGroupId } = resolveQuotationGroup(
    ai.suggestedGroupName,
    ai.suggestedSubGroupName,
    groups,
  );
  const today = new Date().toISOString().slice(0, 10);
  return {
    groupId,
    subGroupId,
    partNumber: ai.partNumber || "",
    description: ai.description || "",
    supplier: ai.supplier || "",
    leadTimeDays: ai.leadTimeDays || 0,
    quotationDate: ai.quotationDate ? ai.quotationDate.slice(0, 10) : today,
    type: ai.type === "rental" ? "rental" : "acquisition",
    cost: ai.cost || 0,
    currency: (ai.currency || "USD").toUpperCase(),
    notes: ai.notes || "",
  };
}

/** Map many AI-extracted quotation lines into modal-ready draft lines. */
export function mapExtractedQuotationLines(
  lines: IExtractedQuotationLine[],
  groups: IFavoriteGroup[],
): IQuotationLineDraft[] {
  return (lines || []).map((line) => mapExtractedQuotationLine(line, groups));
}

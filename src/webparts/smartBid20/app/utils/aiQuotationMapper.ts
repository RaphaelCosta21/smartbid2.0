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

/** Normalize a taxonomy name for tolerant comparison (case/spacing/punctuation). */
function normalizeName(value: string): string {
  return (value || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * Resolve an AI-suggested group / sub-group NAME to configured ids.
 *
 * Matching is tolerant of case, spacing and punctuation, and falls back to a
 * "contains" match. When the group name is missing or unknown but the sub-group
 * name matches, the parent group is inferred from it. Returns blank ids when
 * nothing matches, so the user picks manually.
 */
export function resolveQuotationGroup(
  groupName: string | undefined,
  subGroupName: string | undefined,
  groups: IFavoriteGroup[],
): { groupId: string; subGroupId: string } {
  const list = groups || [];
  const target = normalizeName(groupName || "");
  const subTarget = normalizeName(subGroupName || "");

  let group: IFavoriteGroup | undefined;
  if (target) {
    group = list.find((g) => normalizeName(g.name) === target);
    if (!group) {
      group = list.find((g) => {
        const candidate = normalizeName(g.name);
        return (
          !!candidate &&
          (candidate.indexOf(target) >= 0 || target.indexOf(candidate) >= 0)
        );
      });
    }
  }

  // No group match: infer the parent group from the suggested sub-group.
  if (!group && subTarget) {
    group = list.find((g) =>
      (g.subGroups || []).some((s) => normalizeName(s.name) === subTarget),
    );
  }
  if (!group) return { groupId: "", subGroupId: "" };

  let subGroupId = "";
  if (subTarget) {
    const subs = group.subGroups || [];
    let sub = subs.find((s) => normalizeName(s.name) === subTarget);
    if (!sub) {
      sub = subs.find((s) => {
        const candidate = normalizeName(s.name);
        return (
          !!candidate &&
          (candidate.indexOf(subTarget) >= 0 ||
            subTarget.indexOf(candidate) >= 0)
        );
      });
    }
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

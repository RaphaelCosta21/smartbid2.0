/**
 * aiClarificationMapper — Maps an AI-suggested clarification/qualification onto
 * the BID's IClarificationItem shape used by the Qualifications tab.
 */
import { IClarificationItem } from "../models/IBid";
import { IAISuggestedClarification } from "../models/IAIAnalysis";
import { makeId } from "./idGenerator";

/** Convert an AI suggestion into a BID clarification row. */
export function mapSuggestedClarification(
  suggestion: IAISuggestedClarification,
  scopeItemId?: string | null,
): IClarificationItem {
  return {
    id: makeId("q"),
    scopeItemId: scopeItemId === undefined ? null : scopeItemId,
    item: suggestion.relatedRef || "",
    description: suggestion.description || "",
    clarification: suggestion.clarification || "",
    clientResponse: "",
    isAutoImported: false,
    baseType:
      suggestion.baseType === "Qualification"
        ? "Qualification"
        : "Clarification",
    createdDate: new Date().toISOString(),
  };
}

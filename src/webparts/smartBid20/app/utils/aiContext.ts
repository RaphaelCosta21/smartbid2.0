/**
 * aiContext — Builds the shared AI analysis context (division, service line,
 * resource types and a human-readable context summary) and a serialized
 * requirements text from a BID. Used to ground scope analysis, quotation
 * extraction and clarification suggestions (RAG context — see Phase D).
 */
import { IBid } from "../models/IBid";
import { IAIAnalysisContext } from "../models/IAIAnalysis";

/** Build a richer AI context from a BID for grounding backend retrieval. */
export function buildAiContext(
  bid: IBid,
  resourceTypes?: string[],
): IAIAnalysisContext {
  const opp = bid.opportunityInfo;
  const parts: string[] = [];
  if (bid.bidNumber) parts.push(`BID: ${bid.bidNumber}`);
  if (bid.division) parts.push(`Division: ${bid.division}`);
  if (bid.serviceLine) parts.push(`Service line: ${bid.serviceLine}`);
  if (opp?.client) parts.push(`Client: ${opp.client}`);
  if (opp?.projectName) parts.push(`Project: ${opp.projectName}`);
  if (opp?.field) parts.push(`Field: ${opp.field}`);
  if (opp?.vessel) parts.push(`Vessel: ${opp.vessel}`);

  return {
    division: bid.division || "",
    serviceLine: bid.serviceLine || "",
    resourceTypes: resourceTypes || [],
    contextSummary: parts.join(" | "),
  };
}

/**
 * Serialize the BID scope items into a plain-text requirements block for
 * clarification suggestion requests (the backend retrieves past clarifications
 * that match this text).
 */
export function buildRequirementsText(bid: IBid): string {
  const items = (bid.scopeItems || []).filter((s) => !s.isSection);
  const lines: string[] = [];
  items.forEach((s) => {
    const ref = s.clientDocRef ? `[${s.clientDocRef}] ` : "";
    const desc = s.description || "";
    const req = s.clientRequirement
      ? ` — Requirement: ${s.clientRequirement}`
      : "";
    const comp = s.compliance ? ` (compliance: ${s.compliance})` : "";
    if (desc || req) lines.push(`${ref}${desc}${req}${comp}`);
  });
  return lines.join("\n");
}

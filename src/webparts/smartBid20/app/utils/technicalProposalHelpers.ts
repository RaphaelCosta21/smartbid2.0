import { IBid, IBidAttachment } from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

export type TechnicalProposalState =
  | "not-requested"
  | "pending"
  | "attached"
  | "published"
  | "failed";

export const TECHNICAL_PROPOSAL_STATE_LABELS: Record<
  TechnicalProposalState,
  string
> = {
  "not-requested": "Not requested",
  pending: "Pending upload",
  attached: "Attached",
  published: "Published to KB",
  failed: "KB publish failed",
};

export function isTechnicalProposalAttachment(att: IBidAttachment): boolean {
  return (
    att.category === SHAREPOINT_CONFIG.technicalProposal.attachmentCategory
  );
}

/** Latest Technical Proposal stored in SharePoint (legacy local blob links are ignored). */
export function getTechnicalProposalAttachment(
  bid: IBid,
): IBidAttachment | undefined {
  let latest: IBidAttachment | undefined;
  (bid.attachments || []).forEach((a) => {
    if (!isTechnicalProposalAttachment(a)) return;
    if (!a.fileUrl || a.fileUrl.indexOf("blob:") === 0) return;
    if (!latest || (a.uploadedDate || "") > (latest.uploadedDate || "")) {
      latest = a;
    }
  });
  return latest;
}

export function getTechnicalProposalState(bid: IBid): TechnicalProposalState {
  const doc = bid.technicalProposal?.doc;
  if (doc) return doc.status === "published" ? "published" : "failed";
  if (getTechnicalProposalAttachment(bid)) return "attached";
  return bid.technicalProposal?.requested ? "pending" : "not-requested";
}

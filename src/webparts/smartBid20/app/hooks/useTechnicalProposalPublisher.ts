/**
 * useTechnicalProposalPublisher — Copies a completed BID's Technical Proposal to
 * the Knowledge Base and keeps the BID store in sync. Used on completion
 * (BID detail page) and for manual retries (Documents tab).
 */
import * as React from "react";
import { IBid, IBidTechnicalProposal } from "../models";
import { TechnicalProposalKnowledgeService } from "../services/TechnicalProposalKnowledgeService";
import { useBidStore } from "../stores/useBidStore";
import { useUIStore } from "../stores/useUIStore";
import { useCurrentUser } from "./useCurrentUser";

export function useTechnicalProposalPublisher(): (
  bid: IBid,
) => Promise<IBidTechnicalProposal | null> {
  const currentUser = useCurrentUser();
  const addToast = useUIStore((s) => s.addToast);

  return React.useCallback(
    async (bid: IBid) => {
      try {
        const technicalProposal = await TechnicalProposalKnowledgeService.publish(
          bid,
          {
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
          },
        );
        const store = useBidStore.getState();
        store.setBids(
          store.bids.map((b) =>
            b.bidNumber === bid.bidNumber ? { ...b, technicalProposal } : b,
          ),
        );
        if (technicalProposal.doc?.status === "failed") {
          addToast({
            type: "warning",
            title: "Technical Proposal not published",
            message: `The Technical Proposal of BID ${bid.bidNumber} could not be copied to the Knowledge Base. Retry from the BID Documents tab.`,
          });
        } else {
          addToast({
            type: "success",
            title: "Technical Proposal published",
            message:
              technicalProposal.aiStatus === "ok"
                ? `BID ${bid.bidNumber}'s proposal was added to Knowledge Base › Technical Proposals with AI-filled metadata.`
                : `BID ${bid.bidNumber}'s proposal was added to Knowledge Base › Technical Proposals. AI metadata was unavailable — review it there.`,
          });
        }
        return technicalProposal;
      } catch (err) {
        console.error(
          `Failed to publish the Technical Proposal of ${bid.bidNumber}:`,
          err,
        );
        addToast({
          type: "error",
          title: "Technical Proposal publish failed",
          message:
            (err instanceof Error ? err.message : String(err)) ||
            "The BID could not be updated in SharePoint.",
        });
        return null;
      }
    },
    [currentUser, addToast],
  );
}

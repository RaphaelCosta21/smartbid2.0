/**
 * usePastBidPublisher — Publishes a completed BID to the Past Bids Knowledge Base
 * and keeps the BID store in sync. Shared by the BID detail page (auto-publish on
 * completion), Follow-Up (outcome change) and the Past Bids page.
 */
import * as React from "react";
import { IBid, IBidKnowledgeProfile } from "../models";
import {
  PastBidKnowledgeService,
  PastBidProfileFields,
} from "../services/PastBidKnowledgeService";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useUIStore } from "../stores/useUIStore";
import { useCurrentUser } from "./useCurrentUser";

export interface IPastBidPublishRequest {
  runAi: boolean;
  profile?: PastBidProfileFields;
  /** No success toast (background republish). Failures are always reported. */
  silent?: boolean;
}

export function usePastBidScopeCategories(): string[] {
  const config = useConfigStore((s) => s.config);
  return React.useMemo(
    () =>
      (config?.scopeCategories || [])
        .filter((c) => c.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((c) => c.value || c.label),
    [config],
  );
}

export function usePastBidPublisher(): (
  bid: IBid,
  request: IPastBidPublishRequest,
) => Promise<IBidKnowledgeProfile | null> {
  const currentUser = useCurrentUser();
  const scopeCategories = usePastBidScopeCategories();
  const addToast = useUIStore((s) => s.addToast);

  return React.useCallback(
    async (bid: IBid, request: IPastBidPublishRequest) => {
      try {
        const profile = await PastBidKnowledgeService.publish(
          bid,
          {
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
          },
          {
            runAi: request.runAi,
            scopeCategories,
            profile: request.profile,
          },
        );
        const store = useBidStore.getState();
        store.setBids(
          store.bids.map((b) =>
            b.bidNumber === bid.bidNumber
              ? { ...b, knowledgeProfile: profile }
              : b,
          ),
        );
        if (profile.doc.status === "failed") {
          addToast({
            type: "warning",
            title: "Past Bids document not published",
            message: `BID ${bid.bidNumber} is listed in Past Bids, but its knowledge document could not be saved to SharePoint. Retry from the Past Bids page.`,
          });
        } else if (!request.silent) {
          addToast({
            type: "success",
            title: "Published to Past Bids",
            message: `BID ${bid.bidNumber} was added to the Knowledge Base. AI Search picks it up on its next indexing run.`,
          });
        }
        return profile;
      } catch (err) {
        console.error(`Failed to publish Past Bid ${bid.bidNumber}:`, err);
        addToast({
          type: "error",
          title: "Past Bids publish failed",
          message:
            (err instanceof Error ? err.message : String(err)) ||
            "The BID could not be updated in SharePoint.",
        });
        return null;
      }
    },
    [currentUser, scopeCategories, addToast],
  );
}

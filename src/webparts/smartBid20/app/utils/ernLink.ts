/**
 * ernLink — shared logic to link an ERN (created or selected) to a BID slot
 * and persist it. Used by both ErnCreateModal and ErnSearchModal.
 */
import { BidErnPurpose, IBid, IBidErnLink, IPersonRef } from "../models";
import { BidService } from "../services/BidService";
import { useBidStore } from "../stores/useBidStore";
import {
  getErnLinks,
  getErnLinkForSlot,
  getErnLinkPurpose,
  ErnDivision,
} from "./ernHelpers";

export interface IErnLinkInput {
  ernNumber: string;
  ernId: number;
  ernStatus: string;
  ernDueDate: string;
  ernCheckerDueDate?: string;
  ernLeadDate?: string;
  ernFinishDate?: string;
}

/** How the ERN reached the BID — drives the activity log wording. */
export type ErnLinkSource = "created" | "selected";

/**
 * Attach an ERN to a BID for the given slot (division + purpose; division
 * null = single ERN), persist the patch, and refresh the global bid store.
 * Records the action (created / linked / changed) in the BID activity log.
 */
export async function linkErnToBid(
  staleBid: IBid,
  division: ErnDivision,
  link: IErnLinkInput,
  linkedBy: IPersonRef | null,
  source: ErnLinkSource = "selected",
  purpose: BidErnPurpose = "bid",
): Promise<void> {
  const now = new Date().toISOString();
  // A save right before (e.g. a status change) may be newer than the caller's copy
  const bid =
    useBidStore
      .getState()
      .bids.find((b) => b.bidNumber === staleBid.bidNumber) || staleBid;

  const newLink: IBidErnLink = {
    division: division || null,
    purpose,
    ernNumber: link.ernNumber,
    ernId: link.ernId,
    ernStatus: link.ernStatus,
    ernDueDate: link.ernDueDate,
    ernCheckerDueDate: link.ernCheckerDueDate || "",
    ernLeadDate: link.ernLeadDate || "",
    ernFinishDate: link.ernFinishDate,
    linkedBy,
    linkedDate: now,
  };

  // Existing ERN in this slot (if any) — a different one means a reassignment
  const previous = getErnLinkForSlot(bid, division, purpose);
  const isChange = !!previous && previous.ernNumber !== link.ernNumber;

  // Replace any existing link for the same slot, keep the others
  const existing = getErnLinks(bid).filter(
    (l) =>
      (l.division || null) !== (division || null) ||
      getErnLinkPurpose(l) !== purpose,
  );
  const ernLinks = [...existing, newLink];

  // Primary BID ERN drives the legacy single fields (Technical Proposal ERNs never do)
  const bidLinks = ernLinks.filter((l) => getErnLinkPurpose(l) === "bid");
  const primary = bidLinks.find((l) => l.division === null) || bidLinks[0];

  const what = purpose === "technical-proposal" ? "Technical Proposal ERN" : "ERN";
  const divLabel = division ? ` (${division})` : "";
  let logType: string;
  let description: string;
  if (isChange) {
    logType = "ERN_CHANGED";
    const suffix = source === "created" ? " (new ERN created)" : "";
    description = `${what} changed from ${previous!.ernNumber} to ${link.ernNumber}${suffix}${divLabel}`;
  } else {
    logType = "ERN_LINKED";
    const verb = source === "created" ? "created and linked" : "linked";
    description = `${what} ${link.ernNumber} ${verb} to this BID${divLabel}`;
  }

  const patch: Partial<IBid> = {
    ernLinks,
    ernNumber: primary ? primary.ernNumber : null,
    ernId: primary ? primary.ernId : null,
    ernStatus: primary ? primary.ernStatus : null,
    ernDueDate: primary ? primary.ernDueDate : null,
    ernFinishDate: primary ? primary.ernFinishDate || null : null,
    ernLinkedBy: primary ? primary.linkedBy || null : null,
    ernLinkedDate: primary ? primary.linkedDate || null : null,
    activityLog: [
      ...(bid.activityLog || []),
      {
        id: `log-${Date.now()}-ern`,
        type: logType,
        timestamp: now,
        actor: linkedBy?.email || "",
        actorName: linkedBy?.name || "",
        description,
        metadata: {
          ernNumber: link.ernNumber,
          ernStatus: link.ernStatus,
          division: division || "",
          purpose,
          previousErn: isChange ? previous!.ernNumber : "",
          source,
        },
      },
    ],
  };

  await BidService.patchByBidNumber(bid.bidNumber, patch);
  await useBidStore.getState().refreshBids();
}

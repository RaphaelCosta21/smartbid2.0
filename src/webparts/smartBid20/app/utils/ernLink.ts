/**
 * ernLink — shared logic to link an ERN (created or selected) to a BID slot
 * and persist it. Used by both ErnCreateModal and ErnSearchModal.
 */
import { IBid, IBidErnLink, IPersonRef } from "../models";
import { BidService } from "../services/BidService";
import { useBidStore } from "../stores/useBidStore";
import { getErnLinks, getErnLinkForSlot, ErnDivision } from "./ernHelpers";

export interface IErnLinkInput {
  ernNumber: string;
  ernId: number;
  ernStatus: string;
  ernDueDate: string;
  ernFinishDate?: string;
}

/** How the ERN reached the BID — drives the activity log wording. */
export type ErnLinkSource = "created" | "selected";

/**
 * Attach an ERN to a BID for the given division slot (null = single ERN),
 * persist the patch, and refresh the global bid store. Records the action
 * (created / linked / changed) in the BID activity log.
 */
export async function linkErnToBid(
  bid: IBid,
  division: ErnDivision,
  link: IErnLinkInput,
  linkedBy: IPersonRef | null,
  source: ErnLinkSource = "selected",
): Promise<void> {
  const now = new Date().toISOString();

  const newLink: IBidErnLink = {
    division: division || null,
    ernNumber: link.ernNumber,
    ernId: link.ernId,
    ernStatus: link.ernStatus,
    ernDueDate: link.ernDueDate,
    ernFinishDate: link.ernFinishDate,
    linkedBy,
    linkedDate: now,
  };

  // Existing ERN in this slot (if any) — a different one means a reassignment
  const previous = getErnLinkForSlot(bid, division);
  const isChange = !!previous && previous.ernNumber !== link.ernNumber;

  // Replace any existing link for the same slot, keep the others
  const existing = getErnLinks(bid).filter(
    (l) => (l.division || null) !== (division || null),
  );
  const ernLinks = [...existing, newLink];

  // Primary link drives the legacy single fields (non-integrated view fallbacks)
  const primary = ernLinks.find((l) => l.division === null) || ernLinks[0];

  const divLabel = division ? ` (${division})` : "";
  let logType: string;
  let description: string;
  if (isChange) {
    logType = "ERN_CHANGED";
    const suffix = source === "created" ? " (new ERN created)" : "";
    description = `ERN changed from ${previous!.ernNumber} to ${link.ernNumber}${suffix}${divLabel}`;
  } else {
    logType = "ERN_LINKED";
    const verb = source === "created" ? "created and linked" : "linked";
    description = `ERN ${link.ernNumber} ${verb} to this BID${divLabel}`;
  }

  const patch: Partial<IBid> = {
    ernLinks,
    ernNumber: primary.ernNumber,
    ernId: primary.ernId,
    ernStatus: primary.ernStatus,
    ernDueDate: primary.ernDueDate,
    ernFinishDate: primary.ernFinishDate || null,
    ernLinkedBy: primary.linkedBy || null,
    ernLinkedDate: primary.linkedDate || null,
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
          previousErn: isChange ? previous!.ernNumber : "",
          source,
        },
      },
    ],
  };

  await BidService.patchByBidNumber(bid.bidNumber, patch);
  await useBidStore.getState().refreshBids();
}

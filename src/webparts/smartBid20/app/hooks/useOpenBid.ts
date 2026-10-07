import * as React from "react";
import { useNavigate } from "react-router-dom";
import { IBid } from "../models";
import { useAuthStore } from "../stores/useAuthStore";
import { useBidStore } from "../stores/useBidStore";
import { useUIStore } from "../stores/useUIStore";
import { canOpenBid } from "../utils/bidConfidentiality";

export interface IOpenBidApi {
  /** Navigates to BID Details, or warns when the BID is confidential for this user. */
  openBid: (bidNumber: string) => void;
  canOpen: (bid: IBid) => boolean;
}

/** Single entry point for every in-app navigation to BID Details. */
export function useOpenBid(): IOpenBidApi {
  const navigate = useNavigate();
  const email = useAuthStore((s) => s.currentUser.email);
  const isResolved = useAuthStore((s) => s.isResolved);

  const canOpen = React.useCallback(
    (bid: IBid): boolean => canOpenBid(bid, email),
    [email],
  );

  const openBid = React.useCallback(
    (bidNumber: string): void => {
      const bid = useBidStore
        .getState()
        .bids.find((b) => b.bidNumber === bidNumber);
      // Before sign-in resolves, BidDetailPage's own guard decides.
      if (bid && isResolved && !canOpenBid(bid, email)) {
        useUIStore.getState().addToast({
          type: "warning",
          title: "Confidential BID",
          message: `BID ${bidNumber} is confidential. Ask the BID Responsible for access.`,
        });
        return;
      }
      navigate(`/bid/${encodeURIComponent(bidNumber)}`);
    },
    [navigate, email, isResolved],
  );

  return { openBid, canOpen };
}

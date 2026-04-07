/**
 * useBids — Convenience hook for common BID operations.
 */

import * as React from "react";
import { useBidStore } from "../stores/useBidStore";
import { IBid } from "../models";

export function useBids(): {
  bids: IBid[];
  filteredBids: IBid[];
  isLoading: boolean;
  selectedBid: IBid | null;
  setSelectedBid: (bid: IBid | null) => void;
  getBidByNumber: (bidNumber: string) => IBid | undefined;
} {
  const bids = useBidStore((s) => s.bids);
  const getFilteredBids = useBidStore((s) => s.getFilteredBids);
  const isLoading = useBidStore((s) => s.isLoading);
  const selectedBid = useBidStore((s) => s.selectedBid);
  const setSelectedBid = useBidStore((s) => s.setSelectedBid);

  const filteredBids = React.useMemo(
    () => getFilteredBids(),
    [bids, getFilteredBids],
  );

  const getBidByNumber = React.useCallback(
    (bidNumber: string) => bids.find((b) => b.bidNumber === bidNumber),
    [bids],
  );

  return {
    bids,
    filteredBids,
    isLoading,
    selectedBid,
    setSelectedBid,
    getBidByNumber,
  };
}

/**
 * useClarificationLibrarySync — Pushes a completed BID's clarifications and
 * qualification tables to the Clarif. & Qualif. library (upsert per row) and
 * records the result on the BID.
 */
import * as React from "react";
import { IBid, IClarificationLibrarySync } from "../models";
import { BidService } from "../services/BidService";
import { ClarificationDbService } from "../services/ClarificationDbService";
import { useBidStore } from "../stores/useBidStore";
import { useUIStore } from "../stores/useUIStore";
import { buildLibraryRowsFromBid } from "../utils/clarificationHelpers";

/** BIDs completed before this date are never synced automatically (no backfill). */
export const CLARIFICATION_LIBRARY_SYNC_SINCE = "2026-10-04";

const inFlight: Record<string, Promise<void>> = {};

/** True when a Completed BID has no sync newer than its completion. */
export function needsClarificationLibrarySync(bid: IBid): boolean {
  if (bid.currentStatus !== "Completed") return false;
  const completed = bid.completedDate || "";
  if (!completed || completed < CLARIFICATION_LIBRARY_SYNC_SINCE) return false;
  const last = bid.clarificationLibrarySync;
  return !last || last.syncedAt < completed;
}

export function useClarificationLibrarySync(): (bid: IBid) => Promise<void> {
  const addToast = useUIStore((s) => s.addToast);

  return React.useCallback(
    (bid: IBid) => {
      const running = inFlight[bid.bidNumber];
      if (running) return running;
      const run = (async (): Promise<void> => {
        try {
          const res = await ClarificationDbService.syncFromBid(
            bid.bidNumber,
            buildLibraryRowsFromBid(bid),
          );
          if (res.failed > 0) {
            // No record, so the next visit by an editor retries (upsert is idempotent)
            addToast({
              type: "warning",
              title: "Clarif. & Qualif. library partially updated",
              message: `${res.failed} item(s) from BID ${bid.bidNumber} could not be saved to the library. They will be retried the next time the BID is opened.`,
            });
            return;
          }
          const record: IClarificationLibrarySync = {
            syncedAt: new Date().toISOString(),
            ...res,
          };
          await BidService.patchByBidNumber(bid.bidNumber, {
            clarificationLibrarySync: record,
          });
          const store = useBidStore.getState();
          store.setBids(
            store.bids.map((b) =>
              b.bidNumber === bid.bidNumber
                ? { ...b, clarificationLibrarySync: record }
                : b,
            ),
          );
          const total = res.created + res.updated;
          if (total > 0) {
            addToast({
              type: "success",
              title: "Clarif. & Qualif. library updated",
              message: `${total} clarification(s) / qualification(s) from BID ${bid.bidNumber} were saved to the library.`,
            });
          }
        } catch (err) {
          console.error(
            `Failed to sync BID ${bid.bidNumber} to the Clarif. & Qualif. library:`,
            err,
          );
          addToast({
            type: "error",
            title: "Clarif. & Qualif. library not updated",
            message:
              (err instanceof Error ? err.message : String(err)) ||
              "SharePoint rejected the update.",
          });
        } finally {
          delete inFlight[bid.bidNumber];
        }
      })();
      inFlight[bid.bidNumber] = run;
      return run;
    },
    [addToast],
  );
}

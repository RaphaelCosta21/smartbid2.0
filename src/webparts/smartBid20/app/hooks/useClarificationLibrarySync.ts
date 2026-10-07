/**
 * useClarificationLibrarySync — Pushes a completed BID's clarifications (Clarifications
 * Database) and qualification tables (Qualifications Database) to the Clarif. & Qualif.
 * library (upsert per row), republishes the library knowledge files and records the
 * result on the BID.
 */
import * as React from "react";
import { IBid, IClarificationLibrarySync } from "../models";
import { BidService } from "../services/BidService";
import { ClarificationDbService } from "../services/ClarificationDbService";
import { ClarificationKnowledgeService } from "../services/ClarificationKnowledgeService";
import { QualificationDbService } from "../services/QualificationDbService";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import { useUIStore } from "../stores/useUIStore";
import {
  buildLibraryRowsFromBid,
  isClarificationLibraryEligible,
} from "../utils/clarificationHelpers";
import { buildQualificationLibraryRowsFromBid } from "../utils/qualificationHelpers";

const inFlight: Record<string, Promise<void>> = {};

/** True when a Completed BID has no sync newer than its completion. */
export function needsClarificationLibrarySync(bid: IBid): boolean {
  if (!isClarificationLibraryEligible(bid)) return false;
  const last = bid.clarificationLibrarySync;
  return !last || last.syncedAt < (bid.completedDate || "");
}

export function useClarificationLibrarySync(): (bid: IBid) => Promise<void> {
  const addToast = useUIStore((s) => s.addToast);

  return React.useCallback(
    (bid: IBid) => {
      const running = inFlight[bid.bidNumber];
      if (running) return running;
      const run = (async (): Promise<void> => {
        try {
          const clar = await ClarificationDbService.syncFromBid(
            bid.bidNumber,
            buildLibraryRowsFromBid(bid),
          );
          const qual = await QualificationDbService.syncFromBid(
            bid.bidNumber,
            buildQualificationLibraryRowsFromBid(bid),
          );
          const res = {
            created: clar.created + qual.created,
            updated: clar.updated + qual.updated,
            failed: clar.failed + qual.failed,
          };
          if (res.failed > 0) {
            // No record, so the next visit by an editor retries (upsert is idempotent)
            addToast({
              type: "warning",
              title: "Clarif. & Qualif. library partially updated",
              message: `${res.failed} item(s) from BID ${bid.bidNumber} could not be saved to the library. They will be retried the next time the BID is opened.`,
            });
            return;
          }
          if (res.created + res.updated > 0) {
            try {
              await ClarificationKnowledgeService.publish(
                useConfigStore.getState().config,
              );
            } catch (err) {
              // No record, so the next visit by an editor re-syncs and republishes
              console.error(
                `Failed to publish the Clarif. & Qualif. knowledge files for BID ${bid.bidNumber}:`,
                err,
              );
              addToast({
                type: "warning",
                title: "AI knowledge files not updated",
                message: `The clarification(s) / qualification(s) of BID ${bid.bidNumber} were saved to the library, but the files read by the AI could not be updated. This will be retried the next time the BID is opened.`,
              });
              return;
            }
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

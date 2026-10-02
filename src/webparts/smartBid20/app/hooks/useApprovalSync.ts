/**
 * useApprovalSync — keeps the open BID's approval state current while a round
 * is pending. Decisions are written to SharePoint by the Teams approval flow
 * (power-automate/APPROVALS-INDIVIDUAL.md), so the app must re-read them.
 */
import * as React from "react";
import { IBid } from "../models";
import { BidService } from "../services/BidService";
import { useBidStore } from "../stores/useBidStore";

const POLL_MS = 15000;

/** Only the fields the flow writes are merged; local edits elsewhere stay untouched. */
const FLOW_FIELDS: (keyof IBid)[] = [
  "approvals",
  "approvalRounds",
  "approvalStatus",
  "currentStatus",
  "currentPhase",
  "completedDate",
];

function pickFlowChanges(local: IBid, remote: IBid): Partial<IBid> | undefined {
  const changes: Record<string, unknown> = {};
  let changed = false;
  FLOW_FIELDS.forEach((key) => {
    if (JSON.stringify(local[key]) !== JSON.stringify(remote[key])) {
      changes[key as string] = remote[key];
      changed = true;
    }
  });
  return changed ? (changes as Partial<IBid>) : undefined;
}

export function useApprovalSync(
  bidNumber: string | undefined,
  active: boolean,
): void {
  React.useEffect(() => {
    if (!bidNumber || !active) return undefined;
    const key: string = bidNumber;
    let cancelled = false;
    let inFlight = false;
    let timer: number | undefined;

    function schedule(): void {
      if (cancelled || timer !== undefined) return;
      timer = window.setTimeout(() => {
        tick().catch(() => undefined);
      }, POLL_MS);
    }

    async function tick(): Promise<void> {
      timer = undefined;
      // Paused while the browser tab is hidden; visibilitychange resumes it.
      if (cancelled || document.hidden) return;
      inFlight = true;
      try {
        if (BidService.hasPendingPatch(key)) return;
        const version = BidService.getPatchVersion(key);
        const remote = await BidService.getByBidNumber(key);
        // A local save that started meanwhile wins over this snapshot.
        if (
          cancelled ||
          !remote ||
          BidService.hasPendingPatch(key) ||
          version !== BidService.getPatchVersion(key)
        ) {
          return;
        }
        const store = useBidStore.getState();
        const local = store.bids.find((b) => b.bidNumber === key);
        const changes = local ? pickFlowChanges(local, remote) : undefined;
        if (changes) {
          store.setBids(
            store.bids.map((b) =>
              b.bidNumber === key ? { ...b, ...changes } : b,
            ),
          );
        }
      } catch {
        /* transient read failure — the next tick retries */
      } finally {
        inFlight = false;
        schedule();
      }
    }

    function onVisibilityChange(): void {
      if (cancelled || document.hidden || inFlight) return;
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
      tick().catch(() => undefined);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [bidNumber, active]);
}

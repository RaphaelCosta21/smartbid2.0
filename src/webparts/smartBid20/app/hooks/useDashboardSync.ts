/**
 * useDashboardSync — keeps BIDs and live ERN data fresh while the dashboard is
 * open: on mount, every 60s while the tab is visible, and when it becomes visible.
 */
import * as React from "react";
import { BidService } from "../services/BidService";
import { useBidStore } from "../stores/useBidStore";
import { useErnStore } from "../stores/useErnStore";

const POLL_MS = 60000;
/** Returning to the tab only re-syncs when the data is at least this old. */
const MIN_REFRESH_GAP_MS = 15000;

export interface DashboardSync {
  lastSyncedAt: Date | null;
  syncing: boolean;
  refreshNow: () => void;
}

async function syncBids(): Promise<void> {
  // A save in flight would be overwritten by an older server snapshot.
  if (BidService.hasAnyPendingPatch()) return;
  const version = BidService.getTotalPatchVersion();
  const bids = await BidService.getAll();
  if (
    BidService.hasAnyPendingPatch() ||
    version !== BidService.getTotalPatchVersion()
  ) {
    return;
  }
  useBidStore.getState().setBids(bids);
}

export function useDashboardSync(): DashboardSync {
  const [lastSyncedAt, setLastSyncedAt] = React.useState<Date | null>(null);
  const [syncing, setSyncing] = React.useState(false);
  const runRef = React.useRef<() => void>(() => undefined);

  React.useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let lastRun = 0;
    let timer: number | undefined;

    function schedule(): void {
      if (cancelled) return;
      if (timer !== undefined) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = undefined;
        if (!document.hidden) run();
        else schedule();
      }, POLL_MS);
    }

    function run(): void {
      if (cancelled || inFlight) return;
      inFlight = true;
      lastRun = Date.now();
      setSyncing(true);
      Promise.all([
        syncBids().catch((err) => console.error("Dashboard BID sync failed", err)),
        useErnStore.getState().loadAll(),
      ])
        .then(() => {
          if (!cancelled) setLastSyncedAt(new Date());
        })
        .catch(() => undefined)
        .then(() => {
          inFlight = false;
          if (cancelled) return;
          setSyncing(false);
          schedule();
        });
    }

    function onVisibilityChange(): void {
      if (document.hidden || Date.now() - lastRun < MIN_REFRESH_GAP_MS) return;
      run();
    }

    runRef.current = run;
    document.addEventListener("visibilitychange", onVisibilityChange);
    run();
    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const refreshNow = React.useCallback(() => runRef.current(), []);

  return { lastSyncedAt, syncing, refreshNow };
}

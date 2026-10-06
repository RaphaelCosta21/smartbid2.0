/**
 * LivePulse — minimal header button for the Live overview: a health dot (ok /
 * due soon / overdue ERNs) and a badge counting what changed since the user last
 * checked. Clicking it morphs the button into a floating panel that minimizes
 * on outside click, Escape or the minimize button.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useBidStore } from "../../stores/useBidStore";
import { useErnStore } from "../../stores/useErnStore";
import { useUIStore } from "../../stores/useUIStore";
import { useDashboardSync } from "../../hooks/useDashboardSync";
import { LiveUpdates, useLiveOverview } from "../../hooks/useLiveOverview";
import { useAccessLevel } from "../../hooks/useAccessLevel";
import { IErnLinkRow } from "../../utils/ernHelpers";
import { IPendingApprovalRow } from "../../utils/approvalHelpers";
import { IUpcomingDeadline } from "../../utils/bidHelpers";
import { ROUTES } from "../../config/routes.config";
import { IBid } from "../../models";
import globalStyles from "../../styles/globals.module.scss";
import { LivePulsePanel } from "./LivePulsePanel";
import styles from "./LivePulse.module.scss";

type Phase = "closed" | "opening" | "open" | "closing";

interface Anchor {
  top: number;
  right: number;
  width: number;
  height: number;
  host: HTMLElement;
}

const CLOSE_MS = 420;
const OPEN_POLL_MS = 60000;
const BACKGROUND_POLL_MS = 120000;
const NO_BIDS: IBid[] = [];

type Signature = Record<string, string>;

/** What the Live view tracks per item; a different value means "updated". */
function buildSignature(
  ernRows: IErnLinkRow[],
  approvals: IPendingApprovalRow[],
  deadlines: IUpcomingDeadline[],
): Signature {
  const sig: Signature = {};
  ernRows.forEach((r) => {
    sig[`ern:${r.ernNumber}`] = [
      r.status,
      r.dueDate,
      r.finishDate,
      r.deadline,
    ].join("|");
  });
  approvals.forEach((r) => {
    sig[`apr:${r.bid.bidNumber}`] = [
      r.round,
      r.approved,
      r.total,
      r.statuses.join(","),
    ].join("|");
  });
  deadlines.forEach((r) => {
    const bucket = r.days < 0 ? "late" : r.days <= 3 ? "soon" : "ok";
    sig[`due:${r.bid.bidNumber}`] = `${r.bid.dueDate}|${bucket}`;
  });
  return sig;
}

function diffSignature(
  seen: Signature | null,
  current: Signature,
): LiveUpdates {
  const keys: Record<string, boolean> = {};
  let count = 0;
  if (!seen) return { keys, count };
  Object.keys(current).forEach((k) => {
    if (seen[k] !== current[k]) {
      keys[k] = true;
      count++;
    }
  });
  Object.keys(seen).forEach((k) => {
    if (!(k in current)) count++;
  });
  return { keys, count };
}

export const LivePulse: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((s) => s.currentUser);
  const allBids = useBidStore((s) => s.bids);
  const ernLoadedAt = useErnStore((s) => s.lastLoadedAt);
  const dashboardView = useUIStore((s) => s.dashboardView);
  const setDashboardView = useUIStore((s) => s.setDashboardView);
  const { canViewPage } = useAccessLevel();
  const allowed = canViewPage("dashboard");

  const [phase, setPhase] = React.useState<Phase>("closed");
  const [anchor, setAnchor] = React.useState<Anchor | null>(null);
  const [seen, setSeen] = React.useState<Signature | null>(null);
  const pillRef = React.useRef<HTMLButtonElement>(null);
  const surfaceRef = React.useRef<HTMLDivElement>(null);
  const expanded = phase !== "closed";

  const live = useLiveOverview(allowed ? allBids : NO_BIDS);
  const onDashboard = location.pathname === ROUTES.dashboard;
  const onBidDetail = location.pathname.indexOf("/bid/") === 0;
  // Background polling feeds the update indicator; the dashboard page polls itself.
  // On a BID page only ERNs refresh so in-progress edits stay untouched.
  const sync = useDashboardSync({
    enabled: allowed && !onDashboard,
    includeBids: !onBidDetail,
    intervalMs: expanded ? OPEN_POLL_MS : BACKGROUND_POLL_MS,
    immediate: false,
  });

  const signature = React.useMemo(
    () => buildSignature(live.ernRows, live.approvals, live.deadlines),
    [live.ernRows, live.approvals, live.deadlines],
  );
  const signatureRef = React.useRef(signature);
  signatureRef.current = signature;

  // Baseline once BIDs and ERNs are both loaded, so the first load is not "news".
  // Looking at the dashboard Live tab also counts as checking.
  const watchingLiveTab = onDashboard && dashboardView === "live";
  React.useEffect(() => {
    if (!allowed || allBids.length === 0 || ernLoadedAt === null) return;
    if (!seen || (watchingLiveTab && seen !== signature)) setSeen(signature);
  }, [seen, allowed, allBids.length, ernLoadedAt, signature, watchingLiveTab]);

  const updates = React.useMemo(
    () => diffSignature(seen, signature),
    [seen, signature],
  );

  // ERNs are otherwise loaded by the dashboard only; the indicator needs them everywhere
  React.useEffect(() => {
    if (!allowed) return;
    const ernState = useErnStore.getState();
    if (ernState.erns.length === 0 && !ernState.isLoading) {
      ernState.loadAll().catch(() => undefined);
    }
  }, [allowed]);

  const measure = React.useCallback((): Anchor | null => {
    const pill = pillRef.current;
    if (!pill) return null;
    const r = pill.getBoundingClientRect();
    const host =
      (pill.closest(`.${globalStyles.smartBidRoot}`) as HTMLElement | null) ||
      document.body;
    return {
      top: r.top,
      right: Math.max(8, window.innerWidth - r.right),
      width: r.width,
      height: r.height,
      host,
    };
  }, []);

  const openPanel = (): void => {
    const a = measure();
    if (!a) return;
    setAnchor(a);
    setPhase("opening");
    sync.refreshNow();
  };

  // Closing counts as "checked": highlights and the badge reset
  const closePanel = React.useCallback((): void => {
    setPhase((p) => (p === "closed" ? p : "closing"));
    setSeen(signatureRef.current);
  }, []);

  // opening -> open on the next frame so the clip-path transition runs
  React.useEffect(() => {
    if (phase === "opening") {
      const raf = window.requestAnimationFrame(() =>
        window.requestAnimationFrame(() => setPhase("open")),
      );
      return () => window.cancelAnimationFrame(raf);
    }
    if (phase === "closing") {
      const timer = window.setTimeout(() => setPhase("closed"), CLOSE_MS);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [phase]);

  React.useEffect(() => {
    if (phase !== "opening" && phase !== "open") return undefined;
    const onResize = (): void => {
      const a = measure();
      if (a) setAnchor(a);
    };
    const onKey = (e: KeyboardEvent): void => {
      // Focus-mode overlays / modals handle their own Escape first
      if (
        e.key === "Escape" &&
        !document.querySelector('[aria-modal="true"]')
      ) {
        closePanel();
        pillRef.current?.focus();
      }
    };
    const onPointerDown = (e: MouseEvent): void => {
      const target = e.target as Node | null;
      if (!target) return;
      if (surfaceRef.current?.contains(target)) return;
      if (pillRef.current?.contains(target)) return;
      closePanel();
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [phase, measure, closePanel]);

  if (!allowed) return null;

  const { overdue, dueSoon } = live.ernKpis;
  const health =
    overdue > 0
      ? styles.healthDanger
      : dueSoon > 0
        ? styles.healthWarning
        : styles.healthOk;
  const tooltip = [
    "Live overview",
    updates.count > 0
      ? `${updates.count} update${updates.count === 1 ? "" : "s"} since your last check`
      : "",
    `${overdue} ERN${overdue === 1 ? "" : "s"} overdue`,
    `${dueSoon} due soon`,
    `${live.approvals.length} BID${live.approvals.length === 1 ? "" : "s"} awaiting approval`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <button
        ref={pillRef}
        type="button"
        className={`${styles.trigger} ${
          phase === "opening" || phase === "open" ? styles.triggerHidden : ""
        }`}
        onClick={() => (expanded ? closePanel() : openPanel())}
        aria-expanded={expanded}
        aria-haspopup="dialog"
        aria-label={tooltip}
        title={tooltip}
      >
        <span
          key={updates.count}
          className={`${styles.icon} ${updates.count > 0 ? styles.iconPing : ""}`}
        >
          <Activity size={20} strokeWidth={2} />
        </span>
        <span className={`${styles.health} ${health}`} aria-hidden="true" />
        {updates.count > 0 && (
          <span key={`b${updates.count}`} className={styles.badge}>
            {updates.count > 9 ? "9+" : updates.count}
          </span>
        )}
      </button>

      {expanded &&
        anchor &&
        ReactDOM.createPortal(
          <div
            className={`${styles.panel} ${phase === "open" ? styles.panelOpen : ""} ${
              phase === "closing" ? styles.panelClosing : ""
            }`}
            style={
              {
                top: anchor.top,
                right: anchor.right,
                "--pill-w": `${anchor.width}px`,
                "--pill-h": `${anchor.height}px`,
                "--panel-top": `${anchor.top}px`,
              } as React.CSSProperties
            }
            role="dialog"
            aria-label="Live overview"
          >
            <div ref={surfaceRef} className={styles.surface}>
              <LivePulsePanel
                live={live}
                sync={sync}
                updates={updates}
                userEmail={currentUser.email}
                onMinimize={() => {
                  closePanel();
                  pillRef.current?.focus();
                }}
                onOpenDashboard={() => {
                  setDashboardView("live");
                  navigate(ROUTES.dashboard);
                  closePanel();
                }}
                onOpenBid={(bidNumber) => navigate(`/bid/${bidNumber}`)}
                onDashboard={onDashboard}
              />
            </div>
          </div>,
          anchor.host,
        )}
    </>
  );
};

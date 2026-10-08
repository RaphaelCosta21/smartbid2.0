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
import {
  ILiveUpdate,
  LiveUpdateKind,
  LiveUpdates,
  useLiveOverview,
} from "../../hooks/useLiveOverview";
import { useAccessLevel } from "../../hooks/useAccessLevel";
import { useOpenBid } from "../../hooks/useOpenBid";
import { IErnLinkRow } from "../../utils/ernHelpers";
import { IPendingApprovalRow } from "../../utils/approvalHelpers";
import { IUpcomingDeadline } from "../../utils/bidHelpers";
import { ROUTES } from "../../config/routes.config";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { formatDate } from "../../utils/formatters";
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
const SOON_BID_DAYS = 3;
const PERSON_PREFIX = "p:";

/** What the Live view tracks per item; any different field means "updated". */
interface SigEntry {
  kind: LiveUpdateKind;
  id: string;
  title: string;
  fields: Record<string, string>;
}

type Signature = Record<string, SigEntry>;

function bidTitle(bid: IBid): string {
  return (
    bid.opportunityInfo?.projectName ||
    bid.opportunityInfo?.client ||
    bid.bidNumber
  );
}

function buildSignature(
  ernRows: IErnLinkRow[],
  approvals: IPendingApprovalRow[],
  deadlines: IUpcomingDeadline[],
): Signature {
  const sig: Signature = {};
  ernRows.forEach((r) => {
    sig[`ern:${r.ernNumber}`] = {
      kind: "erns",
      id: r.ernNumber,
      title: r.ern?.projectTitle || bidTitle(r.bid),
      fields: {
        bid: r.bid.bidNumber,
        status: r.status,
        dueDate: r.dueDate,
        finishDate: r.finishDate,
        deadline: r.deadline,
      },
    };
  });
  approvals.forEach((r) => {
    const fields: Record<string, string> = {
      round: String(r.round),
      approved: String(r.approved),
      total: String(r.total),
    };
    r.people.forEach((p) => {
      fields[PERSON_PREFIX + p.name] = p.status;
    });
    sig[`apr:${r.bid.bidNumber}`] = {
      kind: "approvals",
      id: r.bid.bidNumber,
      title: bidTitle(r.bid),
      fields,
    };
  });
  deadlines.forEach((r) => {
    const bucket =
      r.days < 0 ? "late" : r.days <= SOON_BID_DAYS ? "soon" : "ok";
    sig[`due:${r.bid.bidNumber}`] = {
      kind: "deadlines",
      id: r.bid.bidNumber,
      title: bidTitle(r.bid),
      fields: { dueDate: r.bid.dueDate || "", bucket },
    };
  });
  return sig;
}

function sameFields(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  const ka = Object.keys(a);
  return ka.length === Object.keys(b).length && ka.every((k) => a[k] === b[k]);
}

function fmtDay(value: string): string {
  return value ? formatDate(value, "MMM d") : "-";
}

function describeDateChange(label: string, from: string, to: string): string {
  if (!from) return `${label} set to ${fmtDay(to)}`;
  if (!to) return `${label} removed`;
  if (fmtDay(from) === fmtDay(to)) return `${label} updated`;
  return `${label} moved from ${fmtDay(from)} to ${fmtDay(to)}`;
}

function describeErn(prev: SigEntry | undefined, cur: SigEntry): string[] {
  const f = cur.fields;
  if (!prev) return [`New ERN linked to ${f.bid} (${f.status})`];
  const p = prev.fields;
  const out: string[] = [];
  if (p.bid !== f.bid) out.push(`Now linked to ${f.bid}`);
  if (p.status !== f.status) {
    out.push(`Status changed from ${p.status} to ${f.status}`);
  }
  if (p.finishDate !== f.finishDate) {
    out.push(
      f.finishDate && !p.finishDate
        ? `Finished on ${fmtDay(f.finishDate)}`
        : describeDateChange("Finish date", p.finishDate, f.finishDate),
    );
  }
  if (p.dueDate !== f.dueDate) {
    out.push(describeDateChange("Due date", p.dueDate, f.dueDate));
  }
  if (p.deadline !== f.deadline) {
    if (f.deadline === "overdue") out.push("Now overdue");
    else if (f.deadline === "due-soon") {
      out.push(
        `Now due soon (${SHAREPOINT_CONFIG.ern.dueSoonDays} days or less)`,
      );
    } else if (out.length === 0) {
      out.push(f.deadline === "ok" ? "Back on track" : "No due date anymore");
    }
  }
  return out.length ? out : ["Details updated"];
}

function personKeys(fields: Record<string, string>): string[] {
  return Object.keys(fields).filter((k) => k.indexOf(PERSON_PREFIX) === 0);
}

function describeApproval(prev: SigEntry | undefined, cur: SigEntry): string[] {
  const f = cur.fields;
  const progress = `${f.approved}/${f.total} approved`;
  if (!prev) {
    return [
      `Sent for approval, round ${f.round} with ${f.total} approval${f.total === "1" ? "" : "s"}`,
    ];
  }
  const p = prev.fields;
  if (p.round !== f.round) {
    return [`New approval round ${f.round} started`, progress];
  }
  const out: string[] = [];
  personKeys(f).forEach((k) => {
    const name = k.slice(PERSON_PREFIX.length);
    const was = p[k];
    const now = f[k];
    if (was === now) return;
    if (was === undefined) out.push(`${name} added as approver`);
    else if (now === "approved") out.push(`Approved by ${name}`);
    else if (now === "rejected") out.push(`Rejected by ${name}`);
    else if (now === "revision-requested") {
      out.push(`Revision requested by ${name}`);
    } else out.push(`${name} is waiting to approve again`);
  });
  personKeys(p).forEach((k) => {
    if (!(k in f)) {
      out.push(`${k.slice(PERSON_PREFIX.length)} removed from approvers`);
    }
  });
  if (p.approved !== f.approved || p.total !== f.total) out.push(progress);
  return out.length ? out : ["Approval details updated"];
}

function describeDeadline(prev: SigEntry | undefined, cur: SigEntry): string[] {
  const f = cur.fields;
  if (!prev) return [`New active BID, due ${fmtDay(f.dueDate)}`];
  const p = prev.fields;
  const out: string[] = [];
  if (p.dueDate !== f.dueDate) {
    out.push(describeDateChange("Due date", p.dueDate, f.dueDate));
  }
  if (p.bucket !== f.bucket) {
    if (f.bucket === "late") out.push("Now overdue");
    else if (f.bucket === "soon") {
      out.push(`Due in ${SOON_BID_DAYS} days or less`);
    } else if (out.length === 0) out.push("No longer due soon");
  }
  return out.length ? out : ["Deadline updated"];
}

function describeGone(entry: SigEntry, bid: IBid | undefined): string {
  if (entry.kind === "erns") {
    return `No longer linked to ${entry.fields.bid}`;
  }
  if (!bid) return "BID removed";
  if (entry.kind === "approvals") {
    if (bid.approvalStatus === "approved") return "Fully approved";
    if (bid.approvalStatus === "rejected") return "Approval rejected";
    if (bid.approvalStatus === "revision-requested") {
      return "Revision requested";
    }
    return "No longer waiting for approval";
  }
  if (!bid.dueDate) return "Due date removed";
  return `No longer active (${bid.currentStatus})`;
}

function diffSignature(
  seen: Signature | null,
  current: Signature,
  bids: IBid[],
): LiveUpdates {
  const keys: Record<string, ILiveUpdate> = {};
  const items: ILiveUpdate[] = [];
  if (!seen) return { keys, count: 0, items };
  Object.keys(current).forEach((k) => {
    const prev = seen[k];
    const cur = current[k];
    if (prev && sameFields(prev.fields, cur.fields)) return;
    const describe =
      cur.kind === "erns"
        ? describeErn
        : cur.kind === "approvals"
          ? describeApproval
          : describeDeadline;
    const item: ILiveUpdate = {
      key: k,
      kind: cur.kind,
      id: cur.id,
      title: cur.title,
      changes: describe(prev, cur),
      gone: false,
    };
    keys[k] = item;
    items.push(item);
  });
  const byNumber: Record<string, IBid> = {};
  bids.forEach((b) => {
    byNumber[b.bidNumber] = b;
  });
  Object.keys(seen).forEach((k) => {
    if (k in current) return;
    const entry = seen[k];
    items.push({
      key: k,
      kind: entry.kind,
      id: entry.id,
      title: entry.title,
      changes: [describeGone(entry, byNumber[entry.id])],
      gone: true,
    });
  });
  return { keys, count: items.length, items };
}

export const LivePulse: React.FC = () => {
  const navigate = useNavigate();
  const { openBid } = useOpenBid();
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
    () => diffSignature(seen, signature, allBids),
    [seen, signature, allBids],
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
      ? `${updates.count} update${updates.count === 1 ? "" : "s"} since your last check (${updates.items
          .slice(0, 2)
          .map((u) => `${u.id}: ${u.changes[0]}`)
          .join("; ")}${updates.count > 2 ? "; ..." : ""})`
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
                onOpenBid={openBid}
                onDashboard={onDashboard}
              />
            </div>
          </div>,
          anchor.host,
        )}
    </>
  );
};

/**
 * LivePulsePanel — content of the header Live panel: KPI tiles, ERNs /
 * Approvals / Deadlines tabs and an in-panel drill-down detail view.
 */
import * as React from "react";
import { format } from "date-fns";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  LayoutDashboard,
  Minus,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import { LiveOverview, LiveUpdates } from "../../hooks/useLiveOverview";
import { DashboardSync } from "../../hooks/useDashboardSync";
import {
  ErnWatchFilter,
  getErnCountdownLabel,
  IErnLinkRow,
  isErnAssignedTo,
  matchesErnWatchFilter,
} from "../../utils/ernHelpers";
import { IPendingApprovalRow } from "../../utils/approvalHelpers";
import { IUpcomingDeadline } from "../../utils/bidHelpers";
import { formatDate } from "../../utils/formatters";
import { getPhaseDef } from "../../config/status.config";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { StatusBadge } from "../common/StatusBadge";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import { prefersReducedMotion } from "../dashboard/LiveFocusOverlay";
import styles from "./LivePulsePanel.module.scss";

interface LivePulsePanelProps {
  live: LiveOverview;
  sync: DashboardSync;
  updates: LiveUpdates;
  userEmail: string;
  onMinimize: () => void;
  onOpenDashboard: () => void;
  onOpenBid: (bidNumber: string) => void;
  /** The dashboard page polls itself; hide refresh / dashboard shortcuts there */
  onDashboard: boolean;
}

type Tab = "erns" | "approvals" | "deadlines";

interface DetailRef {
  kind: Tab;
  key: string;
}

const LIST_LIMIT = 40;
const SOON_BID_DAYS = 3;

const ERN_FILTERS: { value: ErnWatchFilter; label: string }[] = [
  { value: "overdue", label: "Overdue" },
  { value: "due-soon", label: "Due soon" },
  { value: "open", label: "All open" },
];

function useCountUp(value: number, duration = 700): number {
  const [display, setDisplay] = React.useState(0);
  const fromRef = React.useRef(0);
  React.useEffect(() => {
    if (prefersReducedMotion()) {
      fromRef.current = value;
      setDisplay(value);
      return undefined;
    }
    const from = fromRef.current;
    const start = performance.now();
    let raf = 0;
    const step = (now: number): void => {
      const t = Math.min(1, (now - start) / duration);
      const v = Math.round(from + (value - from) * (1 - Math.pow(1 - t, 3)));
      fromRef.current = v;
      setDisplay(v);
      if (t < 1) raf = window.requestAnimationFrame(step);
    };
    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function ernTone(r: IErnLinkRow): string {
  if (r.onHold) return styles.toneMuted;
  if (r.deadline === "overdue") return styles.toneDanger;
  if (r.deadline === "due-soon") return styles.toneWarning;
  if (r.deadline === "none") return styles.toneMuted;
  return styles.toneOk;
}

function dayTone(days: number | null, warnFrom: number): string {
  if (days === null) return styles.toneMuted;
  if (days < 0) return styles.toneDanger;
  if (days <= warnFrom) return styles.toneWarning;
  return styles.toneOk;
}

function waitTone(days: number | null): string {
  if (days === null) return styles.toneMuted;
  if (days > 3) return styles.toneDanger;
  if (days > 1) return styles.toneWarning;
  return styles.toneMuted;
}

function itemStyle(i: number): React.CSSProperties {
  return { "--i": Math.min(i, 10) } as React.CSSProperties;
}

const Tile: React.FC<{
  label: string;
  value: number;
  tone: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, value, tone, active, onClick }) => {
  const shown = useCountUp(value);
  return (
    <button
      type="button"
      className={`${styles.tile} ${tone} ${active ? styles.tileActive : ""}`}
      onClick={onClick}
      aria-pressed={active}
    >
      <span className={styles.tileValue}>{shown}</span>
      <span className={styles.tileLabel}>{label}</span>
    </button>
  );
};

const Field: React.FC<{ label: string; value?: string; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div className={styles.field}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={styles.fieldValue}>
      {value || "-"}
      {value && hint ? (
        <span className={styles.fieldHint}> · {hint}</span>
      ) : null}
    </span>
  </div>
);

export const LivePulsePanel: React.FC<LivePulsePanelProps> = ({
  live,
  sync,
  updates,
  userEmail,
  onMinimize,
  onOpenDashboard,
  onOpenBid,
  onDashboard,
}) => {
  const { ernRows, ernKpis, approvals, deadlines } = live;
  const [tab, setTab] = React.useState<Tab>("erns");
  const [ernFilter, setErnFilter] = React.useState<ErnWatchFilter>("open");
  const [mine, setMine] = React.useState(false);
  const [detail, setDetail] = React.useState<DetailRef | null>(null);
  const [direction, setDirection] = React.useState<"forward" | "back">(
    "forward",
  );
  const minimizeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    minimizeRef.current?.focus();
  }, []);

  const openErns = React.useMemo(
    () => ernRows.filter((r) => !r.closed),
    [ernRows],
  );
  const ernScoped = mine
    ? openErns.filter((r) => isErnAssignedTo(r.ern, userEmail))
    : openErns;
  const ernVisible = ernScoped.filter((r) =>
    matchesErnWatchFilter(r, ernFilter),
  );
  const soonBids = deadlines.filter((d) => d.days <= SOON_BID_DAYS).length;

  const openDetail = (kind: Tab, key: string): void => {
    setDirection("forward");
    setDetail({ kind, key });
  };
  const goBack = (): void => {
    setDirection("back");
    setDetail(null);
  };
  const pick = (t: Tab, filter?: ErnWatchFilter): void => {
    if (detail) goBack();
    setTab(t);
    if (filter) setErnFilter(filter);
  };

  const tabs: SegmentOption<Tab>[] = [
    { value: "erns", label: `ERNs ${openErns.length}` },
    { value: "approvals", label: `Approvals ${approvals.length}` },
    { value: "deadlines", label: `Deadlines ${deadlines.length}` },
  ];

  const syncLabel = onDashboard
    ? "Synced with the dashboard"
    : sync.syncing
      ? "Syncing..."
      : sync.lastSyncedAt
        ? `Updated ${format(sync.lastSyncedAt, "HH:mm")} · every 60s`
        : "Connecting...";

  /* ── Lists ── */

  const newMark = (key: string): React.ReactNode =>
    updates.keys[key] ? (
      <span
        className={styles.newDot}
        title="Updated since your last check"
        aria-label="Updated"
      />
    ) : null;

  const rowClass = (key: string, tone: string): string =>
    `${styles.row} ${tone} ${updates.keys[key] ? styles.rowUpdated : ""}`;

  const renderErnList = (): React.ReactNode => {
    if (ernVisible.length === 0) {
      return (
        <div className={styles.empty}>
          {mine ? "No ERN assigned to you here." : "Nothing here. All clear."}
        </div>
      );
    }
    return ernVisible.slice(0, LIST_LIMIT).map((r, i) => {
      const project =
        r.ern?.projectTitle ||
        r.bid.opportunityInfo?.projectName ||
        r.bid.bidNumber;
      return (
        <button
          key={r.ernNumber}
          type="button"
          className={rowClass(`ern:${r.ernNumber}`, ernTone(r))}
          style={itemStyle(i)}
          onClick={() => openDetail("erns", r.ernNumber)}
        >
          <span className={styles.rowMain}>
            <span className={styles.rowTitle}>
              {newMark(`ern:${r.ernNumber}`)}
              <span className={styles.mono}>{r.ernNumber}</span>
              <span className={styles.rowTitleText}>{project}</span>
            </span>
            <span className={styles.rowMeta}>
              {r.bid.bidNumber}
              {r.ern?.resource1 ? ` · ${r.ern.resource1}` : ""}
            </span>
          </span>
          <span className={styles.pill}>{getErnCountdownLabel(r)}</span>
          <ChevronRight size={14} className={styles.rowChevron} />
        </button>
      );
    });
  };

  const renderApprovalList = (): React.ReactNode => {
    if (approvals.length === 0) {
      return (
        <div className={styles.empty}>No BID is waiting for approval.</div>
      );
    }
    return approvals.slice(0, LIST_LIMIT).map((r, i) => {
      const project = r.bid.opportunityInfo?.projectName;
      return (
        <button
          key={r.bid.bidNumber}
          type="button"
          className={rowClass(`apr:${r.bid.bidNumber}`, waitTone(r.days))}
          style={itemStyle(i)}
          onClick={() => openDetail("approvals", r.bid.bidNumber)}
        >
          <span className={styles.rowMain}>
            <span className={styles.rowTitle}>
              {newMark(`apr:${r.bid.bidNumber}`)}
              <span className={styles.rowTitleText}>
                {project || r.bid.opportunityInfo?.client || r.bid.bidNumber}
              </span>
            </span>
            <span className={styles.rowMeta}>
              {r.bid.bidNumber}
              <ConfidentialLock bid={r.bid} size={11} />
              {` · ${r.approved}/${r.total} approved · ${r.waiting.length} waiting`}
            </span>
          </span>
          <span className={styles.pill}>
            {r.days === null
              ? "Waiting"
              : r.days === 0
                ? "Today"
                : `${r.days}d`}
          </span>
          <ChevronRight size={14} className={styles.rowChevron} />
        </button>
      );
    });
  };

  const renderDeadlineList = (): React.ReactNode => {
    if (deadlines.length === 0) {
      return <div className={styles.empty}>No active BID with a due date.</div>;
    }
    return deadlines.slice(0, LIST_LIMIT).map((r, i) => {
      const project = r.bid.opportunityInfo?.projectName;
      const client = r.bid.opportunityInfo?.client;
      return (
        <button
          key={r.bid.bidNumber}
          type="button"
          className={rowClass(
            `due:${r.bid.bidNumber}`,
            dayTone(r.days, SOON_BID_DAYS),
          )}
          style={itemStyle(i)}
          onClick={() => openDetail("deadlines", r.bid.bidNumber)}
        >
          <span className={styles.rowMain}>
            <span className={styles.rowTitle}>
              {newMark(`due:${r.bid.bidNumber}`)}
              <span className={styles.rowTitleText}>
                {project || client || r.bid.bidNumber}
              </span>
            </span>
            <span className={styles.rowMeta}>
              {r.bid.bidNumber}
              <ConfidentialLock bid={r.bid} size={11} />
              {project && client ? ` · ${client}` : ""}
              {` · Due ${formatDate(r.bid.dueDate, "MMM d")}`}
            </span>
          </span>
          <span className={styles.pill}>{r.text}</span>
          <ChevronRight size={14} className={styles.rowChevron} />
        </button>
      );
    });
  };

  const listTotal =
    tab === "erns"
      ? ernVisible.length
      : tab === "approvals"
        ? approvals.length
        : deadlines.length;

  /* ── Detail views ── */

  const openBidBtn = (bidNumber: string): React.ReactNode => (
    <button
      type="button"
      className={styles.primaryBtn}
      onClick={() => onOpenBid(bidNumber)}
    >
      Open {bidNumber}
      <ConfidentialLock bidNumber={bidNumber} />
      <ArrowUpRight size={14} />
    </button>
  );

  const renderErnDetail = (r: IErnLinkRow): React.ReactNode => {
    const ern = r.ern;
    const bid = r.bid;
    const project =
      ern?.projectTitle || bid.opportunityInfo?.projectName || bid.bidNumber;
    return (
      <>
        <div className={`${styles.detailHead} ${ernTone(r)}`}>
          <span className={styles.mono}>
            {r.ernNumber}
            {r.division
              ? ` · ${r.division === "SURVEY" ? "Survey" : r.division}`
              : ""}
          </span>
          <span className={styles.pillLg}>{getErnCountdownLabel(r)}</span>
        </div>
        <h3 className={styles.detailTitle}>{project}</h3>
        <div className={styles.detailMeta}>
          <span className={styles.chip}>{r.status}</span>
          {bid.bidNumber}
          {bid.opportunityInfo?.client
            ? ` · ${bid.opportunityInfo.client}`
            : ""}
        </div>
        <div className={styles.fields}>
          <Field
            label="Eng. due date"
            value={r.dueDate ? formatDate(r.dueDate) : ""}
          />
          <Field label="Responsible" value={ern?.resource1} />
          <Field
            label="Checker"
            value={ern?.checker}
            hint={
              ern?.checkerDueDate
                ? `due ${formatDate(ern.checkerDueDate, "MMM d")}`
                : undefined
            }
          />
          <Field
            label="Lead"
            value={ern?.lead}
            hint={ern?.leadDate ? formatDate(ern.leadDate, "MMM d") : undefined}
          />
          <Field
            label="Service line"
            value={ern?.serviceLine || bid.serviceLine}
          />
          <Field label="Deliverable" value={ern?.deliverableType} />
          <Field label="Project number" value={ern?.projectNumber} />
        </div>
        {ern?.description && (
          <div className={styles.description}>{ern.description}</div>
        )}
        <div className={styles.detailActions}>
          {openBidBtn(bid.bidNumber)}
          <a
            className={styles.secondaryBtn}
            href={SHAREPOINT_CONFIG.ern.appUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            ERN app <ExternalLink size={12} />
          </a>
        </div>
      </>
    );
  };

  const renderApprovalDetail = (r: IPendingApprovalRow): React.ReactNode => {
    const project = r.bid.opportunityInfo?.projectName;
    const client = r.bid.opportunityInfo?.client;
    const rank: Record<string, number> = {
      pending: 0,
      rejected: 1,
      approved: 2,
    };
    const people = r.people
      .slice()
      .sort((a, b) => (rank[a.status] ?? 0) - (rank[b.status] ?? 0));
    return (
      <>
        <div className={`${styles.detailHead} ${waitTone(r.days)}`}>
          <span className={styles.mono}>{r.bid.bidNumber}</span>
          <span className={styles.pillLg}>
            {r.days === null ? "Waiting" : `${r.days}d waiting`}
          </span>
        </div>
        <h3 className={styles.detailTitle}>
          {project || client || r.bid.bidNumber}
        </h3>
        <div className={styles.detailMeta}>
          {client && project ? `${client} · ` : ""}Round {r.round}
          {r.startedDate ? ` · started ${format(r.startedDate, "MMM d")}` : ""}
        </div>
        <div className={styles.progress}>
          <div className={styles.segments} aria-hidden="true">
            {r.statuses.map((s, i) => (
              <span
                key={i}
                className={`${styles.segment} ${
                  s === "approved"
                    ? styles.segApproved
                    : s === "rejected"
                      ? styles.segRejected
                      : styles.segPending
                }`}
              />
            ))}
          </div>
          <span className={styles.progressText}>
            <strong>{r.approved}</strong>/{r.total} approved
          </span>
        </div>
        <ul className={styles.people}>
          {people.map((p, i) => (
            <li
              key={p.email || p.name}
              className={styles.personRow}
              style={{
                ...itemStyle(i),
                ...(p.color
                  ? ({ "--sector-color": p.color } as React.CSSProperties)
                  : {}),
              }}
            >
              <span className={styles.avatar}>{initials(p.name)}</span>
              <span className={styles.personInfo}>
                <span className={styles.personName}>{p.name}</span>
                <span className={styles.personSector}>
                  {p.sectors.join(", ")}
                </span>
              </span>
              <span
                className={`${styles.personStatus} ${
                  p.status === "approved"
                    ? styles.toneOk
                    : p.status === "rejected"
                      ? styles.toneDanger
                      : styles.toneWarning
                }`}
              >
                {p.status === "approved" ? (
                  <Check size={12} />
                ) : p.status === "rejected" ? (
                  <X size={12} />
                ) : (
                  <Clock size={12} />
                )}
                {p.status === "approved"
                  ? "Approved"
                  : p.status === "rejected"
                    ? "Rejected"
                    : "Waiting"}
              </span>
            </li>
          ))}
        </ul>
        <div className={styles.detailActions}>
          {openBidBtn(r.bid.bidNumber)}
        </div>
      </>
    );
  };

  const renderDeadlineDetail = (r: IUpcomingDeadline): React.ReactNode => {
    const bid = r.bid;
    const project = bid.opportunityInfo?.projectName;
    const client = bid.opportunityInfo?.client;
    const engineers = (bid.engineerResponsible || [])
      .map((p) => p.name)
      .filter(Boolean)
      .join(", ");
    return (
      <>
        <div
          className={`${styles.detailHead} ${dayTone(r.days, SOON_BID_DAYS)}`}
        >
          <span className={styles.mono}>{bid.bidNumber}</span>
          <span className={styles.pillLg}>{r.text}</span>
        </div>
        <h3 className={styles.detailTitle}>
          {project || client || bid.bidNumber}
        </h3>
        <div className={styles.detailMeta}>
          <StatusBadge status={bid.currentStatus} />
        </div>
        <div className={styles.fields}>
          <Field label="Due date" value={formatDate(bid.dueDate)} />
          <Field label="Client" value={client} />
          <Field
            label="Phase"
            value={getPhaseDef(bid.currentPhase)?.label || bid.currentPhase}
          />
          <Field label="Division" value={bid.division} />
          <Field label="Service line" value={bid.serviceLine} />
          <Field label="Engineer" value={engineers} />
        </div>
        <div className={styles.detailActions}>{openBidBtn(bid.bidNumber)}</div>
      </>
    );
  };

  const renderDetail = (d: DetailRef): React.ReactNode => {
    let content: React.ReactNode = null;
    if (d.kind === "erns") {
      const r = ernRows.find((x) => x.ernNumber === d.key);
      if (r) content = renderErnDetail(r);
    } else if (d.kind === "approvals") {
      const r = approvals.find((x) => x.bid.bidNumber === d.key);
      if (r) content = renderApprovalDetail(r);
    } else {
      const r = deadlines.find((x) => x.bid.bidNumber === d.key);
      if (r) content = renderDeadlineDetail(r);
    }
    return (
      <div
        key={`${d.kind}-${d.key}`}
        className={`${styles.view} ${styles.viewForward}`}
      >
        <button type="button" className={styles.backBtn} onClick={goBack}>
          <ChevronLeft size={15} /> Back
        </button>
        {content || (
          <div className={styles.empty}>
            This item is no longer pending. It was updated in the last sync.
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.liveDot} aria-hidden="true" />
          <div className={styles.headerText}>
            <span className={styles.title}>Live overview</span>
            <span className={styles.sub}>{syncLabel}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          {!onDashboard && (
            <>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={sync.refreshNow}
                disabled={sync.syncing}
                title="Refresh now"
                aria-label="Refresh now"
              >
                <RefreshCw
                  size={15}
                  className={sync.syncing ? styles.spin : undefined}
                />
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={onOpenDashboard}
                title="Open Engineering Dashboard"
                aria-label="Open Engineering Dashboard"
              >
                <LayoutDashboard size={15} />
              </button>
            </>
          )}
          <button
            ref={minimizeRef}
            type="button"
            className={styles.iconBtn}
            onClick={onMinimize}
            title="Minimize (Esc)"
            aria-label="Minimize live overview"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      <div className={styles.body}>
        {detail ? (
          renderDetail(detail)
        ) : (
          <div
            key="main"
            className={`${styles.view} ${direction === "back" ? styles.viewBack : ""}`}
          >
            {updates.count > 0 && (
              <div
                className={styles.updatesBanner}
                data-pulse-item=""
                style={itemStyle(0)}
              >
                <span className={styles.newDot} aria-hidden="true" />
                {updates.count} update{updates.count === 1 ? "" : "s"} since
                your last check
              </div>
            )}
            <div
              className={styles.tiles}
              data-pulse-item=""
              style={itemStyle(0)}
            >
              <Tile
                label="ERNs overdue"
                value={ernKpis.overdue}
                tone={styles.toneDanger}
                active={tab === "erns" && ernFilter === "overdue"}
                onClick={() => pick("erns", "overdue")}
              />
              <Tile
                label="ERNs due soon"
                value={ernKpis.dueSoon}
                tone={styles.toneWarning}
                active={tab === "erns" && ernFilter === "due-soon"}
                onClick={() => pick("erns", "due-soon")}
              />
              <Tile
                label="Awaiting approval"
                value={approvals.length}
                tone={styles.toneInfo}
                active={tab === "approvals"}
                onClick={() => pick("approvals")}
              />
              <Tile
                label={`BIDs due in ${SOON_BID_DAYS}d`}
                value={soonBids}
                tone={styles.toneAccent}
                active={tab === "deadlines"}
                onClick={() => pick("deadlines")}
              />
            </div>

            <div
              className={styles.tabsRow}
              data-pulse-item=""
              style={itemStyle(1)}
            >
              <SegmentedControl<Tab>
                value={tab}
                segments={tabs}
                onChange={setTab}
                size="sm"
                ariaLabel="Live overview sections"
                className={styles.tabs}
              />
            </div>

            {tab === "erns" && (
              <div
                className={styles.filterRow}
                data-pulse-item=""
                style={itemStyle(2)}
              >
                {ERN_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    className={`${styles.chipBtn} ${ernFilter === f.value ? styles.chipActive : ""}`}
                    onClick={() => setErnFilter(f.value)}
                    aria-pressed={ernFilter === f.value}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  type="button"
                  className={`${styles.chipBtn} ${styles.mineBtn} ${mine ? styles.chipActive : ""}`}
                  onClick={() => setMine((m) => !m)}
                  aria-pressed={mine}
                  title="Only ERNs where I am the responsible, checker or lead"
                >
                  <UserRound size={12} /> Mine
                </button>
              </div>
            )}

            <div key={`${tab}-${ernFilter}-${mine}`} className={styles.list}>
              {tab === "erns"
                ? renderErnList()
                : tab === "approvals"
                  ? renderApprovalList()
                  : renderDeadlineList()}
              {listTotal > LIST_LIMIT && (
                <div className={styles.more}>
                  +{listTotal - LIST_LIMIT} more on the dashboard
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {!onDashboard && (
        <button
          type="button"
          className={styles.footerBtn}
          onClick={onOpenDashboard}
        >
          Open Engineering Dashboard <ArrowUpRight size={14} />
        </button>
      )}
    </div>
  );
};

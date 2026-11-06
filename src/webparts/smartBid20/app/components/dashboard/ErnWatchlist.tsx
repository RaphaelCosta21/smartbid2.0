/**
 * ErnWatchlist — live list of open ERNs (linked to BIDs or General BID
 * Support), most urgent first, so no ERN closing date slips. Due soon /
 * overdue follow whoever holds the ERN now (Responsible, Checker or Lead).
 * List rows expand inline with full details; Timeline shows each ERN's stages.
 */
import * as React from "react";
import {
  ChartGantt,
  ChevronDown,
  ClipboardCheck,
  List,
  Plus,
  UserRound,
} from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  compareErnUrgency,
  ERN_GENERAL_SUPPORT_TITLE,
  ERN_STAGE_DATE_LABELS,
  ErnWatchFilter,
  ErnWatchScope,
  getErnCountdownLabel,
  getErnRowTags,
  getErnScopedDeadline,
  IErnLinkRow,
  isErnHandedOver,
  isErnResponsible,
  isErnWaitingOn,
  matchesErnWatchFilter,
  matchesErnWatchScope,
} from "../../utils/ernHelpers";
import { formatDate } from "../../utils/formatters";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { ErnStage } from "../../models";
import { GlassCard } from "../common/GlassCard";
import { EmptyState } from "../common/EmptyState";
import { UserAvatar } from "../common/UserAvatar";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import { ErnCreateModal } from "../bid/ErnCreateModal";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import {
  FocusButton,
  LiveFocusOverlay,
  useFocusMode,
} from "./LiveFocusOverlay";
import { ErnRowDetails } from "./ErnRowDetails";
import { ErnTimeline } from "./ErnTimeline";
import styles from "./ErnWatchlist.module.scss";

interface ErnWatchlistProps {
  rows: IErnLinkRow[];
  filter: ErnWatchFilter;
  onFilterChange: (filter: ErnWatchFilter) => void;
  onBidClick: (bidNumber: string) => void;
}

type ViewMode = "list" | "timeline";

const VIEW_SEGMENTS: SegmentOption<ViewMode>[] = [
  { value: "list", label: "List", icon: <List size={13} /> },
  { value: "timeline", label: "Timeline", icon: <ChartGantt size={13} /> },
];

const FILTERS: { value: ErnWatchFilter; label: string }[] = [
  { value: "overdue", label: "Overdue" },
  { value: "due-soon", label: "Due soon" },
  { value: "open", label: "Open" },
  { value: "on-hold", label: "On hold" },
];

const EMPTY_TEXT: Record<ErnWatchFilter, string> = {
  overdue: "No open ERN is past the date of whoever holds it.",
  "due-soon": `No ERN is due within ${SHAREPOINT_CONFIG.ern.dueSoonDays} days.`,
  open: "Every ERN here is closed.",
  "on-hold": "No ERN is on hold.",
};

const EMPTY_TITLE: Record<ErnWatchScope, string> = {
  all: "All clear",
  mine: "Nothing where you are the Responsible",
  review: "Nothing waiting on you",
};

const SCOPE_HINT: Record<ErnWatchScope, string> = {
  all: "",
  mine: " where I am the Responsible",
  review: " waiting on me as Checker / Lead",
};

/** Short label of the date that closes each stage. */
const STAGE_DATE_SHORT: Record<ErnStage, string> = {
  engineering: "Eng.",
  checker: "Checker",
  lead: "Lead",
};

function toneClass(r: IErnLinkRow, scope: ErnWatchScope): string {
  if (r.onHold) return styles.toneHold;
  if (isErnHandedOver(r, scope)) return styles.toneInfo;
  const d = getErnScopedDeadline(r, scope);
  if (d === "overdue") return styles.toneDanger;
  if (d === "due-soon") return styles.toneWarning;
  if (d === "none") return styles.toneNone;
  return styles.toneOk;
}

function firstName(name: string): string {
  return (name || "").split(" ")[0];
}

/** Second people line: who has the ERN after / instead of the Responsible. */
function reviewText(r: IErnLinkRow): string {
  const ern = r.ern;
  if (!ern) return "";
  const open = !r.closed && !r.onHold;
  if (open && r.stage === "checker" && ern.checker) {
    return `With Checker ${firstName(ern.checker)}${
      ern.checkerDueDate ? ` · due ${formatDate(ern.checkerDueDate, "MMM d")}` : ""
    }`;
  }
  if (open && r.stage === "lead" && ern.lead) {
    return `With Lead ${firstName(ern.lead)}${
      ern.leadDate ? ` · ${formatDate(ern.leadDate, "MMM d")}` : ""
    }`;
  }
  if (ern.checker) {
    return `Checker ${firstName(ern.checker)}${
      ern.checkerDueDate ? ` · due ${formatDate(ern.checkerDueDate, "MMM d")}` : ""
    }`;
  }
  return ern.lead ? `Lead ${firstName(ern.lead)}` : "";
}

export const ErnWatchlist: React.FC<ErnWatchlistProps> = ({
  rows,
  filter,
  onFilterChange,
  onBidClick,
}) => {
  const currentUser = useCurrentUser();
  const email = currentUser.email;
  const focus = useFocusMode();
  const [scope, setScope] = React.useState<ErnWatchScope>("all");
  const [view, setView] = React.useState<ViewMode>("list");
  const [openKey, setOpenKey] = React.useState<string | null>(null);
  const [creating, setCreating] = React.useState(false);

  const scoped = React.useMemo(
    () =>
      scope === "all"
        ? rows
        : rows
            .filter((r) => matchesErnWatchScope(r, scope, email))
            .sort((a, b) => compareErnUrgency(a, b, scope)),
    [rows, scope, email],
  );

  const counts = React.useMemo(() => {
    const c: Record<ErnWatchFilter, number> = {
      overdue: 0,
      "due-soon": 0,
      open: 0,
      "on-hold": 0,
    };
    scoped.forEach((r) => {
      FILTERS.forEach((f) => {
        if (matchesErnWatchFilter(r, f.value, scope)) c[f.value]++;
      });
    });
    return c;
  }, [scoped, scope]);

  const handedOver = React.useMemo(
    () => scoped.filter((r) => isErnHandedOver(r, scope)).length,
    [scoped, scope],
  );

  const mineCount = React.useMemo(
    () => rows.filter((r) => !r.closed && isErnResponsible(r.ern, email)).length,
    [rows, email],
  );
  const reviewCount = React.useMemo(
    () => rows.filter((r) => !r.closed && isErnWaitingOn(r, email)).length,
    [rows, email],
  );

  const visible = scoped.filter((r) => matchesErnWatchFilter(r, filter, scope));

  const segments: SegmentOption<ErnWatchFilter>[] = FILTERS.map((f) => ({
    value: f.value,
    label: `${f.label} ${counts[f.value]}`,
  }));

  const subtitle = `${counts.open} open${SCOPE_HINT[scope]} · ${counts.overdue} overdue · ${counts["due-soon"]} due within ${SHAREPOINT_CONFIG.ern.dueSoonDays} days${
    handedOver > 0 ? ` · ${handedOver} with Checker / Lead` : ""
  }`;

  const toggleScope = (s: ErnWatchScope): void =>
    setScope((cur) => (cur === s ? "all" : s));

  const controls = (
    <>
      <SegmentedControl<ErnWatchFilter>
        value={filter}
        segments={segments}
        onChange={onFilterChange}
        size="sm"
        ariaLabel="ERN filter"
      />
      <button
        type="button"
        className={`${styles.mineBtn} ${scope === "mine" ? styles.mineActive : ""}`}
        onClick={() => toggleScope("mine")}
        aria-pressed={scope === "mine"}
        title="Only ERNs where I am the Responsible. They count as late only while still with me (before the Checker)."
      >
        <UserRound size={13} />
        Mine
        <span className={styles.mineCount}>{mineCount}</span>
      </button>
      <button
        type="button"
        className={`${styles.mineBtn} ${scope === "review" ? styles.mineActive : ""}`}
        onClick={() => toggleScope("review")}
        aria-pressed={scope === "review"}
        title="ERNs waiting on me as Checker or Lead"
      >
        <ClipboardCheck size={13} />
        To review
        <span className={styles.mineCount}>{reviewCount}</span>
      </button>
    </>
  );

  const toolbar = (
    <div className={styles.toolbar}>
      <SegmentedControl<ViewMode>
        value={view}
        segments={VIEW_SEGMENTS}
        onChange={setView}
        size="sm"
        ariaLabel="ERN view"
      />
      <button
        type="button"
        className={styles.createBtn}
        onClick={() => setCreating(true)}
        title={`Create a ${ERN_GENERAL_SUPPORT_TITLE} ERN (not linked to a BID)`}
      >
        <Plus size={13} />
        BID Support ERN
      </button>
    </div>
  );

  const renderRow = (
    r: IErnLinkRow,
    expanded: boolean,
    index: number,
  ): React.ReactNode => {
    const ern = r.ern;
    const bid = r.bid;
    const project =
      ern?.projectTitle ||
      bid?.opportunityInfo?.projectName ||
      bid?.bidNumber ||
      r.ernNumber;
    const client = bid?.opportunityInfo?.client;
    const isOpen = openKey === r.ernNumber;
    const active = !r.closed && !r.onHold;
    const tags = getErnRowTags(r).filter(
      (t) => t !== ERN_GENERAL_SUPPORT_TITLE,
    );
    const meta = [
      client,
      ern?.serviceLine || bid?.serviceLine,
      ern?.deliverableType,
    ].filter(Boolean);
    const second = reviewText(r);
    const toggle = (): void => setOpenKey(isOpen ? null : r.ernNumber);
    return (
      <div
        key={r.ernNumber}
        className={`${styles.row} ${toneClass(r, scope)} ${isOpen ? styles.rowOpen : ""} ${
          expanded ? styles.rowExpanded : ""
        }`}
        data-focus-item={expanded ? "" : undefined}
        style={
          expanded
            ? ({ "--i": Math.min(index, 12) } as React.CSSProperties)
            : undefined
        }
      >
        <div
          className={styles.rowMain}
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
        >
          <div className={styles.ernCol}>
            <span className={styles.ernNumber}>
              {r.ernNumber}
              {tags.map((t) => (
                <span key={t} className={styles.divisionTag}>
                  {t}
                </span>
              ))}
            </span>
            <span className={styles.statusChip} title={r.status}>
              {r.status}
            </span>
          </div>

          <div className={styles.projectCol}>
            <span className={styles.project}>{project}</span>
            <span className={styles.meta}>
              {bid ? (
                <span className={styles.bidNumber}>
                  {bid.bidNumber}
                  <ConfidentialLock bid={bid} />
                </span>
              ) : (
                <span className={styles.generalTag}>
                  {ERN_GENERAL_SUPPORT_TITLE}
                </span>
              )}
              {meta.length > 0 ? ` · ${meta.join(" · ")}` : ""}
            </span>
          </div>

          <div className={styles.peopleCol}>
            {ern?.resource1 ? (
              <span
                className={styles.person}
                title={`Responsible: ${ern.resource1}`}
              >
                <UserAvatar
                  name={ern.resource1}
                  email={ern.resource1Email}
                  size={24}
                  ring={active && r.stage === "engineering"}
                  title=""
                />
                <span className={styles.personName}>{ern.resource1}</span>
              </span>
            ) : (
              <span className={styles.muted}>
                {ern ? "No responsible" : "ERN not loaded yet"}
              </span>
            )}
            {ern && (ern.checker || ern.lead) && (
              <span className={styles.reviewers}>
                <span className={styles.avatarStack}>
                  {ern.checker && (
                    <UserAvatar
                      name={ern.checker}
                      email={ern.checkerEmail}
                      size={18}
                      ring={active && r.stage === "checker"}
                      title={`Checker: ${ern.checker}`}
                    />
                  )}
                  {ern.lead && (
                    <UserAvatar
                      name={ern.lead}
                      email={ern.leadEmail}
                      size={18}
                      ring={active && r.stage === "lead"}
                      title={`Lead: ${ern.lead}`}
                    />
                  )}
                </span>
                <span className={styles.subPerson}>{second}</span>
              </span>
            )}
          </div>

          <div className={styles.dueCol}>
            <span
              className={styles.dueDate}
              title={ERN_STAGE_DATE_LABELS[r.stage]}
            >
              {r.stageDueDate
                ? `${STAGE_DATE_SHORT[r.stage]} ${formatDate(r.stageDueDate, "MMM d")}`
                : "-"}
            </span>
            <span className={styles.countdown}>
              {getErnCountdownLabel(r, scope, false)}
            </span>
          </div>

          <ChevronDown
            size={16}
            className={styles.chevron}
            aria-hidden="true"
          />
        </div>

        <div className={styles.details} aria-hidden={!isOpen}>
          <div className={styles.detailsInner}>
            <ErnRowDetails
              row={r}
              onBidClick={onBidClick}
              tabbable={isOpen}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderContent = (expanded: boolean): React.ReactNode => {
    if (visible.length === 0) {
      return (
        <EmptyState
          variant="glass"
          title={EMPTY_TITLE[scope]}
          description={EMPTY_TEXT[filter]}
        />
      );
    }
    if (view === "timeline") {
      return (
        <ErnTimeline
          rows={visible}
          scope={scope}
          expanded={expanded}
          onBidClick={onBidClick}
        />
      );
    }
    return (
      <div className={expanded ? styles.focusList : styles.list}>
        {visible.map((r, i) => renderRow(r, expanded, i))}
      </div>
    );
  };

  const renderBody = (expanded: boolean): React.ReactNode => (
    <>
      {toolbar}
      {renderContent(expanded)}
    </>
  );

  return (
    <div ref={focus.ref}>
      <GlassCard
        title="ERN Watchlist"
        subtitle={subtitle}
        actions={
          <div className={styles.actions}>
            {controls}
            <FocusButton onClick={focus.open} label="ERN Watchlist" />
          </div>
        }
      >
        {renderBody(false)}
      </GlassCard>

      <LiveFocusOverlay
        origin={focus.origin}
        onClose={focus.close}
        title="ERN Watchlist"
        subtitle={subtitle}
        actions={<div className={styles.actions}>{controls}</div>}
      >
        {renderBody(true)}
      </LiveFocusOverlay>

      {creating && (
        <ErnCreateModal
          isOpen={creating}
          onDismiss={() => setCreating(false)}
          onCreated={() => setCreating(false)}
        />
      )}
    </div>
  );
};

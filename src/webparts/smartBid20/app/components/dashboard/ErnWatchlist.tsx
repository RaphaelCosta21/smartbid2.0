/**
 * ErnWatchlist — live list of open ERNs linked to BIDs, most urgent first, so
 * no ERN closing date slips. Rows expand inline with the full ERN details.
 */
import * as React from "react";
import { ChevronDown, ExternalLink, UserRound } from "lucide-react";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import {
  ErnWatchFilter,
  getErnCountdownLabel,
  IErnLinkRow,
  isErnAssignedTo,
  matchesErnWatchFilter,
} from "../../utils/ernHelpers";
import { formatDate } from "../../utils/formatters";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { GlassCard } from "../common/GlassCard";
import { EmptyState } from "../common/EmptyState";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import {
  FocusButton,
  LiveFocusOverlay,
  useFocusMode,
} from "./LiveFocusOverlay";
import styles from "./ErnWatchlist.module.scss";

interface ErnWatchlistProps {
  rows: IErnLinkRow[];
  filter: ErnWatchFilter;
  onFilterChange: (filter: ErnWatchFilter) => void;
  onBidClick: (bidNumber: string) => void;
}

const FILTERS: { value: ErnWatchFilter; label: string }[] = [
  { value: "overdue", label: "Overdue" },
  { value: "due-soon", label: "Due soon" },
  { value: "open", label: "Open" },
  { value: "on-hold", label: "On hold" },
];

const EMPTY_TEXT: Record<ErnWatchFilter, string> = {
  overdue: "No open ERN is past its due date.",
  "due-soon": `No ERN is due within ${SHAREPOINT_CONFIG.ern.dueSoonDays} days.`,
  open: "Every linked ERN is closed.",
  "on-hold": "No ERN is on hold.",
};

function toneClass(r: IErnLinkRow): string {
  if (r.onHold) return styles.toneHold;
  if (r.deadline === "overdue") return styles.toneDanger;
  if (r.deadline === "due-soon") return styles.toneWarning;
  if (r.deadline === "none") return styles.toneNone;
  return styles.toneOk;
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

export const ErnWatchlist: React.FC<ErnWatchlistProps> = ({
  rows,
  filter,
  onFilterChange,
  onBidClick,
}) => {
  const currentUser = useCurrentUser();
  const focus = useFocusMode();
  const [mine, setMine] = React.useState(false);
  const [openKey, setOpenKey] = React.useState<string | null>(null);

  const scoped = React.useMemo(
    () =>
      mine
        ? rows.filter((r) => isErnAssignedTo(r.ern, currentUser.email))
        : rows,
    [rows, mine, currentUser.email],
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
        if (matchesErnWatchFilter(r, f.value)) c[f.value]++;
      });
    });
    return c;
  }, [scoped]);

  const mineCount = React.useMemo(
    () =>
      rows.filter((r) => !r.closed && isErnAssignedTo(r.ern, currentUser.email))
        .length,
    [rows, currentUser.email],
  );

  const visible = scoped.filter((r) => matchesErnWatchFilter(r, filter));

  const segments: SegmentOption<ErnWatchFilter>[] = FILTERS.map((f) => ({
    value: f.value,
    label: `${f.label} ${counts[f.value]}`,
  }));

  const subtitle = `${counts.open} open${mine ? " assigned to me" : ""} · ${counts.overdue} overdue · ${counts["due-soon"]} due within ${SHAREPOINT_CONFIG.ern.dueSoonDays} days`;

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
        className={`${styles.mineBtn} ${mine ? styles.mineActive : ""}`}
        onClick={() => setMine((m) => !m)}
        aria-pressed={mine}
        title="Only ERNs where I am the responsible, checker or lead"
      >
        <UserRound size={13} />
        Mine
        <span className={styles.mineCount}>{mineCount}</span>
      </button>
    </>
  );

  const renderRow = (
    r: IErnLinkRow,
    expanded: boolean,
    index: number,
  ): React.ReactNode => {
    const ern = r.ern;
    const bid = r.bid;
    const project =
      ern?.projectTitle || bid.opportunityInfo?.projectName || bid.bidNumber;
    const client = bid.opportunityInfo?.client;
    const isOpen = openKey === r.ernNumber;
    const meta = [
      client,
      ern?.serviceLine || bid.serviceLine,
      ern?.deliverableType,
    ].filter(Boolean);
    const toggle = (): void => setOpenKey(isOpen ? null : r.ernNumber);
    return (
      <div
        key={r.ernNumber}
        className={`${styles.row} ${toneClass(r)} ${isOpen ? styles.rowOpen : ""} ${
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
              {r.division && (
                <span className={styles.divisionTag}>
                  {r.division === "SURVEY" ? "Survey" : r.division}
                </span>
              )}
            </span>
            <span className={styles.statusChip}>{r.status}</span>
          </div>

          <div className={styles.projectCol}>
            <span className={styles.project}>{project}</span>
            <span className={styles.meta}>
              <span className={styles.bidNumber}>
                {bid.bidNumber}
                <ConfidentialLock bid={bid} />
              </span>
              {meta.length > 0 ? ` · ${meta.join(" · ")}` : ""}
            </span>
          </div>

          <div className={styles.peopleCol}>
            {ern?.resource1 ? (
              <span
                className={styles.person}
                title={`Responsible: ${ern.resource1}`}
              >
                <span className={styles.avatar}>{initials(ern.resource1)}</span>
                <span className={styles.personName}>{ern.resource1}</span>
              </span>
            ) : (
              <span className={styles.muted}>No responsible</span>
            )}
            {ern?.checker && (
              <span className={styles.subPerson}>
                Checker {ern.checker.split(" ")[0]}
                {ern.checkerDueDate
                  ? ` · due ${formatDate(ern.checkerDueDate, "MMM d")}`
                  : ""}
              </span>
            )}
          </div>

          <div className={styles.dueCol}>
            <span className={styles.dueDate}>
              {r.dueDate ? formatDate(r.dueDate, "MMM d") : "-"}
            </span>
            <span className={styles.countdown}>{getErnCountdownLabel(r)}</span>
          </div>

          <ChevronDown
            size={16}
            className={styles.chevron}
            aria-hidden="true"
          />
        </div>

        <div className={styles.details} aria-hidden={!isOpen}>
          <div className={styles.detailsInner}>
            <div className={styles.detailGrid}>
              <Detail label="Responsible" value={ern?.resource1} />
              <Detail
                label="Checker"
                value={ern?.checker}
                hint={
                  ern?.checkerDueDate
                    ? `due ${formatDate(ern.checkerDueDate, "MMM d, yyyy")}`
                    : undefined
                }
              />
              <Detail
                label="Lead"
                value={ern?.lead}
                hint={
                  ern?.leadDate
                    ? formatDate(ern.leadDate, "MMM d, yyyy")
                    : undefined
                }
              />
              <Detail
                label="Eng. due date"
                value={r.dueDate ? formatDate(r.dueDate) : ""}
              />
              <Detail label="Project number" value={ern?.projectNumber} />
              <Detail label="Deliverable" value={ern?.deliverableType} />
            </div>
            {ern?.description && (
              <p className={styles.description}>{ern.description}</p>
            )}
            <div className={styles.detailActions}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => onBidClick(bid.bidNumber)}
                tabIndex={isOpen ? 0 : -1}
              >
                Open {bid.bidNumber}
              </button>
              <a
                className={styles.linkBtn}
                href={SHAREPOINT_CONFIG.ern.appUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={isOpen ? 0 : -1}
              >
                Open in ERN app <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderList = (expanded: boolean): React.ReactNode =>
    visible.length === 0 ? (
      <EmptyState
        variant="glass"
        title={mine ? "Nothing assigned to you here" : "All clear"}
        description={EMPTY_TEXT[filter]}
      />
    ) : (
      <div className={expanded ? styles.focusList : styles.list}>
        {visible.map((r, i) => renderRow(r, expanded, i))}
      </div>
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
        {renderList(false)}
      </GlassCard>

      <LiveFocusOverlay
        origin={focus.origin}
        onClose={focus.close}
        title="ERN Watchlist"
        subtitle={subtitle}
        actions={<div className={styles.actions}>{controls}</div>}
      >
        {renderList(true)}
      </LiveFocusOverlay>
    </div>
  );
};

const Detail: React.FC<{ label: string; value?: string; hint?: string }> = ({
  label,
  value,
  hint,
}) => (
  <div className={styles.detail}>
    <span className={styles.detailLabel}>{label}</span>
    <span className={styles.detailValue}>
      {value || "-"}
      {value && hint ? (
        <span className={styles.detailHint}> · {hint}</span>
      ) : null}
    </span>
  </div>
);

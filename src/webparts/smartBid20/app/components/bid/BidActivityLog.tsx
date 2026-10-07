import * as React from "react";
import {
  Activity,
  ArrowRight,
  Ban,
  CalendarClock,
  CirclePlus,
  Clock,
  Download,
  FastForward,
  FilePen,
  GitBranch,
  GitCommitHorizontal,
  History,
  Link2,
  Lock,
  LockOpen,
  LucideIcon,
  MessageSquare,
  Paperclip,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Sparkles,
  UserCheck,
  UserLock,
  Users,
  X,
} from "lucide-react";
import { IActivityLogEntry } from "../../models";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { EmptyState } from "../common/EmptyState";
import { PhaseBadge } from "../common/PhaseBadge";
import { StatusBadge } from "../common/StatusBadge";
import { useChartTheme } from "../../hooks/useChartTheme";
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from "../../utils/formatters";
import {
  ACTIVITY_CATEGORIES,
  ActivityCategory,
  getActivityMeta,
  groupActivityByDay,
} from "../../utils/activityLogHelpers";
import styles from "./BidActivityLog.module.scss";

interface BidActivityLogProps {
  entries: IActivityLogEntry[];
  className?: string;
}

const PAGE_SIZE = 20;

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  BID_CREATED: CirclePlus,
  PHASE_CHANGE: UserCheck,
  REVISION_STARTED: GitCommitHorizontal,
  REVISION_CLOSED: GitCommitHorizontal,
  CONFIDENTIALITY_ENABLED: Lock,
  CONFIDENTIALITY_UPDATED: UserLock,
  CONFIDENTIALITY_DISABLED: LockOpen,
  STATUS_CHANGED: RefreshCw,
  PHASE_CHANGED: GitBranch,
  APPROVAL_REQUESTED: Send,
  APPROVAL_RESPONSE: ShieldCheck,
  APPROVAL_REJECTED: ShieldX,
  APPROVAL_OVERRIDE: FastForward,
  APPROVAL_SECTOR_WAIVED: Ban,
  APPROVAL_SECTOR_REINSTATED: RotateCcw,
  DOCUMENT_CHANGE: Paperclip,
  ERN_LINKED: Link2,
  ERN_CHANGED: Link2,
  FIELD_UPDATED: FilePen,
  EDIT_IN_TERMINAL: FilePen,
  DUE_DATE_CHANGED: CalendarClock,
  "ai-import": Sparkles,
  COMMENT_ADDED: MessageSquare,
  BID_EXPORTED: Download,
  BID_EXPORTED_UNAPPROVED: ShieldAlert,
};

type CategoryFilter = ActivityCategory | "all";

function metaString(entry: IActivityLogEntry, key: string): string {
  const value = entry.metadata ? entry.metadata[key] : undefined;
  return value === undefined || value === null ? "" : String(value);
}

function getInitials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0];
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const Transition: React.FC<{ from: React.ReactNode; to: React.ReactNode }> = ({
  from,
  to,
}) => (
  <div className={styles.transition}>
    {from}
    <ArrowRight size={14} className={styles.arrow} aria-hidden="true" />
    {to}
  </div>
);

function renderDetail(entry: IActivityLogEntry): React.ReactNode {
  switch (entry.type) {
    case "PHASE_CHANGED": {
      const from = metaString(entry, "fromPhase");
      const to = metaString(entry, "toPhase");
      if (from && to) {
        return (
          <Transition
            from={<PhaseBadge phase={from} />}
            to={<PhaseBadge phase={to} />}
          />
        );
      }
      break;
    }
    case "STATUS_CHANGED": {
      const from = metaString(entry, "fromStatus");
      const to = metaString(entry, "toStatus");
      const note = metaString(entry, "note");
      if (from && to) {
        return (
          <>
            <Transition
              from={<StatusBadge status={from} />}
              to={<StatusBadge status={to} />}
            />
            {note && <p className={styles.description}>{note}</p>}
          </>
        );
      }
      break;
    }
    case "APPROVAL_RESPONSE":
    case "APPROVAL_REJECTED": {
      const comments = metaString(entry, "comments");
      return (
        <>
          <p className={styles.description}>{entry.description}</p>
          {comments && (
            <blockquote className={styles.quote}>{comments}</blockquote>
          )}
        </>
      );
    }
    case "PHASE_CHANGE": {
      const prevPhase = metaString(entry, "previousPhase");
      const newPhase = metaString(entry, "newPhase");
      const prevStatus = metaString(entry, "previousStatus");
      const newStatus = metaString(entry, "newStatus");
      const engineers = metaString(entry, "engineers");
      const analysts = metaString(entry, "analysts");
      if (newPhase && newStatus) {
        return (
          <>
            <Transition
              from={
                <span className={styles.badgePair}>
                  {prevPhase && <PhaseBadge phase={prevPhase} />}
                  {prevStatus && <StatusBadge status={prevStatus} />}
                </span>
              }
              to={
                <span className={styles.badgePair}>
                  <PhaseBadge phase={newPhase} />
                  <StatusBadge status={newStatus} />
                </span>
              }
            />
            {(engineers || analysts) && (
              <div className={styles.assignees}>
                {engineers && (
                  <span>
                    <strong>Engineers:</strong> {engineers}
                  </span>
                )}
                {analysts && (
                  <span>
                    <strong>Analysts:</strong> {analysts}
                  </span>
                )}
              </div>
            )}
          </>
        );
      }
      break;
    }
    case "DUE_DATE_CHANGED": {
      const prev = metaString(entry, "previousDueDate");
      const next = metaString(entry, "newDueDate");
      const reason = metaString(entry, "reason");
      if (next) {
        return (
          <>
            <Transition
              from={
                <span className={`${styles.datePill} ${styles.datePillOld}`}>
                  {prev ? formatDate(prev) : "-"}
                </span>
              }
              to={<span className={styles.datePill}>{formatDate(next)}</span>}
            />
            {reason && (
              <blockquote className={styles.quote}>{reason}</blockquote>
            )}
          </>
        );
      }
      break;
    }
    default:
      break;
  }
  return <p className={styles.description}>{entry.description}</p>;
}

export const BidActivityLog: React.FC<BidActivityLogProps> = ({
  entries,
  className,
}) => {
  const theme = useChartTheme();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState<CategoryFilter>("all");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  const sorted = React.useMemo(() => {
    const list = (entries || []).map((entry, index) => ({ entry, index }));
    list.sort((a, b) => {
      const diff =
        new Date(b.entry.timestamp).getTime() -
        new Date(a.entry.timestamp).getTime();
      // Same-timestamp entries (e.g. phase + status) keep newest-written first
      return diff !== 0 && !isNaN(diff) ? diff : b.index - a.index;
    });
    return list.map((x) => x.entry);
  }, [entries]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    sorted.forEach((e) => {
      const key = getActivityMeta(e.type).category;
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [sorted]);

  const filtered = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((e) => {
      const meta = getActivityMeta(e.type);
      if (category !== "all" && meta.category !== category) return false;
      if (!term) return true;
      return (
        (e.description || "").toLowerCase().indexOf(term) >= 0 ||
        (e.actorName || "").toLowerCase().indexOf(term) >= 0 ||
        meta.label.toLowerCase().indexOf(term) >= 0
      );
    });
  }, [sorted, search, category]);

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, category]);

  const groups = React.useMemo(
    () => groupActivityByDay(filtered.slice(0, visibleCount)),
    [filtered, visibleCount],
  );

  const contributors = React.useMemo(() => {
    const ids: Record<string, boolean> = {};
    sorted.forEach((e) => {
      const id = (e.actor || e.actorName || "").toLowerCase();
      if (id) ids[id] = true;
    });
    return Object.keys(ids).length;
  }, [sorted]);

  const clearFilters = (): void => {
    setSearch("");
    setCategory("all");
  };

  const rootClass = `${styles.container} ${className || ""}`;

  if (sorted.length === 0) {
    return (
      <div className={rootClass}>
        <EmptyState
          variant="glass"
          icon={<History size={48} className={styles.emptyIcon} />}
          title="No activity yet"
          description="Changes to phase, status, approvals, documents and exports will appear here."
        />
      </div>
    );
  }

  const latest = sorted[0];
  const remaining = filtered.length - visibleCount;
  const isFiltered = category !== "all" || search.trim() !== "";

  return (
    <div className={rootClass}>
      <div className={styles.kpiGrid}>
        <KPICard
          variant="glass"
          label="Total events"
          value={sorted.length}
          icon={<Activity size={18} />}
          accentColor={theme.accent}
        />
        <KPICard
          variant="glass"
          label="Last activity"
          value={formatRelativeTime(latest.timestamp)}
          subtitle={`${getActivityMeta(latest.type).label} · ${latest.actorName || "Unknown"}`}
          icon={<Clock size={18} />}
          accentColor={theme.accentSecondary}
        />
        <KPICard
          variant="glass"
          label="Contributors"
          value={contributors}
          icon={<Users size={18} />}
          accentColor={theme.accentTertiary}
        />
      </div>

      <GlassCard
        title="Activity Log"
        titleIcon={<History size={18} />}
        subtitle={
          isFiltered
            ? `${filtered.length} of ${sorted.length} events`
            : `${sorted.length} events · newest first`
        }
        actions={
          <div className={styles.searchBox}>
            <Search
              size={14}
              className={styles.searchIcon}
              aria-hidden="true"
            />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search activity or person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search activity"
            />
            {search && (
              <button
                type="button"
                className={styles.searchClear}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        }
      >
        <div
          className={styles.chips}
          role="tablist"
          aria-label="Filter by category"
        >
          <button
            type="button"
            role="tab"
            aria-selected={category === "all"}
            className={`${styles.chip} ${category === "all" ? styles.chipActive : ""}`}
            onClick={() => setCategory("all")}
          >
            All
            <span className={styles.chipCount}>{sorted.length}</span>
          </button>
          {ACTIVITY_CATEGORIES.filter((c) => categoryCounts[c.key]).map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={category === c.key}
              className={`${styles.chip} ${category === c.key ? styles.chipActive : ""}`}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
              <span className={styles.chipCount}>{categoryCounts[c.key]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search size={40} className={styles.emptyIcon} />}
            title="No matching activity"
            description="Try a different search term or category."
            actionLabel="Clear filters"
            onAction={clearFilters}
          />
        ) : (
          <div className={styles.feed}>
            {groups.map((group) => (
              <section key={group.key} className={styles.dayGroup}>
                <h5 className={styles.dayHeader}>
                  <span>{group.label}</span>
                  <span className={styles.dayCount}>
                    {group.entries.length}
                  </span>
                </h5>
                <ol className={styles.list}>
                  {group.entries.map((entry) => {
                    const meta = getActivityMeta(entry.type);
                    const Icon = ACTIVITY_ICONS[entry.type] || Activity;
                    const colorStyle = {
                      "--activity-color": meta.colorVar,
                    } as React.CSSProperties;
                    return (
                      <li
                        key={entry.id}
                        className={styles.item}
                        style={colorStyle}
                      >
                        <span className={styles.time}>
                          {formatDate(entry.timestamp, "HH:mm")}
                        </span>
                        <span className={styles.rail}>
                          <span className={styles.iconBubble}>
                            <Icon size={15} aria-hidden="true" />
                          </span>
                        </span>
                        <div className={styles.content}>
                          <span className={styles.itemTitle}>{meta.label}</span>
                          {renderDetail(entry)}
                          <div className={styles.meta}>
                            <span className={styles.avatar} aria-hidden="true">
                              {getInitials(entry.actorName)}
                            </span>
                            <span className={styles.actor}>
                              {entry.actorName || "Unknown"}
                            </span>
                            <span className={styles.dot} aria-hidden="true" />
                            <time
                              className={styles.relative}
                              dateTime={entry.timestamp}
                              title={formatDateTime(entry.timestamp)}
                            >
                              {formatRelativeTime(entry.timestamp)}
                            </time>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </section>
            ))}

            {remaining > 0 && (
              <button
                type="button"
                className={styles.showMore}
                onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              >
                Show more ({remaining} remaining)
              </button>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

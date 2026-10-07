import * as React from "react";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "../common/GlassCard";
import { EmptyState } from "../common/EmptyState";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import {
  IApprovalPerson,
  IPendingApprovalRow,
} from "../../utils/approvalHelpers";
import {
  FocusButton,
  LiveFocusOverlay,
  useFocusMode,
} from "./LiveFocusOverlay";
import styles from "./ApprovalsPending.module.scss";

interface ApprovalsPendingProps {
  rows: IPendingApprovalRow[];
  onView?: (bidNumber: string) => void;
  className?: string;
}

const MAX_PEOPLE = 3;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function sectorStyle(p: IApprovalPerson): React.CSSProperties | undefined {
  return p.color
    ? ({ "--sector-color": p.color } as React.CSSProperties)
    : undefined;
}

export const ApprovalsPending: React.FC<ApprovalsPendingProps> = ({
  rows,
  onView,
  className,
}) => {
  const focus = useFocusMode();

  const outstanding = rows.reduce((s, r) => s + (r.total - r.approved), 0);
  const oldest = rows.length > 0 ? rows[0].days : null;

  const getDaysClass = (days: number | null): string => {
    if (days === null) return styles.normal;
    if (days > 3) return styles.urgent;
    if (days > 1) return styles.warning;
    return styles.normal;
  };

  const subtitle =
    rows.length === 0
      ? "Nothing awaiting approval"
      : `${rows.length} BID${rows.length === 1 ? "" : "s"} · ${outstanding} approval${outstanding === 1 ? "" : "s"} outstanding${oldest !== null ? ` · oldest ${oldest}d` : ""}`;

  const renderItem = (
    r: IPendingApprovalRow,
    expanded: boolean,
    index: number,
  ): React.ReactNode => {
    const project = r.bid.opportunityInfo?.projectName;
    const client = r.bid.opportunityInfo?.client;
    const remaining = r.total - r.approved;
    const waiting = expanded ? r.waiting : r.waiting.slice(0, MAX_PEOPLE);
    const extra = expanded ? [] : r.waiting.slice(MAX_PEOPLE);
    const responded = r.people.filter((p) => p.status !== "pending");
    return (
      <div
        key={r.bid.bidNumber}
        className={`${styles.approvalItem} ${expanded ? styles.expandedItem : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => onView?.(r.bid.bidNumber)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onView?.(r.bid.bidNumber);
          }
        }}
        title={`Open ${r.bid.bidNumber}`}
        data-focus-item={expanded ? "" : undefined}
        style={
          expanded
            ? ({ "--i": Math.min(index, 12) } as React.CSSProperties)
            : undefined
        }
      >
        <div className={styles.topRow}>
          <span className={styles.project}>
            {project || client || r.bid.bidNumber}
          </span>
          <span className={`${styles.approvalDays} ${getDaysClass(r.days)}`}>
            {r.days === null
              ? "Waiting"
              : r.days === 0
                ? "Today"
                : `${r.days}d waiting`}
          </span>
        </div>
        <div className={styles.meta}>
          <span className={styles.bidNumber}>
            {r.bid.bidNumber}
            <ConfidentialLock bid={r.bid} />
          </span>
          {project && client ? ` · ${client}` : ""}
          {` · Round ${r.round}`}
          {expanded && r.startedDate
            ? ` · Started ${format(r.startedDate, "MMM d")}`
            : ""}
        </div>

        <div className={styles.progressRow}>
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
            {remaining > 0 ? ` · ${remaining} left` : ""}
          </span>
        </div>

        {waiting.length > 0 && (
          <div className={styles.waitingRow}>
            <span className={styles.waitingLabel}>Waiting on</span>
            {waiting.map((p) => (
              <span
                key={p.email || p.name}
                className={styles.person}
                title={`${p.name} - ${p.sectors.join(", ")}`}
                style={sectorStyle(p)}
              >
                <span className={styles.avatar}>{initials(p.name)}</span>
                <span className={styles.personName}>
                  {expanded ? p.name : p.name.split(" ")[0]}
                </span>
                <span className={styles.personSector}>
                  {p.sectors.join(", ")}
                </span>
              </span>
            ))}
            {extra.length > 0 && (
              <span
                className={styles.more}
                title={extra
                  .map((p) => `${p.name} - ${p.sectors.join(", ")}`)
                  .join("\n")}
              >
                +{extra.length}
              </span>
            )}
          </div>
        )}

        {expanded && responded.length > 0 && (
          <div className={styles.waitingRow}>
            <span className={styles.waitingLabel}>Responded</span>
            {responded.map((p) => (
              <span
                key={p.email || p.name}
                className={`${styles.responded} ${
                  p.status === "approved"
                    ? styles.respondedOk
                    : styles.respondedNo
                }`}
                title={`${p.name} - ${p.sectors.join(", ")} (${p.status})`}
              >
                {p.status === "approved" ? (
                  <Check size={12} />
                ) : (
                  <X size={12} />
                )}
                {p.name.split(" ")[0]}
                <span className={styles.personSector}>
                  {p.sectors.join(", ")}
                </span>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={focus.ref} className={className}>
      <GlassCard
        title="Pending Approvals"
        subtitle={subtitle}
        actions={
          rows.length > 0 ? (
            <FocusButton onClick={focus.open} label="Pending Approvals" />
          ) : undefined
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            variant="glass"
            title="All caught up"
            description="No BID is waiting for approval."
          />
        ) : (
          <div className={styles.approvalList}>
            {rows.map((r, i) => renderItem(r, false, i))}
          </div>
        )}
      </GlassCard>

      <LiveFocusOverlay
        origin={focus.origin}
        onClose={focus.close}
        title="Pending Approvals"
        subtitle={subtitle}
      >
        <div className={styles.focusGrid}>
          {rows.map((r, i) => renderItem(r, true, i))}
        </div>
      </LiveFocusOverlay>
    </div>
  );
};

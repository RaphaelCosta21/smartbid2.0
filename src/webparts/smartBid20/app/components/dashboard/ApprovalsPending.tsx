import * as React from "react";
import { IBid } from "../../models";
import { GlassCard } from "../common/GlassCard";
import { EmptyState } from "../common/EmptyState";
import { getApprovalSector } from "../../utils/approvalHelpers";
import { getDaysUntil, parseDate } from "../../utils/formatters";
import { getSectorColor, getSectorLabel } from "../../config/sectors.config";
import styles from "./ApprovalsPending.module.scss";

interface ApprovalsPendingProps {
  bids: IBid[];
  onView?: (bidNumber: string) => void;
  className?: string;
}

interface WaitingPerson {
  name: string;
  email: string;
  sectors: string[];
  color: string;
}

interface PendingRow {
  bid: IBid;
  round: number;
  days: number | null;
  total: number;
  approved: number;
  statuses: string[];
  waiting: WaitingPerson[];
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

function buildRow(bid: IBid): PendingRow {
  const approvals = bid.approvals || [];
  const rounds = bid.approvalRounds || [];
  const last = rounds.length > 0 ? rounds[rounds.length - 1] : undefined;
  let started = parseDate(last?.startedDate);
  if (!started) {
    approvals.forEach((a) => {
      const d = parseDate(a.requestedDate);
      if (d && (!started || d.getTime() < started.getTime())) started = d;
    });
  }
  const days = started ? Math.max(0, -(getDaysUntil(started) || 0)) : null;

  // Same person can answer for several sectors; list them once
  const byEmail: Record<string, WaitingPerson> = {};
  const waiting: WaitingPerson[] = [];
  approvals
    .filter((a) => a.status === "pending")
    .forEach((a) => {
      const sector = getApprovalSector(a);
      const label = sector ? getSectorLabel(sector) : a.stakeholderRole;
      const key = (a.stakeholder?.email || a.stakeholder?.name || a.id)
        .toLowerCase();
      if (byEmail[key]) {
        if (byEmail[key].sectors.indexOf(label) < 0) {
          byEmail[key].sectors.push(label);
        }
        return;
      }
      byEmail[key] = {
        name: a.stakeholder?.name || a.stakeholder?.email || "Unknown",
        email: a.stakeholder?.email || "",
        sectors: [label],
        color: sector ? getSectorColor(sector) : "",
      };
      waiting.push(byEmail[key]);
    });

  const order: Record<string, number> = { approved: 0, rejected: 1 };
  return {
    bid,
    round: rounds.length || approvals[0]?.round || 1,
    days,
    total: approvals.length,
    approved: approvals.filter((a) => a.status === "approved").length,
    statuses: approvals
      .map((a) => a.status as string)
      .sort((a, b) => (order[a] ?? 2) - (order[b] ?? 2)),
    waiting,
  };
}

export const ApprovalsPending: React.FC<ApprovalsPendingProps> = ({
  bids,
  onView,
  className,
}) => {
  const rows = React.useMemo(
    () =>
      bids
        .filter((b) => b.approvalStatus === "pending")
        .map(buildRow)
        .sort((a, b) => (b.days ?? -1) - (a.days ?? -1)),
    [bids],
  );

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

  return (
    <GlassCard title="Pending Approvals" subtitle={subtitle} className={className}>
      {rows.length === 0 ? (
        <EmptyState
          variant="glass"
          title="All caught up"
          description="No BID is waiting for approval."
        />
      ) : (
        <div className={styles.approvalList}>
          {rows.map((r) => {
            const project = r.bid.opportunityInfo?.projectName;
            const client = r.bid.opportunityInfo?.client;
            const remaining = r.total - r.approved;
            const extra = r.waiting.slice(MAX_PEOPLE);
            return (
              <div
                key={r.bid.bidNumber}
                className={styles.approvalItem}
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
              >
                <div className={styles.topRow}>
                  <span className={styles.project}>
                    {project || client || r.bid.bidNumber}
                  </span>
                  <span
                    className={`${styles.approvalDays} ${getDaysClass(r.days)}`}
                  >
                    {r.days === null
                      ? "Waiting"
                      : r.days === 0
                        ? "Today"
                        : `${r.days}d waiting`}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.bidNumber}>{r.bid.bidNumber}</span>
                  {project && client ? ` · ${client}` : ""}
                  {` · Round ${r.round}`}
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

                {r.waiting.length > 0 && (
                  <div className={styles.waitingRow}>
                    <span className={styles.waitingLabel}>Waiting on</span>
                    {r.waiting.slice(0, MAX_PEOPLE).map((p) => (
                      <span
                        key={p.email || p.name}
                        className={styles.person}
                        title={`${p.name} - ${p.sectors.join(", ")}`}
                        style={
                          p.color
                            ? ({ "--sector-color": p.color } as React.CSSProperties)
                            : undefined
                        }
                      >
                        <span className={styles.avatar}>{initials(p.name)}</span>
                        <span className={styles.personName}>
                          {p.name.split(" ")[0]}
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
              </div>
            );
          })}
        </div>
      )}
    </GlassCard>
  );
};

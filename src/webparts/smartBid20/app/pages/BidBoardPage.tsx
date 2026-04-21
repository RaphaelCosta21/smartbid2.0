import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useBids } from "../hooks/useBids";
import { isActiveBid } from "../utils/bidHelpers";
import { getDivisionColor } from "../utils/statusHelpers";
import { useConfigStore } from "../stores/useConfigStore";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { IBid } from "../models";
import { getPhaseLabel } from "../config/phases.config";
import { getSubStatusDef } from "../config/status.config";
import { differenceInDays, format } from "date-fns";
import styles from "./BidBoardPage.module.scss";

export const BidBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const config = useConfigStore((s) => s.config);

  const activeBids = React.useMemo(() => bids.filter(isActiveBid), [bids]);

  const divisionGroups = React.useMemo(() => {
    const divs = (config?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    if (divs.length > 0) {
      return divs.map((div) => ({
        division: div.value,
        bids: activeBids.filter((b) => b.division === div.value),
        color: div.color || "#94a3b8",
      }));
    }
    return ["OPG", "SSR"].map((div) => ({
      division: div,
      bids: activeBids.filter((b) => b.division === div),
      color: getDivisionColor(div),
    }));
  }, [config, activeBids]);

  const handleBidClick = (bid: IBid): void => {
    navigate(`/bid/${bid.bidNumber}`);
  };

  const now = new Date();

  return (
    <div className={styles.page}>
      <PageHeader
        title="BID Board"
        subtitle={`${activeBids.length} active BIDs across ${new Set(activeBids.map((b) => b.division)).size} divisions`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
          </svg>
        }
      />

      {divisionGroups.map((group) => (
        <div key={group.division} className={styles.divisionLane}>
          <div className={styles.laneHeader}>
            <span
              className={styles.laneDot}
              style={{ background: group.color }}
            />
            <span className={styles.laneTitle}>{group.division}</span>
            <span className={styles.laneCount}>
              {group.bids.length} BID{group.bids.length !== 1 ? "s" : ""}
            </span>
          </div>

          {group.bids.length === 0 ? (
            <div className={styles.emptyLane}>
              No active BIDs in this division
            </div>
          ) : (
            <div className={styles.cardsGrid}>
              {group.bids.map((bid) => {
                const daysLeft = differenceInDays(new Date(bid.dueDate), now);
                const dueClass =
                  daysLeft < 0
                    ? styles.overdue
                    : daysLeft <= 3
                      ? styles.warning
                      : styles.ok;

                const phaseLabel = getPhaseLabel(bid.currentPhase);
                const subStatusDef = getSubStatusDef(bid.currentStatus);

                // Pick a notes string from bidNotes (first non-empty)
                const notesText = bid.bidNotes
                  ? Object.values(bid.bidNotes).find(
                      (n) => typeof n === "string" && n.trim().length > 0,
                    )
                  : undefined;

                return (
                  <div
                    key={bid.bidNumber}
                    className={styles.bidGlassCard}
                    style={
                      {
                        "--lane-color": group.color,
                        borderLeft: `4px solid ${group.color}`,
                      } as React.CSSProperties
                    }
                    onClick={() => handleBidClick(bid)}
                  >
                    {/* Top: BID # + Priority */}
                    <div className={styles.cardTop}>
                      <span className={styles.bidNumber}>{bid.bidNumber}</span>
                      <StatusBadge status={bid.priority} />
                    </div>

                    {/* Client + Project */}
                    <div className={styles.cardClient}>
                      {bid.opportunityInfo.client}
                    </div>
                    <div className={styles.cardProject}>
                      {bid.opportunityInfo.projectName}
                    </div>

                    {/* Phase + Sub-status */}
                    <div className={styles.phaseRow}>
                      <span
                        className={styles.phaseBadge}
                        style={{
                          background: `${getDivisionColor(bid.division)}18`,
                          color: getDivisionColor(bid.division),
                        }}
                      >
                        {phaseLabel}
                      </span>
                      {subStatusDef && (
                        <>
                          <span className={styles.separator}>·</span>
                          <span
                            className={styles.subStatusBadge}
                            style={{
                              background: `${subStatusDef.color}18`,
                              color: subStatusDef.color,
                            }}
                          >
                            {subStatusDef.icon && (
                              <span style={{ fontSize: 10 }}>
                                {subStatusDef.icon}
                              </span>
                            )}
                            {subStatusDef.label}
                          </span>
                        </>
                      )}
                      {!subStatusDef && bid.currentStatus && (
                        <>
                          <span className={styles.separator}>·</span>
                          <StatusBadge status={bid.currentStatus} />
                        </>
                      )}
                    </div>

                    {/* Meta: creator, engineer, CRM */}
                    <div className={styles.cardMeta}>
                      <span>
                        <span className={styles.metaLabel}>Creator</span>{" "}
                        {bid.creator?.name || "—"}
                      </span>
                      <span>
                        <span className={styles.metaLabel}>Engineer</span>{" "}
                        {bid.engineerResponsible?.[0]?.name || "Unassigned"}
                      </span>
                      <span>
                        <span className={styles.metaLabel}>CRM</span>{" "}
                        {bid.crmNumber}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{
                          width: `${bid.kpis.phaseCompletionPercentage}%`,
                        }}
                      />
                    </div>

                    {/* Notes */}
                    {notesText && (
                      <div className={styles.cardNotes}>{notesText}</div>
                    )}

                    {/* Footer: due date + owner first name */}
                    <div className={styles.cardFooter}>
                      <span className={`${styles.dueDate} ${dueClass}`}>
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)}d overdue`
                          : daysLeft === 0
                            ? "Due today"
                            : `${daysLeft}d left`}
                        {" — "}
                        {format(new Date(bid.dueDate), "MMM d")}
                      </span>
                      <span className={styles.ownerName}>
                        {(bid.creator?.name || "").split(" ")[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

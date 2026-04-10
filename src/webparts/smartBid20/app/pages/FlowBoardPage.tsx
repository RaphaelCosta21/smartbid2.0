import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { StatusBadge } from "../components/common/StatusBadge";
import { useBids } from "../hooks/useBids";
import { isActiveBid } from "../utils/bidHelpers";
import { DIVISION_COLORS } from "../utils/constants";
import { BID_STATUSES } from "../config/status.config";
import { differenceInDays } from "date-fns";
import styles from "./FlowBoardPage.module.scss";

const FLOW_COLUMNS = BID_STATUSES.filter((s) => !s.isTerminal).slice(0, 8);

export const FlowBoardPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const activeBids = React.useMemo(() => bids.filter(isActiveBid), [bids]);
  const now = new Date();

  return (
    <div className={styles.page}>
      <PageHeader
        title="FlowBoard"
        subtitle={`${activeBids.length} active BIDs across ${FLOW_COLUMNS.length} stages`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
        }
      />

      <div className={styles.board}>
        {FLOW_COLUMNS.map((col) => {
          const colBids = activeBids.filter(
            (b) => b.currentStatus === col.value,
          );
          return (
            <div key={col.id} className={styles.column}>
              {/* Column Header */}
              <div
                className={styles.columnHeader}
                style={{ borderBottom: `2px solid ${col.color}` }}
              >
                <span
                  className={styles.columnDot}
                  style={{ background: col.color }}
                />
                <span className={styles.columnTitle}>{col.label}</span>
                <span
                  className={styles.columnCount}
                  style={{ background: `${col.color}20`, color: col.color }}
                >
                  {colBids.length}
                </span>
              </div>

              {/* Cards */}
              {colBids.map((bid) => {
                const daysLeft = differenceInDays(new Date(bid.dueDate), now);
                return (
                  <div
                    key={bid.bidNumber}
                    onClick={() => navigate(`/bid/${bid.bidNumber}`)}
                    className={styles.card}
                    style={{
                      borderLeft: `3px solid ${DIVISION_COLORS[bid.division] || "#94a3b8"}`,
                    }}
                  >
                    <div className={styles.cardHeader}>
                      <span className={styles.cardBidNumber}>
                        {bid.bidNumber}
                      </span>
                      <StatusBadge status={bid.priority} />
                    </div>
                    <div className={styles.cardClient}>
                      {bid.opportunityInfo.client}
                    </div>
                    <div className={styles.cardProject}>
                      {bid.opportunityInfo.projectName}
                    </div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardOwner}>
                        {bid.owner.name.split(" ")[0]}
                      </span>
                      <span
                        className={`${styles.cardDaysLeft} ${daysLeft < 0 ? styles.cardOverdue : daysLeft <= 3 ? styles.cardWarning : styles.cardOk}`}
                      >
                        {daysLeft < 0
                          ? `${Math.abs(daysLeft)}d late`
                          : `${daysLeft}d`}
                      </span>
                    </div>
                  </div>
                );
              })}

              {colBids.length === 0 && (
                <div className={styles.columnEmpty}>No BIDs</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

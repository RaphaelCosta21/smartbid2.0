import * as React from "react";
import { IBid } from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { differenceInDays } from "date-fns";
import styles from "./BidCard.module.scss";

interface BidCardProps {
  bid: IBid;
  onClick: (bid: IBid) => void;
}

export const BidCard: React.FC<BidCardProps> = ({ bid, onClick }) => {
  const now = new Date();
  const daysLeft = differenceInDays(new Date(bid.dueDate), now);
  const dueClass =
    daysLeft < 0 ? styles.overdue : daysLeft <= 3 ? styles.warning : styles.ok;

  return (
    <div className={styles.bidCard} onClick={() => onClick(bid)}>
      <div className={styles.cardHeader}>
        <span className={styles.bidNumber}>{bid.bidNumber}</span>
        <StatusBadge status={bid.priority} />
      </div>

      <div className={styles.clientName}>{bid.opportunityInfo.client}</div>
      <div className={styles.projectName}>
        {bid.opportunityInfo.projectName}
      </div>

      <div className={styles.cardMeta}>
        <span>CRM: {bid.crmNumber}</span>
        <span>Owner: {bid.owner.name}</span>
        <span>Bidder: {bid.bidder.name}</span>
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${bid.kpis.phaseCompletionPercentage}%` }}
        />
      </div>

      <div className={styles.cardFooter}>
        <StatusBadge status={bid.currentStatus} />
        <span className={`${styles.dueDate} ${dueClass}`}>
          {daysLeft < 0
            ? `${Math.abs(daysLeft)}d overdue`
            : daysLeft === 0
              ? "Due today"
              : `${daysLeft}d left`}
        </span>
      </div>
    </div>
  );
};

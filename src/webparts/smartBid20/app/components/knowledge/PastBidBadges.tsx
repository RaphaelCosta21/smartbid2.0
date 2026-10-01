import * as React from "react";
import {
  PAST_BID_KB_STATUS_LABELS,
  PAST_BID_NO_OUTCOME,
  PastBidKbStatus,
} from "../../utils/pastBidHelpers";
import styles from "./PastBidBadges.module.scss";

interface PastBidChipsProps {
  values: string[];
  /** Scope categories use the accent style */
  accent?: boolean;
  /** Show at most this many chips, then a "+N" chip */
  max?: number;
  emptyLabel?: string;
  className?: string;
}

export const PastBidChips: React.FC<PastBidChipsProps> = ({
  values,
  accent,
  max,
  emptyLabel = "—",
  className,
}) => {
  if (!values.length) return <span className={styles.empty}>{emptyLabel}</span>;
  const shown = max ? values.slice(0, max) : values;
  const hidden = values.slice(shown.length);
  return (
    <div className={`${styles.chips} ${className || ""}`}>
      {shown.map((v) => (
        <span
          key={v}
          className={`${styles.chip} ${accent ? styles.chipAccent : ""}`}
        >
          {v}
        </span>
      ))}
      {hidden.length > 0 && (
        <span
          className={`${styles.chip} ${styles.chipMore}`}
          title={hidden.join(", ")}
        >
          +{hidden.length}
        </span>
      )}
    </div>
  );
};

const OUTCOME_CLASS: Record<string, string> = {
  Won: styles.won,
  Loss: styles.loss,
  Pending: styles.pending,
  [PAST_BID_NO_OUTCOME]: styles.none,
};

interface PastBidOutcomeProps {
  outcome: string;
  /** Tinted pill instead of plain colored text */
  pill?: boolean;
}

export const PastBidOutcome: React.FC<PastBidOutcomeProps> = ({
  outcome,
  pill,
}) => (
  <span
    className={`${styles.outcome} ${OUTCOME_CLASS[outcome] || ""} ${pill ? styles.outcomePill : ""}`}
  >
    {outcome}
  </span>
);

const KB_CLASS: Record<PastBidKbStatus, string> = {
  published: styles.kbPublished,
  failed: styles.kbFailed,
  "not-published": styles.kbNone,
};

export const PastBidKbBadge: React.FC<{ status: PastBidKbStatus }> = ({
  status,
}) => (
  <span className={`${styles.kbBadge} ${KB_CLASS[status]}`}>
    {PAST_BID_KB_STATUS_LABELS[status]}
  </span>
);

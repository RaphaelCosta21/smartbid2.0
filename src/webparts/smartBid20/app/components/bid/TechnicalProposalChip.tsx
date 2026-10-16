import * as React from "react";
import {
  TechnicalProposalState,
  TECHNICAL_PROPOSAL_STATE_LABELS,
} from "../../utils/technicalProposalHelpers";
import styles from "../../pages/BidDetailPage.module.scss";

const STATE_CLASS: Record<TechnicalProposalState, string> = {
  "not-requested": styles.tpNotRequested,
  pending: styles.tpPending,
  attached: styles.tpAttached,
  published: styles.tpPublished,
  failed: styles.tpFailed,
};

export interface TechnicalProposalChipProps {
  state: TechnicalProposalState;
  /** Prepends "Requested ·" to the pending state. */
  showRequested?: boolean;
  className?: string;
}

export const TechnicalProposalChip: React.FC<TechnicalProposalChipProps> = ({
  state,
  showRequested,
  className,
}) => (
  <span
    className={`${styles.tpChip} ${STATE_CLASS[state]} ${className || ""}`}
    title={`Technical Proposal: ${TECHNICAL_PROPOSAL_STATE_LABELS[state]}`}
  >
    {showRequested && state === "pending" ? "Requested · " : ""}
    {TECHNICAL_PROPOSAL_STATE_LABELS[state]}
  </span>
);

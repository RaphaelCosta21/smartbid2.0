import * as React from "react";
import styles from "./ApprovalDecisionPanel.module.scss";

interface ApprovalDecisionPanelProps {
  bidNumber: string;
  chainName: string;
  onApprove: (comments: string) => void;
  onReject: (comments: string) => void;
  onRequestRevision: (comments: string) => void;
  className?: string;
}

export const ApprovalDecisionPanel: React.FC<ApprovalDecisionPanelProps> = ({
  bidNumber,
  chainName,
  onApprove,
  onReject,
  onRequestRevision,
  className,
}) => {
  const [comments, setComments] = React.useState("");

  return (
    <div className={`${styles.panel} ${className || ""}`}>
      <h4 className={styles.title}>Decision Required</h4>
      <p className={styles.subtitle}>
        {bidNumber} — {chainName}
      </p>
      <textarea
        value={comments}
        onChange={(e) => setComments(e.target.value)}
        placeholder="Add comments (optional)"
        className={styles.textarea}
      />
      <div className={styles.actions}>
        <button
          onClick={() => onApprove(comments)}
          className={`${styles.btn} ${styles.btnApprove}`}
        >
          Approve
        </button>
        <button
          onClick={() => onRequestRevision(comments)}
          className={`${styles.btn} ${styles.btnRevision}`}
        >
          Request Revision
        </button>
        <button
          onClick={() => onReject(comments)}
          className={`${styles.btn} ${styles.btnReject}`}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

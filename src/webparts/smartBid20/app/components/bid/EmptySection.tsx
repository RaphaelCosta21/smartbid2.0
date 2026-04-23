import * as React from "react";
import styles from "../../pages/BidDetailPage.module.scss";

export const EmptySection: React.FC<{ message: string }> = ({ message }) => (
  <div className={styles.emptyTabContent}>
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={styles.emptyTabIcon}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 12h.01" />
    </svg>
    <p>{message}</p>
  </div>
);

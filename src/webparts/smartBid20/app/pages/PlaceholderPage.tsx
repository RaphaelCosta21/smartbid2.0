import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import styles from "./PlaceholderPage.module.scss";

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  return (
    <div className={styles.page}>
      <PageHeader
        title={title}
        subtitle="This page is under construction"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        }
      />
      <div className={styles.placeholderCard}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="1.5"
          className={styles.placeholderIcon}
        >
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
        <h3 className={styles.placeholderTitle}>Coming Soon</h3>
        <p className={styles.placeholderText}>
          The <strong>{title}</strong> page will be available in the next
          release.
        </p>
      </div>
    </div>
  );
};

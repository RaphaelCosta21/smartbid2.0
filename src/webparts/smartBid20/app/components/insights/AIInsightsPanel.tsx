import * as React from "react";
import styles from "./AIInsightsPanel.module.scss";

interface AIInsightsPanelProps {
  /** Panel heading. */
  title?: string;
  /** What the AI will do once available. */
  description: string;
  /** Optional bullet capabilities shown as chips. */
  features?: string[];
  className?: string;
}

/**
 * AIInsightsPanel — reserved "AI Insights — Coming Soon" surface.
 * Renders a polished, disabled placeholder until AI resources are wired.
 */
export const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  title = "AI Insights",
  description,
  features,
  className,
}) => {
  return (
    <div className={`${styles.panel} ${className || ""}`} aria-disabled="true">
      <div className={styles.sheen} />
      <div className={styles.header}>
        <div className={styles.iconWrap}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z" />
          </svg>
        </div>
        <div className={styles.titleBlock}>
          <div className={styles.titleRow}>
            <h4 className={styles.title}>{title}</h4>
            <span className={styles.badge}>Em breve</span>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
      </div>

      {features && features.length > 0 && (
        <div className={styles.features}>
          {features.map((f, i) => (
            <span className={styles.chip} key={i}>
              {f}
            </span>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.pulse} />
        Aguardando disponibilização dos recursos de IA pelo TI
      </div>
    </div>
  );
};

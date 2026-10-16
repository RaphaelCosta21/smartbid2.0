import * as React from "react";
import { X, Scale, PackagePlus } from "lucide-react";
import styles from "./SurveyGapPanel.module.scss";

interface SurveyGapPanelProps {
  bidNumber: string;
  /** Count of priced spread lines already covered by the BID. */
  covered: number;
  /** Priced spread equipment the BID does not cover. */
  missing: string[];
  /** Equipment the BID considers that is outside this spread. */
  extras: string[];
  onClose: () => void;
  onAddMissing: () => void;
}

export const SurveyGapPanel: React.FC<SurveyGapPanelProps> = ({
  bidNumber,
  covered,
  missing,
  extras,
  onClose,
  onAddMissing,
}) => {
  return (
    <div className={styles.panel}>
      <div className={styles.topbar}>
        <span className={styles.topTitle}>
          <Scale size={12} /> BID GAP · {bidNumber}
        </span>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.metrics}>
          <div className={styles.metric}>
            <span className={`${styles.metricValue} ${styles.green}`}>{covered}</span>
            <span className={styles.metricLabel}>Covered</span>
          </div>
          <div className={styles.metric}>
            <span className={`${styles.metricValue} ${styles.red}`}>{missing.length}</span>
            <span className={styles.metricLabel}>Missing</span>
          </div>
          <div className={styles.metric}>
            <span className={`${styles.metricValue} ${styles.amber}`}>{extras.length}</span>
            <span className={styles.metricLabel}>BID extras</span>
          </div>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.sGreen}`} /> In the BID
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.sRed}`} /> Spread, not in BID
          </span>
          <span className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.sAmber}`} /> BID only
          </span>
        </div>
        {missing.length > 0 && (
          <div className={styles.block}>
            <span className={styles.blockLabel}>Missing from the BID</span>
            <ul className={styles.list}>
              {missing.map((m) => (
                <li key={m} className={styles.listItem}>
                  <span className={`${styles.dot} ${styles.sRed}`} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {extras.length > 0 && (
          <div className={styles.block}>
            <span className={styles.blockLabel}>In the BID, outside this spread</span>
            <ul className={styles.list}>
              {extras.map((m) => (
                <li key={m} className={styles.listItem}>
                  <span className={`${styles.dot} ${styles.sAmber}`} />
                  {m}
                </li>
              ))}
            </ul>
          </div>
        )}
        {missing.length === 0 ? (
          <p className={styles.note}>Every priced item in this spread is already covered by {bidNumber}.</p>
        ) : (
          <button className={styles.add} onClick={onAddMissing}>
            <PackagePlus size={13} /> Add missing to the package
          </button>
        )}
      </div>
    </div>
  );
};

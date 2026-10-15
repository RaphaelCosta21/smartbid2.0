import * as React from "react";
import { X, AlertTriangle, Zap, RotateCcw } from "lucide-react";
import { IFailureImpact } from "../../utils/surveyFailure";
import styles from "./SurveyFailurePanel.module.scss";

interface SurveyFailurePanelProps {
  /** null until the user clicks a node to fail. */
  impact: IFailureImpact | null;
  onClose: () => void;
  onReset?: () => void;
}

export const SurveyFailurePanel: React.FC<SurveyFailurePanelProps> = ({
  impact,
  onClose,
  onReset,
}) => {
  const noCascade =
    !!impact && impact.offlineNodeIds.length === 0 && impact.lostDataTypes.length === 0;
  return (
    <div className={styles.panel}>
      <div className={styles.topbar}>
        <span className={styles.topTitle}>
          <AlertTriangle size={12} /> WHAT IF IT FAILS?
        </span>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <div className={styles.content}>
        {!impact ? (
          <p className={styles.prompt}>
            Click any equipment in the room to simulate its failure. Everything that depends on it
            dims, and you see which data and client deliverables stop arriving.
          </p>
        ) : (
          <>
            <div className={styles.failed}>
              <span className={styles.failedLabel}>{impact.failedLabel}</span>
              <span className={styles.failedSub}>Simulated failure</span>
            </div>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={`${styles.metricValue} ${styles.redValue}`}>
                  {impact.offlineNodeIds.length}
                </span>
                <span className={styles.metricLabel}>Lose the hub</span>
              </div>
              <div className={styles.metric}>
                <span className={`${styles.metricValue} ${styles.redValue}`}>
                  {impact.lostDeliverables.length}
                </span>
                <span className={styles.metricLabel}>Deliverables hit</span>
              </div>
            </div>
            {impact.directVictimLabels.length > 0 && (
              <div className={styles.block}>
                <span className={styles.blockLabel}>Loses its link to</span>
                <div className={styles.chips}>
                  {impact.directVictimLabels.map((l) => (
                    <span key={l} className={styles.chip}>
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {impact.lostDataTypes.length > 0 && (
              <div className={styles.block}>
                <span className={styles.blockLabel}>Data that stops arriving</span>
                <div className={styles.chips}>
                  {impact.lostDataTypes.map((t) => (
                    <span key={t} className={`${styles.chip} ${styles.chipLost}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {impact.lostDeliverables.length > 0 && (
              <div className={styles.block}>
                <span className={styles.blockLabel}>Client deliverables at risk</span>
                <ul className={styles.list}>
                  {impact.lostDeliverables.map((d) => (
                    <li key={d} className={styles.listItem}>
                      <span className={styles.dot} />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {noCascade && (
              <p className={styles.note}>
                No single point of failure here — the spread still reaches the online hub through
                another route. That redundancy is a selling point.
              </p>
            )}
            {impact.partial && (
              <span className={styles.partial}>
                <Zap size={11} /> Wiring-only estimate — add data-flow notes to the catalog for the
                full picture.
              </span>
            )}
            {onReset && (
              <button className={styles.reset} onClick={onReset}>
                <RotateCcw size={12} /> Clear failure
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

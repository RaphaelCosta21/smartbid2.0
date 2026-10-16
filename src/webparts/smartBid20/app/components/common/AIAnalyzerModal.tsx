import * as React from "react";
import { Sparkles, X } from "lucide-react";
import {
  AIDocumentAnalyzer,
  AIDocumentAnalyzerProps,
  AnalyzerStage,
} from "./AIDocumentAnalyzer";
import { ConfirmDialog } from "./ConfirmDialog";
import styles from "./AIAnalyzerModal.module.scss";

interface AIAnalyzerModalProps extends Omit<
  AIDocumentAnalyzerProps,
  "compact" | "onStageChange" | "onCancel"
> {
  title: string;
  subtitle?: string;
  /** Identifier shown next to the title (e.g. the BID number). */
  badge?: string;
  onClose: () => void;
}

/** Modal shell around AIDocumentAnalyzer; grows to full size for the review step. */
export const AIAnalyzerModal: React.FC<AIAnalyzerModalProps> = ({
  title,
  subtitle,
  badge,
  onClose,
  ...analyzerProps
}) => {
  const [stage, setStage] = React.useState<AnalyzerStage>("upload");
  const [confirmClose, setConfirmClose] = React.useState(false);

  const requestClose = (): void => {
    if (stage === "analyzing" || stage === "results") {
      setConfirmClose(true);
    } else {
      onClose();
    }
  };

  return (
    <>
      <div className={styles.overlay}>
        <div
          className={`${styles.modal} ${stage === "results" ? styles.modalExpanded : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-analyzer-modal-title"
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.header}>
            <div className={styles.headerMain}>
              <span className={styles.headerIcon}>
                <Sparkles size={20} />
              </span>
              <div className={styles.headerText}>
                <div className={styles.titleRow}>
                  <h3 id="ai-analyzer-modal-title" className={styles.title}>
                    {title}
                  </h3>
                  {badge && <span className={styles.badge}>{badge}</span>}
                </div>
                {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              </div>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={requestClose}
              title="Close"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <AIDocumentAnalyzer
            {...analyzerProps}
            compact
            onStageChange={setStage}
            onCancel={requestClose}
          />
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmClose}
        title={
          stage === "analyzing" ? "Stop the analysis?" : "Discard AI results?"
        }
        message={
          stage === "analyzing"
            ? "The analysis is still running. Closing now cancels it and nothing will be imported."
            : "The AI items have not been imported yet. Closing now discards them and any edits you made."
        }
        confirmLabel={stage === "analyzing" ? "Stop & close" : "Discard"}
        cancelLabel="Keep working"
        variant="warning"
        onConfirm={() => {
          setConfirmClose(false);
          onClose();
        }}
        onCancel={() => setConfirmClose(false)}
      />
    </>
  );
};

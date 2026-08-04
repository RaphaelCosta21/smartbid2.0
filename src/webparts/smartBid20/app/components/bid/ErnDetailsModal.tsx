/**
 * ErnDetailsModal — read-only view of an ERN, fetched live from SharePoint.
 */
import * as React from "react";
import { IErn } from "../../models";
import { ErnService } from "../../services/ErnService";
import { formatDate } from "../../utils/formatters";
import { getErnDeadlineState } from "../../utils/ernHelpers";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import styles from "./ErnDetailsModal.module.scss";

interface ErnDetailsModalProps {
  ernNumber: string;
  isOpen: boolean;
  onDismiss: () => void;
}

const stateColor: Record<string, string> = {
  overdue: "var(--danger)",
  "due-soon": "var(--warning)",
  ok: "var(--success)",
  none: "var(--text-muted)",
};

export const ErnDetailsModal: React.FC<ErnDetailsModalProps> = ({
  ernNumber,
  isOpen,
  onDismiss,
}) => {
  const [ern, setErn] = React.useState<IErn | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen || !ernNumber) return;
    setLoading(true);
    setErn(null);
    ErnService.getByTitle(ernNumber)
      .then((e) => {
        setErn(e);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [isOpen, ernNumber]);

  if (!isOpen) return null;

  const deadline = ern ? getErnDeadlineState(ern.dueDate, ern.status) : "none";

  return (
    <div className={styles.overlay} onMouseDown={onDismiss}>
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{ernNumber}</div>
            <div className={styles.subtitle}>Engineering Request</div>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close"
            onClick={onDismiss}
          >
            ×
          </button>
        </div>

        <div className={styles.body}>
          {loading && <div className={styles.msg}>Loading ERN…</div>}
          {!loading && !ern && (
            <div className={styles.msg}>ERN not found in the list.</div>
          )}
          {!loading && ern && (
            <>
              <div className={styles.rows}>
                <Row label="Status">
                  <span
                    className={styles.statusPill}
                    style={{ background: stateColor[deadline] }}
                  >
                    {ern.status || "—"}
                  </span>
                </Row>
                <Row label="Deliverable Type" value={ern.deliverableType} />
                <Row label="Due Date" value={formatDate(ern.dueDate)} />
                <Row label="Released Date" value={formatDate(ern.finishDate)} />
                <Row label="Project Number" value={ern.projectNumber} />
                <Row label="Project Title" value={ern.projectTitle} />
              </div>
              <div className={styles.descBlock}>
                <div className={styles.descLabel}>Deliverable Description</div>
                <div className={styles.descValue}>{ern.description || "—"}</div>
              </div>
              <a
                className={styles.appLink}
                href={SHAREPOINT_CONFIG.ern.appUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in ERN app ↗
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Row: React.FC<{
  label: string;
  value?: string;
  children?: React.ReactNode;
}> = ({ label, value, children }) => (
  <div className={styles.row}>
    <span className={styles.rowLabel}>{label}</span>
    <span className={styles.rowValue}>{children || value || "—"}</span>
  </div>
);

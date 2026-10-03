/**
 * DueDateChangeModal — lets the Engineering team change a BID due date.
 * A reason is mandatory; the caller persists it (activity log + open revision).
 */
import * as React from "react";
import { format } from "date-fns";
import { IBid } from "../../models";
import { formatDate, parseDate } from "../../utils/formatters";
import { getActiveRevision } from "./RevisionsTab";
import styles from "./DueDateChangeModal.module.scss";

interface DueDateChangeModalProps {
  bid: IBid;
  isOpen: boolean;
  onDismiss: () => void;
  /** newDueDate is an ISO string at local midnight of the picked day */
  onConfirm: (newDueDate: string, reason: string) => void;
}

// Reads the stored value the same way formatDate does, so the input matches the UI
const toInputDate = (value: string): string => {
  const d = parseDate(value);
  return d ? format(d, "yyyy-MM-dd") : "";
};

const inputDateToIso = (value: string): string => {
  const parts = value.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]).toISOString();
};

export const DueDateChangeModal: React.FC<DueDateChangeModalProps> = ({
  bid,
  isOpen,
  onDismiss,
  onConfirm,
}) => {
  const currentDueDate = bid.dueDate || bid.desiredDueDate || "";
  const [newDate, setNewDate] = React.useState("");
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    setNewDate(toInputDate(currentDueDate));
    setReason("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const activeRevision = getActiveRevision(bid);
  const isSameDate = newDate === toInputDate(currentDueDate);
  const canSubmit = !!newDate && !isSameDate && !!reason.trim();

  const handleSubmit = (): void => {
    if (!canSubmit) return;
    onConfirm(inputDateToIso(newDate), reason.trim());
  };

  return (
    <div className={styles.overlay} onMouseDown={onDismiss}>
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="due-date-change-title"
      >
        <div className={styles.header}>
          <div>
            <div className={styles.title} id="due-date-change-title">
              Change Due Date
            </div>
            <div className={styles.subtitle}>
              {bid.bidNumber} · {bid.opportunityInfo?.client || "-"}
            </div>
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
          <div className={styles.field}>
            <span className={styles.label}>Current due date</span>
            <span className={styles.currentValue}>
              {formatDate(currentDueDate)}
            </span>
          </div>

          <label className={styles.field}>
            <span className={styles.label}>
              New due date <span className={styles.required}>*</span>
            </span>
            <input
              type="date"
              className={styles.input}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            {isSameDate && (
              <span className={styles.hint}>
                Pick a date different from the current one.
              </span>
            )}
          </label>

          <label className={styles.field}>
            <span className={styles.label}>
              Reason for the change <span className={styles.required}>*</span>
            </span>
            <textarea
              className={styles.textarea}
              rows={4}
              maxLength={1000}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why the due date is being changed..."
            />
          </label>

          <div className={styles.note}>
            The change is recorded in the Activity Log with your name, the date
            and the reason
            {activeRevision
              ? ` and tracked in Revision ${activeRevision.revisionLetter}`
              : ""}
            .
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnGhost} onClick={onDismiss}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  );
};

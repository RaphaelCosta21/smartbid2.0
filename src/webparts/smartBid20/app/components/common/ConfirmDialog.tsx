import * as React from "react";
import styles from "./ConfirmDialog.module.scss";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const confirmColors: Record<string, string> = {
    danger: "#EF4444",
    warning: "#F59E0B",
    default: "var(--accent-color, #3B82F6)",
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button onClick={onCancel} className={styles.cancelBtn}>
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={styles.confirmBtn}
            style={{ background: confirmColors[variant] }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

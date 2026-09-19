import * as React from "react";
import styles from "./ToastContainer.module.scss";

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  const icons: Record<Toast["type"], string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => {
        return (
          <div key={toast.id} className={styles.toast} data-type={toast.type}>
            <span className={styles.toastIcon}>{icons[toast.type]}</span>
            <div className={styles.toastBody}>
              <div className={styles.toastTitle}>{toast.title}</div>
              {toast.message && (
                <div className={styles.toastMessage}>{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className={styles.dismissBtn}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

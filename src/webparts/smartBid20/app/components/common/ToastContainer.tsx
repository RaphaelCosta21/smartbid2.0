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
  const colors: Record<string, { bg: string; border: string; icon: string }> = {
    success: { bg: "#10B98120", border: "#10B981", icon: "✓" },
    error: { bg: "#EF444420", border: "#EF4444", icon: "✕" },
    warning: { bg: "#F59E0B20", border: "#F59E0B", icon: "⚠" },
    info: { bg: "#3B82F620", border: "#3B82F6", icon: "ℹ" },
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => {
        const c = colors[toast.type] || colors.info;
        return (
          <div
            key={toast.id}
            className={styles.toast}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
            }}
          >
            <span className={styles.toastIcon} style={{ color: c.border }}>
              {c.icon}
            </span>
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

import * as React from "react";
import styles from "./ToastContainer.module.scss";
import { APP_CONFIG } from "../../config/app.config";
import type { Toast } from "../../stores/useUIStore";

const TOAST_DURATION_MS = APP_CONFIG.defaults.toastDuration;
// Must match the .leaving animation duration in ToastContainer.module.scss.
const TOAST_EXIT_MS = 200;

const ICONS: Record<Toast["type"], string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<{
  toast: Toast;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const [paused, setPaused] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);
  const remainingRef = React.useRef(TOAST_DURATION_MS);

  // JS timer drives dismissal (the bar is visual only), so reduced-motion users still get the full time.
  React.useEffect(() => {
    if (paused || leaving) return undefined;
    const startedAt = Date.now();
    const timer = window.setTimeout(
      () => setLeaving(true),
      remainingRef.current,
    );
    return () => {
      window.clearTimeout(timer);
      remainingRef.current -= Date.now() - startedAt;
    };
  }, [paused, leaving]);

  React.useEffect(() => {
    if (!leaving) return undefined;
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving]);

  return (
    <div
      className={`${styles.toast} ${leaving ? styles.leaving : ""}`}
      data-type={toast.type}
      role={toast.type === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className={styles.toastIcon}>{ICONS[toast.type]}</span>
      <div className={styles.toastBody}>
        <div className={styles.toastTitle}>{toast.title}</div>
        {toast.message && (
          <div className={styles.toastMessage}>{toast.message}</div>
        )}
      </div>
      <button
        onClick={() => setLeaving(true)}
        className={styles.dismissBtn}
        aria-label="Dismiss notification"
      >
        ×
      </button>
      <span
        className={styles.progress}
        style={{
          animationDuration: `${TOAST_DURATION_MS}ms`,
          animationPlayState: paused || leaving ? "paused" : "running",
        }}
        aria-hidden="true"
      />
    </div>
  );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

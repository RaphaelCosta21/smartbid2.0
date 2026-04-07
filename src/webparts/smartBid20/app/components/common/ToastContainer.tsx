import * as React from "react";

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
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 10000,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        maxWidth: 360,
      }}
    >
      {toasts.map((toast) => {
        const style = colors[toast.type] || colors.info;
        return (
          <div
            key={toast.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: 16,
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              animation: "slideIn 0.3s ease",
            }}
          >
            <span
              style={{ fontWeight: 700, color: style.border, fontSize: 16 }}
            >
              {style.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{toast.title}</div>
              {toast.message && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    marginTop: 2,
                  }}
                >
                  {toast.message}
                </div>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: 16,
                color: "var(--text-secondary)",
                padding: 0,
              }}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

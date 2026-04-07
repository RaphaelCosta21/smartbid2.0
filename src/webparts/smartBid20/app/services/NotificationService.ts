/**
 * NotificationService — Toasts in-app (padrão SmartFlow).
 * Static singleton pattern.
 */
type ToastType = "success" | "error" | "warning" | "info";

interface ToastOptions {
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

type ToastCallback = (toast: ToastOptions & { id: string }) => void;

export class NotificationService {
  private static _listeners: ToastCallback[] = [];

  public static subscribe(callback: ToastCallback): () => void {
    NotificationService._listeners.push(callback);
    return () => {
      NotificationService._listeners = NotificationService._listeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  private static _emit(toast: ToastOptions): void {
    const toastWithId = { ...toast, id: crypto.randomUUID() };
    NotificationService._listeners.forEach((cb) => cb(toastWithId));
  }

  public static success(title: string, message?: string): void {
    NotificationService._emit({ title, message, type: "success" });
  }

  public static error(title: string, message?: string): void {
    NotificationService._emit({ title, message, type: "error" });
  }

  public static warning(title: string, message?: string): void {
    NotificationService._emit({ title, message, type: "warning" });
  }

  public static info(title: string, message?: string): void {
    NotificationService._emit({ title, message, type: "info" });
  }
}

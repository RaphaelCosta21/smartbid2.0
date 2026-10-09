import { format, formatDistanceToNow, differenceInDays } from "date-fns";

export function formatCurrency(
  value: number,
  currency: string = "USD",
): string {
  if (currency === "BRL") {
    return `R$ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** Like formatCurrency, but any currency other than USD/BRL is shown with its ISO code instead of a wrong "$" */
export function formatAmount(value: number, currency: string = "USD"): string {
  const code = (currency || "USD").toUpperCase();
  if (code === "USD" || code === "BRL") return formatCurrency(value, code);
  return `${code} ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrencyCompact(
  value: number,
  currency: string = "USD",
): string {
  const prefix = currency === "BRL" ? "R$" : "$";
  if (value >= 1_000_000) return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${prefix}${(value / 1_000).toFixed(0)}K`;
  return `${prefix}${value.toFixed(0)}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatDate(
  dateStr: string,
  pattern: string = "MMM d, yyyy",
): string {
  const d = new Date(dateStr);
  if (!dateStr || isNaN(d.getTime())) return "—";
  return format(d, pattern);
}

export function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (!dateStr || isNaN(d.getTime())) return "—";
  return format(d, "MMM d, yyyy HH:mm");
}

export function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (!dateStr || isNaN(d.getTime())) return "—";
  return formatDistanceToNow(d, { addSuffix: true });
}

export function formatDaysLeft(dueDate: string): {
  text: string;
  isOverdue: boolean;
  days: number;
} {
  const days = differenceInDays(new Date(dueDate), new Date());
  if (days < 0)
    return { text: `${Math.abs(days)}d overdue`, isOverdue: true, days };
  if (days === 0) return { text: "Due today", isOverdue: false, days };
  return { text: `${days}d left`, isOverdue: false, days };
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/** "+12.5%" / "-3.0%" — for changes, where the direction matters */
export function formatSignedPercent(
  value: number,
  decimals: number = 1,
): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

/** "+$1,200.00" / "-$80.00" */
export function formatSignedCurrency(
  value: number,
  currency: string = "USD",
): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatCurrency(Math.abs(value), currency)}`;
}

export function formatHours(hours: number): string {
  return `${hours.toLocaleString("en-US")}h`;
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(0)} KB`;
  return `${bytes} B`;
}

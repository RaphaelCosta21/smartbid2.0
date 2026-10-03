import {
  format,
  formatDistanceToNow,
  differenceInCalendarDays,
} from "date-fns";

export function formatCurrency(
  value: number,
  currency: string = "USD",
): string {
  if (currency === "BRL") {
    return `R$ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parses a stored date. Date-only "YYYY-MM-DD" values are read as a local
 * date — `new Date()` reads them as UTC, i.e. the previous day in Brazil.
 */
export function parseDate(
  value: string | Date | null | undefined,
): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  const m = DATE_ONLY.exec(value);
  const d = m
    ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
    : new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

/** Calendar days from `from` (default now) to the due date: 0 = today, negative = overdue, null = no valid date. */
export function getDaysUntil(
  dueDate: string | Date | null | undefined,
  from?: Date | null,
): number | null {
  const due = parseDate(dueDate);
  return due ? differenceInCalendarDays(due, from || new Date()) : null;
}

/** True once `from` (default now) is past the due day — the due day itself is not overdue. */
export function isPastDue(
  dueDate: string | Date | null | undefined,
  from?: Date | null,
): boolean {
  const days = getDaysUntil(dueDate, from);
  return days !== null && days < 0;
}

export function formatDate(
  dateStr: string,
  pattern: string = "MMM d, yyyy",
): string {
  const d = parseDate(dateStr);
  return d ? format(d, pattern) : "-";
}

export function formatDateTime(dateStr: string): string {
  const d = parseDate(dateStr);
  return d ? format(d, "MMM d, yyyy HH:mm") : "-";
}

export function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (!dateStr || isNaN(d.getTime())) return "-";
  return formatDistanceToNow(d, { addSuffix: true });
}

/** `frozenAt` (see bidHelpers.getDueFreezeDate) stops the count at the BID's closing date. */
export function formatDaysLeft(
  dueDate: string | null | undefined,
  frozenAt?: Date | null,
): {
  text: string;
  isOverdue: boolean;
  days: number | null;
} {
  const days = getDaysUntil(dueDate, frozenAt);
  if (days === null) return { text: "No due date", isOverdue: false, days };
  if (days < 0) return { text: `${-days}d overdue`, isOverdue: true, days };
  if (frozenAt) return { text: "On time", isOverdue: false, days: null };
  if (days === 0) return { text: "Due today", isOverdue: false, days };
  if (days === 1) return { text: "Due tomorrow", isOverdue: false, days };
  return { text: `${days}d left`, isOverdue: false, days };
}

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatHours(hours: number): string {
  return `${hours.toLocaleString("en-US")}h`;
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(0)} KB`;
  return `${bytes} B`;
}

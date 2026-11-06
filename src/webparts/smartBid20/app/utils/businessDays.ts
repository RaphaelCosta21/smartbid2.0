import { BidPriority } from "../models/IBidStatus";
import { IPriorityRules } from "../models/ISystemConfig";
import { DEFAULT_PRIORITY_RULES } from "../config/kpi.config";
import { parseDate } from "./formatters";

/**
 * Count business days between two dates (excluding weekends).
 * startDate is excluded, endDate is included.
 */
export function countBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0;
  let currentTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).setHours(0, 0, 0, 0);

  while (currentTime < endTime) {
    currentTime += 86400000; // +1 day in ms
    const day = new Date(currentTime).getDay();
    if (day !== 0 && day !== 6) {
      count++;
    }
  }
  return count;
}

/**
 * Calculate priority from the business days between today and the desired due date,
 * using the limits configured in System Configuration > BID Urgency.
 */
export function calculatePriority(
  desiredDueDate: string,
  rules: IPriorityRules = DEFAULT_PRIORITY_RULES,
): BidPriority {
  const dueDate = parseDate(desiredDueDate);
  if (!dueDate) return "Normal";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  const bizDays = countBusinessDays(today, dueDate);

  if (bizDays <= rules.urgentMaxBusinessDays) return "Urgent";
  if (bizDays <= rules.normalMaxBusinessDays) return "Normal";
  return "Low";
}

/**
 * Get today's date as YYYY-MM-DD for input[type=date].
 */
export function getTodayISO(): string {
  return toLocalDateInput(new Date());
}

/** Local YYYY-MM-DD for input[type=date]. */
export function toLocalDateInput(d: Date): string {
  const yyyy = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const mm = m < 10 ? "0" + m : "" + m;
  const dd = day < 10 ? "0" + day : "" + day;
  return `${yyyy}-${mm}-${dd}`;
}

/** `days` calendar days after `from`, moved to the next Monday when it lands on a weekend. */
export function addDaysOnBusinessDay(from: Date, days: number): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + days);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d;
}

/**
 * Check if the selected date is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

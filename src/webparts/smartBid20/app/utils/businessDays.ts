import { BidPriority } from "../models/IBidStatus";

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
 * Calculate priority based on business days between today and desired due date.
 * - Up to 4 business days: Urgent
 * - Up to 14 business days: Normal
 * - More than 14 business days: Low
 */
export function calculatePriority(desiredDueDate: string): BidPriority {
  if (!desiredDueDate) return "Normal";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(desiredDueDate);
  dueDate.setHours(0, 0, 0, 0);

  const bizDays = countBusinessDays(today, dueDate);

  if (bizDays <= 4) return "Urgent";
  if (bizDays <= 14) return "Normal";
  return "Low";
}

/**
 * Get today's date as YYYY-MM-DD for input[type=date].
 */
export function getTodayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const mm = m < 10 ? "0" + m : "" + m;
  const dd = day < 10 ? "0" + day : "" + day;
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Check if the selected date is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === getTodayISO();
}

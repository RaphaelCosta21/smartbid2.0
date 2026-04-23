/**
 * Duration formatting and calculation helpers.
 * Shared across BidStatusPhasePanel, BidTimeline, and any component that
 * displays phase/status duration.
 */

/**
 * Formats a duration given in hours into a human-readable string.
 * Handles null values, sub-hour durations (minutes), hours, and days.
 */
export function formatDurationHours(hours: number | null): string {
  if (hours === null || hours === undefined) return "—";
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return mins <= 1 ? "< 1 min" : `${mins} min`;
  }
  if (hours < 24) {
    return `${Math.round(hours * 10) / 10}h`;
  }
  const days = Math.floor(hours / 24);
  const remainHours = Math.round((hours % 24) * 10) / 10;
  if (remainHours === 0) return `${days}d`;
  return `${days}d ${remainHours}h`;
}

/**
 * Formats a duration given in hours with more detail (includes minutes).
 * Used in BidTimeline for displaying phase and status durations.
 */
export function formatDurationFromHours(hours: number): string {
  if (hours < 1 / 60) return "< 1 min";
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins} min`;
  }
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  const d = Math.floor(hours / 24);
  const rh = Math.round((hours % 24) * 10) / 10;
  return rh === 0 ? `${d}d` : `${d}d ${rh}h`;
}

/**
 * Formats a live elapsed time from milliseconds into human-readable string.
 * Used for real-time counters (e.g., current phase/status elapsed time).
 */
export function formatLiveElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (totalMinutes < 60) return `${totalMinutes}m ${secs}s`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  const rh = hours % 24;
  return `${days}d ${rh}h ${mins}m`;
}

/**
 * Calculates duration in hours between two ISO date strings.
 */
export function calcDurationHours(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round((ms / (1000 * 60 * 60)) * 10000) / 10000;
}

/**
 * Calculates elapsed days from an ISO date string to now.
 */
export function calcElapsedDays(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

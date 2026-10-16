/**
 * surveyProgress.ts — Per-user progress for the Survey Portal learning missions.
 *
 * Stored in localStorage only (no SharePoint round-trip): missions are a personal
 * learning aid, not shared data. The store is keyed by the user so two people on
 * the same browser keep separate scores, and it degrades silently when storage is
 * unavailable (private mode, quota) — a missing score just reads as "not started".
 */

const STORAGE_PREFIX = "smartbid.survey.missions.";

export interface IMissionResult {
  /** Best number of correct answers achieved. */
  bestScore: number;
  /** Total questions in the mission at the time it was taken. */
  total: number;
  /** ISO date of the best attempt. */
  updatedAt: string;
}

export type SurveyMissionProgress = Record<string, IMissionResult>;

/** Stable, filename-safe key from a user id/email (falls back to "anon"). */
const userKey = (user: string | null | undefined): string => {
  const raw = (user || "").trim().toLowerCase();
  if (!raw) return "anon";
  return raw.replace(/[^a-z0-9._-]/g, "_");
};

const storageKey = (user: string | null | undefined): string =>
  STORAGE_PREFIX + userKey(user);

export function loadMissionProgress(
  user: string | null | undefined,
): SurveyMissionProgress {
  try {
    const raw = window.localStorage.getItem(storageKey(user));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as SurveyMissionProgress;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (e) {
    return {};
  }
}

/**
 * Records an attempt, keeping only the best score. Returns the updated progress
 * map so the caller can refresh its state without a second read.
 */
export function saveMissionResult(
  user: string | null | undefined,
  missionId: string,
  score: number,
  total: number,
): SurveyMissionProgress {
  const progress = loadMissionProgress(user);
  const prev = progress[missionId];
  if (!prev || score > prev.bestScore) {
    progress[missionId] = {
      bestScore: score,
      total,
      updatedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(storageKey(user), JSON.stringify(progress));
    } catch (e) {
      /* storage unavailable — keep the in-memory copy for this session */
    }
  }
  return progress;
}

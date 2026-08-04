/**
 * Phase helpers — BID phase utility functions.
 */
import {
  PHASE_CONFIGS,
  getPhaseConfig,
  getPhaseLabel,
  getAllTasks,
} from "../config/phases.config";
import { IBid, BidPhase } from "../models";

export function getPhaseProgress(bid: IBid): number {
  const phaseConfig = getPhaseConfig(bid.currentPhase);
  if (!phaseConfig) return 0;
  const totalTasks = phaseConfig.tasks.length;
  if (totalTasks === 0) return 0;
  const completedTasks = (bid.tasks || []).filter(
    (t) => t.phase === bid.currentPhase && t.status === "completed",
  ).length;
  return Math.round((completedTasks / totalTasks) * 100);
}

export function getOverallProgress(bid: IBid): number {
  const allTasks = getAllTasks();
  if (allTasks.length === 0) return 0;
  const completedCount = (bid.tasks || []).filter(
    (t) => t.status === "completed",
  ).length;
  return Math.round((completedCount / allTasks.length) * 100);
}

/**
 * Progress based on the BID's current phase position in the main workflow
 * (Request Submitted → Close Out). Reflects phase advancement even when tasks
 * are not tracked. Terminal statuses report 100%; Rework maps to its base phase.
 */
export function getPhaseProgressByIndex(bid: IBid): number {
  // Main workflow phases, ordered (Rework excluded — it's a side branch)
  const mainPhases = PHASE_CONFIGS.filter((p) => p.id !== "Rework").sort(
    (a, b) => a.order - b.order,
  );
  const lastIndex = mainPhases.length - 1;
  if (lastIndex <= 0) return 0;

  let idx = mainPhases.findIndex((p) => p.id === bid.currentPhase);
  // Rework or unknown phase → derive from the last completed main phase order
  if (idx < 0) {
    const cfg = PHASE_CONFIGS.find((p) => p.id === bid.currentPhase);
    idx = cfg ? Math.min(cfg.order, lastIndex) : 0;
  }
  const pct = Math.round((idx / lastIndex) * 100);
  return Math.max(0, Math.min(100, pct));
}

export function getPhaseIndex(phase: string): number {
  const idx = PHASE_CONFIGS.findIndex((p) => p.id === phase);
  return idx >= 0 ? idx : -1;
}

export function isPhaseCompleted(bid: IBid, phaseKey: string): boolean {
  const config = getPhaseConfig(phaseKey as BidPhase);
  if (!config) return false;
  const phaseTasks = (bid.tasks || []).filter((t) => t.phase === phaseKey);
  return (
    phaseTasks.length > 0 && phaseTasks.every((t) => t.status === "completed")
  );
}

export function getNextPhase(currentPhase: string): string | undefined {
  const idx = PHASE_CONFIGS.findIndex((p) => p.id === currentPhase);
  if (idx < 0 || idx >= PHASE_CONFIGS.length - 1) return undefined;
  return PHASE_CONFIGS[idx + 1].id;
}

export function getPreviousPhase(currentPhase: string): string | undefined {
  const idx = PHASE_CONFIGS.findIndex((p) => p.id === currentPhase);
  if (idx <= 0) return undefined;
  return PHASE_CONFIGS[idx - 1].id;
}

export function getPhaseLabelForBid(bid: IBid): string {
  return getPhaseLabel(bid.currentPhase);
}

export function getPendingTasks(bid: IBid): string[] {
  return bid.tasks
    .filter((s) => s.status === "not-started" || s.status === "in-progress")
    .map((s) => s.name);
}

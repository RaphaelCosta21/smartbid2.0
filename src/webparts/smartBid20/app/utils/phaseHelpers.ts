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

/**
 * Phase helpers — BID phase utility functions.
 */
import {
  PHASE_CONFIGS,
  getPhaseConfig,
  getPhaseLabel,
  getAllTasks,
} from "../config/phases.config";
import { IBid } from "../models";

export function getPhaseProgress(bid: IBid): number {
  const phaseConfig = getPhaseConfig(bid.currentPhase);
  if (!phaseConfig) return 0;
  const totalTasks = phaseConfig.tasks.length;
  if (totalTasks === 0) return 0;
  const completedTasks = bid.steps.filter(
    (s) => s.phase === bid.currentPhase && s.status === "Completed",
  ).length;
  return Math.round((completedTasks / totalTasks) * 100);
}

export function getOverallProgress(bid: IBid): number {
  const allTasks = getAllTasks();
  if (allTasks.length === 0) return 0;
  const completedSteps = bid.steps.filter(
    (s) => s.status === "Completed",
  ).length;
  return Math.round((completedSteps / allTasks.length) * 100);
}

export function getPhaseIndex(phase: string): number {
  const idx = PHASE_CONFIGS.findIndex((p) => p.id === phase);
  return idx >= 0 ? idx : -1;
}

export function isPhaseCompleted(bid: IBid, phaseKey: string): boolean {
  const config = getPhaseConfig(phaseKey as any);
  if (!config) return false;
  const phaseSteps = bid.steps.filter((s) => s.phase === phaseKey);
  return (
    phaseSteps.length > 0 && phaseSteps.every((s) => s.status === "Completed")
  );
}

export function getNextPhase(currentPhase: string): string | null {
  const idx = PHASE_CONFIGS.findIndex((p) => p.id === currentPhase);
  if (idx < 0 || idx >= PHASE_CONFIGS.length - 1) return null;
  return PHASE_CONFIGS[idx + 1].id;
}

export function getPreviousPhase(currentPhase: string): string | null {
  const idx = PHASE_CONFIGS.findIndex((p) => p.id === currentPhase);
  if (idx <= 0) return null;
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

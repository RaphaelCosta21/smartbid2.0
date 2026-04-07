import { BID_STATUSES } from "../config/status.config";
import { IBidStatusDef } from "../models";

export function getStatusDef(statusValue: string): IBidStatusDef | undefined {
  return BID_STATUSES.find(
    (s) => s.value === statusValue || s.id === statusValue,
  );
}

export function getStatusColor(statusValue: string): string {
  return getStatusDef(statusValue)?.color ?? "#94A3B8";
}

export function isTerminalStatus(statusValue: string): boolean {
  return getStatusDef(statusValue)?.isTerminal ?? false;
}

export function getStatusOrder(statusValue: string): number {
  return getStatusDef(statusValue)?.order ?? 99;
}

export function getStatusesByPhase(phase: string): IBidStatusDef[] {
  return BID_STATUSES.filter((s) => s.phase === phase);
}

export function getActiveStatuses(): IBidStatusDef[] {
  return BID_STATUSES.filter((s) => !s.isTerminal);
}

export function getTerminalStatuses(): IBidStatusDef[] {
  return BID_STATUSES.filter((s) => s.isTerminal);
}

export function getPriorityColor(priority: string): string {
  const map: Record<string, string> = {
    Urgent: "#ef4444",
    High: "#f59e0b",
    Normal: "#3b82f6",
    Low: "#64748b",
  };
  return map[priority] ?? "#94a3b8";
}

export function getDivisionColor(division: string): string {
  const map: Record<string, string> = {
    OPG: "#3b82f6",
    "SSR-ROV": "#f59e0b",
    "SSR-Survey": "#10b981",
    "SSR-Integrated": "#8b5cf6",
  };
  return map[division] ?? "#94a3b8";
}

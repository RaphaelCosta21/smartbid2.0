import { BID_STATUSES } from "../config/status.config";
import { useConfigStore } from "../stores/useConfigStore";
import { IBidStatusDef } from "../models";
import { PRIORITY_COLORS } from "./constants";

export function getStatusDef(statusValue: string): IBidStatusDef | undefined {
  const cfg = useConfigStore.getState().config;
  if (cfg) {
    const sub = (cfg.subStatuses || []).find(
      (s) => s.value === statusValue || s.id === statusValue,
    );
    if (sub) {
      return {
        id: sub.id as any,
        label: sub.label,
        value: sub.value,
        color: sub.color || "#94A3B8",
        order: sub.order || 0,
        phase: null,
        isTerminal: false,
      };
    }
    const term = ((cfg as any).terminalStatuses || []).find(
      (t: any) => t.value === statusValue || t.id === statusValue,
    );
    if (term) {
      return {
        id: term.id as any,
        label: term.label,
        value: term.value,
        color: term.color || "#94A3B8",
        order: term.order || 0,
        phase: "Close Out" as any,
        isTerminal: true,
      };
    }
  }
  return BID_STATUSES.find(
    (s) => s.value === statusValue || s.id === statusValue,
  );
}

export function getStatusColor(statusValue: string): string {
  return getStatusDef(statusValue)?.color ?? "#94A3B8";
}

export function isTerminalStatus(statusValue: string): boolean {
  const cfg = useConfigStore.getState().config;
  if (cfg) {
    const terms = (cfg as any).terminalStatuses || [];
    if (terms.length > 0) {
      return terms.some((t: any) => t.value === statusValue);
    }
  }
  return getStatusDef(statusValue)?.isTerminal ?? false;
}

export function getStatusOrder(statusValue: string): number {
  return getStatusDef(statusValue)?.order ?? 99;
}

export function getStatusesByPhase(phase: string): IBidStatusDef[] {
  const cfg = useConfigStore.getState().config;
  if (cfg && cfg.subStatuses && cfg.subStatuses.length > 0) {
    return cfg.subStatuses
      .filter((s) => s.isActive !== false)
      .filter((s) => {
        const cat = s.category || "all";
        return cat === "all" || cat.split(",").indexOf(phase) >= 0;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => ({
        id: s.id as any,
        label: s.label,
        value: s.value,
        color: s.color || "#94A3B8",
        order: s.order || 0,
        phase: null,
        isTerminal: false,
      }));
  }
  return BID_STATUSES.filter((s) => s.phase === phase);
}

export function getActiveStatuses(): IBidStatusDef[] {
  const cfg = useConfigStore.getState().config;
  if (cfg && cfg.subStatuses && cfg.subStatuses.length > 0) {
    return cfg.subStatuses
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => ({
        id: s.id as any,
        label: s.label,
        value: s.value,
        color: s.color || "#94A3B8",
        order: s.order || 0,
        phase: null,
        isTerminal: false,
      }));
  }
  return BID_STATUSES.filter((s) => !s.isTerminal);
}

export function getTerminalStatuses(): IBidStatusDef[] {
  const cfg = useConfigStore.getState().config;
  if (cfg) {
    const terms = (cfg as any).terminalStatuses || [];
    if (terms.length > 0) {
      return terms
        .filter((t: any) => t.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((t: any) => ({
          id: t.id as any,
          label: t.label,
          value: t.value,
          color: t.color || "#94A3B8",
          order: t.order || 0,
          phase: "Close Out" as any,
          isTerminal: true,
        }));
    }
  }
  return BID_STATUSES.filter((s) => s.isTerminal);
}

export function getPriorityColor(priority: string): string {
  return PRIORITY_COLORS[priority] ?? "#94a3b8";
}

export function getDivisionColor(division: string): string {
  const cfg = useConfigStore.getState().config;
  if (cfg && cfg.divisions) {
    const div = cfg.divisions.find((d) => d.value === division);
    if (div?.color) return div.color;
  }
  const map: Record<string, string> = {
    OPG: "#3b82f6",
    "SSR-ROV": "#f59e0b",
    "SSR-Survey": "#10b981",
    "SSR-Integrated": "#8b5cf6",
  };
  return map[division] ?? "#94a3b8";
}

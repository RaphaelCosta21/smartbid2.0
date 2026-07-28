/**
 * useChartTheme — Theme-aware palette for Recharts.
 *
 * The app's CSS custom properties live on a hashed theme class
 * (`.smartBidDark` / `.smartBidLight`), so reading them via
 * getComputedStyle is unreliable. Instead we mirror the stable
 * chrome tokens here, keyed by the current theme from useUIStore.
 *
 * Series colors for statuses / phases / divisions must still come
 * from useStatusColors (config-driven). This hook only provides the
 * neutral chart chrome (axis, grid, ticks, tooltip) plus a generic
 * categorical palette for non-semantic series.
 */
import * as React from "react";
import { useUIStore } from "../stores/useUIStore";

export interface ChartTheme {
  mode: "dark" | "light";
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  grid: string;
  axis: string;
  tick: string;
  cardBg: string;
  cardBgElevated: string;
  accent: string;
  accentSecondary: string;
  accentTertiary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  /** Categorical palette for generic (non-semantic) multi-series charts. */
  categorical: string[];
  /** Subtle fill for reference areas / target bands. */
  referenceFill: string;
}

const CATEGORICAL = [
  "#00c9a7",
  "#3b82f6",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
  "#10b981",
  "#a855f7",
  "#14b8a6",
];

const DARK: ChartTheme = {
  mode: "dark",
  textPrimary: "#f1f5f9",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  grid: "rgba(148, 163, 184, 0.12)",
  axis: "rgba(148, 163, 184, 0.25)",
  tick: "#94a3b8",
  cardBg: "#152238",
  cardBgElevated: "#1a2d4a",
  accent: "#00c9a7",
  accentSecondary: "#3b82f6",
  accentTertiary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  categorical: CATEGORICAL,
  referenceFill: "rgba(148, 163, 184, 0.08)",
};

const LIGHT: ChartTheme = {
  mode: "light",
  textPrimary: "#1e293b",
  textSecondary: "#475569",
  textMuted: "#94a3b8",
  grid: "rgba(71, 85, 105, 0.12)",
  axis: "rgba(71, 85, 105, 0.22)",
  tick: "#475569",
  cardBg: "#ffffff",
  cardBgElevated: "#f1f5f9",
  accent: "#0d9488",
  accentSecondary: "#2563eb",
  accentTertiary: "#7c3aed",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  categorical: CATEGORICAL,
  referenceFill: "rgba(71, 85, 105, 0.06)",
};

export function useChartTheme(): ChartTheme {
  const theme = useUIStore((s) => s.theme);
  return React.useMemo(() => (theme === "dark" ? DARK : LIGHT), [theme]);
}

/** Returns a color from the categorical palette by index (wraps around). */
export function categoricalColor(index: number): string {
  return CATEGORICAL[index % CATEGORICAL.length];
}

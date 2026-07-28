/**
 * useAnalyticsFilters — Shared filter state + apply logic for Analytics pages.
 */
import * as React from "react";
import { IBid } from "../models";

export type DatePreset =
  | "30d"
  | "90d"
  | "180d"
  | "ytd"
  | "12m"
  | "all"
  | "custom";

export interface AnalyticsFilters {
  preset: DatePreset;
  from: string; // yyyy-mm-dd or ""
  to: string; // yyyy-mm-dd or ""
  divisions: string[];
  serviceLines: string[];
  bidTypes: string[];
  search: string;
}

const DEFAULT: AnalyticsFilters = {
  preset: "all",
  from: "",
  to: "",
  divisions: [],
  serviceLines: [],
  bidTypes: [],
  search: "",
};

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function presetRange(preset: DatePreset): { from: string; to: string } {
  const to = todayStr();
  switch (preset) {
    case "30d":
      return { from: isoDaysAgo(30), to };
    case "90d":
      return { from: isoDaysAgo(90), to };
    case "180d":
      return { from: isoDaysAgo(180), to };
    case "12m":
      return { from: isoDaysAgo(365), to };
    case "ytd":
      return { from: `${new Date().getFullYear()}-01-01`, to };
    default:
      return { from: "", to: "" };
  }
}

export interface UseAnalyticsFilters {
  filters: AnalyticsFilters;
  patch: (p: Partial<AnalyticsFilters>) => void;
  setPreset: (preset: DatePreset) => void;
  reset: () => void;
  applyFilters: (bids: IBid[], dateField?: keyof IBid) => IBid[];
  hasActive: boolean;
}

export function useAnalyticsFilters(
  initial?: Partial<AnalyticsFilters>,
): UseAnalyticsFilters {
  const [filters, setFilters] = React.useState<AnalyticsFilters>({
    ...DEFAULT,
    ...initial,
  });

  const patch = React.useCallback((p: Partial<AnalyticsFilters>) => {
    setFilters((f) => ({ ...f, ...p }));
  }, []);

  const setPreset = React.useCallback((preset: DatePreset) => {
    if (preset === "custom") {
      setFilters((f) => ({ ...f, preset }));
      return;
    }
    const r = presetRange(preset);
    setFilters((f) => ({ ...f, preset, from: r.from, to: r.to }));
  }, []);

  const reset = React.useCallback(() => {
    setFilters({ ...DEFAULT, ...initial });
  }, [initial]);

  const applyFilters = React.useCallback(
    (bids: IBid[], dateField: keyof IBid = "createdDate"): IBid[] => {
      return bids.filter((b) => {
        if (
          filters.divisions.length &&
          filters.divisions.indexOf(b.division) < 0
        ) {
          return false;
        }
        if (
          filters.serviceLines.length &&
          filters.serviceLines.indexOf(b.serviceLine) < 0
        ) {
          return false;
        }
        if (
          filters.bidTypes.length &&
          filters.bidTypes.indexOf(b.bidType) < 0
        ) {
          return false;
        }
        const dv = ((b[dateField] as unknown as string) || "").slice(0, 10);
        if (filters.from && dv && dv < filters.from) return false;
        if (filters.to && dv && dv > filters.to) return false;
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const hay = `${b.bidNumber} ${b.crmNumber} ${
            b.opportunityInfo?.client || ""
          } ${b.opportunityInfo?.projectName || ""}`.toLowerCase();
          if (hay.indexOf(q) < 0) return false;
        }
        return true;
      });
    },
    [filters],
  );

  const hasActive =
    filters.divisions.length > 0 ||
    filters.serviceLines.length > 0 ||
    filters.bidTypes.length > 0 ||
    filters.search.length > 0 ||
    !!filters.from ||
    !!filters.to;

  return { filters, patch, setPreset, reset, applyFilters, hasActive };
}

/**
 * useDashboardFilters — filters for the Engineering Dashboard.
 * Scope (search + facets) applies to the Live view only; Period (date field + range)
 * and follow-up Result apply to the Engineering (analytics) view only.
 */
import * as React from "react";
import { format } from "date-fns";
import { IBid } from "../models";
import { countFacets } from "../utils/facetHelpers";
import { parseDate } from "../utils/formatters";
import { DatePreset, presetRange } from "./useAnalyticsFilters";

export type DashboardDateField =
  | "createdDate"
  | "dueDate"
  | "operationStartDate";

export interface DashboardScopeFilters {
  search: string;
  divisions: string[];
  serviceLines: string[];
  /** Lower-cased engineer e-mails */
  engineers: string[];
  clients: string[];
  statuses: string[];
}

export interface DashboardPeriodFilters {
  dateField: DashboardDateField;
  preset: DatePreset;
  from: string; // yyyy-mm-dd or ""
  to: string; // yyyy-mm-dd or ""
  results: string[];
}

export type DashboardScopeFacetKey =
  | "divisions"
  | "serviceLines"
  | "engineers"
  | "clients"
  | "statuses";

const SCOPE_FACETS: Record<
  DashboardScopeFacetKey,
  (b: IBid) => string | string[]
> = {
  divisions: (b) => b.division || "",
  serviceLines: (b) => b.serviceLine || "",
  engineers: (b) =>
    (b.engineerResponsible || []).map((p) => (p.email || "").toLowerCase()),
  clients: (b) => b.opportunityInfo?.client || "",
  statuses: (b) => b.currentStatus || "",
};

const DEFAULT_SCOPE: DashboardScopeFilters = {
  search: "",
  divisions: [],
  serviceLines: [],
  engineers: [],
  clients: [],
  statuses: [],
};

const DEFAULT_PERIOD: DashboardPeriodFilters = {
  dateField: "createdDate",
  preset: "all",
  from: "",
  to: "",
  results: [],
};

/** Local yyyy-MM-dd of the BID's date for `field`, or "" when missing. */
export function getBidDateValue(b: IBid, field: DashboardDateField): string {
  const raw =
    field === "createdDate"
      ? b.createdDate
      : field === "dueDate"
        ? b.dueDate || b.desiredDueDate
        : b.opportunityInfo?.operationStartDate;
  const d = parseDate(raw);
  return d ? format(d, "yyyy-MM-dd") : "";
}

function matchesSearch(b: IBid, q: string): boolean {
  const hay = [
    b.bidNumber,
    b.crmNumber,
    b.opportunityInfo?.client,
    b.opportunityInfo?.projectName,
    b.creator?.name,
    ...(b.engineerResponsible || []).map((p) => p.name),
  ]
    .join(" ")
    .toLowerCase();
  return hay.indexOf(q) >= 0;
}

export interface UseDashboardFilters {
  scope: DashboardScopeFilters;
  period: DashboardPeriodFilters;
  patchScope: (p: Partial<DashboardScopeFilters>) => void;
  patchPeriod: (p: Partial<DashboardPeriodFilters>) => void;
  setPreset: (preset: DatePreset) => void;
  resetScope: () => void;
  resetPeriod: () => void;
  hasScope: boolean;
  hasPeriod: boolean;
  /** BIDs passing the scope filters (Live view). */
  scopeBids: IBid[];
  /** Period + result (Engineering view). */
  analyticsBids: IBid[];
  scopeFacetCounts: Record<DashboardScopeFacetKey, Record<string, number>>;
  /** Result counts over the period (ignores the result selection). */
  resultCounts: Record<string, number>;
  /** BIDs dropped by an active range because they lack the date. */
  missingDateCount: number;
}

export function useDashboardFilters(
  bids: IBid[],
  getResult: (b: IBid) => string,
): UseDashboardFilters {
  const [scope, setScope] =
    React.useState<DashboardScopeFilters>(DEFAULT_SCOPE);
  const [period, setPeriod] =
    React.useState<DashboardPeriodFilters>(DEFAULT_PERIOD);

  const patchScope = React.useCallback(
    (p: Partial<DashboardScopeFilters>) => setScope((s) => ({ ...s, ...p })),
    [],
  );
  const patchPeriod = React.useCallback(
    (p: Partial<DashboardPeriodFilters>) => setPeriod((s) => ({ ...s, ...p })),
    [],
  );
  const setPreset = React.useCallback((preset: DatePreset) => {
    if (preset === "custom") {
      setPeriod((s) => ({ ...s, preset }));
      return;
    }
    const r = presetRange(preset);
    setPeriod((s) => ({ ...s, preset, from: r.from, to: r.to }));
  }, []);
  const resetScope = React.useCallback(() => setScope(DEFAULT_SCOPE), []);
  const resetPeriod = React.useCallback(
    () => setPeriod((s) => ({ ...DEFAULT_PERIOD, dateField: s.dateField })),
    [],
  );

  const passesScope = React.useCallback(
    (b: IBid, skip?: DashboardScopeFacetKey): boolean => {
      const q = scope.search.trim().toLowerCase();
      if (q && !matchesSearch(b, q)) return false;
      return (Object.keys(SCOPE_FACETS) as DashboardScopeFacetKey[]).every(
        (key) => {
          const selected = scope[key];
          if (key === skip || selected.length === 0) return true;
          const v = SCOPE_FACETS[key](b);
          const values = Array.isArray(v) ? v : [v];
          return values.some((x) => selected.indexOf(x) >= 0);
        },
      );
    },
    [scope],
  );

  const scopeBids = React.useMemo(
    () => bids.filter((b) => passesScope(b)),
    [bids, passesScope],
  );

  const scopeFacetCounts = React.useMemo(
    () => countFacets(bids, SCOPE_FACETS, (b, skip) => passesScope(b, skip)),
    [bids, passesScope],
  );

  const rangeActive = !!period.from || !!period.to;

  const { periodBids, missingDateCount } = React.useMemo(() => {
    if (!rangeActive) return { periodBids: bids, missingDateCount: 0 };
    let missing = 0;
    const out = bids.filter((b) => {
      const dv = getBidDateValue(b, period.dateField);
      if (!dv) {
        missing++;
        return false;
      }
      if (period.from && dv < period.from) return false;
      if (period.to && dv > period.to) return false;
      return true;
    });
    return { periodBids: out, missingDateCount: missing };
  }, [bids, rangeActive, period.dateField, period.from, period.to]);

  const resultCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    periodBids.forEach((b) => {
      const r = getResult(b);
      counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
  }, [periodBids, getResult]);

  const analyticsBids = React.useMemo(
    () =>
      period.results.length === 0
        ? periodBids
        : periodBids.filter((b) => period.results.indexOf(getResult(b)) >= 0),
    [periodBids, period.results, getResult],
  );

  const hasScope =
    !!scope.search.trim() ||
    (Object.keys(SCOPE_FACETS) as DashboardScopeFacetKey[]).some(
      (k) => scope[k].length > 0,
    );
  const hasPeriod = rangeActive || period.results.length > 0;

  return {
    scope,
    period,
    patchScope,
    patchPeriod,
    setPreset,
    resetScope,
    resetPeriod,
    hasScope,
    hasPeriod,
    scopeBids,
    analyticsBids,
    scopeFacetCounts,
    resultCounts,
    missingDateCount,
  };
}

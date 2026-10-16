/**
 * DashboardFilterBar — sticky glass "scope" bar of the Engineering Dashboard.
 * Applies to the whole page (Live overview + analytics).
 */
import * as React from "react";
import { Search, X } from "lucide-react";
import { IBid } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { useStatusColors } from "../../hooks/useStatusColors";
import { categoricalColor } from "../../hooks/useChartTheme";
import {
  DashboardScopeFacetKey,
  DashboardScopeFilters,
} from "../../hooks/useDashboardFilters";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../insights/MultiSelectDropdown";
import { withCounts } from "../../utils/facetHelpers";
import styles from "./DashboardFilterBar.module.scss";

interface DashboardFilterBarProps {
  /** Every BID (options are built from these). */
  bids: IBid[];
  scope: DashboardScopeFilters;
  onPatch: (p: Partial<DashboardScopeFilters>) => void;
  onReset: () => void;
  hasScope: boolean;
  facetCounts: Record<DashboardScopeFacetKey, Record<string, number>>;
  shownCount: number;
}

const SEARCH_DEBOUNCE_MS = 250;

function byLabel(a: MultiSelectOption, b: MultiSelectOption): number {
  return a.label.localeCompare(b.label);
}

export const DashboardFilterBar: React.FC<DashboardFilterBarProps> = ({
  bids,
  scope,
  onPatch,
  onReset,
  hasScope,
  facetCounts,
  shownCount,
}) => {
  const config = useConfigStore((s) => s.config);
  const { getStatusColor, getDivisionColor } = useStatusColors();
  const [searchInput, setSearchInput] = React.useState(scope.search);

  React.useEffect(() => {
    setSearchInput(scope.search);
  }, [scope.search]);

  React.useEffect(() => {
    if (searchInput === scope.search) return undefined;
    const id = window.setTimeout(
      () => onPatch({ search: searchInput }),
      SEARCH_DEBOUNCE_MS,
    );
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const options = React.useMemo(() => {
    const divisions: MultiSelectOption[] = (config?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((d) => ({
        value: d.value,
        label: d.label || d.value,
        color: d.color || getDivisionColor(d.value),
      }));

    const serviceLines: MultiSelectOption[] = (config?.serviceLines || [])
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s, i) => ({
        value: s.value,
        label: s.label || s.value,
        color: s.color || categoricalColor(i),
      }));

    const engineerMap: Record<string, string> = {};
    const clientMap: Record<string, boolean> = {};
    const statusMap: Record<string, boolean> = {};
    bids.forEach((b) => {
      (b.engineerResponsible || []).forEach((p) => {
        const email = (p.email || "").toLowerCase();
        if (email && !engineerMap[email]) engineerMap[email] = p.name || email;
      });
      const client = b.opportunityInfo?.client;
      if (client) clientMap[client] = true;
      if (b.currentStatus) statusMap[b.currentStatus] = true;
    });

    const statusOrder: Record<string, number> = {};
    (config?.subStatuses || []).forEach((s, i) => {
      statusOrder[s.value] = s.order !== undefined ? s.order : i;
    });

    return {
      divisions,
      serviceLines,
      engineers: Object.keys(engineerMap)
        .map((email) => ({ value: email, label: engineerMap[email] }))
        .sort(byLabel),
      clients: Object.keys(clientMap)
        .map((c) => ({ value: c, label: c }))
        .sort(byLabel),
      statuses: Object.keys(statusMap)
        .sort((a, b) => {
          const oa = statusOrder[a] !== undefined ? statusOrder[a] : 999;
          const ob = statusOrder[b] !== undefined ? statusOrder[b] : 999;
          return oa - ob || a.localeCompare(b);
        })
        .map((s) => ({ value: s, label: s, color: getStatusColor(s) })),
    };
  }, [bids, config, getStatusColor, getDivisionColor]);

  return (
    <div className={styles.filterBar}>
      <div className={styles.search}>
        <Search size={15} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search BID #, CRM, client, project, engineer..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.currentTarget.value)}
          aria-label="Search BIDs"
        />
        {searchInput && (
          <button
            type="button"
            className={styles.searchClearBtn}
            onClick={() => {
              setSearchInput("");
              onPatch({ search: "" });
            }}
            title="Clear search"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <MultiSelectDropdown
        label="Division"
        options={withCounts(options.divisions, facetCounts.divisions)}
        selected={scope.divisions}
        onChange={(v) => onPatch({ divisions: v })}
      />
      {options.serviceLines.length > 0 && (
        <MultiSelectDropdown
          label="Service Line"
          options={withCounts(options.serviceLines, facetCounts.serviceLines)}
          selected={scope.serviceLines}
          onChange={(v) => onPatch({ serviceLines: v })}
        />
      )}
      <MultiSelectDropdown
        label="Engineer"
        options={withCounts(options.engineers, facetCounts.engineers)}
        selected={scope.engineers}
        onChange={(v) => onPatch({ engineers: v })}
        searchable
      />
      <MultiSelectDropdown
        label="Client"
        options={withCounts(options.clients, facetCounts.clients)}
        selected={scope.clients}
        onChange={(v) => onPatch({ clients: v })}
        searchable
      />
      <MultiSelectDropdown
        label="Status"
        options={withCounts(options.statuses, facetCounts.statuses)}
        selected={scope.statuses}
        onChange={(v) => onPatch({ statuses: v })}
      />

      {hasScope && (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={() => {
            setSearchInput("");
            onReset();
          }}
        >
          <X size={14} /> Clear
        </button>
      )}

      <span className={styles.resultCount}>
        <strong>{shownCount}</strong> {hasScope ? `of ${bids.length} ` : ""}
        {bids.length === 1 ? "BID" : "BIDs"}
      </span>
    </div>
  );
};

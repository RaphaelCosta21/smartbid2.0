/**
 * useQualificationLibraryFilter — Search + faceted multi-select filtering of the
 * Qualifications Database. Shared by the library page and the BID import modal.
 */
import * as React from "react";
import { IBid } from "../models";
import { IQualificationDbItem } from "../models/IQualificationDb";
import { IConfigOption } from "../models/ISystemConfig";
import { MultiSelectOption } from "../components/insights/MultiSelectDropdown";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import {
  activeConfigOptions,
  configOptionLabel,
} from "../utils/clarificationHelpers";
import { matchesPastBidSearch, normalizeText } from "../utils/pastBidHelpers";
import { LIBRARY_NOT_SET } from "./useClarificationLibraryFilter";

export type QualificationFacetKey =
  "table" | "category" | "client" | "division" | "serviceLine" | "origin";

export type QualificationFilters = Record<QualificationFacetKey, string[]>;

const ALL_KEYS: QualificationFacetKey[] = [
  "table",
  "category",
  "client",
  "division",
  "serviceLine",
  "origin",
];

const EMPTY_FILTERS: QualificationFilters = {
  table: [],
  category: [],
  client: [],
  division: [],
  serviceLine: [],
  origin: [],
};

const ORIGIN_OPTIONS = [
  { value: "bid", label: "From a BID" },
  { value: "manual", label: "Manual entry" },
];

export interface IQualificationLibraryRow {
  item: IQualificationDbItem;
  /** Source BID when it is loaded in the BID store */
  sourceBid?: IBid;
  // Flat keys read by DataTable sorting
  tableTitle: string;
  categoryLabel: string;
  qualification: string;
  clientLabel: string;
  divisionLabel: string;
  serviceLineLabel: string;
  sortDate: string;
  facets: Record<QualificationFacetKey, string>;
  searchText: string;
}

export interface IQualificationFilterState {
  rows: IQualificationLibraryRow[];
  filtered: IQualificationLibraryRow[];
  options: Record<QualificationFacetKey, MultiSelectOption[]>;
  search: string;
  setSearch: (value: string) => void;
  filters: QualificationFilters;
  setFilter: (key: QualificationFacetKey) => (values: string[]) => void;
  hasFilters: boolean;
  clear: () => void;
}

export function useQualificationLibraryFilter(
  items: IQualificationDbItem[],
): IQualificationFilterState {
  const config = useConfigStore((s) => s.config);
  const bids = useBidStore((s) => s.bids);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] =
    React.useState<QualificationFilters>(EMPTY_FILTERS);

  const rows = React.useMemo<IQualificationLibraryRow[]>(() => {
    const bidsByNumber: Record<string, IBid> = {};
    bids.forEach((b) => {
      bidsByNumber[b.bidNumber] = b;
    });
    return items.map((it) => {
      const bid = it.sourceBidNumber
        ? bidsByNumber[it.sourceBidNumber]
        : undefined;
      const tableTitle = it.tableTitle.trim();
      const categoryLabel = configOptionLabel(
        config?.qualificationCategories,
        it.category,
      );
      const clientLabel = configOptionLabel(config?.clientList, it.client);
      const divisionLabel = configOptionLabel(config?.divisions, it.division);
      const serviceLineLabel = configOptionLabel(
        config?.serviceLines,
        it.serviceLine,
      );
      return {
        item: it,
        sourceBid: bid,
        tableTitle,
        categoryLabel,
        qualification: it.qualification,
        clientLabel,
        divisionLabel,
        serviceLineLabel,
        sortDate: it.created || "",
        facets: {
          table: tableTitle || LIBRARY_NOT_SET,
          category: it.category || LIBRARY_NOT_SET,
          client: it.client || LIBRARY_NOT_SET,
          division: it.division || LIBRARY_NOT_SET,
          serviceLine: it.serviceLine || LIBRARY_NOT_SET,
          origin: it.sourceBidNumber ? "bid" : "manual",
        },
        searchText: normalizeText(
          [
            tableTitle,
            categoryLabel,
            it.qualification,
            clientLabel,
            divisionLabel,
            serviceLineLabel,
            it.sourceBidNumber,
            bid ? bid.crmNumber : "",
            bid && bid.opportunityInfo ? bid.opportunityInfo.projectName : "",
          ]
            .filter(Boolean)
            .join(" \u2022 "),
        ),
      };
    });
  }, [items, bids, config]);

  /** Search + every filter except `skip`, so each dropdown counts against the others */
  const passes = React.useCallback(
    (r: IQualificationLibraryRow, skip?: QualificationFacetKey): boolean =>
      ALL_KEYS.every(
        (k) =>
          k === skip ||
          filters[k].length === 0 ||
          filters[k].indexOf(r.facets[k]) >= 0,
      ) &&
      (!search.trim() || matchesPastBidSearch(r.searchText, search)),
    [filters, search],
  );

  const filtered = React.useMemo(
    () => rows.filter((r) => passes(r)),
    [rows, passes],
  );

  const options = React.useMemo(() => {
    const counts = {} as Record<QualificationFacetKey, Record<string, number>>;
    ALL_KEYS.forEach((k) => {
      counts[k] = {};
    });
    rows.forEach((r) => {
      ALL_KEYS.forEach((k) => {
        if (passes(r, k)) {
          counts[k][r.facets[k]] = (counts[k][r.facets[k]] || 0) + 1;
        }
      });
    });

    const fromConfig = (
      list: IConfigOption[] | undefined,
    ): { value: string; label: string }[] =>
      activeConfigOptions(list).map((o) => ({
        value: o.value,
        label: o.label,
      }));
    const configured: Record<
      QualificationFacetKey,
      { value: string; label: string }[]
    > = {
      table: [],
      category: fromConfig(config?.qualificationCategories),
      client: [],
      division: fromConfig(config?.divisions),
      serviceLine: [],
      origin: ORIGIN_OPTIONS,
    };
    const labelLists: Partial<Record<QualificationFacetKey, IConfigOption[]>> =
      {
        category: config?.qualificationCategories,
        client: config?.clientList,
        division: config?.divisions,
        serviceLine: config?.serviceLines,
      };

    /** Configured options first, then values only found in the data, then "Not set". */
    const out = {} as Record<QualificationFacetKey, MultiSelectOption[]>;
    ALL_KEYS.forEach((key) => {
      const labelOf = (v: string): string =>
        configOptionLabel(labelLists[key], v);
      const seen: Record<string, boolean> = {};
      const list: { value: string; label: string }[] = [];
      configured[key].forEach((o) => {
        if (seen[o.value]) return;
        seen[o.value] = true;
        list.push(o);
      });
      const extra: string[] = [];
      let hasNotSet = false;
      rows.forEach((r) => {
        const v = r.facets[key];
        if (v === LIBRARY_NOT_SET) hasNotSet = true;
        else if (!seen[v]) {
          seen[v] = true;
          extra.push(v);
        }
      });
      extra
        .sort((a, b) => labelOf(a).localeCompare(labelOf(b)))
        .forEach((v) => list.push({ value: v, label: labelOf(v) }));
      if (hasNotSet) list.push({ value: LIBRARY_NOT_SET, label: "Not set" });
      out[key] = list.map((o) => ({
        ...o,
        count: counts[key][o.value] || 0,
      }));
    });
    return out;
  }, [rows, passes, config]);

  const setFilter = React.useCallback(
    (key: QualificationFacetKey) =>
      (values: string[]): void =>
        setFilters((prev) => ({ ...prev, [key]: values })),
    [],
  );

  const clear = React.useCallback(() => {
    setSearch("");
    setFilters(EMPTY_FILTERS);
  }, []);

  return {
    rows,
    filtered,
    options,
    search,
    setSearch,
    filters,
    setFilter,
    hasFilters: !!search.trim() || ALL_KEYS.some((k) => filters[k].length > 0),
    clear,
  };
}

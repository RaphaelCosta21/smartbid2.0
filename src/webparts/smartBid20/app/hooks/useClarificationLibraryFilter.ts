/**
 * useClarificationLibraryFilter — Search + faceted multi-select filtering of the
 * Clarif. & Qualif. library. Shared by the library page and the BID import modal.
 */
import * as React from "react";
import { IBid } from "../models";
import { IClarificationDbItem } from "../models/IClarificationDb";
import { IConfigOption } from "../models/ISystemConfig";
import { MultiSelectOption } from "../components/insights/MultiSelectDropdown";
import { useBidStore } from "../stores/useBidStore";
import { useConfigStore } from "../stores/useConfigStore";
import {
  activeConfigOptions,
  configOptionLabel,
} from "../utils/clarificationHelpers";
import { matchesPastBidSearch, normalizeText } from "../utils/pastBidHelpers";

export type LibraryFacetKey =
  | "type"
  | "category"
  | "client"
  | "division"
  | "serviceLine"
  | "origin"
  | "approval";

export type LibraryFilters = Record<LibraryFacetKey, string[]>;

/** Facet value for rows with an empty field (mostly legacy entries). */
export const LIBRARY_NOT_SET = "__not_set__";

const ALL_KEYS: LibraryFacetKey[] = [
  "type",
  "category",
  "client",
  "division",
  "serviceLine",
  "origin",
  "approval",
];

const EMPTY_FILTERS: LibraryFilters = {
  type: [],
  category: [],
  client: [],
  division: [],
  serviceLine: [],
  origin: [],
  approval: [],
};

export interface ILibraryRow {
  item: IClarificationDbItem;
  /** Source BID when it is loaded in the BID store */
  sourceBid?: IBid;
  // Flat keys read by DataTable sorting
  baseType: string;
  categoryLabel: string;
  etTopic: string;
  clientLabel: string;
  divisionLabel: string;
  serviceLineLabel: string;
  approvedLabel: string;
  sortDate: string;
  facets: Record<LibraryFacetKey, string>;
  searchText: string;
}

export interface ILibraryFilterState {
  rows: ILibraryRow[];
  filtered: ILibraryRow[];
  options: Record<LibraryFacetKey, MultiSelectOption[]>;
  search: string;
  setSearch: (value: string) => void;
  filters: LibraryFilters;
  setFilter: (key: LibraryFacetKey) => (values: string[]) => void;
  hasFilters: boolean;
  clear: () => void;
}

const FIXED_OPTIONS: Partial<
  Record<LibraryFacetKey, { value: string; label: string }[]>
> = {
  type: [
    { value: "Clarification", label: "Clarification" },
    { value: "Qualification", label: "Qualification" },
  ],
  origin: [
    { value: "bid", label: "From a BID" },
    { value: "manual", label: "Manual entry" },
  ],
  approval: [
    { value: "yes", label: "Approved" },
    { value: "no", label: "Not approved" },
  ],
};

export function useClarificationLibraryFilter(
  items: IClarificationDbItem[],
  initialFilters?: Partial<LibraryFilters>,
): ILibraryFilterState {
  const config = useConfigStore((s) => s.config);
  const bids = useBidStore((s) => s.bids);
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] = React.useState<LibraryFilters>({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });

  const rows = React.useMemo<ILibraryRow[]>(() => {
    const bidsByNumber: Record<string, IBid> = {};
    bids.forEach((b) => {
      bidsByNumber[b.bidNumber] = b;
    });
    return items.map((it) => {
      const bid = it.sourceBidNumber
        ? bidsByNumber[it.sourceBidNumber]
        : undefined;
      const categoryLabel = configOptionLabel(
        config?.clarificationCategories,
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
        baseType: it.baseType,
        categoryLabel,
        etTopic: it.etTopic,
        clientLabel,
        divisionLabel,
        serviceLineLabel,
        approvedLabel: it.approved ? "Yes" : "No",
        sortDate: it.date || it.created || "",
        facets: {
          type: it.baseType,
          category: it.category || LIBRARY_NOT_SET,
          client: it.client || LIBRARY_NOT_SET,
          division: it.division || LIBRARY_NOT_SET,
          serviceLine: it.serviceLine || LIBRARY_NOT_SET,
          origin: it.sourceBidNumber ? "bid" : "manual",
          approval: it.approved ? "yes" : "no",
        },
        searchText: normalizeText(
          [
            it.clientDocRef,
            it.etTopic,
            it.clarification,
            it.clientReply,
            it.keyword,
            clientLabel,
            categoryLabel,
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
    (r: ILibraryRow, skip?: LibraryFacetKey): boolean =>
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
    const counts = {} as Record<LibraryFacetKey, Record<string, number>>;
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
      LibraryFacetKey,
      { value: string; label: string }[]
    > = {
      type: FIXED_OPTIONS.type || [],
      category: fromConfig(config?.clarificationCategories),
      client: [],
      division: fromConfig(config?.divisions),
      serviceLine: [],
      origin: FIXED_OPTIONS.origin || [],
      approval: FIXED_OPTIONS.approval || [],
    };
    const labelLists: Partial<Record<LibraryFacetKey, IConfigOption[]>> = {
      category: config?.clarificationCategories,
      client: config?.clientList,
      division: config?.divisions,
      serviceLine: config?.serviceLines,
    };

    /** Configured options first, then values only found in the data, then "Not set". */
    const out = {} as Record<LibraryFacetKey, MultiSelectOption[]>;
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
    (key: LibraryFacetKey) =>
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

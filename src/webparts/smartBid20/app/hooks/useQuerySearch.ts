/**
 * useQuerySearch — Debounced cascade search for the PN / description autocomplete.
 * Walks the "Add Items from Catalog" sources in priority order until `limit` results are found.
 */
import * as React from "react";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useQuotationStore } from "../stores/useQuotationStore";
import { useBomCostAnalysisStore } from "../stores/useBomCostAnalysisStore";
import { useAssetCatalogStore } from "../stores/useAssetCatalogStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { CatalogSearchBucket, ISearchResultItem } from "../models";

type SearchField = "pn" | "description" | "both";
type SearchFn = (query: string, limit?: number) => ISearchResultItem[];

/** Cascade priority — a bucket is only searched while result slots remain */
const BUCKET_ORDER: CatalogSearchBucket[] = [
  "query",
  "quotations",
  "bomCosts",
  "assets",
  "favorites",
];

const EMPTY_RESULTS: ISearchResultItem[] = [];

/** Inside a `true` provider, autocompletes don't auto-load the heavy Query catalog on mount. */
export const DeferQueryCatalogContext = React.createContext(false);

interface UseQuerySearchOptions {
  /** Which field to match: PN prefix, description words, or both */
  searchField: SearchField;
  /** Debounce delay in ms (default 300) */
  debounceMs?: number;
  /** Max results across all buckets (default 8) */
  limit?: number;
  /** Minimum characters before searching (default 2 for PN, 3 for description) */
  minChars?: number;
  /** Skip source loading (e.g. when in read-only mode) */
  skipLoad?: boolean;
  /** Restrict which buckets are searched (default: all) */
  sources?: CatalogSearchBucket[];
}

interface UseQuerySearchReturn {
  query: string;
  setQuery: (q: string) => void;
  /** Flat results in cascade order */
  results: ISearchResultItem[];
  isSearching: boolean;
  /** Query Catalog is still loading from SharePoint */
  isCatalogLoading: boolean;
}

/** PN and/or description search; "both" merges the two unique by PN */
function searchByField(
  field: SearchField,
  byPN: SearchFn,
  byDesc: SearchFn,
  query: string,
  limit: number,
): ISearchResultItem[] {
  if (field === "pn") return byPN(query, limit);
  if (field === "description") return byDesc(query, limit);
  const out: ISearchResultItem[] = [];
  const seen = new Set<string>();
  byPN(query, limit)
    .concat(byDesc(query, limit))
    .forEach((r) => {
      const key = r.pn.toUpperCase();
      if (out.length < limit && !seen.has(key)) {
        seen.add(key);
        out.push(r);
      }
    });
  return out;
}

/** PN-prefix / all-words description match over an in-memory list, unique by PN + description */
function searchList<T>(
  items: T[],
  getPn: (item: T) => string,
  getDesc: (item: T) => string,
  source: ISearchResultItem["source"],
  field: SearchField,
  query: string,
  limit: number,
): ISearchResultItem[] {
  const upper = query.toUpperCase();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const out: ISearchResultItem[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < items.length && out.length < limit; i++) {
    const pn = (getPn(items[i]) || "").trim();
    const desc = (getDesc(items[i]) || "").trim();
    const lowerDesc = desc.toLowerCase();
    const hit =
      (field !== "description" && pn.toUpperCase().indexOf(upper) === 0) ||
      (field !== "pn" && words.every((w) => lowerDesc.indexOf(w) >= 0));
    const key = (pn + "||" + desc).toUpperCase();
    if (hit && !seen.has(key)) {
      seen.add(key);
      out.push({ pn, description: desc, source });
    }
  }
  return out;
}

function searchBucket(
  bucket: CatalogSearchBucket,
  field: SearchField,
  query: string,
  limit: number,
): ISearchResultItem[] {
  switch (bucket) {
    case "query": {
      const catalog = useQueryCatalogStore.getState();
      return searchByField(
        field,
        catalog.searchByPN,
        catalog.searchByDescription,
        query,
        limit,
      );
    }
    case "quotations":
      return searchList(
        useQuotationStore.getState().items,
        (q) => q.partNumber,
        (q) => q.description,
        "QUOTE",
        field,
        query,
        limit,
      );
    case "bomCosts":
      return searchList(
        useBomCostAnalysisStore.getState().items,
        (a) => a.mainPartNumber,
        (a) => a.mainDescription,
        "BOMCOST",
        field,
        query,
        limit,
      );
    case "assets":
      return searchList(
        useAssetCatalogStore.getState().items,
        (a) => a.pn,
        // Same text the Import modal fills in for an asset
        (a) => a.title || a.description,
        "ASSET",
        field,
        query,
        limit,
      );
    default: {
      const fav = useFavoritesStore.getState();
      return searchByField(
        field,
        fav.searchByPN,
        fav.searchByDescription,
        query,
        limit,
      );
    }
  }
}

export function useQuerySearch(
  options: UseQuerySearchOptions,
): UseQuerySearchReturn {
  const { searchField, debounceMs = 300, limit = 8 } = options;
  const skipLoad = options.skipLoad || false;
  const deferQueryCatalog = React.useContext(DeferQueryCatalogContext);
  const minChars = options.minChars || (searchField === "pn" ? 2 : 3);
  // String key so an inline `sources` array doesn't re-run the effects every render
  const sourcesKey = (options.sources || BUCKET_ORDER).join(",");

  const [query, setQuery] = React.useState("");
  const [results, setResults] =
    React.useState<ISearchResultItem[]>(EMPTY_RESULTS);
  const [isSearching, setIsSearching] = React.useState(false);
  const timerRef = React.useRef<any>(null);

  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  // Loaded flags re-run the search once a source arrives
  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const quotationsLoaded = useQuotationStore((s) => s.isLoaded);
  const bomLoaded = useBomCostAnalysisStore((s) => s.isLoaded);
  const assetsLoaded = useAssetCatalogStore((s) => s.isLoaded);
  const favLoaded = useFavoritesStore((s) => s.isLoaded);

  // Lazy-load the searched sources on mount (each store loads only once)
  React.useEffect(() => {
    if (skipLoad) return;
    const active = sourcesKey.split(",");
    if (active.indexOf("query") >= 0 && !deferQueryCatalog)
      useQueryCatalogStore.getState().loadCatalog();
    if (active.indexOf("quotations") >= 0)
      useQuotationStore.getState().loadQuotations();
    if (active.indexOf("bomCosts") >= 0)
      useBomCostAnalysisStore.getState().loadAnalyses();
    if (active.indexOf("assets") >= 0)
      useAssetCatalogStore.getState().loadAssets();
    if (active.indexOf("favorites") >= 0)
      useFavoritesStore.getState().loadFavorites();
  }, [skipLoad, sourcesKey, deferQueryCatalog]);

  // Debounced cascade search
  React.useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const q = query.trim();
    if (q.length < minChars || q.toUpperCase() === "TBD") {
      setResults(EMPTY_RESULTS);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    timerRef.current = setTimeout(() => {
      const active = sourcesKey.split(",");
      const out: ISearchResultItem[] = [];
      BUCKET_ORDER.forEach((bucket) => {
        if (out.length >= limit || active.indexOf(bucket) < 0) return;
        searchBucket(bucket, searchField, q, limit - out.length).forEach((r) =>
          out.push(r),
        );
      });
      setResults(out);
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    query,
    sourcesKey,
    catalogLoaded,
    quotationsLoaded,
    bomLoaded,
    assetsLoaded,
    favLoaded,
  ]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    isCatalogLoading: catalogLoading,
  };
}

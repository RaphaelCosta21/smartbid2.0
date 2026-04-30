/**
 * useQuerySearch — Multi-source debounced search hook.
 * Aggregates results from Query Catalog, Favorites, and BOM sheets.
 * Triggers lazy catalog load on first use.
 */
import * as React from "react";
import { useQueryCatalogStore } from "../stores/useQueryCatalogStore";
import { useFavoritesStore } from "../stores/useFavoritesStore";
import { IMultiSourceResults, ISearchResultItem } from "../models";

const EMPTY_RESULTS: IMultiSourceResults = {
  query: [],
  favorites: [],
  bomCosts: [],
};

interface UseQuerySearchOptions {
  /** Which field to match: PN prefix, description substring, or both */
  searchField: "pn" | "description" | "both";
  /** Debounce delay in ms (default 300) */
  debounceMs?: number;
  /** Max results per source section (default 5) */
  limitPerSource?: number;
  /** Minimum characters before searching (default 2 for PN, 3 for description) */
  minChars?: number;
  /** Skip catalog/favorites loading (e.g. when in read-only mode) */
  skipLoad?: boolean;
}

interface UseQuerySearchReturn {
  query: string;
  setQuery: (q: string) => void;
  results: IMultiSourceResults;
  isSearching: boolean;
  /** Catalog is still loading from SharePoint */
  isCatalogLoading: boolean;
  /** Total result count across all sources */
  totalResults: number;
}

export function useQuerySearch(
  options: UseQuerySearchOptions,
): UseQuerySearchReturn {
  const { searchField, debounceMs = 300, limitPerSource = 5 } = options;
  const minChars = options.minChars || (searchField === "pn" ? 2 : 3);

  const [query, setQuery] = React.useState("");
  const [results, setResults] =
    React.useState<IMultiSourceResults>(EMPTY_RESULTS);
  const [isSearching, setIsSearching] = React.useState(false);
  const timerRef = React.useRef<any>(null);

  // Catalog store
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);
  const searchCatalogByPN = useQueryCatalogStore((s) => s.searchByPN);
  const searchCatalogByDesc = useQueryCatalogStore(
    (s) => s.searchByDescription,
  );

  // Favorites store
  const favLoaded = useFavoritesStore((s) => s.isLoaded);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const searchFavByPN = useFavoritesStore((s) => s.searchByPN);
  const searchFavByDesc = useFavoritesStore((s) => s.searchByDescription);

  // Trigger lazy load on mount (skip if readOnly / skipLoad)
  const skipLoad = options.skipLoad || false;
  React.useEffect(() => {
    if (skipLoad) return;
    if (!catalogLoaded && !catalogLoading) {
      loadCatalog();
    }
    if (!favLoaded) {
      loadFavorites();
    }
  }, [skipLoad]);

  // Debounced search
  React.useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (query.length < minChars) {
      setResults(EMPTY_RESULTS);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    timerRef.current = setTimeout(() => {
      const q = query.trim();

      let queryResults: ISearchResultItem[] = [];
      let favResults: ISearchResultItem[] = [];

      if (searchField === "pn") {
        queryResults = searchCatalogByPN(q, limitPerSource);
        favResults = searchFavByPN(q, limitPerSource);
      } else if (searchField === "description") {
        queryResults = searchCatalogByDesc(q, limitPerSource);
        favResults = searchFavByDesc(q, limitPerSource);
      } else {
        // "both" — merge PN and description results, dedup by pn
        const qPN = searchCatalogByPN(q, limitPerSource);
        const qDesc = searchCatalogByDesc(q, limitPerSource);
        const seen = new Set<string>();
        qPN.forEach((r) => {
          seen.add(r.pn.toUpperCase());
          queryResults.push(r);
        });
        qDesc.forEach((r) => {
          if (!seen.has(r.pn.toUpperCase())) {
            seen.add(r.pn.toUpperCase());
            queryResults.push(r);
          }
        });
        if (queryResults.length > limitPerSource) {
          queryResults = queryResults.slice(0, limitPerSource);
        }

        const fPN = searchFavByPN(q, limitPerSource);
        const fDesc = searchFavByDesc(q, limitPerSource);
        const seenFav = new Set<string>();
        fPN.forEach((r) => {
          seenFav.add(r.pn.toUpperCase());
          favResults.push(r);
        });
        fDesc.forEach((r) => {
          if (!seenFav.has(r.pn.toUpperCase())) {
            seenFav.add(r.pn.toUpperCase());
            favResults.push(r);
          }
        });
        if (favResults.length > limitPerSource) {
          favResults = favResults.slice(0, limitPerSource);
        }
      }

      setResults({
        query: queryResults,
        favorites: favResults,
        bomCosts: [],
      });
      setIsSearching(false);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [query, catalogLoaded, favLoaded]);

  const totalResults =
    results.query.length + results.favorites.length + results.bomCosts.length;

  return {
    query,
    setQuery,
    results,
    isSearching,
    isCatalogLoading: catalogLoading,
    totalResults,
  };
}

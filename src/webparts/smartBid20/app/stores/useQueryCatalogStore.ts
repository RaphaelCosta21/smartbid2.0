/**
 * useQueryCatalogStore — Zustand store for Query Catalog data.
 * Lazy-loads and caches the Queries.xlsx parsed data with prefix indexing
 * for fast PN lookups across 50K+ rows.
 */
import { create } from "zustand";
import { QueryCatalogService } from "../services/QueryCatalogService";
import {
  IQueryCatalogData,
  IActiveRegisteredItem,
  IPeopleSoftFinancialsItem,
  IBomSheetItem,
  ISearchResultItem,
  IBomCostResult,
  IExchangeRate,
} from "../models";

interface QueryCatalogState {
  data: IQueryCatalogData | null;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;

  /** Load catalog from SharePoint (lazy, only once) */
  loadCatalog: () => Promise<void>;

  /** Search by Part Number prefix across Active Registered + PeopleSoft Financials */
  searchByPN: (query: string, limit?: number) => ISearchResultItem[];

  /** Search by description substring */
  searchByDescription: (query: string, limit?: number) => ISearchResultItem[];

  /** Search BOM costs with cascade: BUMBL → BUMBR → Financials */
  searchBomCosts: (
    pn: string,
    exchangeRates?: IExchangeRate[],
  ) => IBomCostResult;

  /** Search BOM sheets only (for autocomplete — PN + description, no costs) */
  searchBomByPN: (query: string, limit?: number) => ISearchResultItem[];

  /** Search BOM sheets by description */
  searchBomByDescription: (
    query: string,
    limit?: number,
  ) => ISearchResultItem[];

  /** Search Active Registered by Manufacturer ID substring */
  searchByMfgId: (query: string, limit?: number) => ISearchResultItem[];

  /** Search Active Registered by Manufacturer Item ID substring */
  searchByMfgItmId: (query: string, limit?: number) => ISearchResultItem[];

  /** Clear cached data (force re-load) */
  clearCache: () => void;
}

// Prefix index maps for O(1) lookups — built on load
let _arPnIndex: Map<string, IActiveRegisteredItem[]> = new Map();
let _psPnIndex: Map<string, IPeopleSoftFinancialsItem[]> = new Map();
let _bumblPnIndex: Map<string, IBomSheetItem[]> = new Map();
let _bumbrPnIndex: Map<string, IBomSheetItem[]> = new Map();

function buildPrefixIndex<T>(
  items: T[],
  getPn: (item: T) => string,
  prefixLen: number,
): Map<string, T[]> {
  const map = new Map<string, T[]>();
  items.forEach((item) => {
    const pn = getPn(item).toUpperCase();
    if (!pn) return;
    const key = pn.substring(0, prefixLen);
    const bucket = map.get(key);
    if (bucket) {
      bucket.push(item);
    } else {
      map.set(key, [item]);
    }
  });
  return map;
}

function searchInPrefixIndex<T>(
  index: Map<string, T[]>,
  query: string,
  getPn: (item: T) => string,
  limit: number,
): T[] {
  const upper = query.toUpperCase();
  const prefix = upper.substring(0, 3);
  const bucket = index.get(prefix);
  if (!bucket) return [];
  const result: T[] = [];
  for (let i = 0; i < bucket.length && result.length < limit; i++) {
    if (getPn(bucket[i]).toUpperCase().indexOf(upper) === 0) {
      result.push(bucket[i]);
    }
  }
  return result;
}

function searchBySubstring<T>(
  items: T[],
  query: string,
  getDesc: (item: T) => string,
  limit: number,
): T[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];
  // Split query into words; every word must appear somewhere in the target
  const words = lower.split(/\s+/);
  const result: T[] = [];
  for (let i = 0; i < items.length && result.length < limit; i++) {
    const desc = getDesc(items[i]).toLowerCase();
    let allMatch = true;
    for (let w = 0; w < words.length; w++) {
      if (desc.indexOf(words[w]) < 0) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) {
      result.push(items[i]);
    }
  }
  return result;
}

export const useQueryCatalogStore = create<QueryCatalogState>((set, get) => ({
  data: null,
  isLoading: false,
  isLoaded: false,
  error: null,

  loadCatalog: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const data = await QueryCatalogService.loadCatalog();

      // Build prefix indexes (3-char key) for fast lookup
      _arPnIndex = buildPrefixIndex(data.activeRegistered, (i) => i.item, 3);
      _psPnIndex = buildPrefixIndex(data.peopleSoftFinancials, (i) => i.pn, 3);
      _bumblPnIndex = buildPrefixIndex(data.bumbl, (i) => i.partNumber, 3);
      _bumbrPnIndex = buildPrefixIndex(data.bumbr, (i) => i.partNumber, 3);

      set({ data, isLoaded: true, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || "Failed to load catalog",
        isLoading: false,
      });
    }
  },

  searchByPN: (query: string, limit: number = 10): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 2) return [];

    const results: ISearchResultItem[] = [];

    // Active Registered first (preferred)
    const arMatches = searchInPrefixIndex(
      _arPnIndex,
      query,
      (i) => i.item,
      limit,
    );
    arMatches.forEach((m) => {
      results.push({
        pn: m.item,
        description: m.longDescr,
        source: "AR",
        mfgId: m.mfgId,
        mfgItmId: m.mfgItmId,
      });
    });

    // PeopleSoft Financials
    const remaining = limit - results.length;
    if (remaining > 0) {
      const psMatches = searchInPrefixIndex(
        _psPnIndex,
        query,
        (i) => i.pn,
        remaining,
      );
      psMatches.forEach((m) => {
        // Avoid duplicates
        if (!results.some((r) => r.pn === m.pn)) {
          results.push({ pn: m.pn, description: m.description, source: "PS" });
        }
      });
    }

    return results;
  },

  searchByDescription: (
    query: string,
    limit: number = 10,
  ): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 3) return [];

    const results: ISearchResultItem[] = [];

    // Active Registered first
    const arMatches = searchBySubstring(
      data.activeRegistered,
      query,
      (i) => i.longDescr,
      limit,
    );
    arMatches.forEach((m) => {
      results.push({
        pn: m.item,
        description: m.longDescr,
        source: "AR",
        mfgId: m.mfgId,
        mfgItmId: m.mfgItmId,
      });
    });

    // PeopleSoft Financials
    const remaining = limit - results.length;
    if (remaining > 0) {
      const psMatches = searchBySubstring(
        data.peopleSoftFinancials,
        query,
        (i) => i.description,
        remaining,
      );
      psMatches.forEach((m) => {
        if (!results.some((r) => r.pn === m.pn)) {
          results.push({ pn: m.pn, description: m.description, source: "PS" });
        }
      });
    }

    return results;
  },

  searchBomCosts: (
    pn: string,
    exchangeRates?: IExchangeRate[],
  ): IBomCostResult => {
    const data = get().data;
    const notFound: IBomCostResult = {
      partNumber: pn,
      description: "",
      businessUnit: "",
      costPerItem: 0,
      currency: "USD",
      costPerItemUSD: 0,
      dataReference: "",
      leadTimeDays: 0,
      sourceTab: "BUMBL",
      found: false,
    };
    if (!data) return notFound;

    const upperPN = pn.toUpperCase().trim();

    // Cascade: BUMBL → BUMBR → Financials
    // 1. BUMBL
    const bumblMatch = data.bumbl.find(
      (i) => i.partNumber.toUpperCase().trim() === upperPN,
    );
    if (bumblMatch) {
      return {
        partNumber: bumblMatch.partNumber,
        description: bumblMatch.description,
        businessUnit: bumblMatch.businessUnit,
        costPerItem: bumblMatch.costPerItem,
        currency: "BRL",
        costPerItemUSD: bumblMatch.costPerItem, // BOM sheets already in local currency
        dataReference: bumblMatch.dataReference,
        leadTimeDays: bumblMatch.leadTimeDays,
        sourceTab: "BUMBL",
        found: true,
      };
    }

    // 2. BUMBR
    const bumbrMatch = data.bumbr.find(
      (i) => i.partNumber.toUpperCase().trim() === upperPN,
    );
    if (bumbrMatch) {
      return {
        partNumber: bumbrMatch.partNumber,
        description: bumbrMatch.description,
        businessUnit: bumbrMatch.businessUnit,
        costPerItem: bumbrMatch.costPerItem,
        currency: "BRL",
        costPerItemUSD: bumbrMatch.costPerItem,
        dataReference: bumbrMatch.dataReference,
        leadTimeDays: bumbrMatch.leadTimeDays,
        sourceTab: "BUMBR",
        found: true,
      };
    }

    // 3. Financials — find ALL matches across BUs, pick most recent Last Order Date
    const finMatches = data.peopleSoftFinancials.filter(
      (i) => i.pn.toUpperCase().trim() === upperPN,
    );
    let finMatch: IPeopleSoftFinancialsItem | undefined;
    if (finMatches.length === 1) {
      finMatch = finMatches[0];
    } else if (finMatches.length > 1) {
      finMatch = finMatches.reduce((best, cur) => {
        const bestTime = best.lastOrderDate
          ? new Date(best.lastOrderDate).getTime()
          : 0;
        const curTime = cur.lastOrderDate
          ? new Date(cur.lastOrderDate).getTime()
          : 0;
        return curTime > bestTime ? cur : best;
      });
    }
    if (finMatch) {
      let costUSD = finMatch.originalPrice;
      const cur = finMatch.currency || "USD";
      if (cur !== "USD" && exchangeRates) {
        const rate = exchangeRates.find(
          (r) => r.currency.toUpperCase() === cur,
        );
        if (rate && rate.rate > 0) {
          costUSD = finMatch.originalPrice / rate.rate;
        }
      }
      return {
        partNumber: finMatch.pn,
        description: finMatch.description,
        businessUnit: finMatch.businessUnit,
        costPerItem: finMatch.originalPrice,
        currency: cur,
        costPerItemUSD: costUSD,
        dataReference: finMatch.lastOrderDate,
        leadTimeDays: finMatch.leadTimeDays,
        sourceTab: "Financials",
        found: true,
      };
    }

    return notFound;
  },

  searchBomByPN: (query: string, limit: number = 5): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 2) return [];
    const results: ISearchResultItem[] = [];

    const bumblMatches = searchInPrefixIndex(
      _bumblPnIndex,
      query,
      (i) => i.partNumber,
      limit,
    );
    bumblMatches.forEach((m) => {
      results.push({
        pn: m.partNumber,
        description: m.description,
        source: "BUMBL",
      });
    });

    const r2 = limit - results.length;
    if (r2 > 0) {
      const bumbrMatches = searchInPrefixIndex(
        _bumbrPnIndex,
        query,
        (i) => i.partNumber,
        r2,
      );
      bumbrMatches.forEach((m) => {
        if (!results.some((r) => r.pn === m.partNumber)) {
          results.push({
            pn: m.partNumber,
            description: m.description,
            source: "BUMBR",
          });
        }
      });
    }

    const r3 = limit - results.length;
    if (r3 > 0) {
      const psMatches = searchInPrefixIndex(_psPnIndex, query, (i) => i.pn, r3);
      psMatches.forEach((m) => {
        if (!results.some((r) => r.pn === m.pn)) {
          results.push({
            pn: m.pn,
            description: m.description,
            source: "FIN",
          });
        }
      });
    }

    return results;
  },

  searchBomByDescription: (
    query: string,
    limit: number = 5,
  ): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 3) return [];
    const results: ISearchResultItem[] = [];

    const b1 = searchBySubstring(
      data.bumbl,
      query,
      (i) => i.description,
      limit,
    );
    b1.forEach((m) => {
      results.push({
        pn: m.partNumber,
        description: m.description,
        source: "BUMBL",
      });
    });

    const r2 = limit - results.length;
    if (r2 > 0) {
      const b2 = searchBySubstring(data.bumbr, query, (i) => i.description, r2);
      b2.forEach((m) => {
        if (!results.some((r) => r.pn === m.partNumber)) {
          results.push({
            pn: m.partNumber,
            description: m.description,
            source: "BUMBR",
          });
        }
      });
    }

    return results;
  },

  searchByMfgId: (query: string, limit: number = 10): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 2) return [];
    const matches = searchBySubstring(
      data.activeRegistered,
      query,
      (i) => i.mfgId || "",
      limit,
    );
    const results: ISearchResultItem[] = [];
    matches.forEach((m) => {
      results.push({
        pn: m.item,
        description: m.longDescr,
        source: "AR",
        mfgId: m.mfgId,
        mfgItmId: m.mfgItmId,
      });
    });
    return results;
  },

  searchByMfgItmId: (
    query: string,
    limit: number = 10,
  ): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 2) return [];
    const matches = searchBySubstring(
      data.activeRegistered,
      query,
      (i) => i.mfgItmId || "",
      limit,
    );
    const results: ISearchResultItem[] = [];
    matches.forEach((m) => {
      results.push({
        pn: m.item,
        description: m.longDescr,
        source: "AR",
        mfgId: m.mfgId,
        mfgItmId: m.mfgItmId,
      });
    });
    return results;
  },

  clearCache: () => {
    _arPnIndex = new Map();
    _psPnIndex = new Map();
    _bumblPnIndex = new Map();
    _bumbrPnIndex = new Map();
    set({ data: null, isLoaded: false, isLoading: false, error: null });
  },
}));

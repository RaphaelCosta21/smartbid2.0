import { create } from "zustand";
import {
  IQuotationItem,
  ISurveyCatalog,
  ISurveyPackageLine,
  ISurveySpread,
} from "../models";
import { SurveyCatalogService } from "../services/SurveyCatalogService";
import { QuotationService } from "../services/QuotationService";

export interface SurveyFilters {
  search: string;
  division: string;
  serviceLine: string;
  status: string;
  familyId: string;
}

const DEFAULT_FILTERS: SurveyFilters = {
  search: "",
  division: "",
  serviceLine: "",
  status: "",
  familyId: "",
};

interface SurveyState {
  catalog: ISurveyCatalog | null;
  listMissing: boolean;
  isLoading: boolean;
  error: string | null;
  quotations: IQuotationItem[];
  quotationsLoaded: boolean;
  filters: SurveyFilters;
  selectedEquipmentId: string | null;
  packageLines: ISurveyPackageLine[];
  /** Package handed to CreateRequestPage; cleared after the request is submitted. */
  requestPrefill: ISurveyPackageLine[] | null;

  load: (force?: boolean) => Promise<void>;
  loadQuotations: () => Promise<void>;
  setFilters: (filters: Partial<SurveyFilters>) => void;
  resetFilters: () => void;
  selectEquipment: (id: string | null) => void;
  addToPackage: (equipmentId: string, qty: number) => void;
  /** Adds every line of a spread template; returns how many lines were added. */
  addSpreadToPackage: (spread: ISurveySpread) => number;
  setPackageQty: (equipmentId: string, qty: number) => void;
  removeFromPackage: (equipmentId: string) => void;
  clearPackage: () => void;
  startRequestFromPackage: () => void;
  clearRequestPrefill: () => void;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  catalog: null,
  listMissing: false,
  isLoading: false,
  error: null,
  quotations: [],
  quotationsLoaded: false,
  filters: DEFAULT_FILTERS,
  selectedEquipmentId: null,
  packageLines: [],
  requestPrefill: null,

  load: async (force) => {
    if (get().isLoading || (get().catalog && !force)) return;
    set({ isLoading: true, error: null });
    try {
      const catalog = await SurveyCatalogService.getAll();
      set({
        catalog: catalog || { families: [], equipment: [], systems: [], spreads: [] },
        listMissing: catalog === null,
        filters:
          catalog && !get().filters.familyId && catalog.families.length > 0
            ? { ...get().filters, familyId: catalog.families[0].id }
            : get().filters,
      });
    } catch (err) {
      console.error("Survey catalog load failed:", err);
      set({ error: "Could not load the survey catalog." });
    } finally {
      set({ isLoading: false });
    }
  },

  loadQuotations: async () => {
    if (get().quotationsLoaded) return;
    set({ quotationsLoaded: true });
    try {
      set({ quotations: await QuotationService.getAll() });
    } catch (err) {
      console.warn("Survey Bid Intel: quotations unavailable", err);
    }
  },

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () =>
    set((state) => ({
      filters: { ...DEFAULT_FILTERS, familyId: state.filters.familyId },
    })),
  selectEquipment: (id) => set({ selectedEquipmentId: id }),

  addToPackage: (equipmentId, qty) =>
    set((state) => {
      const exists = state.packageLines.some(
        (l) => l.equipmentId === equipmentId,
      );
      return {
        packageLines: exists
          ? state.packageLines.map((l) =>
              l.equipmentId === equipmentId ? { ...l, qty: l.qty + qty } : l,
            )
          : [...state.packageLines, { equipmentId, qty }],
      };
    }),
  addSpreadToPackage: (spread) => {
    const known = get().catalog?.equipment || [];
    const lines: ISurveyPackageLine[] = [];
    spread.zones.forEach((zone) =>
      zone.lines.forEach((l) => {
        if (known.some((e) => e.id === l.equipmentId)) {
          lines.push({ ...l, spreadId: spread.id });
        }
      }),
    );
    set((state) => {
      const next = state.packageLines.slice();
      lines.forEach((line) => {
        const i = next.findIndex((l) => l.equipmentId === line.equipmentId);
        if (i >= 0) next[i] = { ...next[i], qty: next[i].qty + line.qty };
        else next.push(line);
      });
      return { packageLines: next };
    });
    return lines.length;
  },
  setPackageQty: (equipmentId, qty) =>
    set((state) => ({
      packageLines: state.packageLines.map((l) =>
        l.equipmentId === equipmentId ? { ...l, qty: Math.max(1, qty) } : l,
      ),
    })),
  removeFromPackage: (equipmentId) =>
    set((state) => ({
      packageLines: state.packageLines.filter(
        (l) => l.equipmentId !== equipmentId,
      ),
    })),
  clearPackage: () => set({ packageLines: [] }),
  startRequestFromPackage: () =>
    set((state) => ({ requestPrefill: state.packageLines.slice() })),
  clearRequestPrefill: () => set({ requestPrefill: null }),
}));

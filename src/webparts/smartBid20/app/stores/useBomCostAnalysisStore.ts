/**
 * useBomCostAnalysisStore — Zustand store caching saved BOM Cost Analyses.
 * Lazy-loads from the smartbid-config list once per session.
 */
import { create } from "zustand";
import { BomCostAnalysisService } from "../services/BomCostAnalysisService";
import { IBomCostAnalysis } from "../models";

interface BomCostAnalysisState {
  items: IBomCostAnalysis[];
  isLoading: boolean;
  isLoaded: boolean;

  /** Load analyses from SharePoint (lazy, once) */
  loadAnalyses: () => Promise<void>;
}

export const useBomCostAnalysisStore = create<BomCostAnalysisState>(
  (set, get) => ({
    items: [],
    isLoading: false,
    isLoaded: false,

    loadAnalyses: async () => {
      if (get().isLoaded || get().isLoading) return;
      set({ isLoading: true });
      const items = await BomCostAnalysisService.getAll();
      set({ items, isLoaded: true, isLoading: false });
    },
  }),
);

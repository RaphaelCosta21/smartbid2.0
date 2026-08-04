/**
 * useErnStore — caches ERNs loaded from SharePoint (Engineering Requestt).
 */
import { create } from "zustand";
import { IErn } from "../models";
import { ErnService } from "../services/ErnService";

interface ErnState {
  erns: IErn[];
  isLoading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
  getByTitle: (title: string) => Promise<IErn | null>;
}

export const useErnStore = create<ErnState>((set, get) => ({
  erns: [],
  isLoading: false,
  error: null,

  loadAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const erns = await ErnService.getAll();
      set({ erns, isLoading: false });
    } catch (err) {
      console.error("useErnStore.loadAll failed", err);
      set({ isLoading: false, error: "Failed to load ERNs" });
    }
  },

  getByTitle: async (title: string) => {
    const cached = get().erns.find((e) => e.title === title);
    if (cached) return cached;
    try {
      return await ErnService.getByTitle(title);
    } catch (err) {
      console.error("useErnStore.getByTitle failed", err);
      return null;
    }
  },
}));

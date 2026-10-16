/**
 * useAssetCatalogStore — Zustand store caching the Assets Catalog list.
 * Lazy-loads from SharePoint once per session.
 */
import { create } from "zustand";
import { AssetCatalogService } from "../services/AssetCatalogService";
import { IAssetCatalogItem } from "../models/IAssetCatalog";

interface AssetCatalogState {
  items: IAssetCatalogItem[];
  isLoading: boolean;
  isLoaded: boolean;

  /** Load assets from SharePoint (lazy, once) */
  loadAssets: () => Promise<void>;
}

export const useAssetCatalogStore = create<AssetCatalogState>((set, get) => ({
  items: [],
  isLoading: false,
  isLoaded: false,

  loadAssets: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await AssetCatalogService.getAll();
      set({ items, isLoaded: true, isLoading: false });
    } catch (err) {
      console.error("Failed to load assets catalog:", err);
      set({ isLoading: false });
    }
  },
}));

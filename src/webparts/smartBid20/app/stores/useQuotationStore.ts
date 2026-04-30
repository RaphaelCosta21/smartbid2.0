/**
 * useQuotationStore — Zustand store for Quotation catalog management.
 * Lazy-loads from smartbid-quotations SharePoint list.
 */
import { create } from "zustand";
import { QuotationService } from "../services/QuotationService";
import { FavoritesService } from "../services/FavoritesService";
import { IQuotationItem, IFavoriteEquipment } from "../models";

interface QuotationState {
  items: IQuotationItem[];
  isLoading: boolean;
  isLoaded: boolean;

  /** Load quotations from SharePoint (lazy, once) */
  loadQuotations: () => Promise<void>;

  /** Force reload from SharePoint */
  refreshQuotations: () => Promise<void>;

  /** Add one or more new quotation items */
  addItems: (items: IQuotationItem[]) => Promise<void>;

  /** Update a single quotation item */
  updateItem: (item: IQuotationItem) => Promise<void>;

  /** Delete a single quotation item by ID */
  deleteItem: (id: string) => Promise<void>;

  /** Toggle favorite status — also syncs with FavoritesService */
  toggleFavorite: (id: string, userName: string) => Promise<void>;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

export const useQuotationStore = create<QuotationState>((set, get) => ({
  items: [],
  isLoading: false,
  isLoaded: false,

  loadQuotations: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const items = await QuotationService.getAll();
      set({ items, isLoaded: true, isLoading: false });
    } catch (err) {
      console.error("Failed to load quotations:", err);
      set({ isLoading: false });
    }
  },

  refreshQuotations: async () => {
    set({ isLoading: true });
    try {
      const items = await QuotationService.getAll();
      set({ items, isLoaded: true, isLoading: false });
    } catch (err) {
      console.error("Failed to refresh quotations:", err);
      set({ isLoading: false });
    }
  },

  addItems: async (newItems: IQuotationItem[]) => {
    const current = get().items;
    const updated = current.concat(newItems);
    set({ items: updated });
    try {
      await QuotationService.save(updated);
    } catch (err) {
      // Rollback on failure
      set({ items: current });
      throw err;
    }
  },

  updateItem: async (item: IQuotationItem) => {
    const current = get().items;
    const idx = current.findIndex((q) => q.id === item.id);
    if (idx < 0) return;
    const updated = current.slice();
    updated[idx] = item;
    set({ items: updated });
    try {
      await QuotationService.save(updated);
    } catch (err) {
      set({ items: current });
      throw err;
    }
  },

  deleteItem: async (id: string) => {
    const current = get().items;
    const updated = current.filter((q) => q.id !== id);
    set({ items: updated });
    try {
      await QuotationService.save(updated);
    } catch (err) {
      set({ items: current });
      throw err;
    }
  },

  toggleFavorite: async (id: string, userName: string) => {
    const current = get().items;
    const idx = current.findIndex((q) => q.id === id);
    if (idx < 0) return;

    const item = current[idx];
    const newFav = !item.isFavorite;
    const updated = current.slice();
    updated[idx] = {
      ...item,
      isFavorite: newFav,
      lastModified: new Date().toISOString(),
    };
    set({ items: updated });

    try {
      await QuotationService.save(updated);

      if (newFav) {
        // Add to Favorites catalog with dataSource = "quotation"
        const favEquipment: IFavoriteEquipment = {
          id: generateId(),
          groupId: item.groupId,
          subGroupId: item.subGroupId,
          partNumber: item.partNumber,
          description: item.description,
          pictureUrl: "",
          notes: item.notes || "",
          dataSource: "quotation",
          costUSD: item.costUSD,
          costReference: item.supplier,
          leadTimeDays: item.leadTimeDays,
          originalCurrency: item.currency,
          originalCost: item.cost,
          createdBy: userName,
          createdDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };
        await FavoritesService.addEquipment(favEquipment);
      }
    } catch (err) {
      // Rollback on failure
      set({ items: current });
      throw err;
    }
  },
}));

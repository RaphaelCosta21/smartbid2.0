/**
 * useFavoritesStore — Zustand store for Favorites (BID + Equipment catalog).
 * Lazy-loads from SharePoint config list.
 */
import { create } from "zustand";
import { FavoritesService } from "../services/FavoritesService";
import { getDefaultFavoriteGroups } from "../config/defaultFavoriteGroups";
import {
  IFavoritesData,
  IFavoriteEquipment,
  IFavoriteBid,
  IFavoriteGroup,
  IFavoriteSubGroup,
  ISearchResultItem,
} from "../models";

interface FavoritesState {
  data: IFavoritesData | null;
  isLoading: boolean;
  isLoaded: boolean;

  /** Load favorites from SharePoint (lazy, once) */
  loadFavorites: () => Promise<void>;

  // Equipment CRUD
  addEquipment: (item: IFavoriteEquipment) => Promise<void>;
  removeEquipment: (id: string) => Promise<void>;
  updateEquipment: (item: IFavoriteEquipment) => Promise<void>;

  // BID favorites
  toggleBidFavorite: (bidNumber: string, userName: string) => Promise<void>;
  isBidFavorite: (bidNumber: string) => boolean;

  // Group management
  addGroup: (name: string) => Promise<void>;
  addSubGroup: (groupId: string, name: string) => Promise<void>;
  removeGroup: (groupId: string) => Promise<void>;
  removeSubGroup: (groupId: string, subGroupId: string) => Promise<void>;
  renameGroup: (groupId: string, newName: string) => Promise<void>;
  renameSubGroup: (
    groupId: string,
    subGroupId: string,
    newName: string,
  ) => Promise<void>;
  updateGroups: (groups: IFavoriteGroup[]) => Promise<void>;

  // Counts (for delete protection)
  getGroupItemCount: (groupId: string) => number;
  getSubGroupItemCount: (subGroupId: string) => number;

  // Queries
  getEquipmentByGroup: (
    groupId: string,
    subGroupId?: string,
  ) => IFavoriteEquipment[];

  /** Search equipment by PN prefix */
  searchByPN: (query: string, limit?: number) => ISearchResultItem[];

  /** Search equipment by description */
  searchByDescription: (query: string, limit?: number) => ISearchResultItem[];
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  data: null,
  isLoading: false,
  isLoaded: false,

  loadFavorites: async () => {
    if (get().isLoaded || get().isLoading) return;
    set({ isLoading: true });
    try {
      const data = await FavoritesService.getAll();
      // Seed default groups on first load if no groups exist
      if (data.groups.length === 0) {
        data.groups = getDefaultFavoriteGroups();
        await FavoritesService.save(data);
      }
      set({ data, isLoaded: true, isLoading: false });
    } catch {
      const seeded: IFavoritesData = {
        groups: getDefaultFavoriteGroups(),
        equipment: [],
        bids: [],
      };
      set({
        data: seeded,
        isLoaded: true,
        isLoading: false,
      });
    }
  },

  addEquipment: async (item: IFavoriteEquipment) => {
    const data = get().data;
    if (!data) return;
    const updated: IFavoritesData = {
      ...data,
      equipment: [...data.equipment, item],
    };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  removeEquipment: async (id: string) => {
    const data = get().data;
    if (!data) return;
    const updated: IFavoritesData = {
      ...data,
      equipment: data.equipment.filter((e) => e.id !== id),
    };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  updateEquipment: async (item: IFavoriteEquipment) => {
    const data = get().data;
    if (!data) return;
    const eqList = data.equipment.map((e) => (e.id === item.id ? item : e));
    const updated: IFavoritesData = { ...data, equipment: eqList };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  toggleBidFavorite: async (bidNumber: string, userName: string) => {
    const data = get().data;
    if (!data) return;
    const exists = data.bids.some((b) => b.bidNumber === bidNumber);
    let updatedBids: IFavoriteBid[];
    if (exists) {
      updatedBids = data.bids.filter((b) => b.bidNumber !== bidNumber);
    } else {
      updatedBids = [
        ...data.bids,
        { bidNumber, addedBy: userName, addedDate: new Date().toISOString() },
      ];
    }
    const updated: IFavoritesData = { ...data, bids: updatedBids };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  isBidFavorite: (bidNumber: string): boolean => {
    const data = get().data;
    if (!data) return false;
    return data.bids.some((b) => b.bidNumber === bidNumber);
  },

  addGroup: async (name: string) => {
    const data = get().data;
    if (!data) return;
    const newGroup: IFavoriteGroup = {
      id: generateId(),
      name,
      subGroups: [],
    };
    const updated: IFavoritesData = {
      ...data,
      groups: [...data.groups, newGroup],
    };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  addSubGroup: async (groupId: string, name: string) => {
    const data = get().data;
    if (!data) return;
    const newSub: IFavoriteSubGroup = {
      id: generateId(),
      name,
      groupId,
    };
    const groups = data.groups.map((g) => {
      if (g.id === groupId) {
        return { ...g, subGroups: [...g.subGroups, newSub] };
      }
      return g;
    });
    const updated: IFavoritesData = { ...data, groups };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  removeGroup: async (groupId: string) => {
    const data = get().data;
    if (!data) return;
    // Block deletion if equipment exists in this group
    const itemCount = data.equipment.filter(
      (e) => e.groupId === groupId,
    ).length;
    if (itemCount > 0) {
      throw new Error(
        `Cannot delete group — ${itemCount} item(s) are assigned to it. Remove items first.`,
      );
    }
    const updated: IFavoritesData = {
      ...data,
      groups: data.groups.filter((g) => g.id !== groupId),
    };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  removeSubGroup: async (groupId: string, subGroupId: string) => {
    const data = get().data;
    if (!data) return;
    // Block deletion if equipment exists in this sub-group
    const itemCount = data.equipment.filter(
      (e) => e.subGroupId === subGroupId,
    ).length;
    if (itemCount > 0) {
      throw new Error(
        `Cannot delete sub-group — ${itemCount} item(s) are assigned to it. Remove items first.`,
      );
    }
    const groups = data.groups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          subGroups: g.subGroups.filter((sg) => sg.id !== subGroupId),
        };
      }
      return g;
    });
    const updated: IFavoritesData = { ...data, groups };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  renameGroup: async (groupId: string, newName: string) => {
    const data = get().data;
    if (!data) return;
    const groups = data.groups.map((g) =>
      g.id === groupId ? { ...g, name: newName } : g,
    );
    const updated: IFavoritesData = { ...data, groups };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  renameSubGroup: async (
    groupId: string,
    subGroupId: string,
    newName: string,
  ) => {
    const data = get().data;
    if (!data) return;
    const groups = data.groups.map((g) => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        subGroups: g.subGroups.map((sg) =>
          sg.id === subGroupId ? { ...sg, name: newName } : sg,
        ),
      };
    });
    const updated: IFavoritesData = { ...data, groups };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  updateGroups: async (groups: IFavoriteGroup[]) => {
    const data = get().data;
    if (!data) return;
    const updated: IFavoritesData = { ...data, groups };
    set({ data: updated });
    await FavoritesService.save(updated);
  },

  getGroupItemCount: (groupId: string): number => {
    const data = get().data;
    if (!data) return 0;
    return data.equipment.filter((e) => e.groupId === groupId).length;
  },

  getSubGroupItemCount: (subGroupId: string): number => {
    const data = get().data;
    if (!data) return 0;
    return data.equipment.filter((e) => e.subGroupId === subGroupId).length;
  },

  getEquipmentByGroup: (
    groupId: string,
    subGroupId?: string,
  ): IFavoriteEquipment[] => {
    const data = get().data;
    if (!data) return [];
    return data.equipment.filter((e) => {
      if (e.groupId !== groupId) return false;
      if (subGroupId && e.subGroupId !== subGroupId) return false;
      return true;
    });
  },

  searchByPN: (query: string, limit: number = 5): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 2) return [];
    const upper = query.toUpperCase();
    const results: ISearchResultItem[] = [];
    for (let i = 0; i < data.equipment.length && results.length < limit; i++) {
      const eq = data.equipment[i];
      if (eq.partNumber.toUpperCase().indexOf(upper) === 0) {
        results.push({
          pn: eq.partNumber,
          description: eq.description,
          source: "FAV",
        });
      }
    }
    return results;
  },

  searchByDescription: (
    query: string,
    limit: number = 5,
  ): ISearchResultItem[] => {
    const data = get().data;
    if (!data || query.length < 3) return [];
    const words = query.toLowerCase().trim().split(/\s+/);
    const results: ISearchResultItem[] = [];
    for (let i = 0; i < data.equipment.length && results.length < limit; i++) {
      const eq = data.equipment[i];
      const desc = eq.description.toLowerCase();
      let allMatch = true;
      for (let w = 0; w < words.length; w++) {
        if (desc.indexOf(words[w]) < 0) {
          allMatch = false;
          break;
        }
      }
      if (allMatch) {
        results.push({
          pn: eq.partNumber,
          description: eq.description,
          source: "FAV",
        });
      }
    }
    return results;
  },
}));

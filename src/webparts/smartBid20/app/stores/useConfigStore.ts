/**
 * useConfigStore — System config cache (Zustand).
 */
import { create } from "zustand";
import { ISystemConfig } from "../models";
import { SystemConfigService } from "../services/SystemConfigService";

interface ConfigState {
  config: ISystemConfig | null;
  isLoaded: boolean;
  isLoading: boolean;
  /** Initial load failed; access checks fall back to the built-in defaults. */
  loadFailed: boolean;

  setConfig: (config: ISystemConfig) => void;
  setLoading: (loading: boolean) => void;
  setLoadFailed: () => void;
  clearConfig: () => void;
  refreshConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  isLoaded: false,
  isLoading: false,
  loadFailed: false,

  setConfig: (config) =>
    set({ config, isLoaded: true, isLoading: false, loadFailed: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  setLoadFailed: () => set({ loadFailed: true, isLoading: false }),
  clearConfig: () => set({ config: null, isLoaded: false }),

  refreshConfig: async () => {
    set({ isLoading: true });
    try {
      SystemConfigService.clearCache();
      const config = await SystemConfigService.get();
      set({ config, isLoaded: true, isLoading: false });
    } catch (err) {
      console.error("Failed to refresh config:", err);
      set({ isLoading: false });
    }
  },
}));

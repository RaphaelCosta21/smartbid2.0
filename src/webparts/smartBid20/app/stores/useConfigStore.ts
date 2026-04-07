/**
 * useConfigStore — System config cache (Zustand).
 */
import { create } from "zustand";
import { ISystemConfig } from "../models";

interface ConfigState {
  config: ISystemConfig | null;
  isLoaded: boolean;
  isLoading: boolean;

  setConfig: (config: ISystemConfig) => void;
  setLoading: (loading: boolean) => void;
  clearConfig: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  config: null,
  isLoaded: false,
  isLoading: false,

  setConfig: (config) => set({ config, isLoaded: true, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearConfig: () => set({ config: null, isLoaded: false }),
}));

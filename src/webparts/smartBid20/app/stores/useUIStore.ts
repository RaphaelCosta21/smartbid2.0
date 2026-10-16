import { create } from "zustand";
import {
  ColorThemeId,
  DEFAULT_COLOR_THEME,
} from "../config/colorThemes.config";

export type ThemeMode = "dark" | "light";

/** Engineering Dashboard tabs */
export type DashboardView = "live" | "engineering";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
}

interface UIState {
  theme: ThemeMode;
  colorTheme: ColorThemeId;
  sidebarExpanded: boolean;
  sidebarMobileOpen: boolean;
  commandPaletteOpen: boolean;
  activeRoute: string;
  toasts: Toast[];
  dashboardView: DashboardView;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setColorTheme: (colorTheme: ColorThemeId) => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveRoute: (route: string) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
  setDashboardView: (view: DashboardView) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "light",
  colorTheme: DEFAULT_COLOR_THEME,
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  commandPaletteOpen: false,
  activeRoute: "/",
  toasts: [],
  dashboardView: "live",

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setColorTheme: (colorTheme) => set({ colorTheme }),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        },
      ],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  setDashboardView: (dashboardView) => set({ dashboardView }),
}));

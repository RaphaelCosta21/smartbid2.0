import { create } from "zustand";

export type ThemeMode = "dark" | "light";

interface UIState {
  theme: ThemeMode;
  sidebarExpanded: boolean;
  sidebarMobileOpen: boolean;
  commandPaletteOpen: boolean;
  activeRoute: string;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveRoute: (route: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  commandPaletteOpen: false,
  activeRoute: "/",

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setActiveRoute: (route) => set({ activeRoute: route }),
}));

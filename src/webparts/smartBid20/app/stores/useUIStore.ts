import { create } from "zustand";

export type ThemeMode = "dark" | "light";

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: "success" | "error" | "warning" | "info";
}

interface UIState {
  theme: ThemeMode;
  sidebarExpanded: boolean;
  sidebarMobileOpen: boolean;
  commandPaletteOpen: boolean;
  activeRoute: string;
  toasts: Toast[];

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setSidebarMobileOpen: (open: boolean) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setActiveRoute: (route: string) => void;
  addToast: (toast: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: "dark",
  sidebarExpanded: true,
  sidebarMobileOpen: false,
  commandPaletteOpen: false,
  activeRoute: "/",
  toasts: [],

  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () =>
    set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarMobileOpen: (open) => set({ sidebarMobileOpen: open }),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  setActiveRoute: (route) => set({ activeRoute: route }),
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

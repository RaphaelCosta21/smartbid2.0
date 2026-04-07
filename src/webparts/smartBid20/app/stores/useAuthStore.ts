import { create } from "zustand";
import { IUser, UserRole } from "../models";

const DEFAULT_USER: IUser = {
  id: "user-001",
  displayName: "Raphael Costa",
  email: "rcosta@oceaneering.com",
  jobTitle: "Engineering Manager",
  department: "Engineering",
  role: "manager",
  teamCategory: "manager",
  division: "SSR-ROV",
  isActive: true,
  isSuperAdmin: true,
};

interface AuthState {
  currentUser: IUser;
  isGuestUser: boolean;
  isLoading: boolean;

  setCurrentUser: (user: IUser) => void;
  setGuestMode: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  hasAccess: (section: string, level: "view" | "edit") => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: DEFAULT_USER,
  isGuestUser: false,
  isLoading: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setGuestMode: (isGuest) =>
    set({
      isGuestUser: isGuest,
      currentUser: isGuest
        ? {
            ...DEFAULT_USER,
            id: "guest",
            displayName: "Guest User",
            email: "",
            role: "guest",
            isSuperAdmin: false,
          }
        : DEFAULT_USER,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  hasAccess: (section: string, level: "view" | "edit") => {
    const { currentUser, isGuestUser } = get();
    if (isGuestUser) return level === "view" && section === "workspace";
    if (currentUser.isSuperAdmin) return true;

    const accessMap: Record<UserRole, Record<string, string>> = {
      manager: {
        workspace: "edit",
        insights: "edit",
        reports: "edit",
        settings: "edit",
        approvals: "edit",
        templates: "edit",
      },
      engineer: {
        workspace: "edit",
        insights: "view",
        reports: "view",
        settings: "none",
        approvals: "view",
        templates: "edit",
      },
      bidder: {
        workspace: "edit",
        insights: "view",
        reports: "view",
        settings: "none",
        approvals: "view",
        templates: "view",
      },
      projectTeam: {
        workspace: "view",
        insights: "view",
        reports: "view",
        settings: "none",
        approvals: "edit",
        templates: "none",
      },
      viewer: {
        workspace: "view",
        insights: "view",
        reports: "view",
        settings: "none",
        approvals: "none",
        templates: "none",
      },
      guest: {
        workspace: "view",
        insights: "none",
        reports: "none",
        settings: "none",
        approvals: "none",
        templates: "none",
      },
    };

    const userAccess = accessMap[currentUser.role]?.[section] ?? "none";
    if (level === "view") return userAccess === "view" || userAccess === "edit";
    return userAccess === "edit";
  },
}));

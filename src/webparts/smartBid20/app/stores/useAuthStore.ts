import { create } from "zustand";
import { IUser } from "../models";
import {
  hasAccess as checkAccess,
  isSuperAdmin as checkSuperAdmin,
} from "../utils/accessControl";

const DEFAULT_USER: IUser = {
  id: "user-001",
  displayName: "Raphael Costa",
  email: "rcosta@oceaneering.com",
  jobTitle: "Engineering Manager",
  department: "Engineering",
  role: "engineering",
  teamCategory: "engineering",
  sector: "engineering",
  businessLines: ["SURVEY", "ROV"],
  bidRole: "contributor",
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
    if (currentUser.isSuperAdmin || checkSuperAdmin(currentUser.email))
      return true;
    return checkAccess(currentUser.role, section as any, level);
  },
}));

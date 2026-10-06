import { create } from "zustand";
import { IUser } from "../models";

// Placeholder until AppLayout resolves the signed-in user; never privileged.
const DEFAULT_USER: IUser = {
  id: "",
  displayName: "",
  email: "",
  jobTitle: "",
  department: "",
  role: "guest",
  teamCategory: "guest",
  isActive: true,
  isSuperAdmin: false,
};

interface AuthState {
  currentUser: IUser;
  isGuestUser: boolean;
  isLoading: boolean;
  /** True once the signed-in user (and their team) has been resolved, even if it failed. */
  isResolved: boolean;

  setCurrentUser: (user: IUser) => void;
  setGuestMode: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: DEFAULT_USER,
  isGuestUser: false,
  isLoading: false,
  isResolved: false,

  setCurrentUser: (user) => set({ currentUser: user, isResolved: true }),
  setGuestMode: (isGuest) =>
    set({
      isGuestUser: isGuest,
      currentUser: isGuest
        ? {
            ...DEFAULT_USER,
            id: "guest",
            displayName: "Guest User",
          }
        : DEFAULT_USER,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

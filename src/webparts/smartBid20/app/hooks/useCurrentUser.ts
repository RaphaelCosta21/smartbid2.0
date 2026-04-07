/**
 * useCurrentUser — Shorthand hook to access the current user from auth store.
 */

import { useAuthStore } from "../stores/useAuthStore";
import { IUser } from "../models";

export function useCurrentUser(): IUser {
  return useAuthStore((s) => s.currentUser);
}

export function useIsGuest(): boolean {
  return useAuthStore((s) => s.isGuestUser);
}

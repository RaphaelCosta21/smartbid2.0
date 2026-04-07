import { create } from "zustand";
import { INotification } from "../models";

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  dropdownOpen: boolean;

  setNotifications: (items: INotification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setDropdownOpen: (open: boolean) => void;
  addNotification: (notification: INotification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  dropdownOpen: false,

  setNotifications: (items) =>
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.isRead).length,
    }),
  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n,
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  setDropdownOpen: (open) => set({ dropdownOpen: open }),
  addNotification: (notification) =>
    set((state) => {
      const updated = [notification, ...state.notifications];
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.isRead).length,
      };
    }),
}));

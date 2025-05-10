import { create } from "zustand";
import type { Notificationdata } from '../types/notification';
import api from "@/app/auth/utils";
import axios from "axios";
interface NotificationStore {
  notifications: Notificationdata[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  onlineUsers: Record<string, string>;

  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  addNotification: (newNotification: Notificationdata) => void;
  removeNotification: (notificationId: number) => Promise<void>;
  clearError: () => void;
}


const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  onlineUsers: {},

  // Fetch notifications from the backend
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/users/me/notif/');
      const notifications = response.data;

      const unreadCount = notifications.filter((n: Notificationdata) => !n.read).length;

      set({ notifications, unreadCount, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message || 'Failed to fetch notifications', isLoading: false });
      } else {
        set({ error: 'An unknown error occurred', isLoading: false });
      }
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      await api.get(`/users/notifications/${notificationId}/`);

      // Update the notification in the store
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message ?? 'Failed to mark notification as read' });
      } else {
        set({ error: 'An unknown error occurred' });
      }
    }
  },
  addNotification: (newNotification) =>
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
  // Remove a notification
  removeNotification: async (notificationId: number) => {
    try {
      await api.delete(`/users/notifications/delete/${notificationId}/`);  // This line is commented out to prevent deletion of notifications
      // Remove the notification from the store
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        unreadCount: state.notifications.some((n) => n.id === notificationId && !n.read)
          ? state.unreadCount - 1
          : state.unreadCount,
      }));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        set({ error: error.response?.data?.message ?? 'Failed to mark notification as read' });
      } else {
        set({ error: 'An unknown error occurred' });
      }
    }    
  },

  // Clear error state
  clearError: () => set({ error: null }),
}));

export default useNotificationStore;  
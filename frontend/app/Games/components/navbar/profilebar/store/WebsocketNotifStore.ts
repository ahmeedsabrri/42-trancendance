import { create } from "zustand"
import axios from 'axios';

// Base API setup
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});



const useNotificationStore = create((set, get) => ({
  notifications: [], // List of notifications
  unreadCount: 0, // Count of unread notifications
  socket: null, // WebSocket instance
  isConnected: false, // WebSocket connection status
  isLoading: false, // Loading state for API requests
  error: null, // Error state for API requests
  onlineUsers: {},
  // Fetch notifications from the backend
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/users/me/notif/');
      console.log(response);
      const notifications = response.data;

      // Calculate unread count
      const unreadCount = notifications.filter((n) => !n.read).length;

      set({ notifications, unreadCount, isLoading: false });
    } catch (error) {
      set({ error: error.data.message, isLoading: false });
      console.error('Failed to fetch notifications:', error);
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
    } catch (error) {
      set({ error: error.data.message });
      console.error('Failed to mark notification as read:', error);
    }
  },

  // Initialize WebSocket connection
  connectWebSocket: (url) => {
    const socket = new WebSocket(url);

    socket.onopen = () => {
      console.log('WebSocket connected');
      set({ isConnected: true, socket });
    };

    socket.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);

      // Add the new notification to the list
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      }));
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      set({ isConnected: false, socket: null });
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      console.error('WebSocket URL:', url); // Log the WebSocket URL
      console.error('WebSocket readyState:', socket.readyState); // Log the WebSocket state
      set({ error: 'WebSocket connection error', isConnected: false });
    };
  },

  // Close WebSocket connection
  disconnectWebSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ isConnected: false, socket: null });
    }
  },
}));

export default useNotificationStore;
import create from 'zustand';
import axios from 'axios';

// BASE API
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
});



const useNotificationStore = create((set, get) => ({
  notifications: [], // List of notifications
  unreadCount: 0, // Count of unread notifications
  socket: null, // WebSocket instance
  isConnected: false, // WebSocket connection status

  // Fetch notifications from the backend
  fetchNotifications: async () => {
    try {
      const response = await api.get('/users/me/notif/');
      const data = await response.json();
      set({ notifications: data });

      // Calculate unread count
      const unreadCount = data.filter((n) => !n.read).length;
      set({ unreadCount });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  },

  // Mark a notification as read
  markAsRead: async (notificationId) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read/`, {
        method: 'POST',
      });

      // Update the notification in the store
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: state.unreadCount - 1,
      }));
    } catch (error) {
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
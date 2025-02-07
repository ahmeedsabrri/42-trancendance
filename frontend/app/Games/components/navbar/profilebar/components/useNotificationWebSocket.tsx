import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useNotificationStore from '../store/WebsocketNotifStore';
import { useGameStore } from '@/app/Games/store/GameStore';


const useNotificationWebSocket = (url: string) => {
  const { fetchNotifications, addNotification } = useNotificationStore();
  const { setInviterId } = useGameStore();
  const { resetInvitedId } = useGameStore();

  const { lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    shouldReconnect: () => true,
    reconnectInterval: 50000,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      const newNotification = JSON.parse(lastMessage.data);

      if (newNotification.notification.notification_type === "game_decline")
        resetInvitedId();
      if (newNotification.notification.notification_type === "game_invite")
        setInviterId(newNotification.notification.sender.id);
      const data = newNotification.notification
      console.log('New notification:', newNotification);
      if (window.location.pathname !== '/chat')
        addNotification(data);
    }
  }, [lastMessage, addNotification]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { readyState };
};

export default useNotificationWebSocket;
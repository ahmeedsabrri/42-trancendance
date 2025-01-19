import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useNotificationStore from '../store/WebsocketNotifStore';


const useNotificationWebSocket = (url:string) => {
  const {fetchNotifications, addNotification} = useNotificationStore();

  const { lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    shouldReconnect: () => true,
    reconnectInterval: 50000, 
  });

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      console.log('Received message:', lastMessage.data);

      const newNotification = JSON.parse(lastMessage.data);
      const data = newNotification.notification
      console.log('New notification:', newNotification);
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
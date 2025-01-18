import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useNotificationStore from '../store/WebsocketNotifStore';


const useNotificationWebSocket = (url:string) => {
  const {fetchNotifications, addNotification} = useNotificationStore();

  const { lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    shouldReconnect: () => true, // Automatically reconnect
    reconnectInterval: 50000, 
  });

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage !== null) {
      console.log('Received message:', lastMessage.data);
      const newNotification = JSON.parse(lastMessage.data);
      console.log('New notification:', newNotification);
      addNotification(newNotification);
    }
  }, [lastMessage, addNotification]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { readyState };
};

export default useNotificationWebSocket;
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useNotificationStore from '../store/WebsocketNotifStore';
import { useGameStore } from '@/app/Games/store/GameStore';


const useNotificationWebSocket = (url:string) => {
  const {fetchNotifications, addNotification} = useNotificationStore();
  const {setInviterId} = useGameStore();
  // const {resetInvitedId} = useGameStore();

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

      // if (newNotification.notification.notification_type === "game_decline")
      //   {
      //       resetInvitedId();
      //       console.log("REset Invited_id");
      //   }
      if (newNotification.notification.notification_type === "game_invite")
      {
        const data = newNotification.notification
        setInviterId(newNotification.notification.sender.id);
      }
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
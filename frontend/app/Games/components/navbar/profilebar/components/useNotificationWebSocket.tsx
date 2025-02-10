import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useNotificationStore from '../store/WebsocketNotifStore';
import { useGameStore } from '@/app/Games/store/GameStore';
import useChatSocket from '@/hooks/useChatSocket';
import { useChatStore } from '@/app/store/chatStore';
import { useUserFriendsStore } from '@/app/store/UserFriendsStrore';


const useNotificationWebSocket = (url: string) => {
  const { fetchNotifications, addNotification, removeNotification } = useNotificationStore();
  const { setInviterId } = useGameStore();
  const { resetInvitedId } = useGameStore();
  const { fetchOwnFriends } = useUserFriendsStore();

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
      if (
        newNotification.notification.notification_type === "friend_accept"
        || newNotification.notification.notification_type === "unfriend"
      )
      {
        fetchOwnFriends();
        console.log('Fetching friends');
      }
      if (newNotification.notification.notification_type === "block")
      {
        console.log('Blocked');
      }
      console.log('New notification type :', newNotification.notification.notification_type);
      const data = newNotification.notification;
      console.log('New notification:', newNotification);
      if (window.location.pathname === '/chat' && data.notification_type === 'message')
      {
        removeNotification(data.id);
        return;
      }
      addNotification(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, addNotification]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { readyState };
};

export default useNotificationWebSocket;
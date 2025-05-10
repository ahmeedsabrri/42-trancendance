import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import useNotificationStore from '../store/WebsocketNotifStore';
import { useGameStore } from '@/app/Games/store/GameStore';
import { useUserFriendsStore } from '@/app/store/UserFriendsStrore';
import { useRouter } from 'next/navigation'


const useNotificationWebSocket = (url: string) => {
  const router = useRouter();
  const { fetchNotifications, addNotification, removeNotification } = useNotificationStore();
  const { setInviterId } = useGameStore();
  const { resetInvitedId } = useGameStore();
  const { fetchOwnFriends } = useUserFriendsStore();

  const { lastMessage, readyState } = useWebSocket(url, {
    onOpen: () => {},
    onClose: () =>{},
    shouldReconnect: () => true,
    reconnectInterval: 50000,
  });

  useEffect(() => {
        if (lastMessage !== null) {
          const newNotification = JSON.parse(lastMessage.data);
        
        if (newNotification.notification.notification_type === "game_decline")
        {
          resetInvitedId();
          router.push("/Games");
        }
        if (newNotification.notification.notification_type === "game_invite")
          setInviterId(newNotification.notification.sender.id);
        if (
          newNotification.notification.notification_type === "friend_accept"
          || newNotification.notification.notification_type === "unfriend"
        )
        {
          fetchOwnFriends();
        }
        const data = newNotification.notification;
        if ((window.location.pathname === '/chat' && data.notification_type === 'message') || newNotification.notification.notification_type === "block")
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
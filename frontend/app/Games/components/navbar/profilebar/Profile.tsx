
'use client';
import Link from 'next/link';
import ProfileInfo from './ProfileInfo';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { AuthActions } from '@/app/auth/utils';
import { useUserStore } from '@/app/store/store';
import { NotificationBell } from './components/NotificationBell';
import { NotificationPanel } from './components/NotificationPanel';
import { useState } from 'react';
import { CircleChevronDown } from 'lucide-react';
import useNotificationStore from './store/WebsocketNotifStore';
import { Bounce, toast } from 'react-toastify';
import { UserFriendsActions } from '@/app/profile/utils/actions';
import useNotificationWebSocket from './components/useNotificationWebSocket';
import { useGameStore } from '@/app/Games/store/GameStore';
import { useRouter } from 'next/navigation';
import { useUserFriendsStore } from '@/app/store/UserFriendsStrore';


const Profile = () => {
  const base_wws_url = process.env.NEXT_PUBLIC_WSS_URL
  if (!base_wws_url) {
    throw new Error("NEXT_PUBLIC_NOTIFICATION_WSS_URL is not defined");
  }
  useNotificationWebSocket(base_wws_url + "/notifications/");
  const { fetchOwnFriends } = useUserFriendsStore();

  const { user } = useUserStore();
  const { logout } = AuthActions();
  const {notifications,markAsRead,unreadCount,removeNotification} = useNotificationStore();
  const {handleRequest} = UserFriendsActions();
  const [showPanel, setShowPanel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { setInvitedId, inviter_id } = useGameStore();
  const router = useRouter();

  const notifAccept = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  const notifDecilne = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  const notifyErr = (message:string) => toast(message,{
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });

  // Handle notification click
  const handleNotificationClick = () => {
    setShowPanel(!showPanel);
  };

  // Handle marking a notification as read
  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  // Handle accepting a friend request
  const handleAcceptFriend = (username: string) => {

    handleRequest(username, 'accept')
    .then((res) => {
      notifAccept(res.data.message);
      fetchOwnFriends();
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  };

  // Handle rejecting a friend request
  const handleRejectFriend = (username: string) => {
    handleRequest(username, 'decline')
    .then((res) => {
      notifDecilne(res.data.message);
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  };

  const handleAcceptInvite = async (username: string) => {

    setInvitedId(`${user?.id}-${inviter_id}`);
    handleRequest(username, "acceptInvite")
    .then((res) => {
        notifAccept(res.data.message);
      })
      .catch((err) => {
        notifyErr(err.response.data.message);
      })
      .finally(() => {
        router.push("/Games/GameBackground");
      });
  };

  const handleDeclineInvite = (username: string) => {
    handleRequest(username, 'declineInvite')
    .then((res) => {
      notifDecilne(res.data.message);
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  }

  // Handle logout
  const handleLogout = () => {
    logout()
      .then(() => {
         window.location.href = '/auth';
      })
      .catch((err) => {
        notifyErr(err.response.data.message);
      });
  };

  const handlePanelOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="h-full w-full flex items-center justify-end gap-x-[8px]">
        <div className="relative">
          <NotificationBell count={unreadCount} onClick={handleNotificationClick} />
          {showPanel && (
            <NotificationPanel
              notifications={notifications}
              onClose={() => setShowPanel(false)}
              onMarkAsRead={handleMarkAsRead}
              onAcceptFriend={handleAcceptFriend}
              onAcceptInvite={handleAcceptInvite}
              onDeclineInvite={handleDeclineInvite}
              onRejectFriend={handleRejectFriend}
              onRemoveNotification={removeNotification}
            />
          )}
        </div>
        <div className="px-[25px] py-[8px] flex items-center justify-between gap-x-[20px] rounded-full border border-white/10 bg-gray-500 bg-opacity-30 backdrop-blur-xl ">
          <div className="w-4 h-4 rounded-2xl">
            <DropdownMenu>
              <DropdownMenuTrigger
                className="size-full gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 flex justify-between"
                onClick={handlePanelOpen}
              >
                <CircleChevronDown className="size-full text-white transition-transform group-hover:scale-110" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-[20px] py-[8px] flex flex-col items-center justify-between bg-opacity-30 :bg-black/50 backdrop-blur-md rounded-lg border border-white/10 my-2">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150 text-white hover:bg-black/30 rounded-lg font-bold text-md">
                  <Link href={`/profile/${user?.username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150 text-white hover:bg-black/30 rounded-lg font-bold text-md">
                  <Link href="/dashboard/setting"
                  >Setting</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-bold text-md text-red-500/60 hover:text-red/80 flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150  hover:bg-red-500/30 rounded-lg"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ProfileInfo />
        </div>
      </div>
    </>
  );
};

export default Profile;

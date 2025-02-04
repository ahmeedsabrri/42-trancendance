'use client';
import Link from 'next/link';
import ProfileInfo from './ProfileInfo';
import Cookies from 'js-cookie';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthActions } from '@/app/auth/utils';
import { useUserStore } from '@/app/store/store';
import { NotificationBell } from './components/NotificationBell';
import { NotificationPanel } from './components/NotificationPanel';
import { useEffect, useState } from 'react';
import { CircleChevronDown } from 'lucide-react';
import { useRouter } from 'next/router';
import useNotificationStore from './store/WebsocketNotifStore';
import { Bounce, toast } from 'react-toastify';
import { UserFriendsActions } from '@/app/profile/utils/actions';
import useWebSocket from 'react-use-websocket';
import useNotificationWebSocket from './components/useNotificationWebSocket';

const Profile = () => {
  const {readyState} = useNotificationWebSocket("wss://localhost/ws/notifications/");
  const { user } = useUserStore();
  const { logout } = AuthActions();
  const {notifications,markAsRead,unreadCount,removeNotification} = useNotificationStore();
  const {handleRequest} = UserFriendsActions();
  const [showPanel, setShowPanel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    console.log(`Accepted friend request from user ${username}`);
    handleRequest(username, 'accept')
    .then((res) => {
      console.log(res.data.message);
      notifAccept(res.data.message);
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  };

  // Handle rejecting a friend request
  const handleRejectFriend = (username: string) => {
    console.log(`Rejected friend request from user ${username}`);
    handleRequest(username, 'decline')
    .then((res) => {
      console.log(res.data.message);
      notifDecilne(res.data.message);
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  };

  const handleAcceptInvite = (username: string) => {
    console.log(`Accepted Invite request from user ${username}`);
    handleRequest(username, 'acceptInvite')
    .then((res) => {
      console.log(res.data.message);
      notifAccept(res.data.message);
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  };

  const handleDeclineInvite = (username: string) => {
    console.log(`Rejected Invite request from user ${username}`);
    handleRequest(username, 'declineInvite')
    .then((res) => {
      console.log(res.data.message);
      notifDecilne(res.data.message);
    })
    .catch((err) => {
      notifyErr(err.response.data.message);
    });
  }

  // Handle logout
  const handleLogout = () => {
    logout()
      .then((res) => {
        console.log(res.data.message);
         window.location.href = '/auth';
      })
      .catch((err) => {
        notifyErr(err.response.data.message);
      });
  };
  const handelRmoveNotification = (id:number) => {
    console.log(`Remove notification with id ${id}`);
    // notifications.pop(id);
  }

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
            <DropdownMenu >
              <DropdownMenuTrigger
                className="size-full gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 flex justify-between"
                onClick={handlePanelOpen}
              >
                <CircleChevronDown className="size-full text-white transition-transform group-hover:scale-110" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="px-[20px] py-[8px] flex flex-col items-center justify-between bg-opacity-30 bg-black bg-opacity-15 backdrop-blur-md rounded-lg border border-white/10 absolute top-5 -left-10">
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-75 text-white hover:bg-black/30 rounded-lg font-bold text-md cursor-pointer">
                  <Link href={`/profile/${user?.username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-75 text-white hover:bg-black/30 rounded-lg font-bold text-md cursor-pointer">
                  <Link href="/dashboard/setting"
                  >Setting</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="font-bold text-md text-red-500/60 hover:text-red/80 flex items-center gap-2 px-4 py-2 transition ease-in-out delay-75  hover:bg-red-500/30 rounded-lg cursor-pointer"
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
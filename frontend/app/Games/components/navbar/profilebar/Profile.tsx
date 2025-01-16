'use client'
import Link from 'next/link'
import ProfileInfo from "./ProfileInfo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { AuthActions } from '@/app/auth/utils';
import { useUserStore } from '@/app/store/store';
import { NotificationBell } from './components/NotificationBell';
import { NotificationPanel } from './components/NotificationPanel';
import { fakeNotifications } from './data/fakeNotifications';
import type { Notification } from './types/notification';
import { use, useEffect, useState } from 'react';
import {DropdownPanel}  from './components/DropdownPanel';

import { CircleChevronDown, CircleChevronUp } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/router';

const Profile = () => {
    const [notifications, setNotifications] = useState<Notification[]>(fakeNotifications);
  const [showPanel, setShowPanel] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    console.log('Notification clicked');
    setShowPanel(!showPanel);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const handleAcceptFriend = (userId: string) => {
    console.log(`Accepted friend request from user ${userId}`);
    
    const user = notifications.find(n => n.userId === userId);
    if (user) {
      const newNotification: Notification = {
        id: Date.now().toString(),
        title: 'Friend Request Accepted',
        message: `You are now friends with ${user.userName}`,
        timestamp: new Date(),
        read: false,
        type: 'friendAccepted',
        userId: user.userId,
        userName: user.userName,
        userAvatar: user.userAvatar
      };
      setNotifications([newNotification, ...notifications]);
    }
  };
  const { user } = useUserStore();
  const { logout} = AuthActions();
  const handleLogout = () => {
    logout()
    .then((res) => {
              const route = useRouter();
              console.log(res.data.message);
              route.push('/auth');
            })
            .catch((err) => {
              console.error('Failed to logout:', err);
              });
          };
const handelpanelopen = () => {
    console.log('useEffect: adding click event listener');
    setIsOpen(!isOpen);

}  
  const handleRejectFriend = (userId: string) => {
    console.log(`Rejected friend request from user ${userId}`);
  };
    return (
        <>
            <div className="h-full w-full flex items-center justify-end gap-x-[8px]">
                <div className='relative'> 
                    <NotificationBell count={unreadCount} onClick={handleNotificationClick} />
                    {showPanel && (
                        <NotificationPanel
                        notifications={notifications}
                        onClose={() => setShowPanel(false)}
                        onMarkAsRead={handleMarkAsRead}
                        onAcceptFriend={handleAcceptFriend}
                        onRejectFriend={handleRejectFriend}
                        />
                    )}
                </div>
                <div className="px-[25px] py-[8px] flex items-center justify-between gap-x-[20px] bg-gray-500 bg-opacity-30 backdrop-blur-2xl rounded-full border border-white/10">
                    {/* <div className="w-4 h-4 rounded-2xl">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="size-full gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 flex justify-between"
                            onClick={handelpanelopen}>
                            <CircleChevronDown className="size-full text-white transition-transform group-hover:scale-110" /> 
                               
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="px-[20px] py-[8px]  flex flex-col items-center justify-between bg-gray-500 bg-opacity-30 backdrop-blur-2xl rounded-lg border border-white/10 my-2">
                                <DropdownMenuItem className="w-full text-white flex items-center justify-center transition-all font-bold text-md hover:bg-white/20"><Link href={`/profile/${user?.username}`}>Profile</Link></DropdownMenuItem>
                                <DropdownMenuItem  className="w-full text-white flex items-center justify-center transition-all font-bold text-md hover:bg-white/20"><Link href="/dashboard/setting" >Setting</Link></DropdownMenuItem>
                                <DropdownMenuItem className="w-full text-red-500 flex items-center justify-center transition-all font-bold text-md hover:bg-gradient-to-r hover:text-red-400" onClick={handleLogout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div> */}

                    <DropdownPanel />
                    <ProfileInfo />
                </div>
            </div>
        </>
    )
}

export default Profile;
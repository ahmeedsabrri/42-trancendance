import React, { useEffect } from 'react';
import { Shield, UserMinus } from 'lucide-react';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import Link from 'next/link';
import { UserFriendsData } from '@/app/store/UserFriendsStrore';
import { useUserStore } from '@/app/store/store';
import { UserFriendsActions } from '../utils/actions';
import { Bounce, toast } from 'react-toastify';
interface FriendCardProps {
  friend:  UserFriendsData;
}


export function FriendCard({ friend}: FriendCardProps) {
  const notifyBlock = (message: string) =>
      toast(message, {
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
  const {user} = useUserStore();
  const [isMe, setIsMe] = React.useState(false);
  const { handleRequest } = UserFriendsActions();
  useEffect(() => {
    if (user?.username === friend.username) {
      setIsMe(true);
    }
  }, [user, friend]);


  const handleAction = (action: 'block' | 'unfriend') => {
    handleRequest(friend.username, action)
    .then((response) =>{
      switch (action) {
        case 'block':
          notifyBlock(response.data.message);
          break;
        case 'unfriend':
          notifyBlock(response.data.message);
          break;
        default:
          break;
      
    }})
    .catch((error) => {
      notifyBlock(error.response.data.message);
    });
  } 

  return (
    <div className="backdrop-blur-md bg-black/20 shadow-lg rounded-2xl p-4 hover:bg-white/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link rel="stylesheet" href={`${friend.username}`} >
          <Avatar width={48} height={48} avatar={friend.avatar} />
            </Link>
          <div>
            <p className="text-white font-medium">{friend.username}</p>
            <p className="text-sm text-gray-500/90">Level {friend.level}</p>
          </div>
        </div>
       {!isMe && <div className="flex gap-2">
           <button
            onClick={() => handleAction('block')}
            className="p-2 rounded-lg  hover:bg-red-500/30 text-red-500/50 transition-all"
          >
            <Shield size={18} />
          </button>
          <button
            onClick={() => handleAction('unfriend')}
            className="p-2 rounded-lg transition ease-in-out delay-150  hover:bg-black/30 text-white "
          >
            <UserMinus size={18} />
          </button>
        </div>}
      </div>
    </div>
  );
}
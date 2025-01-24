import React, { useEffect } from 'react';
import { Shield, UserMinus } from 'lucide-react';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import Link from 'next/link';
import { UserFriendsData } from '@/app/store/UserFriendsStrore';
import { useUserStore } from '@/app/store/store';
interface FriendCardProps {
  friend:  UserFriendsData;
  onBlock: (username:string) => void;
  onUnfriend: (username:string) => void;
}


export function FriendCard({ friend, onBlock, onUnfriend }: FriendCardProps) {
  const {user} = useUserStore();
  const [isMe, setIsMe] = React.useState(false);
  useEffect(() => {
    if (user?.username === friend.username) {
      setIsMe(true);
    }
  }, [user, friend]);
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all border-t-1 shadow-xl border-t border-l border-border">
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
            onClick={() => onBlock(friend.username)}
            className="p-2 rounded-lg  hover:bg-red-500/30 text-red-500/50 transition-all"
          >
            <Shield size={18} />
          </button>
          <button
            onClick={() => onUnfriend(friend.username)}
            className="p-2 rounded-lg transition ease-in-out delay-150  hover:bg-black/30 text-white "
          >
            <UserMinus size={18} />
          </button>
        </div>}
      </div>
    </div>
  );
}
import React from 'react';
import { Shield, UserMinus } from 'lucide-react';
import { FriendData } from '@/app/profile/types';
import { UserData } from '@/app/store/store';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
interface FriendCardProps {
  friend: UserData;
  onBlock: (id: number) => void;
  onUnfriend: (id: number) => void;
}

export function FriendCard({ friend, onBlock, onUnfriend }: FriendCardProps) {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar width={48} height={48} avatar={friend.avatar} />
          <div>
            <p className="text-white font-medium">{friend.username}</p>
            <p className="text-sm text-gray-500/90">Level {friend.level}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onBlock(friend.id)}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
          >
            <Shield size={18} />
          </button>
          <button
            onClick={() => onUnfriend(friend.id)}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-all"
          >
            <UserMinus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
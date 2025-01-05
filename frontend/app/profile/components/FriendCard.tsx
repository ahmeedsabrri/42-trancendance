import React from 'react';
import { Friend } from '../types';
import { Shield, UserMinus } from 'lucide-react';

interface FriendCardProps {
  friend: Friend;
  onBlock: (id: string) => void;
  onUnfriend: (id: string) => void;
}

export function FriendCard({ friend, onBlock, onUnfriend }: FriendCardProps) {
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-lg p-4 hover:bg-white/20 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={friend.user.avatar}
            alt={friend.user.name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="text-white font-medium">{friend.user.name}</p>
            <p className="text-sm text-gray/90">Level {friend.user.level}</p>
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
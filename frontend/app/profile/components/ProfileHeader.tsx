"use client";

import React from 'react';
import { Shield, UserMinus, UserPlus2, UserPlus2Icon } from 'lucide-react';
import { UserData } from '@/app/store/store';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
interface ProfileHeaderProps {
  user: UserData;
  onBlock: () => void;
  onUnfriend: () => void;
  addFriend: () => void;
}

export function ProfileHeader({ user, onBlock, onUnfriend, addFriend}: ProfileHeaderProps) {

  return (
    <div className="relative mb-8">
      <div className="h-48 w-full overflow-hidden rounded-xl">
        <img
          src={"https://images.unsplash.com/photo-1579546929518-9e396f3cc809"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute -bottom-6 left-8 flex items-end gap-4">
        <div className="relative">
          <Avatar width={96} height={96} avatar={user.avatar}/>
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
        </div>
        
        <div className="backdrop-blur-md bg-white/30 rounded-lg p-4 mb-2 shadow-lg">
          <h1 className="text-2xl font-bold text-white">{user.username}</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
              Level {user.level}
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 right-8 flex gap-2">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg"
          onClick={addFriend}
        >
          <UserPlus2Icon size={24} />
          <span className="text-white">Add Friend</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg"
          onClick={onBlock}
        >
          <Shield size={24} />
          <span className="text-white">Block</span>
        </button>
      </div>
    </div>
  );
}
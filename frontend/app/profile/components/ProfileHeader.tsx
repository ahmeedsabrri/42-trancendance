"use client";

import { UserData} from '@/app/store/store';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import {AddFriends} from './addFriendsComponent';
import { IsaFriend } from './isaFriendComponent';
export interface ProfileHeaderProps {
  userProfile: UserData;
  onBlock: () => void;
  onUnfriend: () => void;
  addFriend: () => void;
  friendOrNot: string;
}

export function ProfileHeader({ userProfile, onBlock, onUnfriend, addFriend,friendOrNot}: ProfileHeaderProps) {
  console.log(friendOrNot);
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
          <Avatar width={96} height={96} avatar={userProfile.avatar}/>
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${userProfile.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
        </div>
        
        <div className="backdrop-blur-md bg-white/30 rounded-lg p-4 mb-2 shadow-lg">
          <h1 className="text-2xl font-bold text-white">{userProfile.username}</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-sm">
              Level {userProfile.level}
            </span>
          </div>
        </div>
      </div>
      {friendOrNot === 'isfriend' && <IsaFriend onBlock={onBlock} onUnfriend={onUnfriend} />}
      {friendOrNot === 'notfriend' && <AddFriends addFriend={addFriend} onBlock={onBlock} />}
    </div>
  );
}
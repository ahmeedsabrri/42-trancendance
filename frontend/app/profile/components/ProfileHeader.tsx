"use client";

import { UserData, useUserStore} from '@/app/store/store';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import {AddFriends} from './addFriendsComponent';
import { IsaFriend } from './isaFriendComponent';
import { Shield } from 'lucide-react';
export interface ProfileHeaderProps {
  userProfile: UserData;
  onBlock: () => void;
  onUnfriend: () => void;
  addFriend: () => void;
  onAccepte: () => void;
  onDecline: () => void;
}

export function ProfileHeader({ userProfile, onBlock, onUnfriend, addFriend, onAccepte, onDecline}: ProfileHeaderProps) {
  const {user} = useUserStore();
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
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${userProfile?.is_online == true ? 'bg-green-500' : 'bg-gray-500'}`} />
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
      {userProfile?.connection_type === 'pending' && 
      <div className="absolute bottom-0 right-8 flex gap-2"> 
        {userProfile.sender == user?.username ? 
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg"
            onClick={onUnfriend}
          >
            <span className="text-white">Cancell friend request</span>
          </button> 
          : 
          <div className='flex gap-2'>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg" 
            onClick={onAccepte}>
              <span className="text-white">Accepte Friend</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg"
            onClick={onDecline}>
              <span className="text-white">Decline Friend</span>
            </button>
          </div> }
      </div>}
      {userProfile?.connection_type === 'accepted' &&<IsaFriend onBlock={onBlock} onUnfriend={onUnfriend} />}
      {userProfile?.connection_type === 'not_connected' && <AddFriends addFriend={addFriend} onBlock={onBlock} />}
    </div>
  );
}


// ('pending', 'pending'),
//         ('accepted', 'accepted'),
//         ('rejected', 'rejected'),
//         ('blocked', 'blocked'),
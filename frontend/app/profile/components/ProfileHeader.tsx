"use client";

import { UserData, useUserStore} from '@/app/store/store';
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import {AddFriends} from './addFriendsComponent';
import { IsaFriend } from './isaFriendComponent';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import Image from 'next/image';
export interface ProfileHeaderProps {
  userProfile: UserData;
  onBlock: () => void;
  onUnfriend: () => void;
  addFriend: () => void;
  onAccepte: () => void;
  onDecline: () => void;
  onCancel: () => void;
}

export function ProfileHeader({ userProfile, onBlock, onUnfriend, addFriend, onAccepte, onDecline,onCancel}: ProfileHeaderProps) {
  const {user, fetchUser} = useUserStore();
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  return (
    <div className="relative mb-8">
      <div className="h-48 w-full rounded-xl overflow-hidden">
          <Image  src="/images/banner1.jpeg" alt="Cover" fill={true} className='rounded-xl bg-cover bg-no-repeat object-cover'/>
      </div>
      
      <div className="absolute -bottom-6 left-8 flex items-end gap-4">
        <div className="relative">
          <Avatar width={96} height={96} avatar={userProfile.avatar}/>
          <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ${userProfile?.is_online === true && userProfile?.connection_type !== 'blocked' ? 'bg-green-500 border-2 border-white' : ''}`} />
        </div>
        
        <div className="backdrop-blur-md bg-black/20 shadow-lg rounded-lg p-4 mb-2 ">
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
            className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150 bg-black/20 hover:bg-black/30 rounded-lg"
            onClick={onCancel}
          >
            <X className="text-white" />
            <span className="text-white">Cancel</span>
          </button> 
          : 
          <div className='flex gap-2'>
            <button className="flex items-center gap-2 px-4 py-2transition ease-in-out delay-150 bg-black/20 hover:bg-black/30 rounded-lg" 
            onClick={onAccepte}>
              <span className="text-white">Accepte Friend</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150 bg-black/20 hover:bg-black/30 rounded-lg"
              onClick={onDecline}>
              <span className="text-white">Decline</span>
            </button>
          </div> }
      </div>}
      {userProfile?.connection_type === 'accepted' && <IsaFriend onBlock={onBlock} onUnfriend={onUnfriend} />}
      {(userProfile?.connection_type === 'not_connected' || userProfile?.connection_type == 'rejected')  && <AddFriends addFriend={addFriend}/>}
    </div>
  );
}

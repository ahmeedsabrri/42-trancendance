"use client";
import React from 'react';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { useUserStore } from '@/app/store/store';

export default function Settings() {
  const { fetchUser, user, isInitialized } = useUserStore();
  
  const userRef = React.useRef(user);
  React.useEffect(() => {
    userRef.current = user;    
  }, [user]);
  React.useEffect(() => {
      fetchUser();
  }, [isInitialized, fetchUser]);
  if (!isInitialized || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className=" w-full h-full hide-scrollbar overflow-y-scroll bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl rounded-3xl overflow-hidden px-2 border border-white/10">
      <div className=" px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        <div className="space-y-6">
          <ProfileSettings user={user}/>
          <SecuritySettings user={user}/>
        </div>
      </div>
    </div>
  );
}
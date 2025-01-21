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
  // Only fetch user data once when component mounts
  React.useEffect(() => {
      fetchUser();
  }, [isInitialized, fetchUser]);
  if (!isInitialized || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-5/6 h-5/6 overflow-scroll border-t-1 shadow-xl border-t border-l border-border backdrop-blur-3xl rounded-3xl">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
        <div className="space-y-6">
          <ProfileSettings user={user}/>
          <SecuritySettings user={user}/>
        </div>
      </div>
    </div>
  );
}
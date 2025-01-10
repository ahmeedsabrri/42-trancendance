"use client";

import React, { useEffect, useRef } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { GameHistoryCard } from '../components/GameHistoryCard';
import { FriendCard } from '../components/FriendCard';
import { MonthlyStats } from '../components/MonthlyStats';
import { GameChart } from '../components/GameChart';
import {GameHistory, Friend } from '../types';
import { useUserStore } from '../../store/store';
import { UserData } from '../../store/store';
import { useParams } from 'next/navigation';
import { api } from '@/app/store/store';
// Mock data
const mockUser: UserData = {
  id: 15,
  username: 'john_doe',
  email: '',
  first_name: 'John',
  last_name: 'Doe',
  level: 42,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  status: 'online',
  friends: [
    {
      id: 12,
      username: 'jane_smith',
      level: 30,
      avatar: 'https://i.pravatar.cc/300'
    },
    {
      id: 13,
      username: 'bob_johnson',
      level: 25,
      avatar: 'https://i.pravatar.cc/300'
    },
    {
      id: 14,
      username: 'alice_brown',
      level: 35,
      avatar: 'https://i.pravatar.cc/300'
    },
    {
      id: 15,
      username: 'charlie_wilson',
      level: 40,
      avatar: 'https://i.pravatar.cc/300'
    }
  ]
};

const mockGames: GameHistory[] = [
  {
    id: 1,
    type: 'pingpong',
    opponent: { ...mockUser, id: 1, username: 'Jane Smith' },
    result: 'win',
    date: '2024-03-10',
    score: '21-18'
  },
  {
    id: 2,
    type: 'tictactoe',
    opponent: { ...mockUser, id: 2, username: 'Bob Johnson' },
    result: 'loss',
    date: '2024-03-09'
  },
  {
    id: 3,
    type: 'pingpong',
    opponent: { ...mockUser, id: 4, username: 'Alice Brown' },
    result: 'win',
    date: '2024-03-08',
    score: '21-15'
  },
  {
    id: 4,
    type: 'tictactoe',
    opponent: { ...mockUser, id: 5, username: 'Charlie Wilson' },
    result: 'win',
    date: '2024-03-07'
  }
];
const fetchProfile = async (username: string) => {
  const response = await api.get(`/user/${username}`);
  if (response.status !== 200) {
    throw new Error('Failed to fetch user');
  }
  return response.data;
}
export default function Profile() {
  const { 
    fetchUser, 
    fetchFriend, 
    user, 
    viewedProfile, 
    loading,
    isInitialized 
  } = useUserStore();
  
  const { username } = useParams();

  useEffect(() => {
      if (!isInitialized) {
      // Fetch authenticated user's profile if no username and not initialized
      fetchFriend(username as string);
      fetchUser();
    }
  }, [username, isInitialized, fetchUser, fetchFriend]);

  const handleBlock = () => {
    console.log('Block user');
  };
  const handleSendfriendRequest = () => {
    console.log('Send friend request');
  }
  const handleUnfriend = () => {
    console.log('Unfriend user');
  };

  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  const profileToShow = username !== user?.username ? viewedProfile : user;
  const profiletype =  username !== user?.username ? viewedProfile?.connection_type : user?.connection_type;
  
  console.log(profiletype);
  console.log(username, viewedProfile?.username, user?.username);
  if (!profileToShow) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="w-full overflow-scroll border-t-1 shadow-xl border-t border-l border-border backdrop-blur-3xl rounded-lg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader
          user={profileToShow}
          onBlock={handleBlock}
          onUnfriend={handleUnfriend}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          <div className="lg:col-span-2 space-y-8">
            <MonthlyStats games={mockGames} />
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">Game History</h2>
              {mockGames.map((game) => (
                <GameHistoryCard key={game.id} game={game} />
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-6">Friends</h2>
            {profileToShow.friends?.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onBlock={handleBlock}
                onUnfriend={handleUnfriend}
                showActions={Boolean(username)}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6">Monthly Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GameChart 
              games={mockGames} 
              type="pingpong" 
              title="Ping Pong Progress"
            />
            <GameChart 
              games={mockGames} 
              type="tictactoe" 
              title="Tic Tac Toe Progress"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
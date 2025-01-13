"use client";

import React, { useEffect, useState } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { GameHistoryCard } from '../components/GameHistoryCard';
import { FriendCard } from '../components/FriendCard';
import { MonthlyStats } from '../components/MonthlyStats';
import { GameChart } from '../components/GameChart';
import {GameHistory} from '../types';
import { useUserStore } from '../../store/store';
import { useUserFriendsStore } from '../../store/UserFriendsStrore';
import { UserData } from '../../store/store';
import { useParams } from 'next/navigation';
import { api } from '@/app/store/store';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UserFriendsActions } from '../utils/actions';
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

export default function Profile() {
  const { 
    fetchUser, 
    fetchFriend, 
    user, 
    viewedProfile, 
    loading,
    isInitialized ,
  } = useUserStore();
  const { Userfriends, fetchUserFriends, fetchOwnFriends, UserOwnfriends, isIn } = useUserFriendsStore();
  const { username } = useParams();
  const {handleRequest} = UserFriendsActions();
  useEffect(() => {
    if (!isInitialized) {
      fetchUser();
    }
    fetchFriend(username as string);
    fetchUserFriends(username as string);
    fetchOwnFriends();
  }, [username, isInitialized, fetchUser, fetchFriend, user, UserOwnfriends, fetchUserFriends, fetchOwnFriends, isIn]);

  // handleBlock function
  const handleBlock =  () => {
    console.log('Blocked');
    handleRequest(username as string, 'block')
    .then((response) => {
      console.log(response);
      return (
        <Alert variant='default'>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{response.data}</AlertDescription>
        </Alert> 
      )
    })
    .catch((err) => {
      console.log(err);
      return (
        <Alert variant='destructive'>
          <AlertTitle>{err.response.data.error}</AlertTitle>
          <AlertDescription>{err.response.data.message}</AlertDescription>
        </Alert> 
      )
    });
  };

  // handleSendfriendRequest function
  const handleSendfriendRequest = () => {
    handleRequest(username as string, 'send')
    .then((response) => {
      console.log(response);
      return (
        <Alert variant='default'>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{response.data.message}</AlertDescription>
        </Alert> 
      )
    })
    .catch((err) => {
      console.log(err);
      return (
        <Alert variant='destructive'>
          <AlertTitle>{err.response.data.error}</AlertTitle>
          <AlertDescription>{err.response.data.message}</AlertDescription>
        </Alert> 
      )
    });
  }

  // handleUnfriend function
  const handleUnfriend = () => {
    handleRequest(username as string, 'unfriend')
    .then((response) => {
      return (
        <Alert variant='default'>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{response.data}</AlertDescription>
        </Alert> // Add closing tag for Alert element
      )
    })
    .catch((err) => {
      return (
        <Alert variant='destructive'>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{err.message}</AlertDescription>
        </Alert> // Add closing tag for Alert element
      )
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  console.log(UserOwnfriends);
  console.log(username);
  const profileToShow = username !== user?.username ? viewedProfile : user;
  if (!profileToShow) {
    return <div>Profile not found</div>;
  }
  return (
    <div className="w-full overflow-scroll border-t-1 shadow-xl border-t border-l border-border backdrop-blur-3xl rounded-lg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader
          userProfile={profileToShow}
          onBlock={handleBlock}
          onUnfriend={handleUnfriend}
          addFriend={handleSendfriendRequest}
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
            {Userfriends?.map((friend) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onBlock={handleBlock}
                onUnfriend={handleUnfriend}
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
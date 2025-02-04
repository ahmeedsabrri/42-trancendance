"use client";

import React, { useEffect, useState } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { GameHistoryCard } from '../components/GameHistoryCard';
import { FriendCard } from '../components/FriendCard';
import { MonthlyStats } from '../components/MonthlyStats';
import { GameChart } from '../components/GameChart';
import { GameHistory } from '../types';
import { useUserStore } from '../../store/store';
import { useUserFriendsStore } from '../../store/UserFriendsStrore';
import { UserData } from '../../store/store';
import { useParams } from 'next/navigation';
import { UserFriendsActions } from '../utils/actions';
import { Bounce, toast } from 'react-toastify';

// Mock data
const mockUser: UserData = {
  id: 5,
  username: 'john_doe',
  email: '',
  first_name: 'John',
  last_name: 'Doe',
  level: 42,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  status: 'online',
  connection_type: 'friend',
};

const mockGames: GameHistory[] = [
  {
    id: 1,
    type: 'pingpong',
    opponent: { ...mockUser, id: 1, username: 'Jane Smith' },
    result: 'win',
    date: '2024-03-10',
    score: '21-18',
  },
  {
    id: 2,
    type: 'tictactoe',
    opponent: { ...mockUser, id: 2, username: 'Bob Johnson' },
    result: 'loss',
    date: '2024-03-09',
  },
  {
    id: 3,
    type: 'pingpong',
    opponent: { ...mockUser, id: 4, username: 'Alice Brown' },
    result: 'win',
    date: '2024-03-08',
    score: '21-15',
  },
  {
    id: 4,
    type: 'tictactoe',
    opponent: { ...mockUser, id: 5, username: 'Charlie Wilson' },
    result: 'win',
    date: '2024-03-07',
  },
];

export default function Profile() {
  const { fetchFriend, user, viewedProfile, loading } = useUserStore();
  const { Userfriends, fetchUserFriends, fetchOwnFriends, UserOwnfriends } = useUserFriendsStore();
  const { username } = useParams();
  const { handleRequest } = UserFriendsActions();
  const [profileState, setProfileState] = useState<UserData | null>(null);

  const notifyAdd = (message: string) =>
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  const notifyCancel = (message: string) =>
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  const notifyBlock = (message: string) =>
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  const notifyUnblock = (message: string) =>
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  const notifyErr = (message: string) =>
    toast(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });

  useEffect(() => {
    fetchFriend(username as string);
    fetchUserFriends(username as string);
    fetchOwnFriends();
  }, [username, fetchFriend, fetchUserFriends, fetchOwnFriends]);

  useEffect(() => {
    const profileToShow = username !== user?.username ? viewedProfile : user;
    setProfileState(profileToShow);
  }, [user, viewedProfile, username]);

  const handleAction = (action: 'accept' | 'decline' | 'block' | 'unblock' | 'send' | 'unfriend') => {
    handleRequest(username as string, action)
      .then((response) => {
        console.log(response);
        switch (action) {
          case 'accept':
            notifyAdd(response.data.message);
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'accepted' } : null);
            break;
          case 'decline':
            notifyCancel(response.data.message);
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'rejected' } : null);
            break;
          case 'block':
            notifyBlock(response.data.message);
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'blocked' } : null);
            console.log("Blocked");
            break;
          case 'unblock':
            notifyUnblock(response.data.message);
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'not_connected' } : null);
            break;
          case 'send':
            notifyAdd(response.data.message);
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'pending', sender: user.username } : null);
            break;
          case 'unfriend':
            notifyCancel(response.data.message);
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'not_connected' } : null);
            break;
        }
      })
      .catch((err) => {
        console.log(err);
        notifyErr(err.response.data.message);
      });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!profileState) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="w-full h-full hide-scrollbar overflow-y-scroll bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl rounded-3xl overflow-hidden px-2 border border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader
          userProfile={profileState}
          onBlock={() => handleAction('block')}
          onUnfriend={() => handleAction('unfriend')}
          addFriend={() => handleAction('send')}
          onAccepte={() => handleAction('accept')}
          onDecline={() => handleAction('decline')}
        />
        {profileState.connection_type !== 'blocked' ? (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
              <div className="lg:col-span-2 space-y-8">
                <MonthlyStats games={mockGames} />

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Game History</h2>
                  {mockGames.map((game) => (
                    <GameHistoryCard key={game.id} game={game} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Friends</h2>
                {Userfriends?.map((friend) => (
                  <FriendCard
                    key={friend.id}
                    friend={friend}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Monthly Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GameChart games={mockGames} type="pingpong" title="Ping Pong Progress" />
                <GameChart games={mockGames} type="tictactoe" title="Tic Tac Toe Progress" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[50vh]">
            {profileState.sender === user?.username ? (
              <div className="absolute bottom-50 right-50 flex gap-2 flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-white mb-6">You have blocked this user</h1>
                <button className="flex items-center gap-2 px-4 py-4 bg-white/20 rounded-lg" onClick={() => handleAction('unblock')}>
                  <span className="text-white">UnBlock</span>
                </button>
              </div>
            ) : (
              <h1 className="text-2xl font-bold text-white mb-6">You have been blocked by this user</h1>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
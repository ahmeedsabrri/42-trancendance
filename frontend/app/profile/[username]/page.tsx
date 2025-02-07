"use client";

import React, { useEffect, useState } from 'react';
import { ProfileHeader } from '../components/ProfileHeader';
import { GameHistoryCard } from '../components/GameHistoryCard';
import { FriendCard } from '../components/FriendCard';
import { MonthlyStats } from '../components/MonthlyStats';
import { GameChart } from '../components/GameChart';
import { MatchData, useUserStore } from '../../store/store';
import { useUserFriendsStore } from '../../store/UserFriendsStrore';
import { UserData } from '../../store/store';
import { useParams } from 'next/navigation';
import { UserFriendsActions } from '../utils/actions';
import { Bounce, toast } from 'react-toastify';

export default function Profile() {
  const { fetchFriend, user, viewedProfile, loading ,  MatchHistory} = useUserStore();
  const { Userfriends, fetchUserFriends, fetchOwnFriends } = useUserFriendsStore();
  const { username } = useParams();
  const { handleRequest } = UserFriendsActions();
  const [profileState, setProfileState] = useState<UserData| null>(null);

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
    console.log("username of profileToShow his id : ", profileToShow?.username, profileToShow?.id);
    setProfileState(profileToShow);
  }, [user, viewedProfile, username]);

  if (!user)
    return ;
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
            setProfileState((prevState) => prevState ? { ...prevState, connection_type: 'pending', sender: user.username  } : null);
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
    <div className="w-full h-full hide-scrollbar overflow-y-scroll bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl rounded-3xl overflow-hidden px-1 border border-white/10">
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
                <MonthlyStats user_id={profileState.id} />

                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Game History</h2>
                  {MatchHistory?.map((game: MatchData) => (
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
                <GameChart games={ MatchHistory || null} type="pingpong" title="Ping Pong Progress" />
                <GameChart games={MatchHistory || null} type="tictactoe" title="Tic Tac Toe Progress" />
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
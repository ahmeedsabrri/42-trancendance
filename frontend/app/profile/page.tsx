"use client";

import React from 'react';
import { ProfileHeader } from './components/ProfileHeader';
import { GameHistoryCard } from './components/GameHistoryCard';
import { FriendCard } from './components/FriendCard';
import { MonthlyStats } from './components/MonthlyStats';
import { GameChart } from './components/GameChart';
import { User, GameHistory, Friend } from './types';

// Mock data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  level: 42,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
  coverImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809',
  status: 'online'
};

const mockGames: GameHistory[] = [
  {
    id: '1',
    type: 'pingpong',
    opponent: { ...mockUser, id: '2', name: 'Jane Smith' },
    result: 'win',
    date: '2024-03-10',
    score: '21-18'
  },
  {
    id: '2',
    type: 'tictactoe',
    opponent: { ...mockUser, id: '3', name: 'Bob Johnson' },
    result: 'loss',
    date: '2024-03-09'
  },
  {
    id: '3',
    type: 'pingpong',
    opponent: { ...mockUser, id: '4', name: 'Alice Brown' },
    result: 'win',
    date: '2024-03-08',
    score: '21-15'
  },
  {
    id: '4',
    type: 'tictactoe',
    opponent: { ...mockUser, id: '5', name: 'Charlie Wilson' },
    result: 'win',
    date: '2024-03-07'
  }
];

const mockFriends: Friend[] = [
  {
    id: '1',
    user: { ...mockUser, id: '2', name: 'Jane Smith' },
    status: 'friend'
  },
  {
    id: '2',
    user: { ...mockUser, id: '3', name: 'Bob Johnson' },
    status: 'friend'
  }
];

function App() {
  const handleBlock = () => {
    console.log('Block user');
  };

  const handleUnfriend = () => {
    console.log('Unfriend user');
  };

  return (
    <div className="w-full overflow-scroll border-t-1 shadow-xl border-t border-l border-border backdrop-blur-3xl rounded-lg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ProfileHeader
          user={mockUser}
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
            {mockFriends.map((friend) => (
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

export default App;
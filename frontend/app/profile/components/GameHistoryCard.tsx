import React from 'react';
// import { GameHistory } from '../types';
import { Trophy, X, Circle } from 'lucide-react';
import { MatchData } from '@/app/store/store';

interface GameHistoryCardProps {
  game: MatchData;
}

export function GameHistoryCard({ game }: GameHistoryCardProps) {
  const getResultColor = () => {
    switch (game.result) {
      case 'W': return 'text-green-500/70';
      case 'L': return 'text-red-500/70';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="backdrop-blur-md bg-black/20 shadow-lg rounded-2xl p-4 hover:bg-white/20 transition-all ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {game.game_type === 'pingpong' ? (
            <Trophy className="w-6 h-6 text-yellow-500/70" />
          ) : (
            <div className="flex">
              <X className="w-6 h-6 text-blue-500/70" />
              <Circle className="w-6 h-6 text-red-500/70 -ml-2" />
            </div>
          )}
          <div>
            <p className="text-white font-medium">vs {game.opponent}</p>
            <p className="text-sm text-white/50">{game.played_at}</p>
            <p className='text-sm text-white/50'>{game.status}</p>

          </div>
        </div>
        <div className="flex items-center gap-2">
          {game.score && (
            <span className="text-white font-medium">{game.score}</span>
          )}
          <span className={`font-bold ${getResultColor()}`}>
            {game.result.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
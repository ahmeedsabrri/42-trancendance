import React from 'react';
import { GameHistory } from '../types';
import { Trophy, X, Circle } from 'lucide-react';

interface GameHistoryCardProps {
  game: GameHistory;
}

export function GameHistoryCard({ game }: GameHistoryCardProps) {
  const getResultColor = () => {
    switch (game.result) {
      case 'win': return 'text-green-500/70';
      case 'loss': return 'text-red-500/70';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="backdrop-blur-md bg-black/20 shadow-lg rounded-2xl p-4 hover:bg-white/20 transition-all ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {game.type === 'pingpong' ? (
            <Trophy className="w-6 h-6 text-yellow-500/70" />
          ) : (
            <div className="flex">
              <X className="w-6 h-6 text-blue-500/70" />
              <Circle className="w-6 h-6 text-red-500/70 -ml-2" />
            </div>
          )}
          <div>
            <p className="text-white font-medium">vs {game.opponent.username}</p>
            <p className="text-sm text-gray-500/90">{game.date}</p>
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
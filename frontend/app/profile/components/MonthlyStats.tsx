import React, { useEffect } from 'react';
import { useUserStore } from '@/app/store/store';
import { Trophy, X, Circle } from 'lucide-react';

interface GameStats {
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

export function MonthlyStats({ user_id }: { user_id: number }) {
  const { MatchHistory, loading, error, fetchMatchHistory} = useUserStore();

  useEffect(() => {
    fetchMatchHistory(user_id as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id]);

  const getCurrentMonthStats = (gameType: 'pingpong' | 'tictactoe'): GameStats => {
    if (!MatchHistory) {
      return { wins: 0, losses: 0, total: 0, winRate: 0 };
    }

    const currentMonth = new Date().getMonth();
    const monthGames = MatchHistory.filter(game => {
      const gameMonth = new Date(game.played_at).getMonth();
      return gameMonth === currentMonth && game.game_type === gameType;
    });

    const wins = monthGames.filter(game => game.result === 'W').length;
    const total = monthGames.length;

    return {
      wins,
      losses: total - wins,
      total,
      winRate: total > 0 ? (wins / total) * 100 : 0
    };
  };

  const pingPongStats = getCurrentMonthStats('pingpong');
  const ticTacToeStats = getCurrentMonthStats('tictactoe');

  const StatCard = ({
    title,
    stats,
    icon
  }: {
    title: string;
    stats: GameStats;
    icon: React.ReactNode;
  }) => (
    <div className="backdrop-blur-md bg-black/20 shadow-lg rounded-2xl p-4 ">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500/90">Wins</p>
          <p className="text-2xl font-bold text-green-500/70">{stats.wins}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500/90">Losses</p>
          <p className="text-2xl font-bold text-red-500/70">{stats.losses}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500/90">Win Rate</p>
          <p className="text-lg font-semibold text-white">
            {stats.winRate.toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );

  // Loading or error state
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Monthly Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Ping Pong"
          stats={pingPongStats}
          icon={<Trophy className="w-6 h-6 text-yellow-500/70" />}
        />
        <StatCard
          title="Tic Tac Toe"
          stats={ticTacToeStats}
          icon={
            <div className="flex">
              <X className="w-6 h-6 text-blue-500" />
              <Circle className="w-6 h-6 text-red-500/70 -ml-2" />
            </div>
          }
        />
      </div>
    </div>
  );
}

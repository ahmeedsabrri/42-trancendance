import { ChartData } from 'chart.js';
// import { GameHistory } from '../types';÷
import { MatchData } from '@/app/store/store';

export const getMonthlyGameData = (games: MatchData[] | null, gameType: 'pingpong' | 'tictactoe'): ChartData<'line'> => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
  
  // Initialize daily stats
  const dailyStats = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    wins: 0,
    losses: 0
  }));

  // Populate daily stats
  games?.forEach(game => {
    const gameDate = new Date(game.played_at);
    if (gameDate.getMonth() === currentMonth && game.game_type === gameType) {
      const dayIndex = gameDate.getDate() - 1;
      if (game.result === 'W') {
        dailyStats[dayIndex].wins++;
      } else if (game.result === 'L') {
        dailyStats[dayIndex].losses++;
      }
    }
  });

  return {
    labels: dailyStats.map(stat => `Day ${stat.day}`),
    datasets: [
      {
        label: 'Wins',
        data: dailyStats.map(stat => stat.wins),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Losses',
        data: dailyStats.map(stat => stat.losses),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
};
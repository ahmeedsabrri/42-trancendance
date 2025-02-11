import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { getMonthlyGameData } from '../utils/chartUtils';
import { MatchData } from '@/app/store/store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: 'rgba(255, 255, 255, 0.8)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    x: {
      ticks: { color: 'rgba(255, 255, 255, 0.8)' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    }
  },
  plugins: {
    legend: {
      labels: { color: 'rgba(255, 255, 255, 0.8)' }
    }
  }
};

interface GameChartProps {
  games: MatchData[] | null;
  type: 'pingpong' | 'tictactoe';
  title: string;
}

export function GameChart({ games, type, title }: GameChartProps) {
  const data = getMonthlyGameData(games, type);
  return (
    <div className="backdrop-blur-md bg-black/20 shadow-lg rounded-2xl p-6 ">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <Line options={chartOptions} data={data} />
    </div>
  );
}
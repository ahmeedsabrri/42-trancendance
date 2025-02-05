"use client";

import { BarChart, Bar, ResponsiveContainer, defs, linearGradient, CartesianGrid, XAxis, YAxis, filter, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';
import { getMatcheHistory } from '@/app/chat/Tools/apiTools';
import { timeHandle } from '@/app/chat/Components/utils/utils';

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '15px', color: 'rgba(255, 255, 255, 0.7)' }}>
        <p>{`Match: ${label}`}</p>
        <p>Score: <span className="text-picton_blue/80">{data.score}</span></p>
        <p>Status:<span className={`${data.status === "Finished" ? "text-green-500/80" : "text-red-500/80"}`}> {data.status}</span> </p>
        <p>{`Played At: ${data.playedAt}`}</p>
      </div>
    );
  }

  return null;
};

const Statistique = () => {
  const [Matches, setMatches] = useState<any>();

  useEffect(() => {
    getMatcheHistory().then((data) => {
      setMatches(data);
    });
  }, []);

  if (!Matches) return null;
  // console.log(Matches);

  const updatedData = Matches.map((match: any, index: number) => {
    return {
      name: `match ${index + 1}`,
      score: match.score[0],
      status: match.status,
      playedAt: timeHandle(match.played_at),
    };
  });

  const data = updatedData.slice(-10);

  return (
    <div className="size-full flex flex-col justify-center">
      <h1 className="text-white font-bold text-2xl text_shadow mt-6">Game Activity</h1>
      <div className="flex items-center justify-center size-full px-4 rounded-2xl">
        <ResponsiveContainer width="100%" height="70%" className="mr-4">
          <BarChart data={data}>
            <Bar dataKey="score" fill={`url(#BarGradient)`} barSize={20} radius={[5, 5, 5, 5]} minPointSize={10}/>
            <defs>
              <linearGradient id="BarGradient" x1="0.8" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A46E9C" stopOpacity={0.5} />
                <stop offset="20%" stopColor="#32A9D6" stopOpacity={0.0} />
                <stop offset="80%" stopColor="#32A9D6" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <defs>
              <filter id="shadow" x="0" y="0" width="150%" height="150%">
                <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="rgba(0, 0, 0, 0.7)" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="1 8" vertical={false} stroke="rgba(255, 255, 255, 0.25)" />
            <Tooltip
              content={<CustomTooltip />} // Use the custom tooltip component
              cursor={{fill: "transparent"}}
            />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fill: 'rgba(255, 255, 255, 0.25)', fontSize: 12 }}
              padding={{ right: 10, left: 10 }}
              filter="url(#shadow)"
            />
            <YAxis
              tick={{ fill: 'rgba(255, 255, 255, 0.25)', fontSize: 12 }}
              padding={{ top: 50 }}
              filter="url(#shadow)"
              dx={-10}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Statistique;
"use client";

import { BarChart, Bar, ResponsiveContainer, CartesianGrid, XAxis, YAxis, TooltipProps, Tooltip} from 'recharts';
import { useEffect, useState } from 'react';
import { getMatcheHistory } from '@/app/chat/Tools/apiTools';
import { useUserStore } from '@/app/store/store';

interface Match {
  id: number;
  user_score: number;
  status: string
}

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Match[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '10px', borderRadius: '15px', color: 'rgba(255, 255, 255, 0.7)' }}>
        <p>{`Match: ${label}`}</p>
        <p>Score: <span className="text-picton_blue/80">{data.user_score}</span></p>
        <p>Status:<span className={`${data.status === "Finished" ? "text-green-500/80" : "text-red-500/80"}`}> {data.status}</span> </p>
      </div>
    );
  }

  return null;
};

const Statistique = () => {
  const [Matches, setMatches] = useState<Match[]>();
  const {user} = useUserStore();

  useEffect(() => {
    if (!user) return;
    getMatcheHistory(user.id).then((data) => {
      setMatches(data);
      console.log("data: ", data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  if (!Matches) return null;

  const updatedData = Matches.map((match: Match) => {
    return {
      name: `match ${match.id}`,
      user_score: match.user_score,
      status: match.status,
    };
  });

  const data = updatedData.slice(-10);

  return (
    <div className="size-full flex flex-col justify-center">
      <h1 className="text-white font-bold text-2xl text_shadow mt-6">Game Activity</h1>
      <div className="flex items-center justify-center size-full px-4 rounded-2xl">
        <ResponsiveContainer width="100%" height="70%" className="mr-4">
          <BarChart data={data}>
            <Bar dataKey="user_score" fill={`url(#BarGradient)`} barSize={20} radius={[5, 5, 5, 5]} minPointSize={10}/>
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
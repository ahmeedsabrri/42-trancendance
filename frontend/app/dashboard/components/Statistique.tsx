"use client";

import { BarChart, Bar, ResponsiveContainer, defs, linearGradient, CartesianGrid, XAxis, YAxis, filter } from 'recharts'

const data = [
  {
    name: 'match 1',
    score : 400,
  },
  {
    name: 'match 2',
    score : 300,
  },
  {
    name: 'match 3',
    score : 500,
  },
  {
    name: 'match 4',
    score : 200,
  },
  {
    name: 'match 5',
    score : 600,
  },
  {
    name: 'match 6',
    score : 400,
  },
  {
    name: 'match 7',
    score : 300,
  },
  {
    name: 'match 8',
    score : 500,
  },
  {
    name: 'match 9',
    score : 200,
  },
  {
    name: 'match 10',
    score : 600,
  },
  {
    name: 'match 2',
    score : 300,
  },
  {
    name: 'match 3',
    score : 500,
  },
  {
    name: 'match 4',
    score : 200,
  },
  {
    name: 'match 5',
    score : 600,
  },
  {
    name: 'match 6',
    score : 400,
  },
  {
    name: 'match 7',
    score : 300,
  },
  {
    name: 'match 8',
    score : 500,
  },
  {
    name: 'match 9',
    score : 200,
  },
  {
    name: 'match 10',
    score : 600,
  }
]

const Statistique = () => {
    return (
        <div className="size-full gap-2 shadow-2xl flex flex-col justify-center">
            <h1 className='text-white font-bold text-xl text_shadow'>Game Activity</h1>
            <div className='flex items-center justify-center size-full px-4 border border-border rounded-2xl'>
                <ResponsiveContainer width="100%" height="80%" className="mr-4">
                  <BarChart data={data}>
                    <Bar dataKey="score" fill={`url(#BarGradient)`} barSize={20} radius={[5, 5, 5, 5]}/>
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
                    <CartesianGrid strokeDasharray="1 8" vertical={false} stroke="rgba(255, 255, 255, 0.25)"/>
                    <XAxis dataKey="name" tick={{ fill: "rgba(255, 255, 255, 0.25)", fontSize: 12 }} padding={{ right: 10, left:10 }} filter="url(#shadow)"/>
                    <YAxis tick={{ fill: "rgba(255, 255, 255, 0.25)", fontSize: 12 }} padding={{ top: 50}} filter="url(#shadow)" dx={-10} />
                  </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Statistique;
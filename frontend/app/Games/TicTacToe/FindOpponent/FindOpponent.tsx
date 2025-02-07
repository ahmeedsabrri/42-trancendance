'use client'
import React, { useState, useEffect } from 'react';
import { Circle, X, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useGameStore } from '../../store/GameStore';
import Image from 'next/image';

const MatchmakingInterface = () => {
  const { TicTacOpponent, setTicTacOpponent } = useGameStore();
  const [count, setCount] = useState<number>(3);


  useEffect(() => {
    return () =>{setTicTacOpponent(false, null, null);}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!TicTacOpponent.isFound) return;
    if (count < 1) return;

    const timer = setTimeout(() => setCount((prev)=> prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [TicTacOpponent, count]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 rounded-xl">
      <div className="flex items-center gap-3 mb-8">
        <X className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
        <Circle className="w-8 h-8 text-red-400" />
      </div>

      <div className="relative w-64 h-64 mb-8">
        {!TicTacOpponent.isFound ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {TicTacOpponent.avatar ? (
              <div className="flex flex-col justify-center items-center gap-3">
                <div className="w-32 h-32 border-4 border-gray-700 rounded-full overflow-hidden">
                  <Image src={TicTacOpponent.avatar || ""} alt="Opponent Avatar" fill={true} className="object-cover w-full h-full" />
                </div>
                <h1>{TicTacOpponent.username}</h1>
                <p className="text-xl font-semibold mt-2">Match starting in {count}</p>
              </div>
            ) : (
              <div className="w-32 h-32 border-4 border-gray-700 rounded-full animate-pulse" />
            )}
          </div>
        )}
      </div>

      <div className="text-center mb-8">
        {!TicTacOpponent.isFound && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Finding Opponent</h2>
            <p className="text-gray-400">Expected wait time: ~ Until an opponent is found</p>
          </div>
        )}
      </div>

      <Link href="/Games">
        <button className="mt-8 px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors">
          Cancel Matchmaking
        </button>
      </Link>
    </div>
  );
};

export default MatchmakingInterface;
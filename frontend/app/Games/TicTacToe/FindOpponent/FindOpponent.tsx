'use client'
import React from 'react';
import { Circle, X, Loader2 } from "lucide-react";

const MatchmakingInterface = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-8 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <X className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl font-bold">Tic Tac Toe</h1>
        <Circle className="w-8 h-8 text-red-400" />
      </div>

      {/* Loading Animation */}
      <div className="relative w-64 h-64 mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-4 border-gray-700 rounded-full animate-pulse" />
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">Finding Opponent</h2>
        <p className="text-gray-400">Expected wait time: ~ Until an opponent is found</p>
      </div>
      <button className="mt-8 px-8 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors">
        Cancel Matchmaking
      </button>
    </div>
  );
};

export default MatchmakingInterface;
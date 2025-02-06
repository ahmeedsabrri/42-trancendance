"use client";
import Game from "./components/Game";
import Rank from "./components/Rank";
import Statistique from "./components/Statistique";

export default function Dashboard() {
  return (
    <div className="w-5/6 h-5/6 flex flex-col items-center justify-center border-t-1 shadow-xl border-t border-l border-white/30 backdrop-blur-3xl rounded-3xl p-5">
    	<div className="h-[50%] w-full flex items-center gap-4">
    		<Game />
    		<Rank />
    	</div>
    	<div className="h-[50%] w-full flex items-center">
    		<Statistique />
    	</div>
    </div>
  );
}

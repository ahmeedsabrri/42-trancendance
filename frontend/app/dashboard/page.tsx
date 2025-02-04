"use client";
import Game from "./components/Game";
import Rank from "./components/Rank";
import Statistique from "./components/Statistique";

export default  function   Dashboard() {
  return (
    <div className=" w-full h-full hide-scrollbar overflow-y-scroll bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl rounded-3xl overflow-hidden px-2 border border-white/10">
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

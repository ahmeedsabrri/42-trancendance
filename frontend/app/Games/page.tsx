'use client'

import { useGameStore } from "./store/GameStore";
import GamePanel from "./components/gamePannel/GamePanel";
import { useGameStateStore } from "./store/CanvasStore";
import { useEffect } from "react";

const Games = () => {
	const { isFirstDotLarge, currentGame, handleGameSwitch} = useGameStore();
	const { setWinner } = useGameStateStore();

	useEffect(() => {
		setWinner(null);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center rounded-3xl overflow-hidden px-2 border border-white/10">
			<main className="w-full h-full flex justify-center items-center gap-x-3 p-2 relative overflow-hidden">
				<GamePanel gameType="pingpong" />
				<GamePanel gameType="tictactoe" />
			</main>
			
			<div className="flex justify-center items-center gap-x-2 content-center mb-1">
				<div className={`transition-all duration-300 rounded-full ${isFirstDotLarge ? 'px-[24px] py-[10px] bg-white bg-opacity-40' : 'px-[12px] py-[10px] bg-black bg-opacity-25 cursor-pointer'}`} onClick={currentGame === 'tictactoe' ? handleGameSwitch : undefined}></div>
				<div className={`transition-all duration-300 rounded-full ${!isFirstDotLarge ? 'px-[24px] py-[10px] bg-pink-500 bg-opacity-40' : 'px-[12px] py-[10px] bg-black bg-opacity-25 cursor-pointer'}`} onClick={currentGame === 'pingpong' ? handleGameSwitch : undefined}></div>
			</div>
		</div>
	);
}

export default Games;
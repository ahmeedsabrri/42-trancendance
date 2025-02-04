'use client'

import { useEffect, useState } from "react";
import { useGameStateStore } from "../../store/CanvasStore";
import WaitingDots from "./WaitingDots";
import Avatar from "@/components/navbar/profilebar/Avatar";

const WaitingForPlayer = () => {

    const { game_status, countdown, setCountdown } = useGameStateStore();
    const { player1info, player2info } = useGameStateStore()

    useEffect(() => {
        if (game_status === "ready" && countdown > 0) {
            const timer = setInterval(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [game_status, countdown, setCountdown]);

    const WaitingReadyComponent = () => {
        if (game_status === "waiting" || !game_status) {
            return <h1 className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-bold p-2 drop-shadow-2xl">Searching for player</h1>
        } else if (game_status === "ready" && countdown > 0) {
            return <h1 className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-bold p-2 drop-shadow-2xl">Match starts in {countdown}</h1>
        }
    }


    const Player = () => {
        if (game_status === "waiting")
            return <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
        else
            return <Avatar width={300} height={300} avatar={player2info.avatar} />
      }

    return (
        <div className='flex flex-col justify-center items-center w-full h-[80%] gap-y-32'>
            <div className='text-white text-8xl font-extrabold mt-9'>
                <WaitingReadyComponent />
                <WaitingDots width={12} height={12} />
            </div>
            <div className='flex justify-around items-center w-[80%]'>
                <div className="flex flex-col justify-center items-center gap-y-4">
                    <div className='w-[300px] h-[300px] bg-gray-500 bg-opacity-30 backdrop-blur-xl rounded-full broder border-2 border-gray-500'>
                        <Avatar width={300} height={300} avatar={player1info.avatar} />
                    </div>
                    <p className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 p-2">{ player1info.fullname }</p>
                </div>
                <div className='text-9xl drop-shadow-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500'>
                    VS
                </div>
                <div className="flex flex-col justify-center items-center gap-y-4">
                    <div className="w-[300px] h-[300px] bg-gray-500 bg-opacity-30 backdrop-blur-xl rounded-full flex flex-col items-center justify-center gap-4 broder border-2 border-gray-500">
                        {/* here is going to the picture of the second opponent */}
                        <Player />
                    </div>
                    <p className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-semibold p-2">
                        { game_status === "waiting" ? "Waiting" : player2info.fullname }
                        { game_status === "waiting" && <WaitingDots width={4} height={4} /> }
                    </p>
                </div>
            </div>
        </div>
    )
};

export default WaitingForPlayer;

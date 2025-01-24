'use client'

import Avatar from "../../components/navbar/profilebar/Avatar";
import { useGameStateStore } from "../../store/CanvasStore";
import { useEffect, useRef } from "react";

const Scores = () => {

    const { player1, player2} = useGameStateStore();

    const player1ScoreRef = useRef(player1.score);
    const player2ScoreRef = useRef(player2.score);
        
    useEffect(() => {
        player1ScoreRef.current = player1.score;
        player2ScoreRef.current = player2.score;

    }, [player1, player2]);

    
    return (
        <div className="w-full flex-start gap-y-8 px-6 mt-4">
            <div className="w-full h-[90px] flex justify-between items-center">
                <div className="flex justify-center items-center gap-x-3">
                    <Avatar width={70} height={70} />
                    <span className="text-white font-semibold">
                        {player1.fullname || "player 1"}
                    </span>
                </div>
                <div className="w-[500px] flex justify-between items-center relative">
                    <span className="text-8xl font-normal text-white ">{player1ScoreRef.current}</span>
                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                    <span className="text-8xl font-normal text-white ">{player2ScoreRef.current}</span>
                </div>
                <div className="flex justify-center items-center gap-x-3">
                    <span className="text-white font-semibold">
                        {player2.fullname || 'player 2'}

                    </span>
                    <Avatar width={70} height={70} />
                </div>
            </div>
        </div>
    )
}

export default Scores;
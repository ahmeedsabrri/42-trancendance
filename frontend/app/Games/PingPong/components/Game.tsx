'use client'

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import CustomButton from '../../components/utils/CutsomButton';
import { IMAGES } from "@/public/index";
import { useGameStateStore } from '../../store/CanvasStore';
import Winner from './winner';
import Canvas from './Canvas/Canvas';
import Scores from './Scores';

interface GameProps {
    mode: 'local' | 'online';
}

const Game: React.FC<GameProps> = ({ mode }) => {

    const { player1, player2, winner } = useGameStateStore();

    const player1ScoreRef = useRef(player1.score);
    const player2ScoreRef = useRef(player2.score);
    const winnerRef = useRef(winner);

    useEffect(() => {
        player1ScoreRef.current = player1.score;
        player2ScoreRef.current = player2.score;
        winnerRef.current = winner;
    }, [player1, player2, winner]);

    return (
        <div className="py-1 bg-gray-500  bg-opacity-30 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center rounded-3xl overflow-hidden px-2">
            <main className="w-full h-full flex justify-center items-center gap-x-2 p-2 relative">
                <div className="w-full h-full rounded-3xl relative flex flex-col justify-center items-center bg-black bg-opacity-20 pb-5">
                    <Image
                        src={IMAGES.pongTable}
                        alt="pong game"
                        fill
                        className="object-cover rounded-3xl -z-10"
                        quality={100}
                        priority
                    />
                    <div className="w-full h-full rounded-3xl relative flex flex-col justify-start items-center">

                        <Scores mainPlayerScore={player1ScoreRef} secondPlayerScore={player2ScoreRef} mode={mode}/>
                        
                        { winnerRef.current ? <Winner winner={ winnerRef.current } /> : <Canvas /> }
                        {
                            winnerRef.current &&
                            <Link href={"/Games"}>
                                <CustomButton
                                    label="EXIT"
                                    className="mt-48 text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                                />
                            </Link>
                        }
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Game; 
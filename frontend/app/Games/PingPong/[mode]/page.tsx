'use client'

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Image from "next/image";
import CustomButton from '../../components/utils/CutsomButton';
import { IMAGES } from "@/public/index";
import { useGameStateStore } from '../../store/CanvasStore';
import Winner from '../components/VictoryCard';
import Canvas from '../components/Canvas/Canvas';
import Scores from '../components/Scores';
import { useParams } from 'next/navigation';


const Game = () => {

    const mode = useParams().mode;
    const { winner, game_status, countdown } = useGameStateStore();
    const winnerRef = useRef(winner);

    useEffect(() => {
        winnerRef.current = winner;
    }, [winner, game_status]);

    const ScoresContent = () => {
        if (mode === "local" || (game_status === "ready" && countdown == 0))
            return <Scores />;
        return null;
    }

    const WinnerCardOrCanvas = winnerRef.current ? <Winner winner={winnerRef.current} /> : <Canvas />;
    
    const ExitButton = () => {
        if (winnerRef.current) {
            return (
                <Link href={"/Games"}>
                    <CustomButton
                        label="EXIT"
                        className="mt-48 text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                    />
                </Link>
            )
        }
        return null;
    }

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
                    <ScoresContent />
                    { WinnerCardOrCanvas }
                    <ExitButton />
                </div>
            </div>
        </main >
    </div >
);
};

export default Game; 
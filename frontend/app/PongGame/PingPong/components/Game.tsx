'use client'

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Image from "next/image";
import Avatar from '../../components/navbar/profilebar/Avatar';
import CustomButton from '../../components/utils/CutsomButton';
import { IMAGES } from "@/public/index";
import GameCanvas from './GameCanvas';
import { useGameStore } from '../../store/PannelStore';
import { useGameStateStore } from '../../store/CanvasStore';

interface GameProps {
    mode: 'local' | 'online';
}

const Game: React.FC<GameProps> = ({ mode }) => {

    const { label, handleCurrentState, } = useGameStore();
    const { player1, player2, winner } = useGameStateStore();

    const player1ScoreRef = useRef(player1.score);
    const player2ScoreRef = useRef(player2.score);
    const winnerRef = useRef(winner);
    useEffect(() => {
        player1ScoreRef.current = player1.score;
        player2ScoreRef.current = player2.score;
        winnerRef.current = winner;
    }, [player1, player2, winner]);

    useEffect(() => {
        if (mode === 'online') {

        } else if (mode == 'local') {

        }
    }, [mode]);

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
                        <div className="w-full flex-start gap-y-8 px-6 mt-4">
                            <div className="w-full h-[90px] flex justify-between items-center">
                                <div className="flex justify-center items-center gap-x-3">
                                    <Avatar width={70} height={70} />
                                    <span className="text-white font-semibold">
                                        {mode === 'local' ? 'Player 1' : 'khalid zerri'}
                                    </span>
                                </div>
                                <div className="w-[500px] flex justify-between items-center relative">
                                    <span className="text-8xl font-normal text-white ">{player1ScoreRef.current}</span>
                                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                                    <span className="text-8xl font-normal text-white ">{player2ScoreRef.current}</span>
                                </div>
                                <div className="flex justify-center items-center gap-x-3">
                                    <span className="text-white font-semibold">
                                        {mode === 'local' ? 'Player 2' : 'Anass raji afoua'}
                                    </span>
                                    <Avatar width={70} height={70} />
                                </div>
                            </div>
                        </div>
                        {!winnerRef.current
                            ?
                            <div className="flex justify-center flex-col items-center p-4 bg-gray-500  bg-opacity-30 backdrop-blur-xl  rounded-xl mt-2" >
                                <GameCanvas />
                                <div className='flex justify-between items-center w-[100%]'>

                                    <Link href="/PongGame/PingPong/local">
                                        <CustomButton
                                            label="RESTART"
                                            // onClick={() => { restart(resetGame) }}
                                            className="mt-5 text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                                        />
                                    </Link>
                                    <CustomButton
                                        label={label}
                                        onClick={() => { handleCurrentState() }}
                                        className="mt-5 text-white text-4xl font-bold bg-gray-800 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                                    />
                                </div>
                            </div>
                            :
                            <div
                                className='w-[50%] h-[50%] flex flex-col justify-center items-center p-4 text-white mt-24 rounded-3xl relative'
                                style={{
                                    background: 'linear-gradient(to right, rgba(0, 161, 255, 0), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0), rgba(0, 225, 79, 0), rgba(0, 186, 65, 0))',
                                    borderRadius: '24px',
                                    position: 'relative',
                                    zIndex: 1
                                }}
                            >
                                <div
                                    className='absolute inset-0 -z-1 rounded-3xl w-full h-full'
                                    style={{
                                        background: 'linear-gradient(to right, rgba(0, 161, 255, 0.3), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1), rgba(0, 225, 79, 0.1), rgba(0, 186, 65, 0.3))',
                                        filter: 'blur(20px)',
                                        zIndex: -1
                                    }}
                                />
                                <h1
                                    className='text-[150px] font-bold'
                                    style={{
                                        textShadow: `
                                            0px 0px 10px rgba(0, 161, 255, 0.8),
                                            0px 0px 20px rgba(255, 255, 255, 0.8),
                                            0px 0px 30px rgba(0, 225, 79, 0.8),
                                            0px 0px 40px rgba(0, 186, 65, 0.8)`
                                    }}
                                >
                                    WINNER
                                </h1>
                                <div
                                    className='w-[90%] h-[20%] flex justify-center items-center gap-x-6 rounded-[30px]'
                                    style={{
                                        background: 'linear-gradient(to right, rgba(255, 234, 0, 0.8), rgba(179, 179, 179, 0.5), rgba(204, 204, 204, 0.4), rgba(255, 255, 255, 0.0))'
                                    }}
                                >
                                    <Avatar width={60} height={60} />
                                    <h1 className='text-5xl font-bold'>{winner ? winner : "khalid"}</h1>
                                </div>
                            </div>
                        }
                        {
                            winner &&
                            <CustomButton
                                label="RESTART"
                                // onClick={() => { restart(resetGame) }}

                                className="mt-48 text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                            />
                        }
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Game; 
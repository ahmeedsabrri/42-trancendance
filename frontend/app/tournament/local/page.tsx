'use client'
import { useState, useEffect } from 'react'
import SubmitName from './SubmitName/SubmitName'
import Player from './Player/Player'
import Image from 'next/image'
import { IMAGES } from '@/public/index'
import { useGameStore } from '../..//Games/store/GameStore'
import { useRouter } from 'next/navigation'
import { useGameStateStore } from '@/app/Games/store/CanvasStore'
import Link from 'next/link'
import CustomButton from '@/app/Games/components/utils/CutsomButton'

const Tournament = () => {
    const router = useRouter();
    const { is_tournament, setIsTournament, tournament_match, setTournamentMatch, resetTournamentPlayer, tournament_players } = useGameStore();
    const { setWinner } = useGameStateStore();
    const [isStartClickable, setStartClick] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const ExitButton = () => {

        return (
            <Link href={"/Games"} className='absolute bottom-[75px]'>
                <CustomButton
                    label="EXIT"
                    className="text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                />
            </Link>
        )
    }

    useEffect(() => {
        if (tournament_players[0] && tournament_players[1] && tournament_players[2] && tournament_players[3] && tournament_players.includes(null)) {
            setStartClick(true);
        }
    }, [tournament_players]);

    const monitorTournament = () => {
        if (!isStartClickable) return;

        if (!tournament_match) {
            setTournamentMatch("first match");
            setIsTournament(true);
        }
        else if (tournament_match === "first match")
            setTournamentMatch("second match");
        else if (tournament_match === "second match")
            setTournamentMatch("last match");
        router.push('/Games/PingPong/local');
    };

    useEffect(() => {
        if (!isStartClickable && !tournament_players.includes(null)) {
            setIsTournament(false)
            setTournamentMatch(null)
            setIsFinished(true)
            setWinner('')
        }
    }, [isStartClickable, tournament_players, setIsTournament, setWinner]);

    return (

        <div className="py-1 bg-gray-500  bg-opacity-30 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center rounded-3xl overflow-hidden px-2">
            <main className="w-full h-full flex justify-center items-center gap-x-2 p-2 relative">
                <div className="w-full h-full rounded-3xl relative flex flex-col justify-center items-center bg-black bg-opacity-20">
                    <Image
                        src={IMAGES.fontBackground}
                        alt="pong game"
                        fill
                        className="object-cover rounded-3xl -z-10"
                        quality={100}
                        priority
                    />
                    <div className="w-full h-full rounded-3xl relative flex flex-col justify-center items-center bg-black bg-opacity-20 backdrop-blur-3xl">
                        <div className="w-full h-full flex justify-around items-center">
                            <div className="w-[12%] h-[70%] mt-20 mr-18 border-r-[0.5px] border-t-[0.5px] border-teal-400 rounded-tr-2xl relative">
                                <div className="absolute -left-[140%] -top-[75px] w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl flex justify-start items-center bg-black bg-opacity-20">
                                    <Player username={tournament_players[0] || null} index={0} />
                                </div>
                            </div>
                            <div className="w-[12%] h-[70%] mt-20 ml-18 border-l-[0.5px] border-t-[0.5px] border-teal-400 rounded-tl-2xl relative">
                                <div className="absolute -right-[140%] -top-[75px] w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl flex justify-start items-center bg-black bg-opacity-20">
                                    <Player username={tournament_players[1] || null} index={1} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-center items-center gap-x-4">
                            <div className="w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl relative flex items-center bg-black bg-opacity-20">
                                <h1 className="w-full text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-mono font-bold">{tournament_players[4]}</h1>
                            </div>
                            <div className="border-t-[0.5px] w-[3%] border-teal-400"></div>
                            <div className="w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl relative flex items-center bg-black bg-opacity-20">
                                <h1 className="absolute -top-20 left-20 text-6xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500 hover:bg-gradient-to-l font-mono font-bold drop-shadow-[0_4px_12px_rgba(99,102,241,0.6)] transition-all duration-500">
                                    WINNER
                                </h1>
                                <h1 className="w-full text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-mono font-bold">{tournament_players[6]}</h1>
                            </div>
                            <div className="border-t-[0.5px] w-[3%] border-teal-400"></div>
                            <div className="w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl relative flex items-center bg-black bg-opacity-20">
                                <h1 className="w-full text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-mono font-bold">{tournament_players[5]}</h1>
                            </div>
                        </div>
                        <div className="w-full h-full flex justify-around items-center relative">
                            <div className="w-[12%] h-[70%] mb-20 mr-18 border-r-[0.5px] border-b-[0.5px] border-teal-400 rounded-br-2xl relative">
                                <div className="absolute -left-[140%] -bottom-[75px] w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl flex justify-start items-center bg-black bg-opacity-20">
                                    <Player username={tournament_players[2] || null} index={2} />
                                </div>
                            </div>
                            {isFinished ? <ExitButton />
                                :
                                (<button
                                    className={`absolute bottom-[75px] text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none ${!isStartClickable ? 'cursor-not-allowed' : ''}`}
                                    onClick={monitorTournament}
                                    disabled={!isStartClickable}
                                >
                                    START
                                </button>)}
                            <div className="w-[12%] h-[70%] mb-20 ml-18 border-l-[0.5px] border-b-[0.5px] border-teal-400 rounded-bl-2xl relative">
                                <div className="absolute -right-[140%] -bottom-[75px] w-[23rem] h-[9rem] border-[0.5px] border-gray-400 rounded-3xl flex justify-start items-center bg-black bg-opacity-20">
                                    <Player username={tournament_players[3] || null} index={3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Tournament;
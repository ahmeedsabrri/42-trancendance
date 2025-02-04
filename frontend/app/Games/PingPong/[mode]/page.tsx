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
import { useGameStore } from '../../store/GameStore';


const Game = () => {

    const mode = useParams().mode;
    const { winner, game_status, countdown, setWinner } = useGameStateStore();
    const winnerRef = useRef(winner.fullname);
    const avatarRef = useRef(winner.avatar);

    const {tournament_match, is_tournament, tournament_players, setTournamentPlayers, setTournamentMatch, handleCurrentState} = useGameStore()

    function setWinnerInTournament(player_winner:string)
    {
        if (tournament_match === "first match")
            player_winner === "player1" ? setTournamentPlayers(tournament_players[0], 4) : setTournamentPlayers(tournament_players[2], 4)
        else if (tournament_match === "second match")
            player_winner === "player1" ? setTournamentPlayers(tournament_players[1], 5) : setTournamentPlayers(tournament_players[3], 5)
        else if (tournament_match === "last match")
            player_winner === "player1" ? setTournamentPlayers(tournament_players[4], 6) : setTournamentPlayers(tournament_players[5], 6)
    }

    useEffect(() => {
        setWinner('')
    }, []);

    useEffect(() => {
        winnerRef.current = winner.fullname;
        avatarRef.current = winner.avatar;
        is_tournament && setWinnerInTournament(winnerRef.current);
        console.log(winnerRef.current);
    }, [winner, game_status]);

    const ScoresContent = () => {
        if (mode === "local" || (game_status === "ready" && countdown == 0))
            return <Scores />;
        return null;
    }

    const WinnerCardOrCanvas = winnerRef.current ? <Winner winner={winnerRef.current} winner_avatar={avatarRef.current} /> : <Canvas />;
    
    const Continue = () => {
        if (winnerRef.current) {
            return (
                <Link href={"/tournament/local"}>
                    <CustomButton
                        label="CONTINUE"
                        className="mt-48 text-white text-4xl font-bold bg-amber-300 bg-opacity-30 backdrop-blur-xl px-16 py-6 hover:bg-opacity-40 rounded-3xl outline-none"
                        onClick={() => { handleCurrentState() }}
                    />
                </Link>
            )
        }
        return null;
    }
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
                    {is_tournament ? <Continue/> : <ExitButton />}
                </div>
            </div>
        </main >
    </div >
);
};

export default Game; 
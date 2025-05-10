'use client'

import Avatar from "../../components/navbar/profilebar/Avatar";
import { useGameStateStore } from "../../store/CanvasStore";
import { useEffect, useRef } from "react";
import { useGameStore } from "../../store/GameStore";

const Scores = () => {

    interface TournamentPlayers {
        first_player_name: string | null,
        second_player_name: string | null
    }

    const { player1info, player2info, player1, player2 } = useGameStateStore();

    const player1ScoreRef = useRef(player1.score);
    const player2ScoreRef = useRef(player2.score);
    const tournamentPlayers = useRef<TournamentPlayers>({ first_player_name: null, second_player_name: null })

    const { tournament_players, tournament_match, is_tournament } = useGameStore()

    function getPlayers() {
        if (tournament_match === "first match") {
            tournamentPlayers.current.first_player_name = tournament_players[0]
            tournamentPlayers.current.second_player_name = tournament_players[2]
        }
        else if (tournament_match === "second match") {
            tournamentPlayers.current.first_player_name = tournament_players[1]
            tournamentPlayers.current.second_player_name = tournament_players[3]
        }
        else if (tournament_match === "last match") {
            tournamentPlayers.current.first_player_name = tournament_players[4]
            tournamentPlayers.current.second_player_name = tournament_players[5]
        }
    }

    if (is_tournament)
        getPlayers()
    
    useEffect(() => {
        player1ScoreRef.current = player1.score;
        player2ScoreRef.current = player2.score;

    }, [player1, player2]);

    return (
        <div className="w-full flex-start gap-y-8 px-6 mt-4">
            <div className="w-full h-[90px] flex justify-between items-center">
                <div className="flex justify-center items-center gap-x-3">
                    {is_tournament ? (
                        <>
                            <Avatar width={70} height={70} avatar={player1info.avatar} />
                            <span className="text-white font-semibold">
                                {tournamentPlayers.current.first_player_name}
                            </span>
                        </>
                    )
                        :
                        (
                            <>
                                <Avatar width={70} height={70} avatar={player1info.avatar} />
                                <span className="text-white font-semibold">
                                    {player1.fullname}
                                </span>
                            </>
                        )}
                </div>
                <div className="w-[500px] flex justify-between items-center relative">
                    <span className="text-8xl font-normal text-white ">{player1ScoreRef.current}</span>
                    <span className="text-4xl font-normal text-white absolute left-56">vs</span>
                    <span className="text-8xl font-normal text-white ">{player2ScoreRef.current}</span>
                </div>
                <div className="flex justify-center items-center gap-x-3">
                    {is_tournament ? (
                        <>
                            <span className="text-white font-semibold">
                                {tournamentPlayers.current.second_player_name}
                            </span>
                            <Avatar width={70} height={70} avatar={player1info.avatar} />
                        </>
                    )
                        :
                        (
                            <>
                                <span className="text-white font-semibold">
                                    {player2.fullname}
                                </span>
                                <Avatar width={70} height={70} avatar={player2info.avatar} />
                            </>
                        )}
                </div>
            </div>
        </div>
    )
}

export default Scores;
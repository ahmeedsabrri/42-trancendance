'use client'

import Avatar from "../../components/navbar/profilebar/Avatar";
import { useGameStore } from "../../store/GameStore";
import { useRef } from "react";

interface WinnerProp {
    winner: string | null;
    winner_avatar: string | null;
    reason: string | null;
}


const Winner: React.FC<WinnerProp> = ({ winner, winner_avatar, reason}) => {

    const { tournament_match, is_tournament, tournament_players } = useGameStore()
    const tournamentMatchWinner = useRef<string>(null)

    if (is_tournament) {
        if (tournament_match === "first match") {
            tournamentMatchWinner.current = winner === "player1" 
                ? tournament_players[0] 
                : tournament_players[2];
        }
        else if (tournament_match === "second match") {
            tournamentMatchWinner.current = winner === "player1" 
                ? tournament_players[1] 
                : tournament_players[3];
        }
        if (tournament_match === "last match") {
            tournamentMatchWinner.current = winner === "player1" 
                ? tournament_players[4] 
                : tournament_players[5];
        }
    }

    const headerStyle = { textShadow: `0px 0px 10px rgba(0, 161, 255, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.8), 0px 0px 30px rgba(0, 225, 79, 0.8), 0px 0px 40px rgba(0, 186, 65, 0.8)` };
    const divStyle = { background: 'linear-gradient(to right, rgba(255, 234, 0, 0.8), rgba(179, 179, 179, 0.5), rgba(204, 204, 204, 0.4), rgba(255, 255, 255, 0.0))' }
    const description = "WINNER";

    return (
        <div
            className='w-[50%] h-[50%] flex flex-col justify-center items-center p-4 text-white mt-24 mb-36 rounded-3xl relative'
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
                className='text-[180px] font-bold'
                style={headerStyle} >
                {description}
            </h1>
            <div
                className='w-[90%] h-[20%] flex justify-center items-center gap-x-6 rounded-[30px]'
                style={divStyle}
            >
                <Avatar width={60} height={60} avatar={winner_avatar || ""} />
                <h1 className='text-5xl font-bold'>{is_tournament ? tournamentMatchWinner.current : winner}</h1>
            </div>
            <h1
                className='text-xl font-bold mt-16'
                style={headerStyle} >
                {is_tournament ? "" : (reason ? reason : "")}
            </h1>
        </div>
    )
}

export default Winner;
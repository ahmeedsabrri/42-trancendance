'use client'

import { useParams } from "next/navigation";
import Avatar from "../../components/navbar/profilebar/Avatar";
import { useGameStateStore } from "../../store/CanvasStore";

interface WinnerProp {
    winner: String;
    winner_avatar: String;
}

const Winner: React.FC<WinnerProp> = ({ winner, winner_avatar}) => {


    // // username from the auth
    // const username = "player1";
    // const mode = useParams().mode;
    
    let headerStyle = { textShadow: `0px 0px 10px rgba(0, 161, 255, 0.8), 0px 0px 20px rgba(255, 255, 255, 0.8), 0px 0px 30px rgba(0, 225, 79, 0.8), 0px 0px 40px rgba(0, 186, 65, 0.8)` };
    let divStyle = { background: 'linear-gradient(to right, rgba(255, 234, 0, 0.8), rgba(179, 179, 179, 0.5), rgba(204, 204, 204, 0.4), rgba(255, 255, 255, 0.0))' }
    let description = "WINNER";

    // if (mode == "online")
    // if (mode === "local")
    // {
    //     // if (winner !== username) {
    //     if (winner === "")
    //     {
    //         headerStyle = { textShadow: `0px 0px 10px rgba(255, 0, 0, 0.8), 0px 0px 20px rgba(255, 0, 0, 0.8), 0px 0px 30px rgba(255, 0, 0, 0.8), 0px 0px 40px rgba(255, 0, 0, 0.8)` };
    //         divStyle = { background: 'linear-gradient(to right, rgba(255, 234, 0, 0.8), rgba(179, 179, 179, 0.5), rgba(204, 204, 204, 0.4), rgba(255, 255, 255, 0.0))' };
    //         description =  "LOSER";
    //     }
    // }
    
    return (
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
                style={ headerStyle } >
                { description }
            </h1>
            <div
                className='w-[90%] h-[20%] flex justify-center items-center gap-x-6 rounded-[30px]'
                style={ divStyle }
            >
                <Avatar width={60} height={60} avatar={winner_avatar}/>
                <h1 className='text-5xl font-bold'>{ winner }</h1>
            </div>
        </div>
    )
}

export default Winner;
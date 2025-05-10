import React, { useState } from 'react';
// import './Player.css'
import SubmitName from '../SubmitName/SubmitName';
import { useGameStore } from '@/app/Games/store/GameStore';
import Image from 'next/image';


interface PlayerInfos {
    username: string | null,
    index: number,
}

const Player: React.FC<PlayerInfos> = ({ username, index }) => {

    const [submitVisibility, setSubmitVisibility] = useState<true | false>(false)
    const { setTournamentPlayers } = useGameStore();

    const handleSubmit = (username: string) => {
        setTournamentPlayers(username, index);
        setSubmitVisibility(false);
    };

    return (
        <>
            {username === null ?
                ((<button className="flex items-center justify-center w-[70px] h-[70px] rounded-full outline-none opacity-50 bg-[rgba(255,255,255,0.25)] border-[2px] border-[rgba(255,255,255,0.5)] ml-[20px] z-[1] bg-white bg-opacity-40 backdrop-blur-3xl"
                    onClick={() => setSubmitVisibility(true)}>
                        <Image
                            src="/game/icons/Add.svg"  alt='add_sign' width={30} height={30}
                        />
                </button>))
                : <h1 className="w-full p-7 text-center text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 font-mono font-bold">{username}</h1>}
            {submitVisibility && <SubmitName onClose={() => setSubmitVisibility(false)}
                onSubmit={handleSubmit} />}
        </>
    )
}

export default Player;
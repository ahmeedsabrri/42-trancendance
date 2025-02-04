'use client'

import Image from "next/image";
import Link from "next/link";
import CustomButton from "../components/utils/CutsomButton";
import Mode from "../components/game_mode/GameMode";
import { IMAGES } from "@/public/index";
import { useGameStore } from "../store/GameStore";

const GameMode = () => {
    const { selectedMode, getGamePath } = useGameStore();
    
    return (
        <div className="bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center rounded-3xl overflow-hidden px-2">
            <main className="w-full h-full flex justify-center items-center gap-x-3 p-2 relative">
                <div className="w-full h-full rounded-3xl relative flex flex-col justify-center items-center bg-black bg-opacity-20 pb-5">
                    <Image
                        src={IMAGES.pongTable}
                        alt="pong game"
                        fill
                        className="object-cover rounded-3xl -z-10"
                        quality={100}
                        priority
                    />
                    <div className="w-full h-full rounded-3xl relative flex justify-center items-center py-2 px-2">
                        <Link href="/Games" className="p-5 bg-gray-500 bg-opacity-30 backdrop-blur-xl self-start rounded-full cursor-pointer hover:bg-white/10">
                            <Image
                                src={IMAGES.BackwardButton}
                                alt="Backward button"
                                width={36}
                                height={36}
                            />
                        </Link>
                        <div className="w-full h-full flex justify-center items-center gap-x-4 px-6">
                            <Mode mode="LOCAL GAME" type="local" src={IMAGES.LocalGame} />
                            <Mode mode="ONLINE GAME" type="online" src={IMAGES.OnlineGame} />
                        </div>
                    </div>
                    <div className="w-full absolute bottom-3 flex justify-center items-center">
                        <Link href={`${selectedMode ? '/Games/GameBackground' : ''}`}>
                            <CustomButton 
                                label="NEXT" 
                                className={`ml-20 text-white text-4xl font-bold ${
                                    selectedMode 
                                        ? 'bg-blue-300 bg-opacity-60 hover:bg-opacity-40 cursor-pointer' 
                                        : 'bg-gray-400 bg-opacity-40 cursor-not-allowed'
                                } backdrop-blur-xl px-16 py-6 rounded-3xl`}
                            />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default GameMode;
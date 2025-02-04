'use client'
import Link from "next/link";
import CustomButton from "../components/utils/CutsomButton";
import { useGameStore } from "../store/GameStore";
import { IMAGES } from "@/public/index";
import Image from "next/image";
import { useState, useEffect } from "react";

const ChooseBackground = () => {

    const { GameBoardColor, setGameBoardColor, getGamePath } = useGameStore();
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [isFirstRender, setIsFirstRender] = useState(true);


    const handleDivClick = (index: number) => {
      setIsFirstRender(false);
      setActiveIndex(index === activeIndex ? null : index);
    };

    const divClasses = [
        "bg-gradient-to-br from-orange-700 via-red-600 to-rose-900",
        "bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-800",
        "bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900",
        "bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900",
        "bg-gradient-to-br from-blue-700 via-cyan-600 to-teal-700",
      ];
    
    useEffect(() => {
        setGameBoardColor(divClasses[2]);
        setActiveIndex(2);
    }, []);
    return (
        <div className="bg-gray-500 py-1 bg-opacity-30 backdrop-blur-xl w-full h-full flex flex-col justify-center items-center rounded-3xl overflow-hidden px-2">
            <main className="w-full h-full flex justify-center items-center gap-x-3 p-2 relative">
                <div className="w-full h-full rounded-3xl relative flex flex-col justify-between items-center bg-black bg-opacity-40">
                    <Image
                        src={IMAGES.pongTable}
                        alt="pong game"
                        fill
                        className="object-cover rounded-3xl -z-10"
                        quality={100}
                        priority
                    />
                    <h1 className="text-7xl inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300 font-bold p-2 drop-shadow-2xl mt-24">CHOOSE YOUR PERFECT COLOR ENVIRONMENT</h1>
                    <div className="flex justify-around items-center w-full">
                        {divClasses.map((gradient, index: number) => (
                            <div
                                key={index}
                                onClick={() => {
                                    handleDivClick(index);
                                    setGameBoardColor(gradient);
                                }}
                                className={`${gradient} p-40 rounded-3xl transition duration-300 ease-in-out cursor-pointer border-white
                                ${(isFirstRender && index === 2) || (!isFirstRender && activeIndex === index)
                                    ? "scale-110 -translate-y-1 border-2" 
                                    : "hover:scale-110 hover:-translate-y-1"
                                }`}
                            ></div>
                        ))}
                    </div>
                    <div className="w-full h-[20%] flex justify-center items-center">
                        <Link href={GameBoardColor ? getGamePath() : ""}>
                            <CustomButton
                                label="START"
                                className={`text-white text-4xl font-bold ${GameBoardColor
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

export default ChooseBackground;
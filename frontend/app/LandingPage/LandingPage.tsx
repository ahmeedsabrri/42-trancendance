'use client'

import Link from "next/link";
import CustomButton from "../Games/components/utils/CutsomButton";
import { useState, useEffect } from "react";

const LandingPage = () => {

    const text = "Loading... Get ready to smash into the world of ping-pong!";
    const [displayText, setDisplayText] = useState("");
    const [index, setIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const typingSpeed = isDeleting ? 50 : 100; // Speed for typing & deleting

        const timeout = setTimeout(() => {
            if (!isDeleting && index < text.length) {
                setDisplayText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            } else if (isDeleting && index > 0) {
                setDisplayText((prev) => prev.slice(0, -1));
                setIndex((prev) => prev - 1);
            } else {
                setIsDeleting((prev) => !prev); // Switch mode after typing/deleting
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [index, isDeleting, text]);


    return (
        <main className="w-screen h-screen flex flex-col p-16">
            <div className="flex justify-between items-start mt-4 gap-x-10">
                <div className="flex-1 flex flex-col items-start justify-start  animate-slide-up gap-y-7 ">
                    <div className="w-full flex flex-col items-start gap-y-4 animate-slide-up">
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 text-8xl font-extrabold transform transition-all duration-300 hover:text-gray-300/50 w-full">WELCOME TO THE</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 text-8xl font-extrabold transform transition-all duration-300 hover:text-gray-300/50 w-full">ULTIMATE</p>
                        <p className="text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 text-8xl font-extrabold transform transition-all duration-300 hover:text-gray-300/50 w-full">PING PONG ARENA</p>
                    </div>
                    <div className="h-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-500 text-2xl font-extrabold transform transition-all duration-300 hover:text-gray-300/50 mt-24 animate-slide-up">
                        <p>{displayText}</p>
                    </div>
                    <Link href={'/auth'} className="cursor-pointer">
                        <CustomButton
                            label="Get Started"
                            className={`text-white text-4xl font-bold bg-black bg-opacity-60 hover:bg-opacity-40 cursor-pointer backdrop-blur-xl px-12 py-6 rounded-3xl shadow-2xl shadow-black transform transition-all duration-300 hover:scale-110 `}
                        />
                    </Link>
                </div>
                <div className="w-[1300px] h-[1200px] rounded-[40px] animate-slide-up flex justify-center items-center bg-landingPage bg-no-repeat bg-cover shadow-[5px_5px_15px_25px_rgba(126,58,242,0.3)]" />
            </div>
        </main>
    )
}

export default LandingPage;

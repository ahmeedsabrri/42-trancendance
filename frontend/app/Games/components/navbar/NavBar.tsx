'use client'

import { useUserStore } from "@/app/store/store";
import SearchBar from "./SeachBar";
import Profile from "./profilebar/Profile";
import { useChatStore } from "@/app/store/chatStore";
import { useEffect } from "react";
import useChatSocket from "@/hooks/useChatSocket";

const NavBar = () => {
    const {user} = useUserStore();
    const setUserId = useChatStore((state) => state.setUserId);

    useEffect(() => {
        if (user?.id)
            setUserId(user.id);
        }, [user?.id]);
    
    useChatSocket(user?.id || 0);


    return (
        <div className="flex justify-center items-center w-full h-[90px] ">
            <div className="h-full w-full flex items-center justify-start">
                <h1 className="text-6xl font-orbitron text-white">
                    Super Pong
                </h1>
            </div>

            <div className="h-full w-full flex items-center justify-center">
            <SearchBar />
            </div>
            <Profile />
        </div>
    )
}

export default NavBar;
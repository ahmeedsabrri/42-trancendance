'use client'

import { useUserStore } from "@/app/store/store";
import SearchBar from "./SeachBar";
import Profile from "./profilebar/Profile";
import { useChatStore } from "@/app/store/chatStore";
import { useEffect, useState } from "react";
import useChatSocket from "@/hooks/useChatSocket";
import { useUserFriendsStore } from "@/app/store/UserFriendsStrore";

const NavBar = () => {
    const {user, fetchUser, fetchUsers} = useUserStore();
    const [userIsReady, setUserIsReady] = useState(false);
    const setUserId = useChatStore((state) => state.setUserId);
    const fetchOwnFriends = useUserFriendsStore((state) => state.fetchOwnFriends);
    
    useEffect(() => {
        const initializeUser = async () => {
            if (!user) {
                await fetchUser();
                setUserIsReady(true);
            } else {
                setUserIsReady(true);
            }
        };
        
        initializeUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        if (user) {
            setUserId(user.id);
            fetchUsers();
            fetchOwnFriends();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, userIsReady]);
    
    useChatSocket(user?.id ?? 0);


    if (!userIsReady) {
        return null;
    } 

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
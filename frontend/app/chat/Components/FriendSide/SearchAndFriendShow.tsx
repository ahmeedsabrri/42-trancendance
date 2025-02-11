"use client"

import { newConversation } from "../../Tools/apiTools";
import { Conversation, useChatStore } from "@/app/store/chatStore";
import {findConversation, filterFriends, sortFriendsByName} from "../utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import { useUserStore } from "@/app/store/store";
import { UserFriendsData, useUserFriendsStore } from "@/app/store/UserFriendsStrore";
import React from "react";
import FriendsSkeleton from "../utils/FriendsSkeleton";
import { useEffect } from "react";

const Inputcomponent = () => {
    const setSearch = useChatStore((state) => state.setSearch);

    return (
        <div className="w-11/12 min-h-[60px] flex justify-center items-center ">
            <div className='size-full rounded-2xl bg-black/30 backdrop-blur-2xl flex justify-end shadow-search_inner'>
                <input className="bg-transparent w-11/12 font-bold placeholder:text-white/50 outline-none color-white/50 text-white/50" placeholder='Search...' onChange={(e) => {setSearch(e.target.value.toLowerCase())}}/>
            </div>
        </div>
    )
}

const SearchAndFriendShow = () => {

    return (
        <div className="w-full h-fit flex flex-col items-center justify-center">
            <Inputcomponent />
            <FriendShow/>
        </div>
    );
}

const FriendShow = () => {

    const user = useUserStore().user;
    const queryClient = useQueryClient();
    const conversations = queryClient.getQueryData<Conversation[]>(["conversations"]) || [];
    const setConversationSelected = useChatStore((state) => state.setConversationSelected);
    const conversationSelected = useChatStore((state) => state.conversationSelected);
    const search = useChatStore((state) => state.search);
    const { UserOwnfriends} = useUserFriendsStore();
    const [friends, setFriends] = React.useState<UserFriendsData[] | null>(UserOwnfriends);
    const [IsLoading] = React.useState(false);

    useEffect(() => {
        setFriends(UserOwnfriends);
    }, [UserOwnfriends]);

    const handleNewConversation = async ( currentUser: UserFriendsData ) => {

        if (!currentUser || !user)
            return;

        const conversation: Conversation | null = findConversation(currentUser.id, user.id, conversations);
        if (conversation)
            setConversationSelected(conversation);
        else
        {
            const newConversationCreated: Conversation = await newConversation(currentUser.id);
            if (!newConversationCreated)
                return;
            setConversationSelected(newConversationCreated);
            queryClient.setQueryData<Conversation[]>(["conversations"], [newConversationCreated, ...conversations]);
        }
    };
   
    return (
        <div className="w-11/12 h-[150px] flex items-center justify-center">
            <ul className="w-full flex items-center scrollable-x overflow-x-scroll snap-x snap-mandatory scrollbar scrollbar-thumb-black/30 scrollbar-track-transparent">
                {IsLoading ?  <FriendsSkeleton/> : sortFriendsByName(filterFriends(friends, search))?.map((friend: UserFriendsData) => {
                    return (
                        <li key={friend.id} onClick={() => {
                                if (conversationSelected?.userTarget?.id !== friend?.id)
                                    handleNewConversation(friend)
                            }} className="flex flex-col items-center min-w-[90px] h-[110px] p-2 gap-2 snap-start snap-always hover:bg-hover_color active:bg-active_color transition-all rounded-xl">
                            <Avatar width={60} height={60} avatar={friend.avatar} />
                            <p className="text-white/80 whitespace-nowrap">{friend.username}</p>
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}



export default SearchAndFriendShow;
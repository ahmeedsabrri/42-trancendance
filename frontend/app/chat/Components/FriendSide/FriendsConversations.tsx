"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChatStore, Conversation } from "@/app/store/chatStore";
import Image from "next/image";
import empty_conversation from "../../../../public/chat/FriendSide/Empty_State_Illustrations_Light_Mode_No_Conversation.png";
import ConversationComp from "./ConversationComp";
import { fetchConversations } from "../../Tools/apiTools";
import ConversationsSkeleton from "../utils/ConversationsSkeleton";
import useDelayedLoading, {decryptNumber, findConversationById, sortConversationsByDate} from "../utils/utils";
import { useUserStore } from "@/app/store/store";


const FriendConversations = () => {

    const {setConversationSelected} = useChatStore();
    const user_id = useUserStore().user?.id;

    // const params = new URLSearchParams(window.location.search);
    // const QueryConversationid = params.get('conversationId');

    const {data: conversationFetched,  isLoading, isError} = useQuery({
        queryKey: ["conversations"],
        queryFn: () => fetchConversations(),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const QueryConversationid = params.get('conversationId');
            if (QueryConversationid) {
                const conversation: Conversation | null = findConversationById(conversationFetched || [], parseInt(decryptNumber(QueryConversationid)));
                if (conversation)
                    setConversationSelected(conversation);
            }
            // setConversationId(QueryConversationid);
        }
    }, [conversationFetched, user_id]);

    const isReady = useDelayedLoading(isLoading, 500);

    // useEffect(() => {
    //     if (QueryConversationid) {
    //         const conversation: Conversation | null = findConversationById(conversationFetched || [], parseInt(decryptNumber(QueryConversationid)));
    //         if (conversation)
    //             setConversationSelected(conversation);
    //     }
    // }, [conversationFetched, user_id, QueryConversationid]);

    return (
        <div className="w-full h-full flex items-center justify-start flex-col overflow-y-scroll snap-y snap-mandatory scrollbar scrollbar-thumb-black/30 scrollbar-track-transparent">
            {!conversationFetched ? (<Image className="m-auto" src={empty_conversation} alt="empty_conversation" />) 
                : isReady ? <ConversationsSkeleton />
                : isError ? <h1 className="text-xl text-white">Error</h1>
                : (
                    sortConversationsByDate(conversationFetched).map((conversation: Conversation) => {
                        return <ConversationComp key={conversation.id} conversation={conversation} />
                    })
                  )}
        </div>
    );
};

export default FriendConversations;
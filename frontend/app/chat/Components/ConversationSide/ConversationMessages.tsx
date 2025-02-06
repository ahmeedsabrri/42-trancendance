"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import MessageComp from "./MessageComp";
import { fetchMessages } from "../../Tools/apiTools";
import { Message, useChatStore} from "@/app/store/chatStore";
import MessagesSkeleton from "../utils/MessagesSkeleton";
import useDelayedLoading from "../utils/utils";

const ConversationMessages = () => {

    const conversationSelected_id = useChatStore((state) => state.conversationSelected?.id);
    const conversationRef = useRef<HTMLDivElement>(null);


    const { data: fetchedMessages, isLoading, isError } = useQuery({
        queryKey: ["messages", conversationSelected_id],
        queryFn: () => fetchMessages(conversationSelected_id ? conversationSelected_id : 0),
        refetchOnWindowFocus: false,
        enabled: !!conversationSelected_id,
        staleTime: Infinity,
    });

    useEffect(() => {
        const handleWindowFocus = () => {
            if (conversationRef.current) {
                conversationRef.current.scrollTo({
                    top: conversationRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        };
    
        window.addEventListener('focus', handleWindowFocus);
    
        if (conversationRef.current) {
            conversationRef.current.scrollTo({
                top: conversationRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    
        return () => {
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, [conversationSelected_id, fetchedMessages]);

    const isReady: boolean = useDelayedLoading(isLoading, 1000) || fetchMessages === undefined;

    return (
        <div ref={conversationRef} className="flex flex-col size-full max-w-full items-center scrollable-y overflow-y-scroll snap-y snap-mandatory scrollbar scrollbar-thumb-transparent scrollbar-track-transparent scroll-auto">
            <div className="flex-grow"></div>
            <ul className="w-full flex flex-col items-center gap-5 p-5">
                {
                    isReady ? <MessagesSkeleton/> : isError ? <h1 className="text-xl text-text_message_color">Error</h1> :
                        Array.isArray(fetchedMessages) ? fetchedMessages.map((message: Message) => {
                            return <MessageComp message={message} key={message.id} />
                        }) : <h1 className="text-xl text-text_message_color">Lets get Started</h1>
                }
            </ul>
        </div>
    );
};

export default ConversationMessages;
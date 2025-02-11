import { useUserStore } from "@/app/store/store";
import { Conversation, useChatStore } from "@/app/store/chatStore";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "postcss";
import { useEffect, useRef, useState } from "react";

const useChatSocket = (user_id: number) => {
    
    const socket = useRef<WebSocket>(null);
    const queryClient = useQueryClient();
    const [wsActive, setWsActive] = useState(true);
    
    const {user} = useUserStore();
    const {setSocket, setEventMessage, setUserId} = useChatStore();
    
    useEffect(() => {
        const base_wws_url = process.env.NEXT_PUBLIC_WSS_URL
        if (!base_wws_url) {
            throw new Error("NEXT_PUBLIC_NOTIFICATION_WSS_URL is not defined");
        }
        socket.current = new WebSocket(base_wws_url+`/chat/`);
        
        if (socket.current === null)
            return;

        socket.current.onopen = () => {
            if (socket.current && user_id)
            {
                setSocket(socket.current);
                setUserId(user_id);
            }
        }
       
        socket.current.onmessage = (e) => {
            setEventMessage(e);
            const message = JSON.parse(e.data);
            queryClient.setQueryData(
                ["messages", message.conversation_id],
                (oldData: Message[] = []) => {
                    return [...oldData, message];
                }
            )
            queryClient.setQueryData(
                ["conversations"],
                (oldData: Conversation[] = []) => {
                    if (oldData.find((conversation) => conversation.id === message.conversation_id))
                    {
                        return oldData.map((conversation) => {
                            if (conversation.id === message.conversation_id) {
                                return {
                                    ...conversation,
                                    last_message: message,
                                }
                            }
                            return conversation;
                        })
                    }
                    else
                    {
                        return [ ...oldData, {
                            id: message.conversation_id,
                            user1: message.sender,
                            user2: user,
                            last_message: message
                        }]
                    }
                }
            )
            
        }

        socket.current.onclose = () => {

            setTimeout(() => {
                setWsActive(false);
            }
            , 4000);
        }

        return () => {
            socket.current?.close();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wsActive, user_id]);
    return socket.current;
};



export default useChatSocket;
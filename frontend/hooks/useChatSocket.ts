import { UserData, useUserStore } from "@/app/store/store";
import { Conversation, useChatStore } from "@/app/store/chatStore";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "postcss";
import { useEffect, useRef, useState } from "react";

const useChatSocket = () => {

    const socket = useRef<WebSocket>(null);
    const {user} = useUserStore();
    const [wsActive, setWsActive] = useState(true);
    
    const user_id = user?.id;
    const queryClient = useQueryClient();
    const {setSocket, setEventMessage, setUserId} = useChatStore();
    
    useEffect(() => {

        console.log("useChatSocket");

        socket.current = new WebSocket(`wss://localhost/ws/chat/`);
        
        if (socket.current === null)
            return;

        socket.current.onopen = () => {
            // console.log("Chat socket connected");
            if (socket.current && user_id)
            {
                // console.log("Chat socket connected with user_id: ", user_id);
                setSocket(socket.current);
                setUserId(user_id);
            }
        }

        socket.current.onmessage = (e) => {
            setEventMessage(e);
            const message = JSON.parse(e.data);
            console.log("Message received: ", message);
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

        socket.current.onclose = (event) => {

            if (event.wasClean) {
                console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
            } else {
                console.log("WebSocket connection closed unexpectedly");
            }

            setTimeout(() => {
                setWsActive(false);
            }
            , 2000);
        }

        socket.current.onerror = (error) => {
            console.log("Chat socket error: ", error);
        }

        return () => {
            socket.current?.close();
        }
    }, [wsActive, user_id, queryClient, setEventMessage, setSocket, setUserId]);

    return socket.current;
};



export default useChatSocket;
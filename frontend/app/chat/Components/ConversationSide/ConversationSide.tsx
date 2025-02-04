"use client";
import UserTopBar from "./UserTopBar";
import ConversationMessages from "./ConversationMessages";
import Image from "next/image";
import conversation_not_selected from "../../../../public/conversation_not_selected.png";
import InputComp from "./InputComp";
import { useState } from "react";
import Info from "./Info";
import InfoBtn from "./InfoBtn";
import { useChatStore } from "@/app/store/chatStore";

const ConversationSide = () => {

    const [showInfo, setShowInfo] = useState(false);
    const conversationSelected_id = useChatStore((state) => state.conversationSelected.id);

    return (
        <div className="bg-black/20 w-[70%] h-full backdrop-blur-3xl rounded-r-3xl flex flex-col items-center justify-center p-4">
            {
                conversationSelected_id ? (
                        <>
                            <UserTopBar />
                            <ConversationMessages />
                            <InputComp/>
                            <InfoBtn showInfo={showInfo} setShowInfo={setShowInfo}/> <Info showInfo={showInfo}/>
                        </>
                    ) : (
                        <Image src={conversation_not_selected} alt="empty" width={400} height={400} className=""/>
                    )
            } 
        </div>
    );
};

export default ConversationSide;
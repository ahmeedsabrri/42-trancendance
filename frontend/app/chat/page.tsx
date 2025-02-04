"use client";

import useChatSocket from "@/hooks/useChatSocket";
import ConversationSide from "./Components/ConversationSide/ConversationSide";
import FriendsSide from "./Components/FriendSide/FriendsSide";

const Chat = () => {

    useChatSocket();
    
    return (
            <div className="w-5/6 h-5/6 rounded-3xl flex items-center justify-center border-t-1 shadow-xl border-t border-l border-white/50">
                <FriendsSide />
                <ConversationSide/>
            </div>
    )
}

export default Chat;
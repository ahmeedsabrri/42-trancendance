import { useChatStore, Conversation } from "@/app/store/chatStore";
import { timeHandle, findTargetUser } from "../utils/utils";
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import React, { memo } from "react";
import { UserData, useUserStore } from "@/app/store/store";


interface ConversationCompProps {
    conversation: Conversation;
}

const ConversationComp: React.FC<ConversationCompProps> = memo(({ conversation}) => {

    const {setConversationSelected} = useChatStore();
    const user_id = useUserStore().user?.id;;
    const conversationSelected_id = useChatStore(state => state.conversationSelected.id);

    const userTarget: UserData = findTargetUser(conversation, user_id || 0);
    const selectOptions = conversationSelected_id === conversation.id ? "bg-gradient-to-r from-white/30" : "";

    return (
        <div onClick={() => setConversationSelected(conversation)} className={` ${selectOptions} w-full h-20 text-black flex items-center justify-center hover:bg-gradient-to-r hover:from-hover_color active:from-active_color snap-start snap-always`}>
            <div className="w-11/12 h-20 flex items-center justify-center gap-2">
                <div className="w-[10%] flex items-center justify-center">
                    <Avatar width={70} height={70} avatar={userTarget?.avatar}/>
                </div>
                <div className="w-[90%] flex flex-col items-start justify-center">
                    <div className="w-11/12 h-8 flex items-center justify-between">
                        <h1 className="text-white font-bold text-lg break-keep">{userTarget?.username}</h1>
                        <h1 className="text-white/50 font-bold ">{timeHandle(conversation?.last_message?.time)}</h1>
                    </div>
                    <div className="w-full h-[25px] overflow-hidden">
                        <p className="text-white/75 overflow-hidden">{ conversation?.last_message?.sender.id === user_id ?  `You:${conversation.last_message?.message}` : conversation.last_message?.message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
});
ConversationComp.displayName = "ConversationComp";
export default ConversationComp;
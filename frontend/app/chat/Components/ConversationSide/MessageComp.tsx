import Avatar from "@/components/navbar/profilebar/Avatar";
import {Message} from "@/app/stores/chatStore";
import { timeHandle } from "@/app/chat/Components/utils/utils";
import { memo } from "react";
import { useUserStore } from "@/app/store/store";
import Link from "next/link";


type MessageProps = {
    message: Message;
}

const MessageComp: React.FC<MessageProps> = memo(({message}) => {
    
    const user = useUserStore().user;

    if (!user) return null;

    const msgPosition = user?.id === message?.sender.id ? "justify-end" : "justify-end flex-row-reverse";
    const msgColor = user?.id === message?.sender.id ? "bg-black/20" : "bg-white/20";
    const avatar = user?.id === message?.sender.id ? user?.avatar : message.sender.avatar;

    return (
        <div className={`w-full h-fit flex ${msgPosition} items-end gap-2 transition-all`}>
            <div className={`${msgColor} shadow-xl size-fit flex justify-center px-4 py-2 rounded-2xl min-w-[100px] min-h-[60px] border border-white/20`}>
                <div className="size-full flex flex-col gap-3">
                    <div className="w-full h-fit">
                        <p className="w-full text-white font-bold break-words">{message.message}</p>
                    </div>
                    <div className="w-full h-fit flex justify-end">
                        <p className="text-xs text-white/75 font-bold"> {timeHandle(message.time)} </p>
                    </div>
                </div>
            </div>
            <Link rel="preload" href={`/profile/${message.sender.username}`}>
                <Avatar width={60} height={60} avatar={avatar}/>
            </Link>
        </div>
    )
});

export default MessageComp;
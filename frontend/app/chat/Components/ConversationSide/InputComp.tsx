import Image from 'next/image';
import document_icon from '../../../../public/chat/conversationSide/documents_icon.png';
import React, { useRef, useState } from 'react';
import { sendMessage } from '../../Tools/wstools';
import sendIcon from '../../../../public/chat/conversationSide/Send_hor.svg';
import { useChatStore } from '@/app/store/chatStore';
import { useUserStore } from '@/app/store/store';

const InputComp = () => {

    const {conversationSelected, socket} = useChatStore();
    const [message, setMessage] = useState<string | null>("");
    const [okToSend, setOkToSend] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const user_id = useUserStore().user?.id;

    

    if (socket === null || user_id === null || conversationSelected === null)
        return null;


    function checkMessageAbellity(message: string) {
        setMessage(message);
        if (message.trim().length > 0)
            setOkToSend(true);
        else
            setOkToSend(false);
    }

    const sendFun = (e: any) => {

        e.preventDefault();
        const msg = message?.trim();

        if (msg && msg.length > 0 && conversationSelected?.userTarget && conversationSelected?.id)
        {
            sendMessage("chat_message", socket ,conversationSelected?.userTarget?.id, msg, user_id || 0, conversationSelected?.id);
        }
        setMessage("");
        setOkToSend(false);
    }

    const  handelMousePress = (e: React.MouseEvent<HTMLButtonElement>) => {
        sendFun(e);
        if (inputRef.current)
            inputRef.current.value = "";
    }
    
    const handelKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (okToSend && (e.key === 'Enter' || e.key === 'NumpadEnter'))
        {
            sendFun(e);
            (e.target as HTMLInputElement).value = "";
        }
    }

    return (
        <div className="w-full  mx-4 h-fit flex items-center gap-5 mb-4">
            <div className="bg-black/30 size-full flex items-center px-2 rounded-full shadow-search_inner">
                <input ref={inputRef} onKeyDown={handelKeyPress} type="text" className="size-full bg-transparent text-white/80 mx-3 outline-none h-12 placeholder:text-white/30" placeholder="Type a message..." onChange={(e) => {checkMessageAbellity(e.target.value)}}/>
                <button onClick={(e) => handelMousePress(e)} className={`${okToSend ? "" : "hidden"}`}><Image src={sendIcon} alt="" width={40} className="rounded-full shadow-2xl bg-border_button p-[5px]" /></button>
            </div>
        </div>
    )
}

export default InputComp;
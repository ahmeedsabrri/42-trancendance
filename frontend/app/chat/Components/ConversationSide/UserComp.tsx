
import { useState } from "react";
import { useChatStore } from "@/app/store/chatStore";
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
const UserComp = () => {

    const conversationSelected = useChatStore((state) => state.conversationSelected);
    
    const [isOpened, setIsOpened] = useState(false);
    

    return (
        <div className="bg-white/10 backdrop-blur-3xl w-fit h-14 flex items-center justify-center p-1 rounded-full border-t border-l shadow-xl border-border  hover:bg-hover_color active:bg-active_color translition-all">
            <div className="size-fit flex items-center justify-center">
                <div className="size-fit" onClick={() => {setIsOpened(!isOpened)}} >
                    <Avatar width={50} height={50} avatar={conversationSelected?.userTarget?.avatar || null}/>
                </div>
                {isOpened ? 
                    <div className="w-fit h-full p-1 transition-all">
                        <div className="size-fit h-full m-1 p-2">
                            <h1 className="font-bold text-white">{conversationSelected?.userTarget?.username}</h1>
                            {/* <p>{conversationSelected?.userTarget.status ? "Online": "Offline"}</p> */}
                        </div>
                    </div>
                    : <div className="transition-all"></div>
                }
            </div>
        </div>
    );
}

export default UserComp;
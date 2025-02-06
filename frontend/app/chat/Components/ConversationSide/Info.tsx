import Image from "next/image";
import Link from "next/link";
import profile from "@/public/chat/conversationSide/profile.svg";
import pingPong from "@/public/chat/conversationSide/ping_pong.svg";
import block from "@/public/chat/conversationSide/user-block.svg";
import { useChatStore } from "@/app/store/chatStore";
import Avatar from "@/components/navbar/profilebar/Avatar";
import { notifyAdd } from "@/app/chat/Tools/wstools";
import { notifyErr } from "@/app/chat/Tools/wstools";
import { handleRequestGames } from "../../Tools/apiTools";
import { useGameStore } from "@/app/Games/store/GameStore";
import { useGameStateStore } from "@/app/Games/store/CanvasStore";
import { useUserStore } from "@/app/store/store";
import { useEffect } from "react";

const Info = ( {showInfo}: {showInfo:boolean} ) => {

    const conversationSelected = useChatStore((state) => state.conversationSelected);
    const {invited_id, setInvitedId, resetInvitedId, setGameMode} = useGameStore();
    const {user} = useUserStore();
    const {setWinner} = useGameStateStore();

    useEffect(() => {
        console.log("invited_id infooo", invited_id);
    }, [invited_id]);

    const handlePingPongNotifyAdd = () => {
        console.log("user_id info", conversationSelected?.userTarget?.id);
        // setWinner(null);
        console.log("manage. stt")
        
        resetInvitedId();
        setInvitedId(`${conversationSelected?.userTarget?.id}-${user?.id}`);
        setGameMode("online");

        handleRequestGames(conversationSelected?.userTarget?.username as string, 'invite')
        .then((response) => {
          console.log(response);
          notifyAdd(response.data.message);
    
        })
        .catch((err) => {
          console.log(err);
          notifyErr(err.response.data.message);
        });
    };

    return (
        <>
            {showInfo && 
                <div className="size-fit bg-white/10 backdrop-blur-[100px] rounded-2xl border-t border-l shadow-xl border-white/20 flex flex-col justify-center transition-all absolute top-3 right-4 p-4">
                        <div className="w-full h-full flex justify-start items-center flex-col gap-2 p-2">
                            <div className="w-full h-[30%] flex items-center justify-center">
                                <Avatar width={100} height={100} avatar={conversationSelected?.userTarget?.avatar} />
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2">
                                <h1 className="text-3xl text-white font-bold">{conversationSelected?.userTarget?.username}</h1>
                            </div>
                        </div>
                        <div className="w-full flex items-center justify-center gap-2">
                            <div className="size-[60px] flex items-center justify-center">
                                <Link rel="preload" href={`/profile/${conversationSelected?.userTarget?.username}`}>
                                    <Image src={profile} alt="info" width={50} className="hover:size-[56px] active:size-[52px] transition-all opacity-75 hover:opacity-100" />
                                </Link>
                            </div>
                            <div className="size-[60px] flex items-center justify-center">
                                <Link rel="preload" href="Games/GameBackground" onClick={handlePingPongNotifyAdd}>
                                    <Image src={pingPong} alt="info" width={40} className="hover:size-[46px] active:size-[42px] transition-all opacity-75 hover:opacity-100" />
                                </Link>
                            </div>
                            <div className="size-[60px] flex items-center justify-center">
                                <Link rel="preload" href="#">
                                    <Image src={block} alt="info" width={50} className="hover:size-[56px] active:size-[52px] transition-all opacity-75 hover:opacity-100" />
                                </Link>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Info;
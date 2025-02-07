import { SetStateAction } from "react";
import infoImg from "../../../../public/chat/conversationSide/Meatballs_menu.svg";
import Image from "next/image";

const InfoBtn = ({showInfo, setShowInfo}: {showInfo: boolean, setShowInfo: React.Dispatch<SetStateAction<boolean>>}) => {
    return (
        <div className="size-[40px] min-w[300px] flex items-center justify-center bg-white/10 backdrop-blur-3xl rounded-full border-t border-l shadow-xl border-border hover:bg-hover_color active:bg-active_color translition-all absolute top-6 right-7 z-10" onClick={() => {
                if (showInfo)
                    setShowInfo(false)
                else
                    setShowInfo(true)
            }}>
            <Image src={infoImg} alt="info" width={30}/>
        </div>
    )
}

export default InfoBtn;
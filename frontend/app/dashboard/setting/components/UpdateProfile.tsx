"use client";

import { useUser } from "@/app/context/userContext";
import Avatar from "@/components/navbar/profilebar/Avatar";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function UpdateProfile() {
    // const userRef = useRef<HTMLInputElement | null>(null);
    // const [username, setUsername] = useState("");
    const Avatarinput = useRef<HTMLInputElement>(null);
    const { user } = useUser();
    const [showEmail, setShowEmail] = useState(false);
    const [ShowInput, setShowInput] = useState(false);

    // const handelusername = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setUsername(e.target.value);
    //     console.log(username);
    // }
    // useEffect(() => {
    //     setUsername(user?.username || "");
    // }
    // , [user]);
    return (<>
    <div className="w-1/2 h-full flex flex-row  items-center gap-4">
        
        
        <div className="w-24 h-20 flex items-center justify-center relative border-2 border-white/10 rounded-full">
            <Avatar width={90} height={70} avatar={user?.avatar}/>
            <input type="file" name="avatar" id="avatar" className="absolute right-[9999px]" ref={Avatarinput}/>
            <Image src="/images/upload.svg" alt="" width={20} height={20} className="absolute top-20 bottom-0 right-0 left-7 opacity-50 cursor-pointer" onClick={()=> {
                Avatarinput.current?.click();
            }}/>
        </div>


        <div className="w-full flex flex-col gap-2">
            <div className="w-full flex flex-row items-center gap-2">
                {!ShowInput && <h1 className="text-xl font-bold text-white">{user?.username}</h1>}
                {ShowInput && <input type="text" className="bg-transparent border-none border-b-2 border-b-white text-white opacity-50 w-3/12"/>}
                <button className="backdrop-blur-3xl w-9 h-9 text-black flex items-center justify-center opacity-65" onClick={()=>setShowInput(!ShowInput)}>{ShowInput ? <Image src="/images/verified.svg" width={20} height={20} alt="" /> : <Image src="/images/edit.svg" width={20} height={20} alt=""/> }</button>
            </div>
            <div className="w-full flex flex-row items-center gap-2">
                {!showEmail && (<span className="text-white opacity-20">**********</span>)}
                {showEmail &&  <p className="text-sm font-light text-white opacity-20">{user?.email}</p>}
                <button onClick={() => setShowEmail(!showEmail)} className="text-white bg-transparent border-none opacity-25">{showEmail ? <Image src="/images/eye-open.svg" width={15} height={15} alt=""/> : <Image src="/images/eye-close.svg" width={15} height={15} alt=""/>}</button>
            </div>
        </div>

    </div>
    </>
    );
}
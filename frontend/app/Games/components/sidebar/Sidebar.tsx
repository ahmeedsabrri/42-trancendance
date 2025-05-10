'use client'

import { IMAGES } from "@/public/index";
import SideBarItem from "./SideBarItems";

const SideBar = () => {
    return (
        <div className="bg-gray-500 bg-opacity-30 backdrop-blur-xl w-[80px] h-[22%] flex flex-col justify-center items-center gap-y-4 rounded-full border border-white/10">
            <SideBarItem src={IMAGES.HomePage} alt="home page" title="Home"/>
            <SideBarItem src={IMAGES.Game} alt="Game page" title="Game" link="/Games"/>
            <SideBarItem src={IMAGES.Ranking} alt="Raking page" title="Ranking"/>
            <SideBarItem src={IMAGES.Chat} alt="Chat page" title="Chat"/>
            <SideBarItem src={IMAGES.Stats} alt="Stats page" title="Stats"/>
            <SideBarItem src={IMAGES.Settings} alt="Settings page" title="Settings"/>
        </div>
    )
}

export default SideBar;
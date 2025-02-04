'use client'

import SearchBar from "./SeachBar";
import SearchList from "./SearchList";
import Profile from "./profilebar/Profile";

const NavBar = () => {
    return (
        <div className="flex justify-center items-center w-full h-[90px] ">
            <div className="h-full w-full flex items-center justify-start">
                <h1 className="text-6xl font-orbitron text-white">
                    Super Pong
                </h1>
            </div>

            <div className="h-full w-full flex items-center justify-center">
            <SearchBar />
            </div>
            <Profile />
        </div>
    )
}

export default NavBar;
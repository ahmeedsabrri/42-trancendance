'use client'

import SearchBar from "./SeachBar";
import Profile from "./profilebar/Profile";

const NavBar = () => {
    return (
        <div className="flex justify-center items-center w-full h-[90px]">
            <div className="h-full w-full flex items-center justify-start">
                <h1 className="text-6xl font-semibold text-white">
                    Super Pong
                </h1>
            </div>

            <SearchBar />
            <Profile />
        </div>
    )
}

export default NavBar;
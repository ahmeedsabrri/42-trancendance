"use client";

import { AuthActions } from "@/app/auth/utils";
import ProfileInfo from "./ProfileInfo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import Link from 'next/link'

  
const Profile = () => {
    const { logout} = AuthActions();

    const handleLogout = () => {
        logout()
          .then(() => {
            window.location.href = "/auth";
          })
          .catch(() => {
            console.error("Logout failed");
            });
        };
    return (
        <div className="h-full w-full flex items-center justify-end gap-x-[18px]">

            <div className="p-[14px] relative bg-gray-500 bg-opacity-30 backdrop-blur-xl rounded-full border border-white/10">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <span className="p-[6px] absolute rounded-2xl bg-red-500 top-[1px] right-[3px]">

                </span>
            </div>

            <div className="px-[19px] py-[8px] flex items-center justify-between gap-x-[15px] bg-gray-500 bg-opacity-30 backdrop-blur-2xl rounded-full border border-white/10">
                <div className="size-full">
                    <DropdownMenu>
                    <DropdownMenuTrigger className="size-full gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 flex justify-between">
                        <ProfileInfo />
                    </DropdownMenuTrigger>
                        <DropdownMenuContent className="px-[30px] py-[8px] flex flex-col items-center justify-between bg-gray-500 bg-opacity-30 backdrop-blur-2xl rounded-lg border border-white/10 my-2">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="w-full text-white flex items-center justify-center transition-all font-bold text-md hover:bg-gradient-to-r hover:from-hover_color"><Link href="/profile">Profile</Link></DropdownMenuItem>
                            <DropdownMenuItem  className="w-full text-white flex items-center justify-center transition-all font-bold text-md hover:bg-gradient-to-r hover:from-hover_color"><Link href="/dashboard/setting" >Setting</Link></DropdownMenuItem>
                            <DropdownMenuItem className="w-full text-red flex items-center justify-center transition-all font-bold text-md hover:bg-gradient-to-r  hover:text-red" onClick={handleLogout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default Profile;
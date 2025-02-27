import React from "react";
import Avatar from "./Avatar";
import { useUserStore } from "@/app/store/store";
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from "react";
const ProfileInfo = () => {
    
    const { fetchUser, user, isInitialized } = useUserStore();
    useEffect(() => {
    }, [user]);

    const userRef = useRef(user);
    useEffect(() => {
    userRef.current = user;    
    }, [user]);
    // Only fetch user data once when component mounts
    React.useEffect(() => {
        if (!isInitialized) {
        fetchUser();
    }
  }, [isInitialized, fetchUser]);

  if (!isInitialized || !user) {
    return (
        <div className="flex  items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-white"/>
            <p className="text-white text-[15px] font-semibold">
                Loading...
            </p>
        </div>
    );
  }
    return (
        <>
            <div className="flex flex-col justify-center items-start">
                <h2 className="text-[17px] font-semibold text-white ">{user.first_name +" "+ user.last_name}</h2>
                <h2 className="text-[15px] font-semibold text-blue-300 -mt-1">{"@"+ user.username}</h2>
            </div>
            <Avatar width={40} height={40} avatar={user.avatar}/>
        </>
    )
}

export default ProfileInfo;
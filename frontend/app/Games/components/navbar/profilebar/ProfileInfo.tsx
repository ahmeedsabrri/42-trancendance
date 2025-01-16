import React from "react";
import Avatar from "./Avatar";
import { useUserStore } from "@/app/store/store";

const ProfileInfo = () => {
    
    const { fetchUser, user, isInitialized } = useUserStore();
  
    const userRef = React.useRef(user);
    React.useEffect(() => {
    userRef.current = user;    
    }, [user]);
    // Only fetch user data once when component mounts
    React.useEffect(() => {
        if (!isInitialized) {
        fetchUser();
    }
  }, [isInitialized, fetchUser]);
  if (!isInitialized || !user) {
    return <div>Loading...</div>;
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
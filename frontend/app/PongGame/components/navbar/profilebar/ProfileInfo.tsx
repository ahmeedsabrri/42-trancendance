import { useUser } from "@/app/context/userContext";
import Avatar from "./Avatar";

const ProfileInfo = () => {
    const { user, loading, error } = useUser();
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;
    return (
        <>
            <div className="flex flex-col justify-center items-start">
                <h2 className="text-[17px] font-semibold text-white ">{user.first_name + " " + user.last_name}</h2>
                <h2 className="text-[15px] font-semibold text-blue-300 -mt-1">{"@"+user.username}</h2>
            </div>
            <Avatar width={40} height={40} avatar={user.avatar}/>
        </>
    )
}

export default ProfileInfo;
import { useUser } from "@/app/context/userContext";
import Avatar from "./Avatar";

const ProfileInfo = () => {
    const { user, loading, error } = useUser();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user found</div>;
    return (
        <>
            <div className="flex flex-row justify-center items-center gap-2">
                <h2 className="text-[15px] font-semibold text-blue-300 -mt-1 text-white">{user.username}</h2>
                <Avatar width={40} height={40} avatar={user.avatar}/>
            </div>
        </>
    )
}

export default ProfileInfo;
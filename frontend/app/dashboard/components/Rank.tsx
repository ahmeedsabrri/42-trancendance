import { UserData, useUserStore } from "@/app/store/store";
import Avatar from "@/app/Games/components/navbar/profilebar/Avatar";
import { useEffect } from "react";

const UserComponent = ({ user, rank }: {user: UserData, rank: number}) => {
    return (
        <div className="w-full min-w[300px] h-[70px] flex items-center p-[10px] rounded-3xl border-white/50 border gap-[10px] shadow-xl duration-300 transition-all hover:bg-white/20 snap-start snap-always">
            <h1 className="text-xl text-white p-2">{rank}</h1>
            <Avatar width={50} height={50} avatar={user.avatar} />
            <div className="w-full">
                <div>
                    <h1 className="font-bold text-white">{user.first_name + " " + user.last_name}</h1>
                </div>
                <div className="w-full flex items-center justify-between">
                    <p className="font-bold text-picton_blue">@{user.username}</p>
                    <p className="font-bold text-white/75">LVL: {user.level}</p>
                </div>
            </div>
        </div>
    );
};

const Rank = () => {

    const {fetchUsers, users} = useUserStore();

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    users.sort((a, b) => b.level - a.level);

    useEffect (() => {
        users.sort((a, b) => b.level - a.level);
    }, [users]);

    return (
        <div className="w-[600px] h-full p-8">
            <h1 className="text-2xl font-bold text-white text_shadow">Rank</h1>
            <div className="size-full flex flex-col justify-start">
                <ul className="flex flex-col gap-2 p-4 scrollable-x overflow-x-scroll snap-x snap-mandatory scrollbar scrollbar-thumb-black/30 scrollbar-track-transparent">
                    {users.map((user, index) => (
                        <li key={user.id}>
                            <UserComponent user={user} rank={index + 1} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Rank;
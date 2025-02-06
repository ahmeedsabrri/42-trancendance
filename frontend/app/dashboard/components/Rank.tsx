import Image from "next/image";
import avatar from "@/public/Ellipse 209.svg";

interface User {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    level: number,
}

const Tariq: User = {
    id:1,
    first_name:"tariq",
    last_name:"ben",
    username:"tben-dal",
    email:"tariq@gmail.com",
    level:7
} 
const ali: User = {
    id:2,
    first_name:"tariq",
    last_name:"ben",
    username:"tben-dal",
    email:"tariq@gmail.com",
    level:7
} 

const users: User[] = [
    Tariq,
    ali
]

const UserComponent = ({ user, rank }: {user: User, rank: number}) => {
    return (
        <div className="w-full min-w[300px] h-[70px] flex items-center p-[10px] rounded-3xl border-white/50 border gap-[10px] shadow-xl duration-300 transition-all hover:bg-white/20 ">
            <h1 className="text-xl text-white">{rank}</h1>
            <Image src={avatar} alt="avatar" width={50} height={50} />
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

    users.sort((a, b) => b.level - a.level);

    return (
        <div className="w-[600px] h-full p-8">
            <h1 className="text-2xl font-bold text-white text_shadow">Rank</h1>
            <div className="size-full flex flex-col justify-start">
                <ul className="flex flex-col gap-2 p-4 ">
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
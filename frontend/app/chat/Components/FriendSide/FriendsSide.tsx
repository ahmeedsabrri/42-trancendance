"use client";
import TopBar from "./TopBar";
import FriendConversations from "./FriendsConversations";
import SearchAndFriendShow from "./SearchAndFriendShow";

const FriendsSide = () => {

    return (
        <div className="overflow-hidden bg-blur w-[30%] h-full backdrop-blur-2xl rounded-l-3xl flex flex-col items-center gap-2 select-none">
            <TopBar/>
            <SearchAndFriendShow />
            <FriendConversations/>
        </div>
    );
}

export default FriendsSide;
import { UserPlus2Icon } from "lucide-react";
import { ProfileHeaderProps } from "./ProfileHeader";

export function AddFriends( {addFriend}:ProfileHeaderProps) {
  
    return (
        <div className="absolute bottom-0 right-8 flex gap-2">
             <button
          className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg"
          onClick={addFriend}
        >
          <UserPlus2Icon size={24} />
          <span className="text-white">Add Friend</span>
        </button>
        </div>
    )
}
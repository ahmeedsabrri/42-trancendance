import { Shield, UserMinus2Icon} from "lucide-react";
import { ProfileHeaderProps } from "./ProfileHeader";

export function IsaFriend({onBlock, onUnfriend}:ProfileHeaderProps) {   
    return (
        <div className="absolute bottom-0 right-8 flex gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150 bg-black/20 hover:bg-black/30 rounded-lg shadow-lg"
            onClick={onUnfriend}
          >
            <UserMinus2Icon size={24} className="text-white" />
            <span className="text-white">Unfriend</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 transition ease-in-out delay-150 bg-red-500/20 hover:bg-red-500/30 rounded-lg"
            onClick={onBlock}
          >
            <Shield size={24} className="text-red-500/70 hover:text-red-500"/>
            <span className="text-red-500/70 hover:text-red-500">Block</span>
        </button>
        </div>
    )
}
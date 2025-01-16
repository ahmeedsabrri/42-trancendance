'use client'

import { IMAGES } from "@/public/index";

interface AvatarProps {
    width: number;
    height: number;
    avatar?: string;
}

const Avatar: React.FC<AvatarProps> = ({width, height,avatar}) => {
    return (
        <img
            src={avatar ? avatar : IMAGES.profile}
            alt="Profile Picture"
            width={width}
            height={height}
            className="rounded-full cursor-pointer object-cover"
        />
    )
}

export default Avatar;

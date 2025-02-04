'use client'

import { IMAGES } from "@/public/index";
import Image from "next/image"

interface AvatarProps {
    width: number;
    height: number;
    avatar: string|null;
}

const Avatar: React.FC<AvatarProps> = ({width, height,avatar}) => {
    return (
        <Image
            src={avatar ? avatar : IMAGES.profile}
            alt="Profile Picture"
            width={width}
            height={height}
            className="rounded-full cursor-pointer object-cover"
        />
    )
}

export default Avatar;

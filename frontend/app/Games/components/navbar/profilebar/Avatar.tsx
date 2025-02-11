'use client'

import { IMAGES } from "@/public/index";
import Image from "next/image"
import Link from "next/link"

interface AvatarProps {
    width: number;
    height: number;
    avatar: string|null;
    username: string;
}

const Avatar: React.FC<AvatarProps> = ({width, height,avatar, username}) => {
    return (
        <Link href={`/profile/${username}`}>
            <Image
                src={avatar ? avatar : IMAGES.profile}
                alt="Profile Picture"
                width={width}
                height={height}
                className="rounded-full cursor-pointer object-cover"
                />
        </Link>
    )
}

export default Avatar;

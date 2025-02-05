'use client'

import Image from "next/image";
import * as Tooltip from '@radix-ui/react-tooltip';
import Link from "next/link";
import { useGameStateStore } from "../../store/CanvasStore";

interface SideBarItemProps {
    src: string;
    alt: string;
    title: string;
    link?: string;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ src, alt, title, link }) => {

    const { setWinner } = useGameStateStore();

    return (
        <Link href={ `${link}` }>
            <Tooltip.Provider>
                <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                        <div className="p-[8px] hover:bg-gray-300/20 cursor-pointer rounded-full">
                            <Image
                                src={src}
                                alt={alt}
                                height={35}
                                width={35}
                            />
                        </div>
                    </Tooltip.Trigger>
                    <Tooltip.Portal>
                        <Tooltip.Content className="bg-white px-2 py-1 rounded shadow">
                            {title}
                        </Tooltip.Content>
                    </Tooltip.Portal>
                </Tooltip.Root>
            </Tooltip.Provider>
        </Link>
    )
}

export default SideBarItem;
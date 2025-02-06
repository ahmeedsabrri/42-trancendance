"use client";

import { useChatStore } from '@/app/store/chatStore';
import React, { useEffect, useState } from 'react'

function SkeletonItem( {msgPosition = 'justify-end', h = "h-3", w = "w-fit", array = 1} ) {

    const adaptiveWidth = 100 + (array * Math.random());
    return (
        <div className='size-full flex items-center justify-center'>
            <div className={`w-full h-fit flex ${msgPosition} items-end gap-2 transition-all`}>
                <div className={`bg-white/20 shadow-lg ${w} ${h} flex justify-center p-5 rounded-3xl min-w-[100px]`}>
                    <div className="size-full flex flex-col">
                        {
                            [...Array(array)].map((_, index) => (
                                <div key={index} className="w-full h-full">
                                    <div className={`h-3 w-[${adaptiveWidth}px] rounded-lg bg-white/20 animate-pulse`} />
                                </div>
                            ))
                        }
                        <div className={`w-full h-fit flex justify-end`}>
                            <div className="h-3 w-2/5 rounded-lg bg-white/20 animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="rounded-full size-16 bg-white/20 animate-pulse shadow-md" />
            </div>
        </div>
    )
}

function MessagesSkeleton() {
    const conversationSelected = useChatStore((state) => state.conversationSelected);

    const [items, setItems] = useState([
        <SkeletonItem key={1} msgPosition='justify-end flex-row-reverse' h='h-[70px]' />,
        <SkeletonItem key={2} h='h-[100px]' w='w-[200px]' />,
        <SkeletonItem key={3} msgPosition='justify-end flex-row-reverse' h='h-[250px]' w='w-[300px]' array={5} />,
        <SkeletonItem key={4} msgPosition='justify-end flex-row-reverse' h='h-[80px]' w='w-[100px]' />,
        <SkeletonItem key={5} h='h-[80px]' w='w-[100px]' />,
        <SkeletonItem key={6} h='h-[80px]' w='w-[100px]' />,
        <SkeletonItem key={7} h='h-[100px]' w='w-[100px]' />
    ]);

    useEffect(() => {
        // Shuffle the items array
        const shuffledItems = [...items].sort(() => Math.random() - 0.5);
        setItems(shuffledItems);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationSelected]);

    return (
        <>
            {items}
        </>
    );
}

export default MessagesSkeleton
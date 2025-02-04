import React from 'react'

function SkeletonItem() {
  return (
    <div className="w-full flex items-center">
        <div className="flex flex-col items-center min-w-[90px] h-[110px] p-2 gap-2">
            <div>
                <div className="rounded-full size-16 bg-white/20 animate-pulse" />
            </div>
            <div className='w-14 h-3 bg-white/20  rounded-xl'></div>
        </div>
    </div>
  )
}

function FriendsSkeleton() {
  return (
    <div className="w-full h-[150px] flex items-center justify-start overflow-hidden">
        {[...Array(8)].map((_,item) => (
            <SkeletonItem key={item} />
        ))}
    </div>
  )
}

export default FriendsSkeleton
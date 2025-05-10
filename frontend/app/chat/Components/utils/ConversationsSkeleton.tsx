import React from 'react'

function SkeletonItem() {
  return (
    <div className="max-w-[400px] w-full h-20 flex items-center gap-3 p-2">
      <div>
        <div className="flex rounded-full w-12 h-12 bg-white/20 animate-pulse" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="h-3 w-4/5 rounded-lg bg-white/20 animate-pulse" />
        <div className="h-3 w-full rounded-lg bg-white/20 animate-pulse" />
      </div>
    </div>
  )
}

function ConversationsSkeleton() {
  return (
    <div className="w-11/12 h-full flex flex-col gap-2.5">
        {[...Array(8)].map((_,item) => (
            <SkeletonItem key={item} />
        ))}
    </div>
  )
}

export default ConversationsSkeleton;
'use client'

const SearchBar = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <input type="text" className="w-[80%] h-[65%] bg-gray-500 bg-opacity-30 backdrop-blur-xl pl-[50px] pr-[8px] text-white outline-none placeholder:text-gray-200 rounded-full border border-white/10 hover:border-white/30 focus:border-white/30" placeholder="SEARCH..." />
        </div>
    )
}

export default SearchBar;
'use client';
import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchStore } from './store/searchStore';
import Avatar from './profilebar/Avatar';
import { redirect } from 'next/navigation';

const SearchBar: React.FC = () => {
  const {
    query,
    results,
    isLoading,
    error,
    setQuery,
    searchUsers,
    message,
  } = useSearchStore();
  const [isFocused, setIsFocused] = React.useState(false);

  // Debounce the search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        searchUsers();
      } else {
        useSearchStore.setState({ results: [] }); // Clear results if query is empty
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchUsers]);

  const handleUserClick = (username: string) => {
    redirect(`/profile/${username}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4">
      <div className="relative">
        <div
          className={`
            relative backdrop-blur-xl bg-white/20 rounded-3xl
            shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
            border border-white/20
            transition-all duration-300
            ${isFocused ? 'bg-white/30' : ''}
          `}
        >
          <div className="flex items-center px-4 py-3">
            <Search className="w-4 h-4 text-white/50" />
            <input
              type="text"
              className="w-full px-3 py-1 bg-transparent border-none outline-none text-white/90 font-semibold placeholder-white/50"
              placeholder="Search ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        {isFocused && query && (
          <div className="absolute w-full mt-2 backdrop-blur-md bg-white/30 rounded-xl shadow-lg border border-white/20 overflow-hidden z-50">
            {isLoading ? (
              <div className="px-4 py-3 text-gray-500 text-center">Loading...</div>
            ) : error ? (
              <div className="px-4 py-3 text-red-500 text-center">{error}</div>
            ) : results.length > 0 ? (
              <div className="divide-y divide-gray-200/30">
                {results.map((user) => (
                  <button
                    key={user.id}
                    className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-white/20 transition-colors"
                    onClick={() => handleUserClick(user.username)}
                  >
                    <Avatar width={40} height={40} avatar={user.avatar} />
                    <span className="text-white/90 font-semibold">{user.username}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-white/90 font-semibold text-center">{message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
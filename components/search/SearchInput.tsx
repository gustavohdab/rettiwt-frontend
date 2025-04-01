'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { useRecentSearches } from '@/lib/hooks/useRecentSearches';

interface SearchInputProps {
    initialQuery?: string;
    showRecentSearches?: boolean;
}

export default function SearchInput({ initialQuery = '', showRecentSearches = true }: SearchInputProps) {
    const [query, setQuery] = useState(initialQuery);
    const [isFocused, setIsFocused] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { recentSearches, addRecentSearch, removeRecentSearch, clearRecentSearches } = useRecentSearches();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            addRecentSearch(query.trim());
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsFocused(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    const handleSearchClick = (searchTerm: string) => {
        setQuery(searchTerm);
        addRecentSearch(searchTerm);
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
        setIsFocused(false);
    };

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSearch}>
                <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-[var(--secondary)]" />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search Twitter"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            // Delayed blur to allow clicking on recent searches
                            setTimeout(() => setIsFocused(false), 200);
                        }}
                        className="w-full py-3 pl-12 pr-12 bg-gray-800 border border-transparent rounded-full focus:outline-none focus:bg-gray-900 focus:border-gray-700 transition-colors"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 flex items-center pr-4"
                        >
                            <XMarkIcon className="h-5 w-5 text-white hover:text-gray-200" />
                        </button>
                    )}
                </div>
            </form>

            {showRecentSearches && isFocused && recentSearches.length > 0 && (
                <div className="absolute mt-2 w-full bg-[var(--background)] rounded-md shadow-lg z-10 border border-gray-800">
                    <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-[var(--secondary)]">Recent searches</h3>
                        <button
                            onClick={clearRecentSearches}
                            className="text-xs text-white hover:text-gray-200 px-3 py-1 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                    <ul>
                        {recentSearches.map((search, index) => (
                            <li key={index} className="flex items-center justify-between hover:bg-gray-800">
                                <button
                                    onClick={() => handleSearchClick(search)}
                                    className="p-3 text-left w-full text-sm text-[var(--foreground)]"
                                >
                                    {search}
                                </button>
                                <button
                                    onClick={() => removeRecentSearch(search)}
                                    className="p-3 text-white hover:text-gray-200"
                                >
                                    <XMarkIcon className="h-4 w-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

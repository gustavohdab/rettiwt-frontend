'use client';

import LoadingSpinner from '@/components/ui/LoadingSpinner';
import getImageUrl from '@/lib/utils/getImageUrl';
import { SuggestedUser } from '@/types';
import Image from 'next/image';

interface MentionSuggestionsProps {
    suggestions: SuggestedUser[];
    loading: boolean;
    onSelect: (username: string) => void;
    activeIndex: number;
}

export default function MentionSuggestions({
    suggestions,
    loading,
    onSelect,
    activeIndex,
}: MentionSuggestionsProps) {
    if (loading) {
        return (
            <div className="p-4 text-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (suggestions.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 text-sm">
                No users found matching your query.
            </div>
        );
    }

    return (
        <ul className="py-1 max-w-full">
            {suggestions.map((user, index) => (
                <li
                    key={user._id}
                    onClick={() => onSelect(user.username)}
                    // Apply active highlight style based on activeIndex
                    className={`px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${index === activeIndex ? 'bg-gray-100 dark:bg-gray-800' : ''
                        }`}
                // Optional: Add scrollIntoView logic for keyboard nav if needed
                >
                    <div className="flex-shrink-0 mr-3">
                        <Image
                            src={getImageUrl(user.avatar)}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full w-8 h-8 object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100">
                            {user.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs truncate">
                            @{user.username}
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
}
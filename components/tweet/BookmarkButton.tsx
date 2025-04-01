'use client';

import { useState } from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { bookmarkTweet, unbookmarkTweet } from '@/lib/actions/tweet.actions';

interface BookmarkButtonProps {
    tweetId: string;
    initialBookmarked?: boolean;
}

export default function BookmarkButton({ tweetId, initialBookmarked = false }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
    const [isLoading, setIsLoading] = useState(false);

    const handleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation to tweet detail

        // Skip if already processing a request
        if (isLoading) return;

        setIsLoading(true);

        try {
            // Optimistic update
            setIsBookmarked(prevState => !prevState);

            // Call the appropriate server action
            if (isBookmarked) {
                await unbookmarkTweet(tweetId);
            } else {
                await bookmarkTweet(tweetId);
            }
        } catch (error) {
            // Revert optimistic update if error occurs
            setIsBookmarked(prevState => !prevState);
            console.error('Error toggling bookmark:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleBookmark}
            disabled={isLoading}
            className={`flex items-center transition duration-150 p-1 sm:p-2 rounded-full 
                ${isBookmarked ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20'} 
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark tweet'}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark tweet'}
        >
            {isBookmarked ? (
                <BookmarkSolid className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
                <BookmarkOutline className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
        </button>
    );
} 
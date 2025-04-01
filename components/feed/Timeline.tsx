'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { Tweet } from '@/types';
import TweetCard from '../tweet/TweetCard';
import TweetService from '@/lib/api/services/tweet.service';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useIntersectionObserver from '@/lib/hooks/useIntersectionObserver';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

interface TimelineProps {
    initialTweets: Tweet[];
    initialPagination: PaginationInfo;
    currentUserId: string;
}

export default function Timeline({
    initialTweets,
    initialPagination,
    currentUserId
}: TimelineProps) {
    const [allTweets, setAllTweets] = useState<Tweet[]>(initialTweets);
    const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [includeReplies, setIncludeReplies] = useState(false);

    // Keep track of tweets loaded through infinite scrolling
    const [loadedTweets, setLoadedTweets] = useState<Tweet[]>([]);

    // Track ids of all tweets to prevent duplicates
    const tweetIdsRef = useRef(new Set(initialTweets.map(t => t._id)));

    // Update when initialTweets changes (e.g., when a new tweet is created)
    useEffect(() => {
        // Get IDs of current tweets to check for duplicates
        const currentIds = new Set(allTweets.map(t => t._id));

        // Find actually new tweets (not ones we already have)
        const newTweets = initialTweets.filter(t => !currentIds.has(t._id));

        if (newTweets.length > 0) {
            // Add new tweets to the beginning without losing loaded tweets
            setAllTweets(prev => [...newTweets, ...prev]);

            // Update our ID tracking
            newTweets.forEach(t => tweetIdsRef.current.add(t._id));
        }
    }, [initialTweets]);

    // Reset timeline when includeReplies changes
    useEffect(() => {
        // Clear loaded tweets and reset to initial state
        setLoadedTweets([]);
        tweetIdsRef.current = new Set(initialTweets.map(t => t._id));

        // Reload the timeline with the new setting
        const reloadTimeline = async () => {
            try {
                setIsLoading(true);
                setError('');

                const response = await TweetService.getTimeline(1, pagination.limit, undefined, includeReplies);

                if (response.status === 'success' && response.data) {
                    setAllTweets(response.data.tweets);
                    setPagination(response.data.pagination);
                    tweetIdsRef.current = new Set(response.data.tweets.map(t => t._id));
                } else {
                    setError('Failed to load timeline');
                }
            } catch (err) {
                setError('Error loading tweets. Please try again.');
                console.error('Error loading timeline:', err);
            } finally {
                setIsLoading(false);
            }
        };

        reloadTimeline();
    }, [includeReplies, pagination.limit]);

    // Calculate if we have more tweets to load
    const hasMore = pagination.page < pagination.pages;

    // Reference to the last tweet element for intersection observer
    const loadMoreRef = useRef<HTMLDivElement>(null);

    const loadMoreTweets = useCallback(async () => {
        if (isLoading || !hasMore) return;

        try {
            setIsLoading(true);
            setError('');

            const nextPage = pagination.page + 1;
            const response = await TweetService.getTimeline(nextPage, pagination.limit, undefined, includeReplies);

            if (response.status === 'success' && response.data) {
                const newTweets = response.data.tweets;

                // Add only new tweets (avoid duplicates using our ref set)
                const uniqueNewTweets = newTweets.filter(t => !tweetIdsRef.current.has(t._id));

                // Update our tracking set
                uniqueNewTweets.forEach(t => tweetIdsRef.current.add(t._id));

                // Add to both loaded tweets and all tweets
                setLoadedTweets(prev => [...prev, ...uniqueNewTweets]);
                setAllTweets(prev => [...prev, ...uniqueNewTweets]);

                setPagination(response.data.pagination);
            } else {
                setError('Failed to load more tweets');
            }
        } catch (err) {
            setError('Error loading tweets. Please try again.');
            console.error('Error loading more tweets:', err);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, pagination.limit, isLoading, hasMore, includeReplies]);

    // Set up intersection observer
    useIntersectionObserver({
        target: loadMoreRef as React.RefObject<Element>,
        onIntersect: loadMoreTweets,
        enabled: hasMore && !isLoading,
        rootMargin: '200px', // Load more tweets when user is 200px away from the bottom
    });

    // Toggle including replies
    const toggleReplies = () => {
        setIncludeReplies(prev => !prev);
    };

    return (
        <div className="flex flex-col">
            <div className="sticky top-0 z-10 bg-white dark:bg-black p-2 border-b border-gray-200 dark:border-gray-800 flex justify-end">
                <button
                    onClick={toggleReplies}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${includeReplies
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}
                >
                    <FunnelIcon className="h-4 w-4" />
                    <span>{includeReplies ? 'Showing Replies' : 'Hide Replies'}</span>
                </button>
            </div>

            {allTweets.length === 0 && !isLoading ? (
                <div className="p-8 text-center text-gray-500 border-b border-gray-200 dark:border-gray-800">
                    <p className="mb-2 font-medium">Welcome to your timeline!</p>
                    <p>When you follow people, their tweets will show up here.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {allTweets.map((tweet) => (
                        <TweetCard
                            key={tweet._id}
                            tweet={tweet}
                            currentUserId={currentUserId}
                            withBorder={true}
                        />
                    ))}
                </div>
            )}

            {/* Loading indicator at bottom */}
            <div ref={loadMoreRef} className="py-4">
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-center text-red-500">{error}</p>}
                {!hasMore && allTweets.length > 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">No more tweets to load</p>
                )}
            </div>
        </div>
    );
} 
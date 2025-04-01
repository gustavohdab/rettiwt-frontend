'use client';

import { useState, useTransition } from 'react';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { likeTweet, unlikeTweet } from '@/lib/actions/tweet.actions';

interface LikeButtonProps {
    tweetId: string;
    isLiked: boolean | undefined;
    count: number;
}

export default function LikeButton({ tweetId, isLiked = false, count }: LikeButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticIsLiked, setOptimisticIsLiked] = useState(isLiked);
    const [optimisticCount, setOptimisticCount] = useState(count);

    const handleLike = () => {
        if (isPending) return;

        // Optimistic update
        const newIsLiked = !optimisticIsLiked;
        setOptimisticIsLiked(newIsLiked);
        setOptimisticCount(prev => newIsLiked ? prev + 1 : prev - 1);

        // Server action
        startTransition(() => {
            if (newIsLiked) {
                likeTweet(tweetId).catch(() => {
                    // Revert on error
                    setOptimisticIsLiked(!newIsLiked);
                    setOptimisticCount(prev => newIsLiked ? prev - 1 : prev + 1);
                });
            } else {
                unlikeTweet(tweetId).catch(() => {
                    // Revert on error
                    setOptimisticIsLiked(!newIsLiked);
                    setOptimisticCount(prev => newIsLiked ? prev - 1 : prev + 1);
                });
            }
        });
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center ${optimisticIsLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
            disabled={isPending}
        >
            {optimisticIsLiked ? (
                <HeartIconSolid className="h-5 w-5 mr-1" />
            ) : (
                <HeartIconOutline className="h-5 w-5 mr-1" />
            )}
            <span className="text-xs">{optimisticCount > 0 ? optimisticCount : ''}</span>
        </button>
    );
} 
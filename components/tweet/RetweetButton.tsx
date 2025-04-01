'use client';

import { useState, useTransition } from 'react';
import { ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline';
import { ArrowPathRoundedSquareIcon as ArrowPathRoundedSquareIconSolid } from '@heroicons/react/24/solid';
import { retweetTweet, unretweetTweet } from '@/lib/actions/tweet.actions';

interface RetweetButtonProps {
    tweetId: string;
    isRetweeted: boolean | undefined;
    count: number;
}

export default function RetweetButton({ tweetId, isRetweeted = false, count }: RetweetButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [optimisticIsRetweeted, setOptimisticIsRetweeted] = useState(isRetweeted);
    const [optimisticCount, setOptimisticCount] = useState(count);

    const handleRetweet = () => {
        if (isPending) return;

        // Optimistic update
        const newIsRetweeted = !optimisticIsRetweeted;
        setOptimisticIsRetweeted(newIsRetweeted);
        setOptimisticCount(prev => newIsRetweeted ? prev + 1 : prev - 1);

        // Server action
        startTransition(() => {
            if (newIsRetweeted) {
                retweetTweet(tweetId).catch(() => {
                    // Revert on error
                    setOptimisticIsRetweeted(!newIsRetweeted);
                    setOptimisticCount(prev => newIsRetweeted ? prev - 1 : prev + 1);
                });
            } else {
                unretweetTweet(tweetId).catch(() => {
                    // Revert on error
                    setOptimisticIsRetweeted(!newIsRetweeted);
                    setOptimisticCount(prev => newIsRetweeted ? prev - 1 : prev + 1);
                });
            }
        });
    };

    return (
        <button
            onClick={handleRetweet}
            className={`flex items-center ${optimisticIsRetweeted ? 'text-green-500' : 'text-gray-500 hover:text-green-500'
                }`}
            disabled={isPending}
        >
            <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-1" />
            <span className="text-xs">{optimisticCount > 0 ? optimisticCount : ''}</span>
        </button>
    );
} 
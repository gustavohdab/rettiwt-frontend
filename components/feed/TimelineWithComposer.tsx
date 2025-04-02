'use client';

import Timeline from '@/components/feed/Timeline';
import TweetComposer from '@/components/tweet/TweetComposer';
import { useSocket } from '@/context/SocketContext';
import type { Tweet } from '@/types';
import { useEffect, useState } from 'react';

interface TimelineWithComposerProps {
    initialTweets: Tweet[];
    initialPagination: any;
    currentUserId: string;
}

export default function TimelineWithComposer({
    initialTweets,
    initialPagination,
    currentUserId
}: TimelineWithComposerProps) {
    const { emitter } = useSocket();
    const [timelineTweets, setTimelineTweets] = useState<Tweet[]>(initialTweets);

    const handleLocalNewTweet = (newTweet: Tweet) => {
        console.log("Handling local new tweet:", newTweet);
        setTimelineTweets(prevTweets => [newTweet, ...prevTweets]);
    };

    useEffect(() => {
        const handleRemoteNewTweet = (newTweet: Tweet) => {
            console.log("Handling remote new tweet:", newTweet);
            setTimelineTweets(prevTweets => [newTweet, ...prevTweets]);
        };

        if (emitter) {
            emitter.on('newTweetReceived', handleRemoteNewTweet);
            console.log("Timeline: Attached listener for newTweetReceived");

            return () => {
                emitter.off('newTweetReceived', handleRemoteNewTweet);
                console.log("Timeline: Detached listener for newTweetReceived");
            };
        } else {
            console.log("Timeline: Emitter not available yet.");
        }
    }, [emitter]);

    return (
        <>
            <div className="border-b border-gray-200 dark:border-gray-800">
                <TweetComposer onSuccess={handleLocalNewTweet} />
            </div>

            <Timeline
                initialTweets={timelineTweets}
                initialPagination={initialPagination}
                currentUserId={currentUserId}
            />
        </>
    );
} 
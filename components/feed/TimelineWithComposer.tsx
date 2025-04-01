'use client';

import { useState } from 'react';
import TweetComposer from '@/components/tweet/TweetComposer';
import Timeline from '@/components/feed/Timeline';
import type { Tweet } from '@/types';

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
    // Keep track of newly created tweets to pass to Timeline
    const [newTweets, setNewTweets] = useState<Tweet[]>(initialTweets);

    // Function to handle new tweet creation
    const handleNewTweet = (newTweet: Tweet) => {
        // Add the new tweet to the beginning of our new tweets array
        setNewTweets(prevTweets => [newTweet, ...prevTweets]);
    };

    return (
        <>
            {/* Tweet composer with onSuccess callback */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <TweetComposer onSuccess={handleNewTweet} />
            </div>

            {/* Timeline component with the newest tweets */}
            <Timeline
                initialTweets={newTweets}
                initialPagination={initialPagination}
                currentUserId={currentUserId}
            />
        </>
    );
} 
import { Suspense } from 'react';
import TweetComposer from '@/components/tweet/TweetComposer';
import TweetList from '@/components/tweet/TweetList';
import TweetSkeleton from '@/components/tweet/TweetSkeleton';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home / Twitter Clone',
    description: 'See what\'s happening in the world right now',
};

export default function FeedPage() {
    return (
        <div>
            <h1 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-800">Home</h1>

            {/* Tweet composer section */}
            <div className="border-b border-gray-200 dark:border-gray-800">
                <TweetComposer />
            </div>

            {/* Timeline with suspense for loading state */}
            <Suspense fallback={
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {[...Array(5)].map((_, i) => (
                        <TweetSkeleton key={i} />
                    ))}
                </div>
            }>
                <TweetList />
            </Suspense>
        </div>
    );
} 
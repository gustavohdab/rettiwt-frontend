import { Suspense } from 'react';
import TweetList from '@/components/tweet/TweetList';
import TweetSkeleton from '@/components/tweet/TweetSkeleton';
import Header from '@/components/layout/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home / Twitter Clone',
    description: 'See what\'s happening in the world right now',
};

export default function FeedPage() {
    return (
        <div>
            <Header title="Home" showSearch={false} />

            {/* Tweet composer and timeline are managed together in TweetList */}
            <Suspense fallback={
                <div>
                    <div className="border-b border-gray-200 dark:border-gray-800 p-4">
                        <div className="animate-pulse h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {[...Array(5)].map((_, i) => (
                            <TweetSkeleton key={i} />
                        ))}
                    </div>
                </div>
            }>
                <TweetList />
            </Suspense>
        </div>
    );
} 
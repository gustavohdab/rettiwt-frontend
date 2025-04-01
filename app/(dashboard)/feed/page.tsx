import { Suspense } from 'react';
import TweetList from '@/components/tweet/TweetList';
import TweetSkeleton from '@/components/tweet/TweetSkeleton';
import Header from '@/components/layout/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Home / Rettiwt',
    description: 'See what\'s happening in the world right now',
};

export default function FeedPage() {
    return (
        <>
            <Header title="Home" showSearch={false} />

            {/* Tweet composer and timeline are managed together in TweetList */}
            <Suspense fallback={
                <>
                    <div className="border-b p-4">
                        <div className="animate-pulse h-24 rounded"></div>
                    </div>
                    <div className="divide-y">
                        {[...Array(5)].map((_, i) => (
                            <TweetSkeleton key={i} />
                        ))}
                    </div>
                </>
            }>
                <TweetList />
            </Suspense>
        </>
    );
} 
import TweetSkeleton from '@/components/tweet/TweetSkeleton';
import Header from '@/components/layout/Header';

export default function FeedLoading() {
    return (
        <>
            <Header title="Home" showSearch={false} />
            <div className="border-b p-4">
                <div className="animate-pulse h-24 rounded bg-gray-800/30"></div>
            </div>
            <div className="divide-y">
                {[...Array(5)].map((_, i) => (
                    <TweetSkeleton key={i} />
                ))}
            </div>
        </>
    );
} 
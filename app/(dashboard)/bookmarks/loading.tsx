import Header from '@/components/layout/Header';
import TweetSkeleton from '@/components/tweet/TweetSkeleton';

export default function BookmarksLoading() {
    return (
        <>
            <Header title="Bookmarks" showBackButton />

            {/* Empty state skeleton */}
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="w-16 h-16 rounded-full bg-[var(--skeleton)] animate-pulse mb-4"></div>
                <div className="h-6 w-48 bg-[var(--skeleton)] animate-pulse rounded mb-2"></div>
                <div className="h-4 w-64 bg-[var(--skeleton)] animate-pulse rounded"></div>
            </div>

            {/* Bookmarks list skeleton */}
            <div className="divide-y divide-[var(--border)]">
                {[...Array(5)].map((_, i) => (
                    <TweetSkeleton key={i} />
                ))}
            </div>
        </>
    );
} 
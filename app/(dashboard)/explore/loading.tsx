import Header from '@/components/layout/Header';
import TweetSkeleton from '@/components/tweet/TweetSkeleton';

export default function ExploreLoading() {
    return (
        <>
            <Header title="Explore" showBackButton />

            {/* Search bar skeleton */}
            <div className="sticky top-0 z-10 bg-[var(--background)] border-b border-[var(--border)] p-4">
                <div className="relative">
                    <div className="h-10 w-full bg-[var(--skeleton)] animate-pulse rounded-full"></div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[var(--skeleton)] animate-pulse rounded"></div>
                </div>
            </div>

            {/* Trending section skeleton */}
            <div className="border-b border-[var(--border)] p-4">
                <div className="h-6 w-32 bg-[var(--skeleton)] animate-pulse rounded mb-4"></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--skeleton)] animate-pulse"></div>
                            <div className="flex-1">
                                <div className="h-5 w-32 bg-[var(--skeleton)] animate-pulse rounded mb-1"></div>
                                <div className="h-4 w-24 bg-[var(--skeleton)] animate-pulse rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* For you section skeleton */}
            <div className="border-b border-[var(--border)] p-4">
                <div className="h-6 w-32 bg-[var(--skeleton)] animate-pulse rounded mb-4"></div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3">
                            <div className="w-12 h-12 rounded-full bg-[var(--skeleton)] animate-pulse"></div>
                            <div className="flex-1">
                                <div className="h-5 w-32 bg-[var(--skeleton)] animate-pulse rounded mb-1"></div>
                                <div className="h-4 w-24 bg-[var(--skeleton)] animate-pulse rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tweets section skeleton */}
            <div className="divide-y divide-[var(--border)]">
                {[...Array(5)].map((_, i) => (
                    <TweetSkeleton key={i} />
                ))}
            </div>
        </>
    );
} 
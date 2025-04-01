import Header from '@/components/layout/Header';
import TweetSkeleton from '@/components/tweet/TweetSkeleton';

export default function ProfileLoading() {
    return (
        <>
            <Header title="Profile" showBackButton />

            {/* Profile header skeleton */}
            <div className="relative">
                <div className="h-48 w-full bg-[var(--skeleton)] animate-pulse"></div>
                <div className="absolute -bottom-16 left-4">
                    <div className="w-32 h-32 rounded-full border-4 border-[var(--background)] bg-[var(--skeleton)] animate-pulse"></div>
                </div>
            </div>

            {/* Profile info skeleton */}
            <div className="mt-20 px-4">
                <div className="h-7 w-48 bg-[var(--skeleton)] animate-pulse rounded mb-2"></div>
                <div className="h-5 w-32 bg-[var(--skeleton)] animate-pulse rounded mb-4"></div>
                <div className="h-16 w-full bg-[var(--skeleton)] animate-pulse rounded mb-4"></div>
            </div>

            {/* Tabs skeleton */}
            <div className="border-b border-[var(--border)] mt-4">
                <div className="flex">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex-1 py-4">
                            <div className="h-5 w-16 mx-auto bg-[var(--skeleton)] animate-pulse rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Timeline skeleton */}
            <div className="divide-y divide-[var(--border)]">
                {[...Array(3)].map((_, i) => (
                    <TweetSkeleton key={i} />
                ))}
            </div>
        </>
    );
} 
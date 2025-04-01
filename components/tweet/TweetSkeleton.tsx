export default function TweetSkeleton() {
    return (
        <div className="p-4">
            <div className="flex gap-3">
                {/* Avatar skeleton */}
                <div className="w-12 h-12 rounded-full bg-[var(--skeleton)] animate-pulse"></div>

                <div className="flex-1">
                    {/* Header skeleton */}
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-32 bg-[var(--skeleton)] animate-pulse rounded"></div>
                        <div className="h-4 w-16 bg-[var(--skeleton)] animate-pulse rounded"></div>
                    </div>

                    {/* Content skeleton */}
                    <div className="space-y-2 mb-3">
                        <div className="h-4 w-full bg-[var(--skeleton)] animate-pulse rounded"></div>
                        <div className="h-4 w-3/4 bg-[var(--skeleton)] animate-pulse rounded"></div>
                        <div className="h-4 w-1/2 bg-[var(--skeleton)] animate-pulse rounded"></div>
                    </div>

                    {/* Media skeleton */}
                    <div className="h-48 w-full bg-[var(--skeleton)] animate-pulse rounded-lg mb-3"></div>

                    {/* Actions skeleton */}
                    <div className="flex justify-between max-w-md">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="h-5 w-5 bg-[var(--skeleton)] animate-pulse rounded"></div>
                                <div className="h-4 w-8 bg-[var(--skeleton)] animate-pulse rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 
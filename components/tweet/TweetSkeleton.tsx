export default function TweetSkeleton() {
    return (
        <div className="flex p-4 animate-pulse">
            {/* Avatar skeleton */}
            <div className="flex-shrink-0 mr-3">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
                {/* Header skeleton */}
                <div className="flex items-center mb-2">
                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded-md mr-2" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-md opacity-70" />
                </div>

                {/* Tweet text skeleton */}
                <div className="space-y-2 mb-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-5/6" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4" />
                </div>

                {/* Media skeleton (optional) */}
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3 w-full" />

                {/* Action buttons skeleton */}
                <div className="flex justify-between max-w-md">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
} 
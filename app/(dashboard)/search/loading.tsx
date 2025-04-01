import Header from '@/components/layout/Header';

export default function SearchLoading() {
    return (
        <>
            <Header title="Search" showSearch />

            {/* Search tabs skeleton */}
            <div className="border-b border-gray-800">
                <div className="flex">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex-1 py-4">
                            <div className="h-5 w-16 mx-auto bg-gray-800/30 animate-pulse rounded"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search results skeleton */}
            <div className="divide-y">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4">
                        <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-800/30 animate-pulse"></div>
                            <div className="flex-1">
                                <div className="h-5 w-32 bg-gray-800/30 animate-pulse rounded mb-2"></div>
                                <div className="h-4 w-24 bg-gray-800/30 animate-pulse rounded mb-3"></div>
                                <div className="h-16 w-full bg-gray-800/30 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
} 
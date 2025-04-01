"use client";

import { useEffect, useState } from "react";
import { Tweet, normalizeTweet } from "@/types/models";
import trendsService from "@/lib/api/services/trends.service";
import { Skeleton } from "@/components/ui/skeleton";
import TweetCard from "@/components/tweet/TweetCard";
import { useAuth } from "@/lib/hooks/useAuth";

interface HashtagPageProps {
    hashtag: string;
}

export default function HashtagPage({ hashtag }: HashtagPageProps) {
    const { user } = useAuth();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchHashtagTweets(1);
    }, [hashtag]);

    const fetchHashtagTweets = async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await trendsService.getTweetsByHashtag(hashtag, pageNum);
            if (response.status === "success" && response.data) {
                const normalizedTweets = response.data.tweets.map(normalizeTweet);
                if (pageNum === 1) {
                    setTweets(normalizedTweets);
                } else {
                    setTweets((prev) => [...prev, ...normalizedTweets]);
                }

                // Check if there are more tweets to load
                const { pagination } = response.data;
                setHasMore(pagination.page < pagination.pages);
                setPage(pagination.page);
            } else {
                setError("Failed to load tweets for this hashtag");
            }
        } catch (err) {
            setError("Failed to load tweets for this hashtag");
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchHashtagTweets(page + 1);
        }
    };

    if (loading && tweets.length === 0) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-gray-200 dark:border-gray-800 p-4">
                        <div className="flex items-start gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1">
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-3 w-24 mb-3" />
                                <Skeleton className="h-16 w-full rounded-md mb-2" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error && tweets.length === 0) {
        return (
            <div className="p-4">
                <p className="text-red-500">Failed to load tweets for #{hashtag}</p>
            </div>
        );
    }

    if (!tweets.length) {
        return (
            <div className="p-4 text-center py-10">
                <p className="text-gray-500 text-lg">No tweets found with #{hashtag}</p>
                <p className="text-gray-400 mt-2">Be the first to tweet with this hashtag!</p>
            </div>
        );
    }

    // Extract the user ID, using only the id property that we know exists
    const userId = user?.id || "";

    return (
        <div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {tweets.map((tweet) => (
                    <TweetCard
                        key={tweet._id}
                        tweet={tweet}
                        currentUserId={userId}
                        withBorder={true}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="p-4 text-center">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "Load more"}
                    </button>
                </div>
            )}

            {!hasMore && tweets.length > 0 && (
                <div className="p-4 text-center text-gray-500">
                    No more tweets to load
                </div>
            )}
        </div>
    );
} 
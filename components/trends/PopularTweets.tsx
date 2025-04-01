"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Tweet, normalizeTweet } from "@/types/models";
import trendsService from "@/lib/api/services/trends.service";
import { Skeleton } from "@/components/ui/skeleton";
import TweetCard from "@/components/tweet/TweetCard";
import { useAuth } from "@/lib/hooks/useAuth";
import Header from "@/components/layout/Header";
interface PopularTweetsProps {
    initialTweets?: Tweet[];
}

export default function PopularTweets({ initialTweets }: PopularTweetsProps) {
    const { user } = useAuth();
    const [tweets, setTweets] = useState<Tweet[]>(initialTweets || []);
    const [loading, setLoading] = useState(!initialTweets);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        if (!initialTweets) {
            fetchPopularTweets();
        }
    }, [initialTweets]);

    const fetchPopularTweets = async (pageNum = 1) => {
        try {
            setLoading(true);
            const response = await trendsService.getPopularTweets(pageNum);
            if (response.status === "success" && response.data) {
                // Properly normalize API tweets to UI model tweets
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
                setError("Failed to load popular tweets");
            }
        } catch (err) {
            setError("Failed to load popular tweets");
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            fetchPopularTweets(page + 1);
        }
    };

    if (error && tweets.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Popular Tweets</h2>
                <p className="text-red-500">Failed to load popular tweets</p>
            </div>
        );
    }

    if (!tweets.length) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Popular Tweets</h2>
                <p className="text-gray-500">No popular tweets at the moment</p>
            </div>
        );
    }

    // Extract the user ID, using only the id property that we know exists
    const userId = user?.id || "";

    return (
        <div>
            <Header title="Popular Tweets" showSearch={false} />

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
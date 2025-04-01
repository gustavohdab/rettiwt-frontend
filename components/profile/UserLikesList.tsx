"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Tweet } from "@/types/models";
import { ApiTypes } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import TweetCard from "@/components/tweet/TweetCard";
import TweetService from "@/lib/api/services/tweet.service";
import { useSession } from "next-auth/react";

interface UserLikesListProps {
    username: string;
    initialLikes: Tweet[];
    pagination?: ApiTypes.PaginationInfo;
}

export default function UserLikesList({
    username,
    initialLikes,
    pagination,
}: UserLikesListProps) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState<Tweet[]>(initialLikes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(pagination?.page || 1);
    const [hasMore, setHasMore] = useState(
        pagination ? page < pagination.pages : true
    );
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastLikeRef = useRef<HTMLDivElement | null>(null);

    const loadMoreLikes = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            const nextPage = page + 1;
            const response = await TweetService.getUserLikedTweets(username, nextPage);

            if (response.status === "success" && response.data) {
                const newLikes = response.data.tweets;
                setLikes((prev) => [...prev, ...newLikes]);
                setPage(nextPage);
                setHasMore(
                    response.data.pagination.page < response.data.pagination.pages
                );
            } else {
                setError("Failed to load more likes");
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to load more likes");
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, username]);

    // Setup intersection observer for infinite scrolling
    useEffect(() => {
        if (loading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        const options = {
            rootMargin: "100px",
            threshold: 0.1,
        };

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreLikes();
            }
        }, options);

        if (lastLikeRef.current) {
            observerRef.current.observe(lastLikeRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMoreLikes, loading, hasMore]);

    if (!likes.length && !loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <h3 className="text-2xl font-bold mb-2">
                    @{username} hasn't liked any tweets
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    When they like a tweet, it will show up here.
                </p>
            </div>
        );
    }

    return (
        <div>
            {likes.map((tweet, index) => (
                <div
                    key={tweet._id}
                    ref={index === likes.length - 1 ? lastLikeRef : null}
                >
                    <TweetCard
                        tweet={tweet}
                        currentUserId={session?.user.id || ""}
                        withBorder={true}
                    />
                </div>
            ))}

            {loading && (
                <div className="p-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="mb-4">
                            <Skeleton className="w-full h-24 rounded-lg" />
                        </div>
                    ))}
                </div>
            )}

            {error && (
                <div className="py-4 text-center text-red-500">
                    {error}
                    <button
                        onClick={() => loadMoreLikes()}
                        className="ml-2 text-blue-500 hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!hasMore && likes.length > 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    You've reached the end
                </div>
            )}
        </div>
    );
} 
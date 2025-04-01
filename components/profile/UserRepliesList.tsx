"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Tweet } from "@/types/models";
import { ApiTypes } from "@/types";
import TweetCard from "@/components/tweet/TweetCard";
import { Skeleton } from "@/components/ui/skeleton";
import TweetService from "@/lib/api/services/tweet.service";
import { useAuth } from "@/lib/hooks/useAuth";

interface UserRepliesListProps {
    username: string;
    initialReplies: Tweet[];
    pagination?: ApiTypes.PaginationInfo;
}

export default function UserRepliesList({
    username,
    initialReplies,
    pagination,
}: UserRepliesListProps) {
    const { user } = useAuth();
    const [replies, setReplies] = useState<Tweet[]>(initialReplies);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(pagination?.page || 1);
    const [hasMore, setHasMore] = useState(
        pagination ? page < pagination.pages : true
    );
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastReplyRef = useRef<HTMLDivElement | null>(null);

    const loadMoreReplies = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            const nextPage = page + 1;
            const response = await TweetService.getUserReplies(username, nextPage);

            if (response.status === "success" && response.data) {
                const newReplies = response.data.tweets;
                setReplies((prev) => [...prev, ...newReplies]);
                setPage(nextPage);
                setHasMore(
                    response.data.pagination.page < response.data.pagination.pages
                );
            } else {
                setError("Failed to load more replies");
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to load more replies");
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
                loadMoreReplies();
            }
        }, options);

        if (lastReplyRef.current) {
            observerRef.current.observe(lastReplyRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMoreReplies, loading, hasMore]);

    if (!replies.length && !loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <h3 className="text-2xl font-bold mb-2">
                    @{username} hasn't replied to any tweets
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    When they reply to a tweet, those replies will show up here.
                </p>
            </div>
        );
    }

    return (
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {replies.map((tweet, index) => (
                <div
                    key={tweet._id}
                    ref={index === replies.length - 1 ? lastReplyRef : null}
                >
                    <TweetCard
                        tweet={tweet}
                        currentUserId={user?.id || ""}
                        withBorder={false}
                    />
                </div>
            ))}

            {loading && (
                <div className="py-4 px-4">
                    <div className="flex items-start space-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-24 w-full rounded-md" />
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="py-4 px-4 text-center text-red-500">
                    {error}
                    <button
                        onClick={() => loadMoreReplies()}
                        className="ml-2 text-blue-500 hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!hasMore && replies.length > 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    You've reached the end
                </div>
            )}
        </div>
    );
} 
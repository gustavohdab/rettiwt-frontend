"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tweet } from "@/types/models";
import { ApiTypes } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import TweetService from "@/lib/api/services/tweet.service";

interface UserMediaListProps {
    username: string;
    initialMediaTweets: Tweet[];
    pagination?: ApiTypes.PaginationInfo;
}

export default function UserMediaList({
    username,
    initialMediaTweets,
    pagination,
}: UserMediaListProps) {
    const [mediaTweets, setMediaTweets] = useState<Tweet[]>(initialMediaTweets);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(pagination?.page || 1);
    const [hasMore, setHasMore] = useState(
        pagination ? page < pagination.pages : true
    );
    const observerRef = useRef<IntersectionObserver | null>(null);
    const lastMediaRef = useRef<HTMLDivElement | null>(null);

    const loadMoreMedia = useCallback(async () => {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            const nextPage = page + 1;
            const response = await TweetService.getUserMediaTweets(username, nextPage);

            if (response.status === "success" && response.data) {
                const newMediaTweets = response.data.tweets;
                setMediaTweets((prev) => [...prev, ...newMediaTweets]);
                setPage(nextPage);
                setHasMore(
                    response.data.pagination.page < response.data.pagination.pages
                );
            } else {
                setError("Failed to load more media");
                setHasMore(false);
            }
        } catch (err) {
            setError("Failed to load more media");
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
                loadMoreMedia();
            }
        }, options);

        if (lastMediaRef.current) {
            observerRef.current.observe(lastMediaRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMoreMedia, loading, hasMore]);

    if (!mediaTweets.length && !loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <h3 className="text-2xl font-bold mb-2">
                    @{username} hasn't shared any media
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    When they share media in a tweet, it will show up here.
                </p>
            </div>
        );
    }

    // Extract all media from tweets
    const allMedia = mediaTweets.flatMap(tweet =>
        tweet.media.map(media => ({
            mediaItem: media,
            tweet
        }))
    );

    return (
        <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allMedia.map((item, index) => (
                    <div
                        key={`${item.tweet._id}-${index}`}
                        ref={index === allMedia.length - 1 ? lastMediaRef : null}
                        className="aspect-square relative rounded-lg overflow-hidden"
                    >
                        <Link href={`/tweet/${item.tweet._id}`}>
                            <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL_MEDIA}${item.mediaItem.url}`}
                                alt={item.mediaItem.altText || "Media"}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-200"
                            />
                        </Link>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
            )}

            {error && (
                <div className="py-4 text-center text-red-500">
                    {error}
                    <button
                        onClick={() => loadMoreMedia()}
                        className="ml-2 text-blue-500 hover:underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {!hasMore && mediaTweets.length > 0 && (
                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                    You've reached the end
                </div>
            )}
        </div>
    );
} 
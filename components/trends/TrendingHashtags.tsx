"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSocket } from "@/context/SocketContext";
import trendsService from "@/lib/api/services/trends.service";
import { TrendingHashtag } from "@/types/models";
import Link from "next/link";
import { useEffect, useState } from "react";

interface TrendingHashtagsProps {
    initialHashtags?: TrendingHashtag[];
}

export default function TrendingHashtags({ initialHashtags }: TrendingHashtagsProps) {
    const { emitter } = useSocket();
    const [hashtags, setHashtags] = useState<TrendingHashtag[]>(initialHashtags || []);
    const [loading, setLoading] = useState(!initialHashtags);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!initialHashtags) {
            const fetchTrendingHashtags = async () => {
                try {
                    setLoading(true);
                    const response = await trendsService.getTrendingHashtags();
                    if (response.status === "success" && response.data) {
                        setHashtags(response.data.trendingHashtags);
                    } else {
                        setError("Failed to load trending hashtags");
                    }
                } catch (err) {
                    setError("Failed to load trending hashtags");
                } finally {
                    setLoading(false);
                }
            };

            fetchTrendingHashtags();
        }
    }, [initialHashtags]);

    // Listen for real-time trending updates
    useEffect(() => {
        if (emitter) {
            const handleTrendsUpdate = (newHashtags: TrendingHashtag[]) => {
                console.log("Received real-time trending update:", newHashtags);
                setHashtags(newHashtags);
            };

            emitter.on('trends:update', handleTrendsUpdate);
            console.log("TrendingHashtags: Attached listener for trends:update");

            return () => {
                emitter.off('trends:update', handleTrendsUpdate);
                console.log("TrendingHashtags: Detached listener for trends:update");
            };
        }
    }, [emitter]);

    if (loading) {
        return (
            <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Trending</h2>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-4">
                        <Skeleton className="h-5 w-24 mb-2 bg-gray-800" />
                        <Skeleton className="h-4 w-16 bg-gray-800" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Trending</h2>
                <p className="text-red-500">Failed to load trending hashtags</p>
            </div>
        );
    }

    if (!hashtags.length) {
        return (
            <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Trending</h2>
                <p className="text-[var(--secondary)]">No trending hashtags at the moment</p>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Trending</h2>
            <div className="space-y-4">
                {hashtags.map((tag) => (
                    <Link
                        href={`/hashtag/${tag.hashtag}`}
                        key={tag.hashtag}
                        className="block hover:bg-[#1a1a1a] -mx-3 px-3 py-2.5 rounded-md transition"
                    >
                        <div className="font-semibold text-base text-[var(--foreground)]">#{tag.hashtag}</div>
                        <div className="text-sm text-[var(--secondary)]">
                            {tag.tweetCount} {tag.tweetCount === 1 ? "tweet" : "tweets"}
                        </div>
                    </Link>
                ))}
            </div>
            <Link
                href="/explore"
                className="block text-white hover:text-gray-200 text-sm mt-4 font-medium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-center transition"
            >
                Show more
            </Link>
        </div>
    );
} 
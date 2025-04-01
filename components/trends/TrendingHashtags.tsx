"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingHashtag } from "@/types/models";
import trendsService from "@/lib/api/services/trends.service";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingHashtagsProps {
    initialHashtags?: TrendingHashtag[];
}

export default function TrendingHashtags({ initialHashtags }: TrendingHashtagsProps) {
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

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Trending</h2>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-3">
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Trending</h2>
                <p className="text-red-500">Failed to load trending hashtags</p>
            </div>
        );
    }

    if (!hashtags.length) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Trending</h2>
                <p className="text-gray-500">No trending hashtags at the moment</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Trending</h2>
            <div className="space-y-3">
                {hashtags.map((tag) => (
                    <Link
                        href={`/hashtag/${tag.hashtag}`}
                        key={tag.hashtag}
                        className="block hover:bg-gray-100 dark:hover:bg-gray-700 -mx-3 px-3 py-2 rounded-md transition"
                    >
                        <div className="font-semibold text-base">#{tag.hashtag}</div>
                        <div className="text-sm text-gray-500">
                            {tag.tweetCount} {tag.tweetCount === 1 ? "tweet" : "tweets"}
                        </div>
                    </Link>
                ))}
            </div>
            <Link
                href="/explore"
                className="block text-blue-500 hover:text-blue-600 text-sm mt-3 font-medium"
            >
                Show more
            </Link>
        </div>
    );
} 
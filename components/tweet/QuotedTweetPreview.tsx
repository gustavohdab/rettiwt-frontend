"use client";

import getImageUrl from "@/lib/utils/getImageUrl";
import type { Tweet } from "@/types/models";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import TweetContent from "./TweetContent"; // Reuse content renderer

interface QuotedTweetPreviewProps {
    tweet: Tweet;
}

// A simplified display for a quoted tweet within the composer
export default function QuotedTweetPreview({ tweet }: QuotedTweetPreviewProps) {
    if (!tweet || !tweet.author) {
        // Handle cases where tweet data or author might be missing unexpectedly
        return <div className="p-3 text-sm text-red-500">Error: Quoted tweet data incomplete.</div>;
    }

    const author = tweet.author; // Already normalized as an object
    const formattedDate = formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true });
    const authorInitial = author.name?.charAt(0).toUpperCase() || "U";

    // Stop propagation on links inside the preview
    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div className="p-3 bg-transparent">
            <div className="flex items-center mb-2">
                {/* Avatar */}
                <Link href={`/${author.username}`} onClick={stopPropagation} className="flex-shrink-0 mr-2">
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        {author.avatar ? (
                            <Image
                                src={getImageUrl(author.avatar)}
                                alt={author.name}
                                width={20}
                                height={20}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{authorInitial}</span>
                        )}
                    </div>
                </Link>
                {/* Author Name & Username */}
                <Link href={`/${author.username}`} onClick={stopPropagation} className="hover:underline">
                    <span className="font-semibold text-sm mr-1 text-gray-900 dark:text-gray-100 truncate">{author.name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 truncate">@{author.username}</span>
                </Link>
                {/* Timestamp */}
                <span className="mx-1 text-gray-500 dark:text-gray-400 text-sm">·</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 truncate">{formattedDate}</span>
            </div>
            {/* Tweet Content Snippet - Use TweetContent for consistency */}
            <div className="text-sm text-gray-800 dark:text-gray-200">
                <TweetContent content={tweet.content} />
            </div>
            {/* Optionally show first image thumbnail? */}
            {tweet.media && tweet.media.length > 0 && tweet.media[0].url && (
                <div className="mt-2 rounded-lg overflow-hidden max-h-32">
                    <Image
                        src={getImageUrl(tweet.media[0].url)}
                        alt={tweet.media[0].altText || "Quoted tweet media"}
                        width={500} // Use larger width for potential layout calc
                        height={300}
                        className="object-cover w-full h-full"
                    />
                </div>
            )}
        </div>
    );
} 
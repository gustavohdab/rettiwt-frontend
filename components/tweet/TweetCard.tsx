// TweetCard.tsx
'use client';

import ActionButton from '@/components/shared/ActionButton';
import { likeTweet, retweetTweet, unlikeTweet, unretweetTweet } from '@/lib/actions/tweet.actions';
import getImageUrl from '@/lib/utils/getImageUrl';
import type { TweetCardProps } from '@/types';
import {
    ArrowPathRoundedSquareIcon,
    ArrowUpTrayIcon,
    ChatBubbleOvalLeftIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import BookmarkButton from './BookmarkButton';
import TweetContent from './TweetContent';

export default function TweetCard({ tweet, currentUserId, withBorder }: TweetCardProps) {
    const router = useRouter();
    const displayTweet = tweet.isRetweet && tweet.originalTweet ? tweet.originalTweet : tweet;
    const formattedDate = formatDistanceToNow(new Date(displayTweet.createdAt), { addSuffix: true });
    const [isPending] = useTransition();

    // State for optimistic UI updates
    const [isLiked, setIsLiked] = useState(
        tweet.liked ||
        (Array.isArray(tweet.likes) && tweet.likes.some(like => like._id === currentUserId))
    );
    const [likeCount, setLikeCount] = useState(
        tweet.engagementCount?.likes || (Array.isArray(tweet.likes) ? tweet.likes.length : 0)
    );
    const [isRetweeted, setIsRetweeted] = useState(
        tweet.retweeted ||
        (Array.isArray(tweet.retweets) && tweet.retweets.some(retweet => retweet._id === currentUserId))
    );
    const [retweetCount, setRetweetCount] = useState(
        tweet.engagementCount?.retweets || (Array.isArray(tweet.retweets) ? tweet.retweets.length : 0)
    );
    const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

    // Optimistic UI updates for like/unlike
    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLiked) {
            setIsLiked(false);
            setLikeCount(prev => Math.max(0, prev - 1));
            await unlikeTweet(tweet._id);
        } else {
            setIsLiked(true);
            setLikeCount(prev => prev + 1);
            await likeTweet(tweet._id);
        }
    };

    // Optimistic UI updates for retweet/unretweet
    const handleRetweet = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isRetweeted) {
            setIsRetweeted(false);
            setRetweetCount(prev => Math.max(0, prev - 1));
            await unretweetTweet(tweet._id);
        } else {
            setIsRetweeted(true);
            setRetweetCount(prev => prev + 1);
            await retweetTweet(tweet._id);
        }
    };

    const author = displayTweet.author;

    // Navigation handlers
    const navigateToTweet = () => {
        router.push(`/tweet/${tweet._id}`);
    };

    const navigateToProfile = (e: React.MouseEvent, username: string) => {
        e.stopPropagation();
        router.push(`/${username}`);
    };

    // Handle share button click - copy URL to clipboard
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const tweetUrl = `${window.location.origin}/tweet/${tweet._id}`;
        navigator.clipboard.writeText(tweetUrl)
            .then(() => {
                setShowCopiedTooltip(true);
                setTimeout(() => {
                    setShowCopiedTooltip(false);
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy URL: ', err);
            });
    };

    return (
        <article
            className={`p-5 sm:p-6 hover:bg-[#121212] transition duration-150 cursor-pointer ${withBorder ? 'border-b border-gray-800' : ''
                }`}
            onClick={navigateToTweet}
        >
            {/* Retweet indicator */}
            {tweet.isRetweet && tweet.retweetedBy && (
                <div className="flex items-center text-[var(--secondary)] text-sm sm:text-base mb-3">
                    <ArrowPathRoundedSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                    <span>{tweet.retweetedBy.name} Retweeted</span>
                </div>
            )}

            {/* Reply indicator */}
            {tweet.inReplyTo && (
                <div className="flex items-center text-[var(--secondary)] text-sm sm:text-base mb-3">
                    <ChatBubbleOvalLeftIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                    <span>Replying to </span>
                    <button
                        className="ml-1 text-[var(--accent)] hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (tweet.inReplyTo) {
                                router.push(`/tweet/${tweet.inReplyTo._id}`);
                            }
                        }}
                    >
                        @{tweet.inReplyTo.author.username}
                    </button>
                </div>
            )}

            <div className="flex">
                {/* Author avatar */}
                <div className="flex-shrink-0 mr-4">
                    <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer"
                        onClick={(e) => navigateToProfile(e, author.username)}
                    >
                        {author.avatar ? (
                            <Image
                                src={getImageUrl(author.avatar)}
                                alt={author.name}
                                width={64}
                                height={64}
                                className="rounded-full w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm sm:text-base font-medium">
                                {author.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tweet content */}
                <div className="flex-1 min-w-0">
                    {/* Tweet header */}
                    <div className="flex flex-wrap items-center mb-2">
                        <span
                            className="font-bold text-[var(--foreground)] hover:underline mr-2 cursor-pointer text-base sm:text-lg"
                            onClick={(e) => navigateToProfile(e, author.username)}
                        >
                            {author.name}
                        </span>
                        {author.verified && (
                            <span className="text-[var(--accent)] mr-2">
                                <svg
                                    className="h-4 w-4 sm:h-5 sm:w-5 inline-block"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                </svg>
                            </span>
                        )}
                        <span
                            className="text-[var(--secondary)] hover:underline cursor-pointer text-sm sm:text-base"
                            onClick={(e) => navigateToProfile(e, author.username)}
                        >
                            @{author.username}
                        </span>
                        <span className="mx-2 text-[var(--secondary)]">·</span>
                        <span className="text-[var(--secondary)] hover:underline text-sm sm:text-base">
                            {formattedDate}
                        </span>
                    </div>

                    {/* Tweet text */}
                    <div className="mb-4 text-[var(--foreground)]">
                        <TweetContent content={displayTweet.content} />
                    </div>

                    {/* Tweet images */}
                    {displayTweet.media && displayTweet.media.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            {displayTweet.media.map((item, index) => (
                                <div key={index} className="relative rounded-xl overflow-hidden bg-gray-800">
                                    {item.url && (
                                        <Image
                                            src={getImageUrl(item.url)}
                                            alt={item.altText || `Image ${index + 1}`}
                                            width={500}
                                            height={300}
                                            className="w-full h-auto object-cover"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tweet actions */}
                    <div className="flex justify-between mt-3 text-[var(--secondary)]">
                        {/* Reply */}
                        <ActionButton
                            onClick={navigateToTweet}
                            Icon={ChatBubbleOvalLeftIcon}
                            defaultColorClass="hover:text-[var(--accent)]"
                        />

                        {/* Retweet */}
                        <ActionButton
                            onClick={handleRetweet}
                            Icon={ArrowPathRoundedSquareIcon}
                            activeColorClass="text-green-500 hover:text-green-500"
                            defaultColorClass="hover:text-green-500"
                            active={isRetweeted}
                            count={retweetCount}
                        />

                        {/* Like */}
                        <ActionButton
                            onClick={handleLike}
                            Icon={HeartIcon}
                            ActiveIcon={HeartIconSolid}
                            activeColorClass="text-red-500 hover:text-red-500"
                            defaultColorClass="hover:text-red-500"
                            active={isLiked}
                            count={likeCount}
                        />

                        {/* Bookmark */}
                        <BookmarkButton tweetId={tweet._id} initialBookmarked={tweet.bookmarked} />

                        {/* Share */}
                        <div className="relative">
                            <ActionButton
                                onClick={handleShare}
                                Icon={ArrowUpTrayIcon}
                                defaultColorClass="hover:text-[var(--accent)]"
                            />
                            {showCopiedTooltip && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--accent)] text-white text-xs rounded whitespace-nowrap">
                                    Copied to clipboard!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

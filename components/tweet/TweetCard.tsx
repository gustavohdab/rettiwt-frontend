'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ArrowPathRoundedSquareIcon, ChatBubbleOvalLeftIcon, ArrowUpTrayIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { likeTweet, unlikeTweet, retweetTweet, unretweetTweet } from '@/lib/actions/tweet.actions';
import type { TweetCardProps } from '@/types';

export default function TweetCard({ tweet, currentUserId, withBorder }: TweetCardProps) {
    const router = useRouter();

    // State for optimistic UI updates
    const [isLiked, setIsLiked] = useState(tweet.liked || Array.isArray(tweet.likes) && tweet.likes.some(like =>
        like._id === currentUserId
    ));
    const [likeCount, setLikeCount] = useState(
        tweet.engagementCount?.likes || (Array.isArray(tweet.likes) ? tweet.likes.length : 0)
    );
    const [isRetweeted, setIsRetweeted] = useState(tweet.retweeted || Array.isArray(tweet.retweets) && tweet.retweets.some(retweet =>
        retweet._id === currentUserId
    ));
    const [retweetCount, setRetweetCount] = useState(
        tweet.engagementCount?.retweets || (Array.isArray(tweet.retweets) ? tweet.retweets.length : 0)
    );

    // Handle like/unlike
    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation to tweet detail

        // Optimistic update
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

    // Handle retweet/unretweet
    const handleRetweet = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation to tweet detail

        // Optimistic update
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

    // For retweets, use the original tweet content but show who retweeted it
    const displayTweet = tweet.isRetweet && tweet.originalTweet ? tweet.originalTweet : tweet;
    const author = displayTweet.author;

    // Navigate to tweet detail page
    const navigateToTweet = () => {
        router.push(`/tweet/${tweet._id}`);
    };

    // Navigate to user profile, stopping propagation
    const navigateToProfile = (e: React.MouseEvent, username: string) => {
        e.stopPropagation(); // Prevent navigation to tweet detail
        router.push(`/${username}`);
    };

    return (
        <article
            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-150 cursor-pointer ${withBorder ? 'border-b border-gray-200 dark:border-gray-800' : ''}`}
            onClick={navigateToTweet}
        >
            {/* Retweet indicator */}
            {tweet.isRetweet && tweet.retweetedBy && (
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <ArrowPathRoundedSquareIcon className="h-4 w-4 mr-2" />
                    <span>{tweet.retweetedBy.name} Retweeted</span>
                </div>
            )}

            {/* Reply indicator */}
            {tweet.inReplyTo && (
                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <ChatBubbleOvalLeftIcon className="h-4 w-4 mr-2" />
                    <span>Replying to </span>
                    <button
                        className="ml-1 text-blue-500 hover:underline"
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
                <div className="flex-shrink-0 mr-3">
                    <div
                        className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                        onClick={(e) => navigateToProfile(e, author.username)}
                    >
                        {author.avatar ? (
                            <Image
                                src={author.avatar}
                                alt={author.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm font-medium">
                                {author.name.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tweet content */}
                <div className="flex-1 min-w-0">
                    {/* Tweet header */}
                    <div className="flex items-center mb-1">
                        <span
                            className="font-bold text-gray-900 dark:text-white hover:underline mr-1 cursor-pointer"
                            onClick={(e) => navigateToProfile(e, author.username)}
                        >
                            {author.name}
                        </span>
                        {author.verified && (
                            <span className="text-blue-500 mr-1">
                                <svg className="h-4 w-4 inline-block" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                </svg>
                            </span>
                        )}
                        <span
                            className="text-gray-500 dark:text-gray-400 hover:underline cursor-pointer"
                            onClick={(e) => navigateToProfile(e, author.username)}
                        >
                            @{author.username}
                        </span>
                        <span className="mx-1 text-gray-500 dark:text-gray-400">·</span>
                        <span className="text-gray-500 dark:text-gray-400 hover:underline">
                            {formatDistanceToNow(new Date(displayTweet.createdAt), { addSuffix: true })}
                        </span>
                    </div>

                    {/* Tweet text */}
                    <div className="mb-2 text-gray-900 dark:text-white whitespace-pre-wrap">
                        {displayTweet.content}
                    </div>

                    {/* Tweet images */}
                    {(() => {
                        const media = displayTweet?.media || [];
                        if (media.length > 0) {
                            return (
                                <div className={`grid ${media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 mb-3`}>
                                    {media.map((item, index) => (
                                        <div key={index} className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            {item.url && (
                                                <Image
                                                    src={`http://localhost:5000${item.url}`}
                                                    alt={item.altText || `Image ${index + 1}`}
                                                    width={500}
                                                    height={media.length === 1 ? 300 : 200}
                                                    className="object-cover w-full"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            );
                        }
                        return null;
                    })()}

                    {/* Tweet actions */}
                    <div className="flex justify-between max-w-md text-gray-500 dark:text-gray-400">
                        {/* Reply */}
                        <button
                            onClick={navigateToTweet}
                            className="flex items-center hover:text-blue-500 transition duration-150"
                        >
                            <ChatBubbleOvalLeftIcon className="h-5 w-5 mr-1" />
                            <span>{displayTweet.engagementCount?.replies || 0}</span>
                        </button>

                        {/* Retweet */}
                        <button
                            onClick={handleRetweet}
                            className={`flex items-center hover:text-green-500 transition duration-150 ${isRetweeted ? 'text-green-500' : ''}`}
                        >
                            <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-1" />
                            <span>{retweetCount}</span>
                        </button>

                        {/* Like */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center hover:text-red-500 transition duration-150 ${isLiked ? 'text-red-500' : ''}`}
                        >
                            {isLiked ? (
                                <HeartIconSolid className="h-5 w-5 mr-1" />
                            ) : (
                                <HeartIcon className="h-5 w-5 mr-1" />
                            )}
                            <span>{likeCount}</span>
                        </button>

                        {/* Share */}
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center hover:text-blue-500 transition duration-150"
                        >
                            <ArrowUpTrayIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
} 
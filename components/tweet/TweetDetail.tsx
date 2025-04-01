'use client';

import LikeButton from '@/components/tweet/LikeButton';
import RetweetButton from '@/components/tweet/RetweetButton';
import getImageUrl from '@/lib/utils/getImageUrl';
import type { Tweet } from '@/types';
import { ChatBubbleLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import TweetContent from './TweetContent';

interface TweetDetailProps {
    tweet: Tweet;
    currentUserId: string;
}

export default function TweetDetail({ tweet, currentUserId }: TweetDetailProps) {
    // Destructuring for easier access
    const {
        author,
        content: text,
        createdAt,
    } = tweet;

    const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    const fullDate = new Date(createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <article className="p-4 border-b border-gray-200 dark:border-gray-800">
            {/* Author info with follow button */}
            <div className="flex items-start mb-4">
                <Link href={`/${author.username}`} className="flex-shrink-0 mr-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                        {author.avatar ? (
                            <Image
                                src={getImageUrl(author.avatar)}
                                alt={author.name || 'User avatar'}
                                width={48}
                                height={48}
                                className="rounded-full object-cover w-full h-full"
                            />
                        ) : (
                            <span className="text-gray-500 text-sm font-medium">
                                {author.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        )}
                    </div>
                </Link>

                <div className="flex-1">
                    <div className="flex flex-col">
                        <Link
                            href={`/${author.username}`}
                            className="font-bold hover:underline"
                        >
                            {author.name}
                        </Link>
                        <Link
                            href={`/${author.username}`}
                            className="text-gray-500"
                        >
                            @{author.username}
                        </Link>
                    </div>
                </div>

                {/* Follow button would go here if not the current user */}
                {author._id !== currentUserId && (
                    <button className="px-4 py-1 rounded-full border border-gray-300 hover:bg-gray-100 transition dark:border-gray-700 dark:hover:bg-gray-800">
                        Follow
                    </button>
                )}
            </div>

            {/* Tweet content */}
            <div className="mb-4 text-xl">
                <TweetContent content={text} />
            </div>

            {/* Media if present */}
            {tweet.media && tweet.media.length > 0 && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                    {tweet.media.map((item: { id?: string, url: string, altText?: string }, index: number) => (
                        <div key={item.id || index} className="rounded-lg overflow-hidden">
                            {item.url && (
                                <Image
                                    src={getImageUrl(item.url)}
                                    alt={item.altText || `Image ${index + 1}`}
                                    width={800}
                                    height={450}
                                    className="w-full h-auto object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Posted time */}
            <div className="text-gray-500 mb-4">
                <time dateTime={createdAt} title={fullDate}>
                    {fullDate}
                </time>
            </div>

            {/* Stats line */}
            {(tweet.engagementCount.replies > 0 ||
                tweet.engagementCount.retweets > 0 ||
                tweet.engagementCount.likes > 0) && (
                    <div className="flex border-y border-gray-200 dark:border-gray-800 py-3 mb-3 text-gray-500">
                        {tweet.engagementCount.replies > 0 && (
                            <div className="mr-5">
                                <span className="font-bold text-black dark:text-white">{tweet.engagementCount.replies}</span> {tweet.engagementCount.replies === 1 ? 'Reply' : 'Replies'}
                            </div>
                        )}
                        {tweet.engagementCount.retweets > 0 && (
                            <div className="mr-5">
                                <span className="font-bold text-black dark:text-white">{tweet.engagementCount.retweets}</span> {tweet.engagementCount.retweets === 1 ? 'Retweet' : 'Retweets'}
                            </div>
                        )}
                        {tweet.engagementCount.likes > 0 && (
                            <div>
                                <span className="font-bold text-black dark:text-white">{tweet.engagementCount.likes}</span> {tweet.engagementCount.likes === 1 ? 'Like' : 'Likes'}
                            </div>
                        )}
                    </div>
                )}

            {/* Action buttons */}
            <div className="flex justify-around py-2 border-b border-gray-200 dark:border-gray-800">
                <button className="text-gray-500 flex items-center hover:text-blue-500">
                    <ChatBubbleLeftIcon className="h-5 w-5 mr-1" />
                    <span className="text-xs">Reply</span>
                </button>

                <RetweetButton
                    tweetId={tweet._id}
                    isRetweeted={tweet.retweeted}
                    count={tweet.engagementCount.retweets}
                />

                <LikeButton
                    tweetId={tweet._id}
                    isLiked={tweet.liked}
                    count={tweet.engagementCount.likes}
                />

                <button className="text-gray-500 flex items-center hover:text-blue-500">
                    <ShareIcon className="h-5 w-5 mr-1" />
                    <span className="text-xs">Share</span>
                </button>
            </div>
        </article>
    );
} 
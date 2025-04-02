"use client";

import { formatDateToMonthYear } from "@/lib/utils/dateUtils";
import getImageUrl from "@/lib/utils/getImageUrl";
import { User } from "@/types/models";
import { CalendarIcon, LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import FollowButton from "./FollowButton";

interface ProfileHeaderProps {
    user: User;
    tweetCount?: number;
    isCurrentUser?: boolean;
    isFollowing?: boolean;
}

export default function ProfileHeader({
    user,
    tweetCount = 0,
    isCurrentUser = false,
    isFollowing = false,
}: ProfileHeaderProps) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4 relative">
            {/* Cover Image */}
            <div className="relative h-48 sm:h-64 bg-gray-200 dark:bg-gray-700">
                {user.headerImage && (
                    <Image
                        src={getImageUrl(user.headerImage)}
                        alt={`${user.name || user.username}'s cover photo`}
                        fill
                        className="object-cover"
                        priority
                    />
                )}
            </div>

            <div className="px-4 sm:px-6">
                {/* Avatar and Edit/Follow Button Section */}
                <div className="flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
                    {/* Avatar */}
                    <div className="avatar-container flex-shrink-0">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-900 overflow-hidden relative">
                            {user.avatar ? (
                                <Image
                                    src={getImageUrl(user.avatar)}
                                    alt={user.name || 'User avatar'}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 96px, 128px"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                    <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Button (Edit or Follow) */}
                    <div className="pt-14 sm:pt-16">
                        {isCurrentUser ? (
                            <Link
                                href={`/${user.username}/edit`}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
                            >
                                Edit profile
                            </Link>
                        ) : (
                            <FollowButton
                                userId={user._id}
                                username={user.username}
                                initialFollowing={isFollowing}
                                size="md"
                                className=""
                            />
                        )}
                    </div>
                </div>

                {/* User Info Section */}
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--foreground)]">{user.name}</h1>
                    <p className="text-[var(--secondary)] mb-3">@{user.username}</p>
                    {user.bio && <p className="text-[var(--foreground)] mb-3 whitespace-pre-wrap">{user.bio}</p>}

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[var(--secondary)] text-sm mb-3">
                        {user.location && (
                            <span className="flex items-center gap-1">
                                <MapPinIcon className="w-4 h-4" /> {user.location}
                            </span>
                        )}
                        {user.website && (
                            <span className="flex items-center gap-1">
                                <LinkIcon className="w-4 h-4" />
                                <a
                                    href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    {user.website.replace(/^(https?:\/\/)/, '')}
                                </a>
                            </span>
                        )}
                        {user.createdAt && (
                            <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" /> Joined {formatDateToMonthYear(user.createdAt)}
                            </span>
                        )}
                    </div>

                    <div className="flex gap-4 text-sm">
                        <Link href={`/${user.username}/following`} className="hover:underline">
                            <span className="font-bold text-[var(--foreground)]">{user.following?.length || 0}</span>
                            <span className="text-[var(--secondary)]"> Following</span>
                        </Link>
                        <Link href={`/${user.username}/followers`} className="hover:underline">
                            <span className="font-bold text-[var(--foreground)]">{user.followers?.length || 0}</span>
                            <span className="text-[var(--secondary)]"> Followers</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
} 
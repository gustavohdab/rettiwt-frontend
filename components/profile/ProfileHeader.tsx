"use client";

import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { formatDateToMonthYear } from "@/lib/utils/dateUtils";
import getImageUrl from "@/lib/utils/getImageUrl";
import { User } from "@/types/models";
import { CalendarIcon, LinkIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
    const [following, setFollowing] = useState(isFollowing);
    const [followHovered, setFollowHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleFollowClick = async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            if (following) {
                const result = await unfollowUser(user.username);
                if (result.success) {
                    setFollowing(false);
                } else {
                    console.error('Failed to unfollow user:', result.error);
                }
            } else {
                const result = await followUser(user.username);
                if (result.success) {
                    setFollowing(true);
                } else {
                    console.error('Failed to follow user:', result.error);
                }
            }
        } catch (error) {
            console.error('Error toggling follow status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            {/* Cover photo */}
            <div className="h-48 bg-blue-100 dark:bg-blue-900 relative">
                {user.headerImage && (
                    <Image
                        src={getImageUrl(user.headerImage)}
                        alt={`${user.name}'s cover`}
                        fill
                        className="object-cover"
                    />
                )}
            </div>

            {/* Profile header */}
            <div className="px-4 py-3 relative">
                {/* Avatar */}
                <div className="absolute -top-16 left-4 border-4 border-white dark:border-black rounded-full bg-white dark:bg-black overflow-hidden w-32 h-32">
                    <Image
                        src={getImageUrl(user.avatar)}
                        alt={user.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Action buttons */}
                <div className="flex justify-end mb-12">
                    {isCurrentUser ? (
                        <Link
                            href={`/${user.username}/edit`}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                            Edit profile
                        </Link>
                    ) : (
                        <button
                            onClick={handleFollowClick}
                            onMouseEnter={() => setFollowHovered(true)}
                            onMouseLeave={() => setFollowHovered(false)}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-full transition-colors font-semibold ${isLoading
                                ? "opacity-70 cursor-not-allowed"
                                : following
                                    ? "border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 dark:hover:text-red-500"
                                    : "bg-black text-white dark:bg-white dark:text-black"
                                }`}
                        >
                            {isLoading
                                ? "Processing..."
                                : following
                                    ? followHovered
                                        ? "Unfollow"
                                        : "Following"
                                    : "Follow"
                            }
                        </button>
                    )}
                </div>

                {/* User info */}
                <div className="mb-4">
                    <h1 className="font-bold text-xl">{user.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                </div>

                {/* Bio */}
                {user.bio && <p className="mb-3">{user.bio}</p>}

                {/* User metadata */}
                <div className="flex flex-wrap text-gray-500 dark:text-gray-400 text-sm gap-x-4 gap-y-2 mb-3">
                    {user.location && (
                        <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            <span>{user.location}</span>
                        </div>
                    )}
                    {user.website && (
                        <div className="flex items-center">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            <a
                                href={
                                    user.website.startsWith("http")
                                        ? user.website
                                        : `https://${user.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {user.website.replace(/^https?:\/\//, "")}
                            </a>
                        </div>
                    )}
                    {user.createdAt && (
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>Joined {formatDateToMonthYear(user.createdAt)}</span>
                        </div>
                    )}
                </div>

                {/* Following/Followers */}
                <div className="flex gap-4 text-sm">
                    <Link
                        href={`/${user.username}/following`}
                        className="hover:underline"
                    >
                        <span className="font-bold">{user.following?.length || 0}</span>{" "}
                        <span className="text-gray-500 dark:text-gray-400">Following</span>
                    </Link>
                    <Link
                        href={`/${user.username}/followers`}
                        className="hover:underline"
                    >
                        <span className="font-bold">{user.followers?.length || 0}</span>{" "}
                        <span className="text-gray-500 dark:text-gray-400">Followers</span>
                    </Link>
                </div>
            </div>
        </div>
    );
} 
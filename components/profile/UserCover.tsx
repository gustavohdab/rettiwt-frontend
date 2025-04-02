'use client';

import getImageUrl from '@/lib/utils/getImageUrl';
import { User } from '@/types';
import Image from 'next/image';
import FollowButton from '../profile/FollowButton';

interface UserCoverProps {
    profile: User;
    isCurrentUser: boolean;
    isFollowing: boolean;
    followerCount: number;
}

export default function UserCover({ profile, isCurrentUser, isFollowing, followerCount }: UserCoverProps) {
    return (
        <div className="relative mb-20">
            {/* Cover image */}
            <div className="relative w-full h-48 sm:h-60 md:h-72 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                {profile.headerImage ? (
                    <Image
                        src={getImageUrl(profile.headerImage)}
                        alt="Header image"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-500" />
                )}
            </div>

            {/* User profile picture */}
            <div className="avatar-container absolute -bottom-16 left-4 sm:left-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-900 bg-white dark:bg-gray-900 overflow-hidden relative">
                    {profile.avatar ? (
                        <Image
                            src={getImageUrl(profile.avatar)}
                            alt={profile.name || 'User avatar'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 96px, 128px"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <span className="text-3xl font-bold text-gray-500 dark:text-gray-400">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Follow button for non-current users */}
            {!isCurrentUser && (
                <div className="absolute top-4 right-4">
                    <FollowButton
                        userId={profile._id}
                        username={profile.username}
                        initialFollowing={isFollowing}
                        className="px-4 py-1.5 rounded-full text-sm font-medium"
                    />
                </div>
            )}
        </div>
    );
} 
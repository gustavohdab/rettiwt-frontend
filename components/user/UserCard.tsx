'use client';

import FollowButton from '@/components/profile/FollowButton';
import getImageUrl from '@/lib/utils/getImageUrl';
import { User } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

interface UserCardProps {
    user: User;
    currentUserId?: string;
    showFollowButton?: boolean;
    isFollowing?: boolean;
}

export default function UserCard({
    user,
    currentUserId,
    showFollowButton = false,
    isFollowing = false
}: UserCardProps) {
    const isCurrentUser = currentUserId === user._id;

    return (
        <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900/40 rounded-lg transition">
            <div className="flex items-start justify-between">
                <Link
                    href={`/${user.username}`}
                    className="flex space-x-3 items-start flex-1"
                >
                    <div className="flex-shrink-0">
                        <Image
                            src={getImageUrl(user.avatar)}
                            alt={user.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                            <p className="font-bold truncate">
                                {user.name}
                            </p>
                            {user.verified && (
                                <svg className="h-5 w-5 ml-1 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                </svg>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm">
                            @{user.username}
                        </p>
                        {user.bio && (
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                {user.bio}
                            </p>
                        )}
                    </div>
                </Link>

                {showFollowButton && !isCurrentUser && (
                    <div className="ml-4 flex-shrink-0">
                        <FollowButton
                            userId={user._id}
                            username={user.username}
                            initialFollowing={isFollowing}
                            size="sm"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

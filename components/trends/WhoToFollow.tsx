"use client";

import FollowButton from "@/components/profile/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import { useRecommendedUsers } from "@/lib/hooks/useRecommendedUsers";
import getImageUrl from "@/lib/utils/getImageUrl";
import { RecommendedUser } from "@/types/models";
import Image from "next/image";
import Link from "next/link";

interface WhoToFollowProps {
    initialUsers?: RecommendedUser[];
}

export default function WhoToFollow({ initialUsers }: WhoToFollowProps) {
    const { users, loading, error } = useRecommendedUsers(initialUsers);

    if (loading) {
        return (
            <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Who to follow</h2>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full bg-gray-800" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-2 bg-gray-800" />
                            <Skeleton className="h-3 w-16 bg-gray-800" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-full bg-gray-800" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Who to follow</h2>
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
                <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Who to follow</h2>
                <p className="text-[var(--secondary)]">No recommendations at the moment</p>
            </div>
        );
    }

    return (
        <div className="bg-[#121212] rounded-lg p-5 mb-5 border border-gray-800">
            <h2 className="text-xl font-bold mb-4 text-[var(--foreground)]">Who to follow</h2>
            <div className="space-y-4">
                {users.map((user: RecommendedUser) => (
                    <div key={user._id} className="flex items-center gap-3">
                        <div className="flex-shrink-0 mr-2">
                            <Link href={`/${user.username}`}>
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <Image
                                        src={getImageUrl(user.avatar)}
                                        alt={user.name || user.username}
                                        width={48}
                                        height={48}
                                        className="object-cover"
                                    />
                                </div>
                            </Link>
                        </div>
                        <div className="flex-1 min-w-0">
                            <Link href={`/${user.username}`} className="hover:underline">
                                <h3 className="font-semibold text-sm text-[var(--foreground)] truncate">{user.name}</h3>
                                <p className="text-[var(--secondary)] text-xs truncate">@{user.username}</p>
                            </Link>
                        </div>
                        <FollowButton
                            userId={user._id}
                            username={user.username}
                            initialFollowing={false}
                            size="sm"
                        />
                    </div>
                ))}
            </div>
            <Link
                href="/explore/who-to-follow"
                className="block text-white hover:text-gray-200 text-sm mt-4 font-medium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-center transition"
            >
                Show more
            </Link>
        </div>
    );
} 
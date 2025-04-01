"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { RecommendedUser } from "@/types/models";
import trendsService from "@/lib/api/services/trends.service";
import { Skeleton } from "@/components/ui/skeleton";
import FollowButton from "@/components/profile/FollowButton";
import { useAuth } from "@/lib/hooks/useAuth";

interface WhoToFollowProps {
    initialUsers?: RecommendedUser[];
}

export default function WhoToFollow({ initialUsers }: WhoToFollowProps) {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<RecommendedUser[]>(initialUsers || []);
    const [loading, setLoading] = useState(!initialUsers);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!initialUsers) {
            const fetchRecommendedUsers = async () => {
                try {
                    setLoading(true);
                    const response = await trendsService.getRecommendedUsers();
                    if (response.status === "success" && response.data) {
                        // Filter out current user if somehow included
                        const filteredUsers = response.data.users.filter(
                            user => !currentUser || user.username !== currentUser.username
                        );
                        setUsers(filteredUsers as RecommendedUser[]);
                    } else {
                        setError("Failed to load recommended users");
                    }
                } catch (err) {
                    setError("Failed to load recommended users");
                } finally {
                    setLoading(false);
                }
            };

            fetchRecommendedUsers();
        }
    }, [initialUsers, currentUser]);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Who to follow</h2>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 mb-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-8 w-20 rounded-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Who to follow</h2>
                <p className="text-red-500">Failed to load recommended users</p>
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-4">Who to follow</h2>
                <p className="text-gray-500">No recommendations at the moment</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            <div className="space-y-4">
                {users.map((user) => (
                    <div key={user._id} className="flex items-center gap-3">
                        <Link href={`/${user.username}`}>
                            <Image
                                src={user.avatar || "/placeholder-avatar.png"}
                                alt={user.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        </Link>
                        <div className="flex-1 min-w-0">
                            <Link href={`/${user.username}`} className="hover:underline">
                                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                                <p className="text-gray-500 text-xs truncate">@{user.username}</p>
                            </Link>
                        </div>
                        <FollowButton
                            username={user.username}
                            initialFollowing={false}
                            size="sm"
                        />
                    </div>
                ))}
            </div>
            <Link
                href="/explore/who-to-follow"
                className="block text-blue-500 hover:text-blue-600 text-sm mt-4 font-medium"
            >
                Show more
            </Link>
        </div>
    );
} 
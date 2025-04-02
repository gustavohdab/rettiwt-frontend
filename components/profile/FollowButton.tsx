"use client";

import { useSocket } from "@/context/SocketContext";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { useAuth } from "@/lib/hooks/useAuth";
import { useEffect, useState } from "react";

interface FollowButtonProps {
    userId: string;
    username: string;
    initialFollowing: boolean;
    size?: "sm" | "md" | "lg";
    withText?: boolean;
    className?: string;
}

export default function FollowButton({
    userId,
    username,
    initialFollowing,
    size = "md",
    withText = true,
    className = "",
}: FollowButtonProps) {
    const { user: currentUser } = useAuth();
    const { emitter } = useSocket();
    const [following, setFollowing] = useState(initialFollowing);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleFollowStatusChange = (
            data: { targetUserId: string; isFollowing: boolean }
        ) => {
            if (data.targetUserId === userId) {
                console.log(`FollowButton (${username}): Received status change`, data);
                setFollowing(data.isFollowing);
            }
        };

        if (emitter) {
            emitter.on('followStatusChanged', handleFollowStatusChange);
            console.log(`FollowButton (${username}): Attached listener for followStatusChanged`);

            return () => {
                emitter.off('followStatusChanged', handleFollowStatusChange);
                console.log(`FollowButton (${username}): Detached listener for followStatusChanged`);
            };
        } else {
            console.log(`FollowButton (${username}): Emitter not available yet.`);
        }
    }, [emitter, userId, username]);

    if (currentUser?.username === username) return null;

    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5",
    };

    const handleFollowClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading) return;
        setIsLoading(true);

        const action = following ? unfollowUser : followUser;
        setFollowing(!following);
        try {
            const result = await action(username);
            if (!result.success) {
                setFollowing(following);
                console.error("Follow/Unfollow action failed:", result.error);
            }
        } catch (error: any) {
            setFollowing(following);
            console.error("Error during follow/unfollow action:", error?.message || error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollowClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            className={`rounded-full font-bold transition-colors ${sizeClasses[size]} ${following
                ? "border border-gray-600 bg-transparent text-[var(--foreground)] hover:border-red-500 hover:text-red-500"
                : "bg-white text-black hover:bg-opacity-90"
                } ${isLoading ? "opacity-70" : ""} ${className}`}
        >
            {withText
                ? following
                    ? isHovered
                        ? "Unfollow"
                        : "Following"
                    : "Follow"
                : following
                    ? isHovered
                        ? "✕"
                        : "✓"
                    : "+"}
        </button>
    );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";

interface FollowButtonProps {
    username: string;
    initialFollowing: boolean;
    size?: "sm" | "md" | "lg";
    withText?: boolean;
    className?: string;
}

export default function FollowButton({
    username,
    initialFollowing,
    size = "md",
    withText = true,
    className = "",
}: FollowButtonProps) {
    const { user } = useAuth();
    const [following, setFollowing] = useState(initialFollowing);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (user?.username === username) return null;

    const sizeClasses = {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2",
    };

    const handleFollowClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isLoading) return;
        setIsLoading(true);

        const action = following ? unfollowUser : followUser;
        setFollowing(!following);
        const result = await action(username);
        if (!result.success) setFollowing(following);

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleFollowClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isLoading}
            className={`rounded-full font-semibold transition-colors ${sizeClasses[size]} ${following
                ? "border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 dark:hover:text-red-500"
                : "bg-black text-white dark:bg-white dark:text-black"
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

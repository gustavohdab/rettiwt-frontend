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

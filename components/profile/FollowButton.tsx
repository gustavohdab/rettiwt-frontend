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
    const [debugInfo, setDebugInfo] = useState<string | null>(null);

    // If this is the current user, don't show the button
    if (user?.username === username) {
        return null;
    }

    const sizeClasses = {
        sm: "px-3 py-1 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2",
    };

    const handleFollowClick = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation when used in a clickable parent

        if (isLoading) return;
        setIsLoading(true);
        setDebugInfo(null);

        try {
            if (following) {
                console.log(`Attempting to unfollow ${username}...`);
                // Optimistically update UI
                setFollowing(false);
                // Call server action
                const result = await unfollowUser(username);
                console.log(`Unfollow result:`, result);

                if (!result.success) {
                    // Revert on error
                    setFollowing(true);
                    console.error("Failed to unfollow:", result.error);
                    setDebugInfo(`Error unfollowing: ${result.error}`);
                } else {
                    setDebugInfo(`Successfully unfollowed ${username}. Refresh to verify.`);
                }
            } else {
                console.log(`Attempting to follow ${username}...`);
                // Optimistically update UI
                setFollowing(true);
                // Call server action
                const result = await followUser(username);
                console.log(`Follow result:`, result);

                if (!result.success) {
                    // Revert on error
                    setFollowing(false);
                    console.error("Failed to follow:", result.error);
                    setDebugInfo(`Error following: ${result.error}`);
                } else {
                    setDebugInfo(`Successfully followed ${username}. Refresh to verify.`);
                }
            }
        } catch (error) {
            // Revert on unexpected error
            setFollowing(following);
            console.error("Error toggling follow status:", error);
            setDebugInfo(`Unexpected error: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleFollowClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                disabled={isLoading}
                className={`rounded-full font-semibold transition-colors ${sizeClasses[size]
                    } ${following
                        ? "border border-gray-300 dark:border-gray-600 hover:border-red-500 hover:text-red-500 dark:hover:text-red-500"
                        : "bg-black text-white dark:bg-white dark:text-black"
                    } ${isLoading && "opacity-70"
                    } ${className}`}
            >
                {withText &&
                    (following ? (isHovered ? "Unfollow" : "Following") : "Follow")}
                {!withText && (following ? (isHovered ? "✕" : "✓") : "+")}
            </button>

            {debugInfo && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-black bg-opacity-80 text-white p-2 rounded text-xs z-50">
                    {debugInfo}
                </div>
            )}
        </div>
    );
} 
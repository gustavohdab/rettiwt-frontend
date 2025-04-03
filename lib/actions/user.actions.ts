"use server";

import UserService from "@/lib/api/services/user.service";
import { authOptions } from "@/lib/auth";
import { SuggestedUser } from "@/types";
import { UpdateProfileParams } from "@/types/actions";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

/**
 * Follow a user
 * @param username Username to follow
 */
export async function followUser(username: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.accessToken) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await UserService.followUser(
            username,
            session.accessToken
        );

        if (response.status === "success") {
            // Revalidate multiple paths to ensure UI is updated
            revalidatePath(`/${username}`);
            revalidatePath("/feed");
            revalidatePath("/[username]");

            // Revalidate the current user profile too
            if (session.user?.username) {
                revalidatePath(`/${session.user.username}`);
            }

            return { success: true };
        } else {
            console.error("API returned error:", response);
            return {
                success: false,
                error: response.message || "Failed to follow user",
            };
        }
    } catch (error) {
        console.error("Error in followUser action:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

/**
 * Unfollow a user
 * @param username Username to unfollow
 */
export async function unfollowUser(username: string) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.accessToken) {
            return { success: false, error: "Unauthorized" };
        }

        console.log(
            `Attempting to unfollow ${username} with token ${session.accessToken.substring(
                0,
                10
            )}...`
        );

        const response = await UserService.unfollowUser(
            username,
            session.accessToken
        );

        console.log(`Unfollow API response:`, response);

        if (response.status === "success") {
            console.log(
                `Successfully unfollowed ${username}, revalidating paths...`
            );

            // Revalidate multiple paths to ensure UI is updated
            revalidatePath(`/${username}`);
            revalidatePath("/feed");
            revalidatePath("/[username]");
            revalidatePath(`/api/users/${username}`);

            // Revalidate the current user profile too
            if (session.user?.username) {
                revalidatePath(`/${session.user.username}`);
            }

            return { success: true };
        } else {
            console.error("API returned error for unfollow:", response);
            return {
                success: false,
                error: response.message || "Failed to unfollow user",
            };
        }
    } catch (error) {
        console.error("Error in unfollowUser action:", error);
        return { success: false, error: String(error) };
    }
}

/**
 * Update user profile
 * @param data Profile data to update
 */
export async function updateProfile(data: UpdateProfileParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.accessToken) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await UserService.updateProfile(
            {
                name: data.name,
                bio: data.bio,
                location: data.location,
                website: data.website,
            },
            session.accessToken
        );

        if (response.status === "success") {
            // Revalidate paths to show updated profile data
            if (session.user?.username) {
                revalidatePath(`/${session.user.username}`);
                revalidatePath(`/${session.user.username}/edit`);

                // Revalidate paths that include the layout with sidebar
                revalidatePath("/feed");
                revalidatePath("/bookmarks");
                revalidatePath("/explore");
                revalidatePath("/search");
            }
            return { success: true };
        } else {
            console.error("API returned error for profile update:", response);
            return {
                success: false,
                error: response.message || "Failed to update profile",
            };
        }
    } catch (error) {
        console.error("Error in updateProfile action:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

/**
 * Search for users to mention in the tweet composer.
 * @param query The search query string.
 * @returns A promise resolving to an array of suggested users or an empty array.
 */
export async function searchUsersForMention(
    query: string
): Promise<SuggestedUser[]> {
    // Basic check: Don't search if query is empty or just '@'
    if (!query || query.length < 1) {
        return [];
    }

    try {
        const session = await getServerSession(authOptions);
        if (!session?.accessToken) {
            console.error("searchUsersForMention: Unauthorized");
            return []; // Return empty array on auth error
        }

        const response = await UserService.getUserSuggestions(
            query,
            session.accessToken
        );

        if (response.status === "success" && response.data?.suggestions) {
            return response.data.suggestions;
        } else {
            console.error(
                "searchUsersForMention: API error:",
                response.message
            );
            return []; // Return empty array on API error
        }
    } catch (error) {
        console.error("Error in searchUsersForMention action:", error);
        return []; // Return empty array on unexpected errors
    }
}

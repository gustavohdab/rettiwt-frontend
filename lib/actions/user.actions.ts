"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserService from "@/lib/api/services/user.service";
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

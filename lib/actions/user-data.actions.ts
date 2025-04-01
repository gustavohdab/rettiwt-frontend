"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import UserService from "@/lib/api/services/user.service";
import { ApiTypes } from "@/types";
import { revalidatePath } from "next/cache";

export async function getUserProfile(username: string) {
    try {
        const session = await getServerSession(authOptions);

        const response = await UserService.getUserProfile(username);

        return response;
    } catch (error) {
        console.error(`Error getting profile for ${username}:`, error);
        return {
            status: "error",
            message: "Failed to load user profile",
        };
    }
}

export async function getUserFollowers(username: string) {
    try {
        const session = await getServerSession(authOptions);

        const response = await UserService.getUserFollowers(
            username,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error(`Error getting followers for ${username}:`, error);
        return {
            status: "error",
            message: "Failed to load followers",
        };
    }
}

export async function getUserFollowing(username: string) {
    try {
        const session = await getServerSession(authOptions);

        const response = await UserService.getUserFollowing(
            username,
            session?.accessToken
        );

        return response;
    } catch (error) {
        console.error(`Error getting following for ${username}:`, error);
        return {
            status: "error",
            message: "Failed to load following",
        };
    }
}

export async function searchUsers(query: string, page = 1, limit = 10) {
    try {
        const session = await getServerSession(authOptions);

        const response = await UserService.searchUsers(query, page, limit);

        return response;
    } catch (error) {
        console.error(`Error searching users with query ${query}:`, error);
        return {
            status: "error",
            message: "Failed to search users",
        };
    }
}

export async function updateProfile(data: ApiTypes.UpdateProfileRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return { status: "error", message: "Not authenticated" };
        }

        const response = await UserService.updateProfile(data);

        if (response.status === "success" && response.data?.user) {
            // Revalidate user profile page
            revalidatePath(`/${response.data.user.username}`);
        }

        return response;
    } catch (error) {
        console.error("Error updating profile:", error);
        return {
            status: "error",
            message: "Failed to update profile",
        };
    }
}

/**
 * Get current authenticated user data
 * Fetches the latest user data from the server
 */
export async function getCurrentUser() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.accessToken) {
            return { success: false, error: "Unauthorized" };
        }

        const response = await UserService.getCurrentUser(session.accessToken);

        if (response.status === "success" && response.data) {
            return {
                success: true,
                data: response.data.user,
            };
        } else {
            console.error("API returned error for getCurrentUser:", response);
            return {
                success: false,
                error: response.message || "Failed to fetch current user data",
            };
        }
    } catch (error) {
        console.error("Error in getCurrentUser action:", error);
        return { success: false, error: "An unexpected error occurred" };
    }
}

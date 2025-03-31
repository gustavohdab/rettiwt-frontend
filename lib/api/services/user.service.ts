import api from "@/lib/api/axios";
import { ApiTypes, User, normalizeUser } from "@/types";

/**
 * User service for handling user-related API endpoints
 */
const UserService = {
    /**
     * Get a user profile by username
     * @param username Username
     */
    getUserProfile: async (
        username: string
    ): Promise<ApiTypes.ApiResponse<{ user: User; tweetCount: number }>> => {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<{
                    user: ApiTypes.User;
                    tweetCount: number;
                }>
            >(`/users/${username}`);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.user
            ) {
                return {
                    status: "success",
                    data: {
                        user: normalizeUser(response.data.data.user),
                        tweetCount: response.data.data.tweetCount,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting user profile for ${username}:`, error);
            return { status: "error", message: "Failed to get user profile" };
        }
    },

    /**
     * Update the authenticated user's profile
     * @param profileData Profile data to update
     */
    updateProfile: async (
        profileData: ApiTypes.UpdateProfileRequest
    ): Promise<ApiTypes.ApiResponse<{ user: User }>> => {
        try {
            const response = await api.patch<
                ApiTypes.ApiResponse<{ user: ApiTypes.User }>
            >("/users/profile", profileData);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.user
            ) {
                return {
                    status: "success",
                    data: {
                        user: normalizeUser(response.data.data.user),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error("Error updating user profile:", error);
            return {
                status: "error",
                message: "Failed to update user profile",
            };
        }
    },

    /**
     * Follow a user
     * @param username Username to follow
     */
    followUser: async (
        username: string
    ): Promise<ApiTypes.ApiResponse<void>> => {
        try {
            const response = await api.post<ApiTypes.ApiResponse<void>>(
                `/users/${username}/follow`
            );
            return response.data;
        } catch (error) {
            console.error(`Error following user ${username}:`, error);
            return { status: "error", message: "Failed to follow user" };
        }
    },

    /**
     * Unfollow a user
     * @param username Username to unfollow
     */
    unfollowUser: async (
        username: string
    ): Promise<ApiTypes.ApiResponse<void>> => {
        try {
            const response = await api.delete<ApiTypes.ApiResponse<void>>(
                `/users/${username}/follow`
            );
            return response.data;
        } catch (error) {
            console.error(`Error unfollowing user ${username}:`, error);
            return { status: "error", message: "Failed to unfollow user" };
        }
    },

    /**
     * Get a user's followers
     * @param username Username
     */
    getUserFollowers: async (
        username: string
    ): Promise<ApiTypes.ApiResponse<{ followers: User[] }>> => {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<{ followers: ApiTypes.User[] }>
            >(`/users/${username}/followers`);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.followers
            ) {
                return {
                    status: "success",
                    data: {
                        followers:
                            response.data.data.followers.map(normalizeUser),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting followers for ${username}:`, error);
            return { status: "error", message: "Failed to get followers" };
        }
    },

    /**
     * Get users that a user is following
     * @param username Username
     */
    getUserFollowing: async (
        username: string
    ): Promise<ApiTypes.ApiResponse<{ following: User[] }>> => {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<{ following: ApiTypes.User[] }>
            >(`/users/${username}/following`);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.following
            ) {
                return {
                    status: "success",
                    data: {
                        following:
                            response.data.data.following.map(normalizeUser),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting following for ${username}:`, error);
            return { status: "error", message: "Failed to get following" };
        }
    },

    /**
     * Search for users
     * @param query Search query
     * @param page Page number
     * @param limit Items per page
     */
    searchUsers: async (
        query: string,
        page = 1,
        limit = 10
    ): Promise<ApiTypes.ApiResponse<{ users: User[] }>> => {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<{ users: ApiTypes.User[] }>
            >("/users/search", {
                params: { query, page, limit },
            });

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.users
            ) {
                return {
                    status: "success",
                    data: {
                        users: response.data.data.users.map(normalizeUser),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error("Error searching users:", error);
            return { status: "error", message: "Failed to search users" };
        }
    },
};

export default UserService;

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
     * Get current authenticated user profile
     * @param accessToken Optional access token for server components
     */
    getCurrentUser: async (
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ user: User }>> => {
        try {
            const config = accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : undefined;

            const response = await api.get<
                ApiTypes.ApiResponse<{ user: ApiTypes.User }>
            >("/auth/me", config);

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
            console.error("Error getting current user:", error);
            return { status: "error", message: "Failed to get current user" };
        }
    },

    /**
     * Update the authenticated user's profile
     * @param profileData Profile data to update
     */
    updateProfile: async (
        profileData: ApiTypes.UpdateProfileRequest,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ user: User }>> => {
        try {
            const config = accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : undefined;

            const response = await api.patch<
                ApiTypes.ApiResponse<{ user: ApiTypes.User }>
            >("/users/profile", profileData, config);

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
        username: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<void>> => {
        try {
            const response = await api.post<ApiTypes.ApiResponse<void>>(
                `/users/${username}/follow`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
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
        username: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<void>> => {
        try {
            console.log(
                `UserService: Sending unfollow request for ${username}`
            );

            if (!accessToken) {
                console.error("No access token provided for unfollow request");
                return {
                    status: "error",
                    message: "No authentication token provided",
                };
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            };

            console.log(`UserService: Using config`, JSON.stringify(config));

            const response = await api.delete<ApiTypes.ApiResponse<void>>(
                `/users/${username}/follow`,
                config
            );

            console.log(
                `UserService: Unfollow response status: ${response.status}, data:`,
                response.data
            );

            return response.data;
        } catch (error: any) {
            console.error(`Error unfollowing user ${username}:`, error);

            // More detailed error logging
            if (error.response) {
                console.error(
                    `Response error status: ${error.response.status}`
                );
                console.error(`Response data:`, error.response.data);
            }

            return { status: "error", message: "Failed to unfollow user" };
        }
    },

    /**
     * Get a user's followers
     * @param username Username
     */
    getUserFollowers: async (
        username: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ followers: User[] }>> => {
        try {
            const config = accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : undefined;

            const response = await api.get<
                ApiTypes.ApiResponse<{ followers: ApiTypes.User[] }>
            >(`/users/${username}/followers`, config);

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
        username: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ following: User[] }>> => {
        try {
            const config = accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : undefined;

            const response = await api.get<
                ApiTypes.ApiResponse<{ following: ApiTypes.User[] }>
            >(`/users/${username}/following`, config);

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
        limit = 10,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ users: User[] }>> => {
        try {
            const config = accessToken
                ? { headers: { Authorization: `Bearer ${accessToken}` } }
                : undefined;

            const response = await api.get<
                ApiTypes.ApiResponse<{ users: ApiTypes.User[] }>
            >("/users/search", {
                params: { query, page, limit },
                ...config,
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

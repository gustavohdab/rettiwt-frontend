import api from "@/lib/api/axios";
import {
    ApiTypes,
    Tweet,
    normalizeTweet,
    normalizeTimelineResponse,
} from "@/types";

/**
 * Tweet service for handling tweet-related API endpoints
 */
const TweetService = {
    /**
     * Create a new tweet
     * @param tweetData Tweet data to create
     * @param accessToken Optional auth token for server components
     */
    createTweet: async (
        tweetData: ApiTypes.CreateTweetRequest,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>
            >("/tweets", tweetData, config);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.tweet
            ) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error("Error creating tweet:", error);
            return { status: "error", message: "Failed to create tweet" };
        }
    },

    /**
     * Get a tweet by ID
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    getTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>
            >(`/tweets/${id}`, config);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.tweet
            ) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting tweet ${id}:`, error);
            return { status: "error", message: "Failed to get tweet" };
        }
    },

    /**
     * Delete a tweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    deleteTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{}>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.delete<ApiTypes.ApiResponse<{}>>(
                `/tweets/${id}`,
                config
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting tweet ${id}:`, error);
            return { status: "error", message: "Failed to delete tweet" };
        }
    },

    /**
     * Like a tweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    likeTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>
            >(`/tweets/${id}/like`, {}, config);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.tweet
            ) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error liking tweet ${id}:`, error);
            return { status: "error", message: "Failed to like tweet" };
        }
    },

    /**
     * Unlike a tweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    unlikeTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.delete<
                ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>
            >(`/tweets/${id}/like`, config);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.tweet
            ) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error unliking tweet ${id}:`, error);
            return { status: "error", message: "Failed to unlike tweet" };
        }
    },

    /**
     * Retweet a tweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    retweetTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>
            >(`/tweets/${id}/retweet`, {}, config);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.tweet
            ) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error retweeting tweet ${id}:`, error);
            return { status: "error", message: "Failed to retweet tweet" };
        }
    },

    /**
     * Undo a retweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    unretweetTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ tweet: Tweet }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.delete<
                ApiTypes.ApiResponse<{ tweet: ApiTypes.Tweet }>
            >(`/tweets/${id}/retweet`, config);

            // Transform API response to UI model
            if (
                response.data.status === "success" &&
                response.data.data?.tweet
            ) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error unretweeting tweet ${id}:`, error);
            return { status: "error", message: "Failed to unretweet tweet" };
        }
    },

    /**
     * Get home timeline
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    getTimeline: async (
        page = 1,
        limit = 20,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            tweets: Tweet[];
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: { page, limit },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TimelineResponse>
            >("/tweets/timeline", config);

            // Transform API response to UI model
            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: {
                        tweets: response.data.data.tweets.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error("Error getting timeline:", error);
            return { status: "error", message: "Failed to get timeline" };
        }
    },

    /**
     * Get user tweets
     * @param username Username
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    getUserTweets: async (
        username: string,
        page = 1,
        limit = 20,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            tweets: Tweet[];
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: { page, limit },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TimelineResponse>
            >(`/users/${username}/tweets`, config);

            // Transform API response to UI model
            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: {
                        tweets: response.data.data.tweets.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting tweets for user ${username}:`, error);
            return { status: "error", message: "Failed to get user tweets" };
        }
    },

    /**
     * Get user replies
     * @param username Username
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    getUserReplies: async (
        username: string,
        page = 1,
        limit = 20,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            tweets: Tweet[];
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: { page, limit },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TimelineResponse>
            >(`/users/${username}/replies`, config);

            // Transform API response to UI model
            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: {
                        tweets: response.data.data.tweets.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting replies for user ${username}:`, error);
            return { status: "error", message: "Failed to get user replies" };
        }
    },
};

export default TweetService;

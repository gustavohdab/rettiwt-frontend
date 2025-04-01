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
     * @param includeReplies Whether to include replies
     */
    getTimeline: async (
        page = 1,
        limit = 20,
        accessToken?: string,
        includeReplies = false
    ): Promise<
        ApiTypes.ApiResponse<{
            tweets: Tweet[];
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: { page, limit, includeReplies },
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
            >(`/tweets/user/${username}`, config);

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
     * Get tweets that are replies from a specific user
     * @param username The username of the user
     * @param page The page to fetch (default: 1)
     * @param limit The number of tweets per page (default: 10)
     * @param accessToken Optional access token for authorization
     * @returns Promise with the user replies response
     */
    getUserReplies: async (
        username: string,
        page: number = 1,
        limit: number = 10,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            tweets: Tweet[];
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: {
                    page,
                    limit,
                },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TimelineResponse>
            >(`/tweets/user/${username}/replies`, config);

            if (
                response.data &&
                response.data.status === "success" &&
                response.data.data
            ) {
                return {
                    status: "success",
                    data: {
                        tweets: response.data.data.tweets.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return {
                status: "error",
                message: "Failed to fetch user replies",
            };
        } catch (error: any) {
            console.error("Error fetching user replies:", error);
            return {
                status: "error",
                message:
                    error.response?.data?.message ||
                    "Failed to fetch user replies",
            };
        }
    },

    /**
     * Get tweet thread (tweet with replies)
     * @param id Tweet ID
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    getTweetThread: async (
        id: string,
        page = 1,
        limit = 10,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            tweet: Tweet;
            parentTweet?: Tweet;
            replies: Tweet[];
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
                ApiTypes.ApiResponse<{
                    tweet: ApiTypes.Tweet;
                    parentTweet?: ApiTypes.Tweet;
                    replies: ApiTypes.Tweet[];
                    pagination: ApiTypes.PaginationInfo;
                }>
            >(`/tweets/${id}/thread`, config);

            // Transform API response to UI model
            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: {
                        tweet: normalizeTweet(response.data.data.tweet),
                        parentTweet: response.data.data.parentTweet
                            ? normalizeTweet(response.data.data.parentTweet)
                            : undefined,
                        replies: response.data.data.replies.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error(`Error getting tweet thread for ${id}:`, error);
            return { status: "error", message: "Failed to get tweet thread" };
        }
    },

    /**
     * Bookmark a tweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    bookmarkTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ bookmarked: boolean }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{ bookmarked: boolean }>
            >(`/tweets/${id}/bookmark`, {}, config);

            return response.data;
        } catch (error) {
            console.error(`Error bookmarking tweet ${id}:`, error);
            return { status: "error", message: "Failed to bookmark tweet" };
        }
    },

    /**
     * Remove bookmark from a tweet
     * @param id Tweet ID
     * @param accessToken Optional auth token for server components
     */
    unbookmarkTweet: async (
        id: string,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ bookmarked: boolean }>> => {
        try {
            const config: any = {};
            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.delete<
                ApiTypes.ApiResponse<{ bookmarked: boolean }>
            >(`/tweets/${id}/bookmark`, config);

            return response.data;
        } catch (error) {
            console.error(`Error removing bookmark from tweet ${id}:`, error);
            return {
                status: "error",
                message: "Failed to remove bookmark from tweet",
            };
        }
    },

    /**
     * Get user's bookmarked tweets
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    getBookmarks: async (
        page = 1,
        limit = 20,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            bookmarks: Tweet[];
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
                ApiTypes.ApiResponse<{
                    bookmarks: ApiTypes.Tweet[];
                    pagination: ApiTypes.PaginationInfo;
                }>
            >("/users/bookmarks", config);

            // Transform API response to UI model
            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: {
                        bookmarks:
                            response.data.data.bookmarks.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error("Error getting bookmarks:", error);
            return { status: "error", message: "Failed to get bookmarks" };
        }
    },

    /**
     * Get user tweets with media
     * @param username Username
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    getUserMediaTweets: async (
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
                params: { page, limit, mediaOnly: true },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TimelineResponse>
            >(`/tweets/user/${username}`, config);

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
            console.error(
                `Error getting media tweets for user ${username}:`,
                error
            );
            return {
                status: "error",
                message: "Failed to get user media tweets",
            };
        }
    },

    /**
     * Get tweets that a user has liked
     * @param username The username of the user
     * @param page The page to fetch (default: 1)
     * @param limit The number of tweets per page (default: 10)
     * @param accessToken Optional access token for authorization
     * @returns Promise with the liked tweets response
     */
    getUserLikedTweets: async (
        username: string,
        page: number = 1,
        limit: number = 10,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            tweets: Tweet[];
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: {
                    page,
                    limit,
                },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            // This endpoint may need to be added to the backend
            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TimelineResponse>
            >(`/tweets/user/${username}/likes`, config);

            if (
                response.data &&
                response.data.status === "success" &&
                response.data.data
            ) {
                return {
                    status: "success",
                    data: {
                        tweets: response.data.data.tweets.map(normalizeTweet),
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return {
                status: "error",
                message: "Failed to fetch user liked tweets",
            };
        } catch (error: any) {
            console.error("Error fetching user liked tweets:", error);
            return {
                status: "error",
                message:
                    error.response?.data?.message ||
                    "Failed to fetch user liked tweets",
            };
        }
    },
};

export default TweetService;

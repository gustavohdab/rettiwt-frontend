import api from "../axios";
import * as ApiTypes from "@/types/api";
import {
    normalizeTrendingHashtags,
    normalizePopularTweets,
    normalizeHashtagTweets,
    normalizeRecommendedUsers,
} from "@/types/models";

/**
 * Service for handling trends related API calls
 */
class TrendsService {
    /**
     * Get trending hashtags
     * @param limit - Number of hashtags to return
     * @param accessToken - Optional access token
     */
    async getTrendingHashtags(limit = 10, accessToken?: string) {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.TrendingResponse>
            >(
                `/trends/hashtags?limit=${limit}`,
                accessToken
                    ? { headers: { Authorization: `Bearer ${accessToken}` } }
                    : undefined
            );

            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: normalizeTrendingHashtags(response.data.data),
                };
            }

            return response.data;
        } catch (error) {
            return {
                status: "error",
                message: "Failed to fetch trending hashtags",
            };
        }
    }

    /**
     * Get popular tweets
     * @param page - Page number
     * @param limit - Number of tweets per page
     * @param accessToken - Optional access token
     */
    async getPopularTweets(page = 1, limit = 10, accessToken?: string) {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.PopularTweetsResponse>
            >(
                `/trends/popular?page=${page}&limit=${limit}`,
                accessToken
                    ? { headers: { Authorization: `Bearer ${accessToken}` } }
                    : undefined
            );

            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: normalizePopularTweets(response.data.data),
                };
            }

            return response.data;
        } catch (error) {
            return {
                status: "error",
                message: "Failed to fetch popular tweets",
            };
        }
    }

    /**
     * Get tweets by hashtag
     * @param hashtag - Hashtag to search for
     * @param page - Page number
     * @param limit - Number of tweets per page
     * @param accessToken - Optional access token
     */
    async getTweetsByHashtag(
        hashtag: string,
        page = 1,
        limit = 10,
        accessToken?: string
    ) {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.HashtagTweetsResponse>
            >(
                `/trends/hashtag/${hashtag}?page=${page}&limit=${limit}`,
                accessToken
                    ? { headers: { Authorization: `Bearer ${accessToken}` } }
                    : undefined
            );

            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: normalizeHashtagTweets(response.data.data),
                };
            }

            return response.data;
        } catch (error) {
            return {
                status: "error",
                message: "Failed to fetch tweets by hashtag",
            };
        }
    }

    /**
     * Get recommended users to follow
     * @param limit - Number of users to return
     * @param accessToken - Optional access token
     */
    async getRecommendedUsers(limit = 5, accessToken?: string) {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.RecommendedUsersResponse>
            >(
                `/trends/who-to-follow?limit=${limit}`,
                accessToken
                    ? { headers: { Authorization: `Bearer ${accessToken}` } }
                    : undefined
            );

            if (response.data.status === "success" && response.data.data) {
                return {
                    status: "success",
                    data: normalizeRecommendedUsers(response.data.data),
                };
            }

            return response.data;
        } catch (error) {
            return {
                status: "error",
                message: "Failed to fetch recommended users",
            };
        }
    }
}

export default new TrendsService();

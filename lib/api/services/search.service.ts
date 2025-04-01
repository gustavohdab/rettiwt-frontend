import api from "@/lib/api/axios";
import { ApiTypes, Tweet, User, normalizeTweet, normalizeUser } from "@/types";

export interface SearchResults {
    users?: User[];
    tweets?: Tweet[];
    counts?: {
        users: number;
        tweets: number;
        total: number;
    };
}

/**
 * Search service for handling search-related API endpoints
 */
const SearchService = {
    /**
     * Search for users, tweets or both
     * @param query Search query string
     * @param type Type of search (users, tweets, all)
     * @param page Page number
     * @param limit Items per page
     * @param accessToken Optional auth token for server components
     */
    search: async (
        query: string,
        type: "users" | "tweets" | "all" = "all",
        page = 1,
        limit = 10,
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            results: SearchResults;
            pagination: ApiTypes.PaginationInfo;
        }>
    > => {
        try {
            const config: any = {
                params: { q: query, type, page, limit },
            };

            if (accessToken) {
                config.headers = {
                    Authorization: `Bearer ${accessToken}`,
                };
            }

            const response = await api.get<
                ApiTypes.ApiResponse<{
                    results: {
                        users?: ApiTypes.User[];
                        tweets?: ApiTypes.Tweet[];
                        counts?: {
                            users: number;
                            tweets: number;
                            total: number;
                        };
                    };
                    pagination: ApiTypes.PaginationInfo;
                }>
            >("/search", config);

            // Transform API response to UI model
            if (response.data.status === "success" && response.data.data) {
                const normalized: SearchResults = {};

                if (response.data.data.results.users) {
                    normalized.users =
                        response.data.data.results.users.map(normalizeUser);
                }

                if (response.data.data.results.tweets) {
                    normalized.tweets =
                        response.data.data.results.tweets.map(normalizeTweet);
                }

                if (response.data.data.results.counts) {
                    normalized.counts = response.data.data.results.counts;
                }

                return {
                    status: "success",
                    data: {
                        results: normalized,
                        pagination: response.data.data.pagination,
                    },
                };
            }

            return response.data as any;
        } catch (error) {
            console.error("Error searching:", error);
            return { status: "error", message: "Failed to search" };
        }
    },
};

export default SearchService;

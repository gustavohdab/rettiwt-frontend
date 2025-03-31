"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query";
import TweetService from "@/lib/api/services/tweet.service";
import type {
    Tweet,
    UseTimelineParams,
    UseUserTweetsParams,
    UseTweetParams,
    ApiTypes,
} from "@/types";

/**
 * Custom hook for managing tweets
 */
export function useTweets() {
    const queryClient = useQueryClient();

    /**
     * Get user timeline
     * @param params Timeline parameters (page, limit)
     * @param options Query options
     */
    const useTimeline = (
        params?: UseTimelineParams,
        options?: UseQueryOptions<
            ApiTypes.ApiResponse<{
                tweets: Tweet[];
                pagination: ApiTypes.PaginationInfo;
            }>
        >
    ) => {
        const { page = 1, limit = 10 } = params || {};

        return useQuery({
            queryKey: ["timeline", page, limit],
            queryFn: () => TweetService.getTimeline(page, limit),
            ...options,
        });
    };

    /**
     * Get user tweets
     * @param params User tweets parameters (username, page, limit)
     * @param options Query options
     */
    const useUserTweets = (
        params: UseUserTweetsParams,
        options?: UseQueryOptions<
            ApiTypes.ApiResponse<{
                tweets: Tweet[];
                pagination: ApiTypes.PaginationInfo;
            }>
        >
    ) => {
        const { username, page = 1, limit = 10 } = params;

        return useQuery({
            queryKey: ["tweets", username, page, limit],
            queryFn: () => TweetService.getUserTweets(username, page, limit),
            ...options,
        });
    };

    /**
     * Get user replies
     * @param params User replies parameters (username, page, limit)
     * @param options Query options
     */
    const useUserReplies = (
        params: UseUserTweetsParams,
        options?: UseQueryOptions<
            ApiTypes.ApiResponse<{
                tweets: Tweet[];
                pagination: ApiTypes.PaginationInfo;
            }>
        >
    ) => {
        const { username, page = 1, limit = 10 } = params;

        return useQuery({
            queryKey: ["replies", username, page, limit],
            queryFn: () => TweetService.getUserReplies(username, page, limit),
            ...options,
        });
    };

    /**
     * Get a tweet by ID
     * @param params Tweet parameters (id)
     * @param options Query options
     */
    const useTweet = (
        params: UseTweetParams,
        options?: UseQueryOptions<ApiTypes.ApiResponse<{ tweet: Tweet }>>
    ) => {
        const { id, initialData } = params;

        return useQuery({
            queryKey: ["tweet", id],
            queryFn: () => TweetService.getTweet(id),
            initialData: initialData
                ? ({
                      status: "success",
                      data: { tweet: initialData },
                  } as ApiTypes.ApiResponse<{ tweet: Tweet }>)
                : undefined,
            ...options,
        });
    };

    /**
     * Create a tweet mutation
     */
    const useCreateTweet = () => {
        return useMutation({
            mutationFn: (tweetData: ApiTypes.CreateTweetRequest) =>
                TweetService.createTweet(tweetData),
            onSuccess: () => {
                // Invalidate timeline queries to refetch
                queryClient.invalidateQueries({ queryKey: ["timeline"] });
            },
        });
    };

    /**
     * Delete a tweet mutation
     */
    const useDeleteTweet = () => {
        return useMutation({
            mutationFn: (id: string) => TweetService.deleteTweet(id),
            onSuccess: () => {
                // Invalidate timeline queries to refetch
                queryClient.invalidateQueries({ queryKey: ["timeline"] });
            },
        });
    };

    /**
     * Like a tweet mutation
     */
    const useLikeTweet = () => {
        return useMutation({
            mutationFn: (id: string) => TweetService.likeTweet(id),
            onSuccess: (_, id) => {
                // Invalidate specific tweet query
                queryClient.invalidateQueries({ queryKey: ["tweet", id] });
            },
        });
    };

    /**
     * Unlike a tweet mutation
     */
    const useUnlikeTweet = () => {
        return useMutation({
            mutationFn: (id: string) => TweetService.unlikeTweet(id),
            onSuccess: (_, id) => {
                // Invalidate specific tweet query
                queryClient.invalidateQueries({ queryKey: ["tweet", id] });
            },
        });
    };

    /**
     * Retweet a tweet mutation
     */
    const useRetweetTweet = () => {
        return useMutation({
            mutationFn: (id: string) => TweetService.retweetTweet(id),
            onSuccess: (_, id) => {
                // Invalidate specific tweet query
                queryClient.invalidateQueries({ queryKey: ["tweet", id] });
                queryClient.invalidateQueries({ queryKey: ["timeline"] });
            },
        });
    };

    /**
     * Undo retweet mutation
     */
    const useUnretweetTweet = () => {
        return useMutation({
            mutationFn: (id: string) => TweetService.unretweetTweet(id),
            onSuccess: (_, id) => {
                // Invalidate specific tweet query
                queryClient.invalidateQueries({ queryKey: ["tweet", id] });
                queryClient.invalidateQueries({ queryKey: ["timeline"] });
            },
        });
    };

    return {
        useTimeline,
        useUserTweets,
        useUserReplies,
        useTweet,
        useCreateTweet,
        useDeleteTweet,
        useLikeTweet,
        useUnlikeTweet,
        useRetweetTweet,
        useUnretweetTweet,
    };
}

export default useTweets;

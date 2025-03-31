"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from "@tanstack/react-query";
import UserService from "@/lib/api/services/user.service";
import { ApiTypes, User } from "@/types";

/**
 * Custom hook for managing users
 */
export function useUsers() {
    const queryClient = useQueryClient();

    /**
     * Get user profile
     * @param username Username
     * @param options Query options
     */
    const useUserProfile = (
        username: string,
        options?: UseQueryOptions<
            ApiTypes.ApiResponse<{ user: User; tweetCount: number }>
        >
    ) => {
        return useQuery({
            queryKey: ["user", username],
            queryFn: () => UserService.getUserProfile(username),
            ...options,
        });
    };

    /**
     * Update user profile mutation
     */
    const useUpdateProfile = () => {
        return useMutation({
            mutationFn: (profileData: ApiTypes.UpdateProfileRequest) =>
                UserService.updateProfile(profileData),
            onSuccess: (data) => {
                // Invalidate current user profile query
                if (data.status === "success" && data.data?.user) {
                    queryClient.invalidateQueries({
                        queryKey: ["user", data.data.user.username],
                    });
                }
            },
        });
    };

    /**
     * Follow user mutation
     */
    const useFollowUser = () => {
        return useMutation({
            mutationFn: (username: string) => UserService.followUser(username),
            onSuccess: (_, username) => {
                // Invalidate user profile query
                queryClient.invalidateQueries({ queryKey: ["user", username] });
                // Invalidate followers/following queries
                queryClient.invalidateQueries({
                    queryKey: ["followers", username],
                });
                queryClient.invalidateQueries({
                    queryKey: ["following", username],
                });
            },
        });
    };

    /**
     * Unfollow user mutation
     */
    const useUnfollowUser = () => {
        return useMutation({
            mutationFn: (username: string) =>
                UserService.unfollowUser(username),
            onSuccess: (_, username) => {
                // Invalidate user profile query
                queryClient.invalidateQueries({ queryKey: ["user", username] });
                // Invalidate followers/following queries
                queryClient.invalidateQueries({
                    queryKey: ["followers", username],
                });
                queryClient.invalidateQueries({
                    queryKey: ["following", username],
                });
            },
        });
    };

    /**
     * Get user followers
     * @param username Username
     * @param options Query options
     */
    const useUserFollowers = (
        username: string,
        options?: UseQueryOptions<ApiTypes.ApiResponse<{ followers: User[] }>>
    ) => {
        return useQuery({
            queryKey: ["followers", username],
            queryFn: () => UserService.getUserFollowers(username),
            ...options,
        });
    };

    /**
     * Get user following
     * @param username Username
     * @param options Query options
     */
    const useUserFollowing = (
        username: string,
        options?: UseQueryOptions<ApiTypes.ApiResponse<{ following: User[] }>>
    ) => {
        return useQuery({
            queryKey: ["following", username],
            queryFn: () => UserService.getUserFollowing(username),
            ...options,
        });
    };

    /**
     * Search users
     * @param query Search query
     * @param page Page number
     * @param limit Items per page
     * @param options Query options
     */
    const useSearchUsers = (
        query: string,
        page = 1,
        limit = 10,
        options?: UseQueryOptions<ApiTypes.ApiResponse<{ users: User[] }>>
    ) => {
        return useQuery({
            queryKey: ["searchUsers", query, page, limit],
            queryFn: () => UserService.searchUsers(query, page, limit),
            enabled: query.length > 0,
            ...options,
        });
    };

    return {
        useUserProfile,
        useUpdateProfile,
        useFollowUser,
        useUnfollowUser,
        useUserFollowers,
        useUserFollowing,
        useSearchUsers,
    };
}

export default useUsers;

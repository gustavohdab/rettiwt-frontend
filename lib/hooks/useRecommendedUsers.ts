"use client";

import { useSocket } from "@/context/SocketContext";
import trendsService from "@/lib/api/services/trends.service";
import { RecommendedUser } from "@/types/models";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

interface UseRecommendedUsersResult {
    users: RecommendedUser[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useRecommendedUsers(
    initialUsers?: RecommendedUser[]
): UseRecommendedUsersResult {
    const { user: currentUser } = useAuth();
    const { emitter } = useSocket();
    const [users, setUsers] = useState<RecommendedUser[]>(initialUsers || []);
    const [loading, setLoading] = useState<boolean>(!initialUsers);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        console.log("fetchData (Recommended Users) called.");
        setLoading(true);
        setError(null);
        try {
            const response = await trendsService.getRecommendedUsers();
            if (response.status === "success" && response.data?.users) {
                const filteredUsers = response.data.users.filter(
                    (user) =>
                        !currentUser || user.username !== currentUser?.username
                );
                setUsers(filteredUsers as RecommendedUser[]);
            } else {
                setError(
                    response.message || "Failed to load recommended users"
                );
            }
        } catch (err: any) {
            setError(
                err.message ||
                    "An unexpected error occurred while fetching users"
            );
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!initialUsers) {
            fetchData();
        } else {
            setLoading(false);
        }
    }, [fetchData, initialUsers]);

    useEffect(() => {
        const handleRemoveUser = (data: { userId: string }) => {
            if (!data?.userId) return;
            console.log(`Recommendation Event: Removing user ${data.userId}`);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== data.userId)
            );
        };

        const handleAddUser = (data: { user: RecommendedUser }) => {
            if (!data?.user) return;
            console.log(
                `Recommendation Event: Adding user ${data.user.username}`
            );
            setUsers((prevUsers) => [
                data.user,
                ...prevUsers.filter((u) => u._id !== data.user._id),
            ]);
        };

        if (emitter) {
            emitter.on("recommendations:remove", handleRemoveUser);
            emitter.on("recommendations:add", handleAddUser);
            console.log("Attached recommendation listeners (add/remove)");

            return () => {
                emitter.off("recommendations:remove", handleRemoveUser);
                emitter.off("recommendations:add", handleAddUser);
                console.log("Detached recommendation listeners (add/remove)");
            };
        } else {
            console.log("Recommendation emitter not available yet.");
        }
    }, [emitter, fetchData]);

    return { users, loading, error, refetch: fetchData };
}

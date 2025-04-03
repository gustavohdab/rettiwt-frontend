"use client";

import { useSocket } from "@/context/SocketContext";
import {
    markAllNotificationsRead,
    markNotificationRead,
} from "@/lib/actions/notification.actions";
import notificationService from "@/lib/api/services/notification.service";
import * as ApiTypes from "@/types/api";
import {
    Notification,
    NotificationPaginationInfo,
    normalizeNotification,
} from "@/types/models";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";

interface UseNotificationsResult {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    paginationInfo: NotificationPaginationInfo | null;
    markAsRead: (notificationId: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    fetchNextPage: () => void;
}

export function useNotifications(): UseNotificationsResult {
    const { data: session } = useSession();
    const { emitter, isConnected } = useSocket();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [paginationInfo, setPaginationInfo] =
        useState<NotificationPaginationInfo | null>(null);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(
        async (page = 1) => {
            if (!session?.accessToken) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const result = await notificationService.getNotifications(
                    page,
                    15,
                    session.accessToken
                );
                if (result.status === "success" && result.data) {
                    setNotifications((prev) =>
                        page === 1
                            ? result.data.notifications
                            : [...prev, ...result.data.notifications]
                    );
                    setPaginationInfo(result.data.pagination);
                    setUnreadCount(result.data.pagination.unreadCount);
                } else {
                    setError(result.message || "Failed to fetch notifications");
                }
            } catch (err) {
                console.error("Fetch notifications hook error:", err);
                setError("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        },
        [session?.accessToken]
    );

    // Initial fetch
    useEffect(() => {
        if (session?.accessToken) {
            fetchNotifications(1);
        }
    }, [session?.accessToken, fetchNotifications]);

    // Listen for real-time updates
    useEffect(() => {
        if (emitter && isConnected) {
            const handleNewNotification = (
                newApiNotification: ApiTypes.Notification
            ) => {
                console.log(
                    "Received new notification via socket:",
                    newApiNotification
                );
                const newNotification =
                    normalizeNotification(newApiNotification);
                setNotifications((prev) => [newNotification, ...prev]);
                setUnreadCount((prev) => prev + 1);
                // Update pagination total if needed, though might be slightly off until next fetch
                setPaginationInfo((prev) =>
                    prev
                        ? {
                              ...prev,
                              total: prev.total + 1,
                              unreadCount: prev.unreadCount + 1,
                          }
                        : null
                );
            };

            emitter.on("notification:new", handleNewNotification);
            console.log(
                "useNotifications: Attached listener for notification:new"
            );

            return () => {
                emitter.off("notification:new", handleNewNotification);
                console.log(
                    "useNotifications: Detached listener for notification:new"
                );
            };
        }
    }, [emitter, isConnected]);

    // --- Effect to listen for internal count changes ---
    useEffect(() => {
        if (emitter) {
            const handleCountUpdate = (newCount: number) => {
                console.log(
                    "Internal event: unreadCountChanged received:",
                    newCount
                );
                setUnreadCount(newCount);
            };
            emitter.on("unreadCountChanged", handleCountUpdate);
            return () => {
                emitter.off("unreadCountChanged", handleCountUpdate);
            };
        }
    }, [emitter]);
    // -----------------------------------------------------

    const markAsRead = useCallback(
        async (notificationId: string) => {
            let previousNotifications = [...notifications];
            let previousUnreadCount = unreadCount;
            let optimisticallyUpdated = false;

            // Optimistic UI update
            const targetNotification = notifications.find(
                (n) => n._id === notificationId
            );
            if (targetNotification && !targetNotification.read) {
                optimisticallyUpdated = true;
                const newUnreadCount = Math.max(0, unreadCount - 1);
                setNotifications((prev) =>
                    prev.map((n) =>
                        n._id === notificationId ? { ...n, read: true } : n
                    )
                );
                setUnreadCount(newUnreadCount);
                emitter?.emit("unreadCountChanged", newUnreadCount); // Emit internal change
            }

            // Only proceed if we actually made an optimistic update
            if (!optimisticallyUpdated) return;

            try {
                const result = await markNotificationRead(notificationId);
                if (result.status === "error") {
                    console.error(
                        "Failed to mark notification as read:",
                        result.message
                    );
                    // Revert optimistic update on error
                    setNotifications(previousNotifications);
                    setUnreadCount(previousUnreadCount);
                    emitter?.emit("unreadCountChanged", previousUnreadCount); // Emit reverted change
                }
                // Success - optimistic update is confirmed
            } catch (err) {
                console.error("Mark as read action error:", err);
                // Revert optimistic update on error
                setNotifications(previousNotifications);
                setUnreadCount(previousUnreadCount);
                emitter?.emit("unreadCountChanged", previousUnreadCount); // Emit reverted change
            }
        },
        [notifications, unreadCount, emitter] // Add emitter to dependency array
    );

    const markAllAsRead = useCallback(async () => {
        const previouslyUnreadCount = unreadCount;
        if (previouslyUnreadCount === 0) return; // No need to do anything

        const previousNotifications = [...notifications];

        // Optimistic UI update
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        emitter?.emit("unreadCountChanged", 0); // Emit internal change

        try {
            const result = await markAllNotificationsRead();
            if (result.status === "error") {
                console.error(
                    "Failed to mark all notifications as read:",
                    result.message
                );
                // Revert optimistic update
                setNotifications(previousNotifications);
                setUnreadCount(previouslyUnreadCount);
                emitter?.emit("unreadCountChanged", previouslyUnreadCount); // Emit reverted change
            }
            // Success - optimistic update is confirmed
        } catch (err) {
            console.error("Mark all as read action error:", err);
            // Revert optimistic update
            setNotifications(previousNotifications);
            setUnreadCount(previouslyUnreadCount);
            emitter?.emit("unreadCountChanged", previouslyUnreadCount); // Emit reverted change
        }
    }, [unreadCount, emitter, notifications]); // Add emitter & notifications

    const fetchNextPage = useCallback(() => {
        if (
            paginationInfo &&
            !isLoading &&
            paginationInfo.page < paginationInfo.pages
        ) {
            fetchNotifications(paginationInfo.page + 1);
        }
    }, [paginationInfo, isLoading, fetchNotifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        error,
        paginationInfo,
        markAsRead,
        markAllAsRead,
        fetchNextPage,
    };
}

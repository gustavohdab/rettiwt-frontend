"use client";

import Header from "@/components/layout/Header"; // Assuming a standard Header component
import GroupedNotificationItem, { GroupedNotification } from "@/components/notifications/GroupedNotificationItem"; // Import new component
import NotificationItem from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { Notification } from "@/types/models";
import { useEffect, useMemo } from "react";

// TODO: Add Loading Skeletons and Error states

// --- Grouping Logic --- 
function groupNotifications(notifications: Notification[]): (Notification | GroupedNotification)[] {
    if (!notifications || notifications.length === 0) return [];

    const grouped: (Notification | GroupedNotification)[] = [];
    let currentLikeGroup: GroupedNotification | null = null;

    for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];

        // Check if it can be added to the current like group
        if (
            notification.type === 'like' &&
            notification.tweetId &&
            currentLikeGroup &&
            notification.tweetId === currentLikeGroup.tweetId
        ) {
            currentLikeGroup.senders.push(notification.sender);
            currentLikeGroup.mostRecentDate = notification.createdAt;
            currentLikeGroup.read = currentLikeGroup.read && notification.read;
            currentLikeGroup.notificationIds.push(notification._id);
        }
        // Start a new like group
        else if (notification.type === 'like' && notification.tweetId) {
            if (currentLikeGroup) {
                grouped.push(currentLikeGroup);
            }
            currentLikeGroup = {
                type: 'grouped-like',
                tweetId: notification.tweetId,
                senders: [notification.sender],
                mostRecentDate: notification.createdAt,
                read: notification.read,
                notificationIds: [notification._id],
                tweetSnippet: notification.tweetSnippet
            };
        }
        // Not a likable notification, push previous group and the current item
        else {
            if (currentLikeGroup) {
                grouped.push(currentLikeGroup);
                currentLikeGroup = null;
            }
            grouped.push(notification);
        }
    }

    if (currentLikeGroup) {
        grouped.push(currentLikeGroup);
    }

    return grouped;
}
// --------------------

export default function NotificationsPage() {
    const {
        notifications,
        isLoading,
        error,
        markAsRead,
        markAllAsRead,
        fetchNextPage,
        paginationInfo
    } = useNotifications();

    // Memoize the grouped notifications to avoid re-computation on every render
    const processedNotifications = useMemo(() => groupNotifications(notifications), [notifications]);

    // Optional: Mark notifications as read when the page is viewed
    // This depends on desired UX. Could mark all visible ones, or only on click.
    // For simplicity, we'll rely on the click within NotificationItem for now.

    // Basic infinite scroll trigger
    useEffect(() => {
        const handleScroll = () => {
            // Check if scrolled near the bottom
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 300) {
                if (!isLoading && paginationInfo && paginationInfo.page < paginationInfo.pages) {
                    fetchNextPage();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, paginationInfo, fetchNextPage]);

    // Handler for marking group reads (needs more logic)
    const handleMarkGroupRead = (ids: string[]) => {
        // TODO: Implement logic to call markAsRead for each ID
        // Maybe batch these calls or create a new server action?
        console.log("Marking group as read:", ids);
        ids.forEach(id => markAsRead(id)); // Simple initial approach
    };

    return (
        <div>
            <Header title="Notifications" />

            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {processedNotifications.map((item) => {
                    if ('type' in item && item.type === 'grouped-like') {
                        return (
                            <GroupedNotificationItem
                                key={`grouped-${item.tweetId}-${item.notificationIds[0]}`}
                                group={item}
                                onMarkRead={handleMarkGroupRead}
                            />
                        );
                    }
                    else {
                        return (
                            <NotificationItem
                                key={item._id}
                                notification={item as Notification}
                                onMarkRead={markAsRead}
                            />
                        );
                    }
                })}
            </div>

            {isLoading && (
                <div className="p-4 text-center text-gray-500">
                    Loading more notifications...
                    {/* Add Skeleton placeholders here if desired */}
                </div>
            )}

            {error && (
                <div className="p-4 text-center text-red-500">
                    Error loading notifications: {error}
                </div>
            )}

            {!isLoading && paginationInfo && paginationInfo.page >= paginationInfo.pages && notifications.length > 0 && (
                <div className="p-4 text-center text-gray-500">
                    No more notifications.
                </div>
            )}
            {!isLoading && notifications.length === 0 && !error && (
                <div className="p-10 text-center text-gray-500">
                    You have no notifications yet.
                </div>
            )}
        </div>
    );
} 
import * as ApiTypes from "@/types/api";
import { normalizeNotification } from "@/types/models";
import api from "../axios";

/**
 * Service for handling notification related API calls
 */
class NotificationService {
    /**
     * Get notifications for the current user
     * @param page - Page number
     * @param limit - Number of notifications per page
     * @param accessToken - Required access token
     */
    async getNotifications(page = 1, limit = 15, accessToken: string) {
        try {
            const response = await api.get<
                ApiTypes.ApiResponse<ApiTypes.NotificationResponseData>
            >(`/notifications?page=${page}&limit=${limit}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.data.status === "success" && response.data.data) {
                const normalizedNotifications =
                    response.data.data.notifications.map(normalizeNotification);
                return {
                    status: "success" as const,
                    data: {
                        notifications: normalizedNotifications,
                        pagination: response.data.data.pagination,
                    },
                };
            } else {
                return {
                    status: "error" as const,
                    message:
                        response.data.message ||
                        "Failed to fetch notifications",
                };
            }
        } catch (error) {
            console.error("Get notifications error:", error);
            return {
                status: "error" as const,
                message:
                    "An unexpected error occurred while fetching notifications.",
            };
        }
    }

    /**
     * Mark a specific notification as read
     * @param notificationId - ID of the notification to mark as read
     * @param accessToken - Required access token
     */
    async markNotificationRead(notificationId: string, accessToken: string) {
        try {
            const response = await api.patch<
                ApiTypes.ApiResponse<ApiTypes.MarkReadResponse>
            >(
                `/notifications/${notificationId}/read`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return response.data; // Return the raw API response
        } catch (error) {
            console.error("Mark notification read error:", error);
            return {
                status: "error" as const,
                message: "Failed to mark notification as read.",
            };
        }
    }

    /**
     * Mark all notifications as read for the current user
     * @param accessToken - Required access token
     */
    async markAllNotificationsRead(accessToken: string) {
        try {
            const response = await api.post<
                ApiTypes.ApiResponse<ApiTypes.MarkReadResponse>
            >(
                `/notifications/read-all`,
                {},
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            return response.data; // Return the raw API response
        } catch (error) {
            console.error("Mark all notifications read error:", error);
            return {
                status: "error" as const,
                message: "Failed to mark all notifications as read.",
            };
        }
    }
}

const notificationService = new NotificationService();
export default notificationService;

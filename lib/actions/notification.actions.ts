"use server";

import notificationService from "@/lib/api/services/notification.service";
import { authOptions } from "@/lib/auth"; // Import authOptions
import { getServerSession } from "next-auth/next";

/**
 * Server action to mark a single notification as read.
 * @param notificationId The ID of the notification to mark as read.
 */
export async function markNotificationRead(
    notificationId: string
): Promise<{ status: "success" | "error"; message?: string }> {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        return { status: "error", message: "Authentication required." };
    }

    try {
        const result = await notificationService.markNotificationRead(
            notificationId,
            session.accessToken
        );

        if (result.status === "success") {
            // Optionally revalidate paths if needed, though the hook will handle UI updates
            // revalidatePath("/"); // Example: revalidate layout to update icon count server-side?
            return { status: "success", message: result.message };
        } else {
            return {
                status: "error",
                message:
                    result.message || "Failed to mark notification as read.",
            };
        }
    } catch (error) {
        console.error("Server Action markNotificationRead error:", error);
        return { status: "error", message: "An unexpected error occurred." };
    }
}

/**
 * Server action to mark all notifications as read.
 */
export async function markAllNotificationsRead(): Promise<{
    status: "success" | "error";
    message?: string;
    modifiedCount?: number;
}> {
    const session = await getServerSession(authOptions);
    if (!session?.accessToken) {
        return { status: "error", message: "Authentication required." };
    }

    try {
        const result = await notificationService.markAllNotificationsRead(
            session.accessToken
        );

        if (result.status === "success") {
            // Optionally revalidate paths
            // revalidatePath("/");
            return {
                status: "success",
                message: result.message,
                modifiedCount: result.data?.modifiedCount,
            };
        } else {
            return {
                status: "error",
                message:
                    result.message ||
                    "Failed to mark all notifications as read.",
            };
        }
    } catch (error) {
        console.error("Server Action markAllNotificationsRead error:", error);
        return { status: "error", message: "An unexpected error occurred." };
    }
}

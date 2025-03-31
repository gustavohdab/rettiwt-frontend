"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UploadService from "@/lib/api/services/upload.service";
import { UploadResponse } from "@/types";

/**
 * Upload tweet media
 */
export async function uploadTweetMedia(
    formData: FormData
): Promise<UploadResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const files = formData.getAll("media") as File[];

        if (!files || files.length === 0) {
            return { error: "No files selected" };
        }

        const result = await UploadService.uploadTweetMedia(
            files,
            session.accessToken
        );

        if (result.status !== "success" || !result.data) {
            return { error: result.message || "Failed to upload media" };
        }

        return { success: true, urls: result.data.media.map((m) => m.url) };
    } catch (error) {
        console.error("Error uploading media:", error);
        return { error: "Failed to upload media" };
    }
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(
    formData: FormData
): Promise<UploadResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const file = formData.get("avatar") as File;

        if (!file) {
            return { error: "No file selected" };
        }

        const result = await UploadService.uploadAvatar(
            file,
            session.accessToken
        );

        if (result.status !== "success" || !result.data) {
            return { error: result.message || "Failed to upload avatar" };
        }

        return { success: true, urls: [result.data.avatar] };
    } catch (error) {
        console.error("Error uploading avatar:", error);
        return { error: "Failed to upload avatar" };
    }
}

/**
 * Upload profile header
 */
export async function uploadProfileHeader(
    formData: FormData
): Promise<UploadResponse> {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return { error: "Not authenticated" };
        }

        const file = formData.get("header") as File;

        if (!file) {
            return { error: "No file selected" };
        }

        const result = await UploadService.uploadHeader(
            file,
            session.accessToken
        );

        if (result.status !== "success" || !result.data) {
            return { error: result.message || "Failed to upload header image" };
        }

        return { success: true, urls: [result.data.headerImage] };
    } catch (error) {
        console.error("Error uploading header image:", error);
        return { error: "Failed to upload header image" };
    }
}

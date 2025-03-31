import api from "@/lib/api/axios";
import { ApiTypes } from "@/types";
/**
 * Upload service for handling file uploads
 */
const UploadService = {
    /**
     * Upload tweet media (images/videos)
     * @param files Files to upload
     * @param accessToken Optional auth token for server components
     */
    uploadTweetMedia: async (
        files: File[],
        accessToken?: string
    ): Promise<
        ApiTypes.ApiResponse<{
            media: { type: string; url: string; altText: string }[];
        }>
    > => {
        try {
            const formData = new FormData();

            files.forEach((file) => {
                formData.append("media", file);
            });

            const config: any = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{
                    media: { type: string; url: string; altText: string }[];
                }>
            >("/upload/tweet", formData, config);

            return response.data;
        } catch (error) {
            console.error("Error uploading tweet media:", error);
            return { status: "error", message: "Failed to upload media" };
        }
    },

    /**
     * Upload user avatar
     * @param file Avatar image file
     * @param accessToken Optional auth token for server components
     */
    uploadAvatar: async (
        file: File,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ avatar: string }>> => {
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const config: any = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{ avatar: string }>
            >("/upload/avatar", formData, config);

            return response.data;
        } catch (error) {
            console.error("Error uploading avatar:", error);
            return { status: "error", message: "Failed to upload avatar" };
        }
    },

    /**
     * Upload profile header image
     * @param file Header image file
     * @param accessToken Optional auth token for server components
     */
    uploadHeader: async (
        file: File,
        accessToken?: string
    ): Promise<ApiTypes.ApiResponse<{ headerImage: string }>> => {
        try {
            const formData = new FormData();
            formData.append("header", file);

            const config: any = {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            };

            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            const response = await api.post<
                ApiTypes.ApiResponse<{ headerImage: string }>
            >("/upload/header", formData, config);

            return response.data;
        } catch (error) {
            console.error("Error uploading header image:", error);
            return {
                status: "error",
                message: "Failed to upload header image",
            };
        }
    },
};

export default UploadService;

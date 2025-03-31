import axios, { AxiosError, AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Important for cookies
});

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Only attempt token refresh in the browser
        if (typeof window !== "undefined") {
            // Handle token expiration
            if (
                error.response?.status === 401 &&
                originalRequest &&
                !(originalRequest as any)._retry
            ) {
                (originalRequest as any)._retry = true;

                try {
                    // Call refresh token endpoint
                    await axios.post(
                        `${
                            process.env.NEXT_PUBLIC_API_URL ||
                            "http://localhost:5000/api"
                        }/auth/refresh`,
                        {},
                        { withCredentials: true }
                    );

                    // Retry the original request
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token failed, redirect to login using NextAuth
                    await signOut({ redirect: true, callbackUrl: "/login" });
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

// Request interceptor for adding auth token to requests
api.interceptors.request.use(
    async (config) => {
        // Only run in the browser
        if (typeof window !== "undefined") {
            const session = await getSession();

            // If we have an access token, add it to the request
            if (session?.accessToken) {
                config.headers.Authorization = `Bearer ${session.accessToken}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

import api from "@/lib/api/axios";
import {
    ApiResponse,
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    User,
} from "@/types/api";
/**
 * Auth service for handling authentication API endpoints
 */
const AuthService = {
    /**
     * Register a new user
     * @param userData User registration data
     */
    register: async (
        userData: RegisterRequest
    ): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/register",
            userData
        );
        return response.data;
    },

    /**
     * Log in an existing user
     * @param credentials User login credentials
     */
    login: async (
        credentials: LoginRequest
    ): Promise<ApiResponse<AuthResponse>> => {
        const response = await api.post<ApiResponse<AuthResponse>>(
            "/auth/login",
            credentials
        );
        return response.data;
    },

    /**
     * Refresh the access token
     * @param refreshToken Optional refresh token (uses cookie by default)
     */
    refreshToken: async (
        refreshToken?: string
    ): Promise<ApiResponse<{ access: string }>> => {
        const response = await api.post<ApiResponse<{ access: string }>>(
            "/auth/refresh",
            refreshToken ? { refreshToken } : {}
        );
        return response.data;
    },

    /**
     * Get the current authenticated user
     */
    getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.get<ApiResponse<{ user: User }>>("/auth/me");
        return response.data;
    },

    /**
     * Log out the current user
     */
    logout: async (): Promise<ApiResponse<void>> => {
        const response = await api.post<ApiResponse<void>>("/auth/logout");
        return response.data;
    },
};

export default AuthService;

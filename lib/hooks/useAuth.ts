import { useSession, signIn, signOut } from "next-auth/react";
import { AxiosError } from "axios";
import AuthService from "../api/services/auth.service";
import { LoginRequest, RegisterRequest, ValidationError } from "@/types/api";

// Define a type for the register function's return value
type RegisterResult =
    | { success: true; data?: any }
    | { success: false; error: string | ValidationError[] };

/**
 * Custom hook for authentication
 */
export function useAuth() {
    const { data: session, status, update } = useSession();

    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";
    const user = session?.user;

    /**
     * Log in a user
     * @param credentials User credentials
     */
    const login = async (credentials: LoginRequest) => {
        return signIn("credentials", {
            usernameOrEmail: credentials.usernameOrEmail,
            password: credentials.password,
            redirect: false,
        });
    };

    /**
     * Register a new user
     * @param userData User registration data
     */
    const register = async (
        userData: RegisterRequest
    ): Promise<RegisterResult> => {
        try {
            const result = await AuthService.register(userData);

            if (result.status === "success" && result.data) {
                // After registration, log the user in
                const signInResult = await signIn("credentials", {
                    usernameOrEmail: userData.email,
                    password: userData.password,
                    redirect: false,
                });
                if (signInResult?.error) {
                    // Handle potential sign-in errors after successful registration
                    return { success: false, error: signInResult.error };
                }
                return { success: true, data: result.data };
            }
            // Handle cases where backend returns success: false explicitly
            return {
                success: false,
                error: result.message || "Registration failed",
            };
        } catch (error) {
            // Check if it's an Axios error
            if (error instanceof AxiosError && error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 409) {
                    // Conflict (username/email exists)
                    return {
                        success: false,
                        error:
                            data?.message ||
                            "Username or email already exists.",
                    };
                } else if (status === 422 && data?.errors) {
                    // Validation error
                    return {
                        success: false,
                        error: data.errors as ValidationError[], // Return structured errors
                    };
                } else {
                    // Other backend errors (400, 500, etc.)
                    return {
                        success: false,
                        error:
                            data?.message ||
                            `Request failed with status code ${status}`,
                    };
                }
            } else {
                // Network errors or other non-Axios errors
                return {
                    success: false,
                    error:
                        (error as Error).message ||
                        "An unexpected network error occurred",
                };
            }
        }
    };

    /**
     * Log out the current user
     */
    const logout = async () => {
        try {
            // Call the backend logout endpoint
            await AuthService.logout();
            // Sign out from NextAuth
            await signOut({ redirect: true, callbackUrl: "/" });
        } catch (error) {
            console.error("Logout error:", error);
            // Sign out from NextAuth even if backend fails
            await signOut({ redirect: true, callbackUrl: "/" });
        }
    };

    /**
     * Refresh the user session
     */
    const refreshSession = async () => {
        await update();
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshSession,
    };
}

export default useAuth;

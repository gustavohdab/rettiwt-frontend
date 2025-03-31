import { useSession, signIn, signOut } from "next-auth/react";
import AuthService from "../api/services/auth.service";
import { LoginRequest, RegisterRequest } from "@/types/api";
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
    const register = async (userData: RegisterRequest) => {
        try {
            const result = await AuthService.register(userData);

            if (result.status === "success" && result.data) {
                // After registration, log the user in
                return signIn("credentials", {
                    usernameOrEmail: userData.email,
                    password: userData.password,
                    redirect: false,
                });
            }

            return { error: "Registration failed" };
        } catch (error) {
            return { error: (error as Error).message || "Registration failed" };
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

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/lib/hooks/useAuth';

// Map NextAuth error codes to user-friendly messages
const errorMessages: { [key: string]: string } = {
    CredentialsSignin: "Invalid username/email or password.",
    Default: "An unexpected error occurred during login. Please try again.",
};

const LoginForm = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    // Check for error codes passed in URL by NextAuth redirect
    const urlError = searchParams.get('error');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null); // Clear previous errors
        setIsLoading(true);

        try {
            // Attempt login using the useAuth hook
            const result = await login({ usernameOrEmail, password });

            if (result?.error) {
                // If login hook returns an error (e.g., CredentialsSignin)
                const errorMessage = errorMessages[result.error] || errorMessages.Default;
                setLoginError(errorMessage);
            } else if (!result?.ok) {
                // Handle cases where signIn might return ok: false without a specific error code
                setLoginError(errorMessages.Default);
            } else {
                // Successful login - redirect to feed
                router.push('/feed');
                router.refresh(); // Refresh session data
            }
        } catch (err) {
            // Catch unexpected errors during the login process itself
            console.error("Login submission error:", err);
            setLoginError(errorMessages.Default);
        } finally {
            setIsLoading(false);
        }
    };

    // Determine which error message to display
    // Priority: 1. Error from submit, 2. Error from URL param
    const displayError = loginError || (urlError ? (errorMessages[urlError] || errorMessages.Default) : null);

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Log in to Rettiwt</h1>
            </div>

            {/* Display Login Error */}
            {displayError && (
                <div className="w-full p-3 mb-4 text-sm text-white bg-red-500 rounded">
                    {displayError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-1">
                    <label htmlFor="usernameOrEmail" className="text-sm font-medium">
                        Username or Email
                    </label>
                    <input
                        id="usernameOrEmail"
                        type="text"
                        required
                        value={usernameOrEmail}
                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                </div>

                <button
                    type="submit"
                    className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Log in'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-blue-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm; 
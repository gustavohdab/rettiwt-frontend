'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/lib/hooks/useAuth';

const LoginForm = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await login({ usernameOrEmail, password });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/feed');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Log in to Rettiwt</h1>
            </div>

            {error && (
                <div className="w-full p-3 mb-4 text-sm text-white bg-red-500 rounded">
                    {error}
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
'use client';

import useAuth from '@/lib/hooks/useAuth';
import { getFieldError } from '@/lib/utils/form.utils';
import { ValidationError } from '@/types/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const RegisterForm = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | ValidationError[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const result = await register({ name, username, email, password });

            if (!result.success) {
                setError(result.error);
            } else {
                router.push('/feed');
                router.refresh();
            }
        } catch (err) {
            setError('An unexpected client-side error occurred');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Get specific field errors for rendering
    const nameError = getFieldError('name', error);
    const usernameError = getFieldError('username', error);
    const emailError = getFieldError('email', error);
    const passwordError = getFieldError('password', error);
    // General error is only displayed if error state is a string
    const generalError = typeof error === 'string' ? error : null;

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md p-6 mx-auto">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold">Create your account</h1>
            </div>

            {generalError && (
                <div className="w-full p-3 mb-4 text-sm text-white bg-red-500 rounded">
                    {generalError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="w-full space-y-4">
                <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${nameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        disabled={isLoading}
                        aria-invalid={!!nameError}
                        aria-describedby={nameError ? "name-error" : undefined}
                    />
                    {nameError && <p id="name-error" className="text-xs text-red-600">{nameError}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="username" className="text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${usernameError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        disabled={isLoading}
                        aria-invalid={!!usernameError}
                        aria-describedby={usernameError ? "username-error" : undefined}
                    />
                    {usernameError && <p id="username-error" className="text-xs text-red-600">{usernameError}</p>}
                </div>

                <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        disabled={isLoading}
                        aria-invalid={!!emailError}
                        aria-describedby={emailError ? "email-error" : undefined}
                    />
                    {emailError && <p id="email-error" className="text-xs text-red-600">{emailError}</p>}
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
                        className={`w-full p-2 border rounded focus:outline-none focus:ring-2 ${passwordError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                        disabled={isLoading}
                        minLength={8}
                        aria-invalid={!!passwordError}
                        aria-describedby={passwordError ? "password-error" : undefined}
                    />
                    {passwordError && <p id="password-error" className="text-xs text-red-600">{passwordError}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating account...' : 'Sign up'}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterForm; 
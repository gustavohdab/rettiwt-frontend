import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Login | Rettiwt',
    description: 'Log in to your Rettiwt account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-lg shadow-md overflow-hidden">
                <Suspense fallback={<div className="p-6">Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    );
} 
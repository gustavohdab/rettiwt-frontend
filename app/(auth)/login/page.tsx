import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
    title: 'Login | Twitter Clone',
    description: 'Log in to your Twitter Clone account',
};

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
                <LoginForm />
            </div>
        </div>
    );
} 
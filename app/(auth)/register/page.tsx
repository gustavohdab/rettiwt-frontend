import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register | Twitter Clone',
    description: 'Create a new Twitter Clone account',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-lg shadow-md overflow-hidden">
                <RegisterForm />
            </div>
        </div>
    );
} 
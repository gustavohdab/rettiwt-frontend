import { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
    title: 'Register | Twitter Clone',
    description: 'Create a new Twitter Clone account',
};

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
                <RegisterForm />
            </div>
        </div>
    );
} 
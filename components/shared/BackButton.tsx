'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
    fallbackRoute?: string;
    title?: string;
}

export default function BackButton({ fallbackRoute = '/feed', title }: BackButtonProps) {
    const router = useRouter();

    const handleBack = () => {
        // Try to go back in history if possible
        router.back();
    };

    return (
        <div className="sticky top-0 z-10 bg-white dark:bg-black p-4 border-b border-gray-200 dark:border-gray-800 flex items-center">
            <button onClick={handleBack} className="mr-4">
                <ArrowLeftIcon className="h-5 w-5" />
            </button>
            {title && <h1 className="text-xl font-bold">{title}</h1>}
        </div>
    );
} 
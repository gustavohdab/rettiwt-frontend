'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import SearchInput from '@/components/search/SearchInput';
import BackButton from '@/components/shared/BackButton';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    showSearch?: boolean;
}

export default function Header({ title, showBackButton = false, showSearch = true }: HeaderProps) {
    const pathname = usePathname();

    // Don't show search on the search page itself
    const shouldShowSearch = showSearch && !pathname?.startsWith('/search');

    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    {showBackButton && (
                        <button onClick={() => window.history.back()} className="mr-4">
                            <ArrowLeftIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                        </button>
                    )}
                    {title && (
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    )}
                </div>

                {shouldShowSearch && (
                    <div className="hidden md:block flex-1 max-w-md mx-auto">
                        <SearchInput showRecentSearches={false} />
                    </div>
                )}
            </div>
        </header>
    );
}
